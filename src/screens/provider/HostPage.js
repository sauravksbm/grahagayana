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
  import { colors, fonts,live_app_id,live_app_sign,go_live,api_url,exit_live,change_status } from '../../config/Constants';
  import { useState } from 'react';
  import { useRef } from 'react';
  import { connect } from 'react-redux';
  import ZegoUIKitPrebuiltLiveStreaming, {
    HOST_DEFAULT_CONFIG,
    AUDIENCE_DEFAULT_CONFIG,
    ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import * as ZIM from 'zego-zim-react-native';
import axios from 'axios';
  
  const { width, height } = Dimensions.get('screen');
  
  const LiveNow = props => {

    const prebuiltRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [kundliList, setKundliList] = useState(null);
    const [history, sethistory] = useState(null);

    console.log('idd====>',props.route.params.id1);

    const change_chat_status = async () => {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + change_status,
        data: {
          id: props.providerData.id,
          is_online: 0,
          wait_time: new Date().toString(),
        },
      })
        .then(res => {
          setIsLoading(false);
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    };

    const golive = async() => {
        console.log('provideID===========>',props.providerData.id);
        await axios({
            method: 'post',
            url: api_url + go_live,
            headers: {
              'content-type': 'multipart/form-data',
            },
            data: {
            astro_id: props.providerData.id,
            status: 'live',
            },
          })
            .then(res => {
              change_chat_status();
              console.log('sucess=================>',res.data);    
            })
            .catch(err => {
              setIsLoading(false)
              console.log('error===============>',err);
            });

    }

    const exit = async() => {
        await axios({
            method: 'post',
            url: api_url + exit_live,
            headers: {
              'content-type': 'multipart/form-data',
            },
            data: {
            astro_id: props.providerData.id,
            status: 'exit',
            liveid:props.route.params.liveID
            },
          })
            .then(res => {
              console.log('sucess_exit=================>',res.data);    
            })
            .catch(err => {
              setIsLoading(false)
              console.log('error===============>',err);
            });

    }

    const provide = 'AstroID_' + props.providerData.id;
  
    return (
        <View style={styles.container}>
            

        <ZegoUIKitPrebuiltLiveStreaming
                ref={prebuiltRef}
                appID={live_app_id}
                appSign={live_app_sign}
                userID={provide}
                userName={props.providerData.owner_name}
                liveID={props.route.params.liveID}

                config={{
                    ...HOST_DEFAULT_CONFIG,
                    // startLiveButtonBuilder: (startLive) => <Button onPress={startLive} title="Start Live"></Button>,
                    onStartLiveButtonPressed: () => {golive()},
                    onLiveStreamingEnded: (duration) => {
                        console.log('########HostPage onLiveStreamingEnded', duration);
                    },
                    onLeaveLiveStreaming: (duration) => {
                        console.log('########HostPage onLeaveLiveStreaming', duration);
                        exit();
                        props.navigation.navigate('providerHome')
                    },
                    durationConfig: {
                        isVisible: true,
                        onDurationUpdate: function(duration) {
                            console.log('########HostPage onDurationUpdate', duration);
                            if (duration > 100000) {
                                prebuiltRef.current.leave(true);
                            }
                        }
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
    providerData: state.provider.providerData,
  });
  
  export default connect(mapStateToProps, null)(LiveNow);
  
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
  