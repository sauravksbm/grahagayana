import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    Animated,
    Dimensions,
    StyleSheet,
    Image,
    TextInput,
    ImageBackground,
    FlatList,
  } from 'react-native';
  import React from 'react';
  import { colors, fonts,live_app_id,live_app_sign } from '../../config/Constants';
  import { useState } from 'react';
  import { useRef } from 'react';
  import { connect } from 'react-redux';
  import ZegoUIKitPrebuiltLiveStreaming, {
    HOST_DEFAULT_CONFIG,
    AUDIENCE_DEFAULT_CONFIG,
    ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import * as ZIM from 'zego-zim-react-native';
  
  const { width, height } = Dimensions.get('screen');
  
  const HostLive = props => {

    const prebuiltRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [kundliList, setKundliList] = useState(null);
    const [history, sethistory] = useState(null);

    const userID = 'UserID_' + props.customerData.id;
    console.log(userID,props.customerData.username);
    return (
        <View style={styles.container}>
        <ZegoUIKitPrebuiltLiveStreaming
            ref={prebuiltRef}
            appID={live_app_id}
            appSign={live_app_sign}
            userID={userID}
            userName={props.customerData.username}
            liveID={props.route.params.AstroLiveID}

            config={{
                ...AUDIENCE_DEFAULT_CONFIG,
                onLiveStreamingEnded: () => { console.log('########AudiencePage onLiveStreamingEnded'); },
                onLeaveLiveStreaming: () => {
                  props.navigation.navigate('home');
                },
                topMenuBarConfig: {
                  buttons: [ZegoMenuBarButtonName.leaveButton],
                },
              }}
              plugins={[ZIM]}
        />
        
    </View>
    );
  }
  
  const mapStateToProps = state => ({
    customerData: state.customer.customerData,
  });
  
  export default connect(mapStateToProps, null)(HostLive);
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
      },
      avView: {
        flex: 1,
        width: '100%',
        height: '100%',
        zIndex: 1,
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'red',
      },
      ctrlBar: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 50,
        width: '100%',
        height: 50,
        zIndex: 2,
      },
      ctrlBtn: {
        flex: 1,
        width: 48,
        height: 48,
        marginLeft: 37 / 2,
        position: 'absolute',
      },
  });
  