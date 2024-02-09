import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyStatusBar from '../components/MyStatusbar';
import {
  api_astrodetails,
  api_url,
  colors,
  fonts,
  update_intake_status,
} from '../config/Constants';
import axios from 'axios';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import database from '@react-native-firebase/database';

var Sound = require('react-native-sound');
const {width, height} = Dimensions.get('screen');

var whoosh = new Sound(require('../assets/audio/incoming.mp3'), error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const NotificationHandle = ({
  message,
  visible,
  setModalVisible,
  providerData,
}) => {
  useEffect(() => {
    if (visible) {
      whoosh.play();
      whoosh.setNumberOfLoops(-1);
    }
    return () => {
      whoosh.stop();
    };
  }, [visible]);


  return (
    <Modal visible={visible}>
      <View style={{flex: 1}}>
        <MyStatusBar
          backgroundColor={colors.background_theme2}
          barStyle="light-content"
        />
        <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
          <View
            style={{
              flex: 0.3,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: width * 0.25,
                height: width * 0.25,
                borderRadius: (width * 0.25) / 2,
              }}
            />
          </View>
          <View style={{flex: 0.3, justifyContent: 'flex-end'}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color,
                fontFamily: fonts.bold,
                textAlign: 'center',
                position: 'relative',
                bottom: 0,
              }}>
              Please accept the chat request
            </Text>
          </View>

          <View
            style={{
              flex: 0.4,
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity onPress={()=>accept_request('REJECTED', 'Reject')}>
              <Image
                source={require('../assets/images/cross.png')}
                style={{
                  width: width * 0.18,
                  height: width * 0.18,
                  borderRadius: (width * 0.18) / 2,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => accept_request('ACCEPTED BY ASTRO', 'Accept')}>
              <Image
                source={require('../assets/images/green_btn.png')}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  borderRadius: (width * 0.2) / 2,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 0.2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/images/logo.png')}
              style={{
                width: width * 0.12,
                height: width * 0.12,
                borderRadius: (width * 0.12) / 2,
              }}
            />
            <Text
              style={{
                marginLeft: 10,
                fontSize: 22,
                color: colors.black_color,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              AstroKunj
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(NotificationHandle);
