import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import React from 'react';
import {useEffect, useRef, useMemo, useState} from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import {api_url, colors, fonts, set_dnd} from '../../config/Constants';
import {Image} from 'react-native';
import MyStatusBar from '../../components/MyStatusbar';
import database from '@react-native-firebase/database';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import {connect} from 'react-redux';
import axios from 'axios';
import {success_toast} from '../../components/MyToastMessage';

const {width, height} = Dimensions.get('screen');

const AstrodateChat = props => {
  const [profileData] = useState(props.route.params.profileData);
  let listRef = useRef(null);
  const [chatData, setChatData] = useState(null);
  const memoizedArray = useMemo(() => chatData, [chatData]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <View>
          <MyStatusBar
            backgroundColor={colors.background_theme2}
            barStyle="light-content"
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.background_theme2,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
                style={{
                  flex: 0,
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="arrow-back"
                  color={colors.background_theme1}
                  size={25}
                />
              </TouchableOpacity>
              <Image
                source={
                  profileData?.image
                    ? {uri: profileData?.image}
                    : require('../../assets/images/logo.png')
                }
                style={{
                  width: width * 0.1,
                  height: width * 0.1,
                  borderRadius: (width * 0.1) / 2,
                  borderWidth: 2,
                  borderColor: colors.background_theme1,
                  marginLeft: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.semi_bold,
                  marginLeft: 10,
                }}>
                {profileData?.username}
              </Text>
            </View>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity onPress={user_block} style={{}}>
                <Entypo name="block" color={colors.white_color} size={28} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    get_chats();
  }, []);

  const get_chats = () => {
    database()
      .ref(`/Messages/${props.customerData?.id}/${profileData?.user_id}`)
      .on('value', value => {
        const myDataObject = value.val();
        if (myDataObject) {
          const myDataArray = Object.keys(myDataObject)
            .sort()
            .map(key => myDataObject[key]);
          setChatData(myDataArray.reverse());
        }
      });
  };

  const is_typing = focus => {
    database()
      .ref(`/Chat/${props.customerData?.id}/${profileData?.user_id}`)
      .update({
        typing: focus,
      });
    database()
      .ref(`/Chat/${profileData?.user_id}/${props.customerData?.id}`)
      .update({
        typing: focus,
      });
  };

  const maskPhoneNumbers = (text)=> {
    // Regular expression to match phone numbers
    var phoneRegex = /(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

    // Replace phone numbers with masked values
    var maskedText = text.replace(phoneRegex, function(match) {
      // Extract the last two digits of the phone number
      var lastTwoDigits = match.replace(/[^\d]/g, '').substr(-2);
  
      // Mask the remaining digits with asterisks
      var maskedNumber = 'X'.repeat(match.length - 2) + lastTwoDigits;  
  
      return maskedNumber;
    });
  
    return maskedText;
  }
  

  const add_message = async (image = null) => {
    let mask_message = maskPhoneNumbers(message)
    console.log(mask_message)
    setChatData(prev => [
      ...prev,
      {
        from: props.customerData?.id,
        message: image != null ? image.uri : mask_message,
        name: 'Ranjeet Ji',
        timestamp: new Date().getTime(),
        to: profileData?.user_id,
        type: image != null ? 'image' : 'text',
      },
    ]);
    const send_msg = {
      from: props.customerData?.id,
      message:
        image != null
          ? RNFetchBlob.wrap(image.uri.replace('file://', ''))
          : mask_message,
      timestamp: new Date().getTime(),
      to: profileData?.user_id,
      type: image != null ? 'image' : 'text',
    };

    const add_msg = {
      message:
        image != null
          ? RNFetchBlob.wrap(image.uri.replace('file://', ''))
          : mask_message,
      timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      type: image != null ? 'image' : 'text',
    };

    const node = database().ref(`/UserId/${props.customerData?.id}`).push();
    const key = node.key;
    database()
      .ref(`/Messages/${props.customerData?.id}/${profileData?.user_id}/${key}`)
      .set(send_msg);
    database()
      .ref(`/Messages/${profileData?.user_id}/${props.customerData?.id}/${key}`)
      .set(send_msg);
    database()
      .ref(`/Chat/${props.customerData?.id}/${profileData?.user_id}`)
      .update(add_msg);
    database()
      .ref(`/Chat/${profileData?.user_id}/${props.customerData?.id}`)
      .update(add_msg);
    setMessage('');
  };

  const user_block = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + set_dnd,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        request_id: profileData?.user_id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          success_toast('You block the user.');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const getDateOrTime = timestamp => {
    const now = Date.now();
    const diff = now - timestamp;
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < oneDay) {
      // Within last 24 hours, return time
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else if (diff < 2 * oneDay) {
      // Between 24 and 48 hours ago, return "Yesterday" and time
      const yesterday = new Date(timestamp);
      const hours = yesterday.getHours();
      const minutes = yesterday.getMinutes();
      return `Yesterday ${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    } else {
      // Before yesterday, return date and time
      const date = new Date(timestamp);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return `${day}/${month}/${year} ${hours}:${
        minutes < 10 ? '0' + minutes : minutes
      }`;
    }
  };

  const render_chat = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          transform: [{scaleY: -1}],
        }}>
        {item.from != props.customerData?.id ? (
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 15,
            }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
            <View
              style={{
                flex: 0,
                maxWidth: width * 0.7,
                backgroundColor: colors.white_color,
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: {width: -2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginLeft: 10,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color8,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <Image
                  source={{uri: item.message}}
                  style={{width: width * 0.3, height: width * 0.4}}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: colors.black_color8,
                }}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              marginTop: 15,
            }}>
            <View
              style={{
                flex: 0,
                maxWidth: width * 0.7,
                backgroundColor: colors.background_theme2,
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: {width: -2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginRight: 10,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <Image
                  source={{uri: item.message}}
                  style={{width: width * 0.3, height: width * 0.4}}
                />
              )}
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: colors.background_theme1,
                  textAlign: 'right',
                }}>
                {getDateOrTime(item.timestamp)}
              </Text>
            </View>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{width: 40, height: 40, resizeMode: 'contain'}}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{
        flex: 1,
        backgroundColor: colors.background_theme3,
      }}>
      <View style={{flex: 1, paddingHorizontal: 10, transform: [{scaleY: -1}]}}>
        {chatData && (
          <FlatList
            ref={listRef}
            data={memoizedArray}
            renderItem={render_chat}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: colors.background_theme3,
          paddingVertical: 10,
          paddingHorizontal: 5,
          marginBottom: isFocused ? 80 : 0,
        }}>
        <TextInput
          value={message}
          placeholder="Enter Message"
          placeholderTextColor={colors.black_color8}
          onFocus={() => {
            setIsFocused(true), is_typing(1);
          }}
          onBlur={() => {
            setIsFocused(false), is_typing(0);
          }}
          onChangeText={text => {
            setMessage(text);
          }}
          style={{
            flex: 0,
            width: '80%',
            fontSize: 16,
            color: colors.black_color9,
            fontWeight: 'normal',
            borderWidth: 1,
            borderColor: colors.black_color8,
            borderRadius: 5,
            paddingVertical: 10,
            paddingHorizontal: 5,
            backgroundColor: colors.background_theme1,
          }}
        />
        <TouchableOpacity
          disabled={message.length == 0 || message.trim() === ''}
          onPress={() => add_message()}
          style={{
            flex: 0,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background_theme2,
            borderRadius: 30,
            shadowColor: colors.black_color8,
            shadowOffset: {width: -2, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <Octicons name="arrow-right" color={colors.white_color} size={30} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstrodateChat);
