import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {api_astrodetails, api_url, colors, fonts} from '../../config/Constants';
import axios from 'axios';
import {CommonActions} from '@react-navigation/native';
import database from '@react-native-firebase/database';
var Sound = require('react-native-sound');
const {width, height} = Dimensions.get('screen');

var whoosh = new Sound(require('../../assets/audio/incoming.mp3'), error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const ChatPickup = props => {
  useEffect(() => {
    whoosh.play();
    whoosh.setNumberOfLoops(-1);
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const accept_request = async () => {
    whoosh.stop();
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: props.route.params.astro_id,
      },
    })
      .then(res => {
        const dateNodeRef = database().ref(
          `/CurrentRequest/${props.route.params.astro_id}`,
        );
        dateNodeRef
          .update({
            status: 'AceeptedbyUser',
          })
          .then(res => {
            console.log('updated');
          })
          .catch(err => {
            console.log(err);
          });
        props.navigation.navigate('customerChat', {
          astroData: res.data.records[0],
          trans_id: props.route.params.trans_id,
          chat_id: props.route.params.chat_id,
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const reject_request = () => {
    whoosh.stop();
    const dateNodeRef = database().ref(
      `/CurrentRequest/${props.route.params.astro_id}`,
    );
    dateNodeRef.update({
      status: 'RejectByUser',
    });
    go_home();
  };

  const go_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
        <View
          style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/images/logo.png')}
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
          <TouchableOpacity onPress={reject_request}>
            <Image
              source={require('../../assets/images/cross.png')}
              style={{
                width: width * 0.18,
                height: width * 0.18,
                borderRadius: (width * 0.18) / 2,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={accept_request}>
            <Image
              source={require('../../assets/images/green_btn.png')}
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
            source={require('../../assets/images/logo.png')}
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
            Graha Gyana
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ChatPickup;
