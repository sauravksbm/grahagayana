import {View, Text, TouchableOpacity, Dimensions, Image} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {api_url, colors, update_like} from '../config/Constants';
import axios from 'axios';
import { warnign_toast } from './MyToastMessage';

const {width, height} = Dimensions.get('screen');

const ProfileBottomButtons = ({setIsLoading, user_id, another_user_id, setIsRaining, setAboutModalVisible}) => {
  const like_profile = async () => {
    setIsLoading(true);
    console.log({
      user_id: user_id,
      another_user_id: another_user_id,
    })
    await axios({
      method: 'post',
      url: api_url + update_like,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        user_id: user_id,
        another_user_id: another_user_id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setAboutModalVisible(false)
        if(res.data.status){
          setIsRaining(true)
        }else{
          warnign_toast(res.data.msg)
        }
        console.log(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };
  return (
    <View
      style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <TouchableOpacity>
        <Ionicons
          name="md-close-circle-sharp"
          color={colors.background_theme2}
          size={width * 0.13}
        />
      </TouchableOpacity>
      <Image
        source={require('../assets/images/logo.png')}
        style={{
          width: width * 0.18,
          height: width * 0.18,
          resizeMode: 'contain',
          borderRadius: 10,
        }}
      />
      <TouchableOpacity
        onPress={like_profile}
        style={{
          width: width * 0.13,
          height: width * 0.13,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1000,
          backgroundColor: colors.black_color3,
        }}>
        <Ionicons
          name="thumbs-up-sharp"
          color={colors.background_theme1}
          size={width * 0.08}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileBottomButtons;
