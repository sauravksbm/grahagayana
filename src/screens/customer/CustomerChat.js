import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Button

} from 'react-native';

import React, { useCallback } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import {
  api2_tarot_cards,
  api_url,
  colors,
  deductwallet,
  fonts,
  provider_img_url,
  img_url_astrologer
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MyStatusBar from '../../components/MyStatusbar';
import { vedic_images } from '../../config/Constants';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
// import storage from '@react-native-firebase/storage';
import { connect } from 'react-redux';
import moment from 'moment';
import { useMemo } from 'react';
import CardFlip from 'react-native-card-flip';
import axios from 'axios';
import { useRef } from 'react';
import MyLoader from '../../components/MyLoader';
import * as ImagePicker from 'react-native-image-picker';
import { actions } from '../../config/data';
import RNFetchBlob from 'rn-fetch-blob';
import storage from '@react-native-firebase/storage';
import { NativeModules, DeviceEventEmitter } from 'react-native';

const { width, height } = Dimensions.get('screen');
const { TimerModule } = NativeModules;

const CustomerChat = props => {

  
  const [astroData] = useState(props.route.params.astroData);
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState(null);
  const [tarotCardVisible, setTarotCardVisible] = useState(false);
  const [tarotCards, setTarotCards] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectImage, setSelectImage] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [modalVisibleChat, setModalVisibleChat] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleastro, setModalVisibleastro] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (
      parseFloat(props.wallet) /
      (parseFloat(astroData.chat_price_m) +
        parseFloat(astroData.chat_commission))
    ).toFixed(0) * 60,
  );
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const memoizedArray = useMemo(() => chatData, [chatData]);
  const tarotRef = Array.from({ length: 10 }, () => useRef(null));
  const [timerId, setTimerId] = useState(null);
  const [minutes1, setMinutes] = useState(0);
  const [seconds1, setSeconds] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalImage1, setModalImage1] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  let listRef = useRef(null);

  // console.log('chat===========', props.route.params.astroData);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    get_chats();
    props.navigation.addListener('focus', () => {
      setTarotCardVisible(true);
    });

    const interval = setInterval(() => {
      database()
        .ref(`/CurrentRequestUser/${props.customerData.id}`)
        .on('value', async snapshot => {
          if (snapshot.val()?.status == 'EndbyAstrologer') {
            console.log('test');
            stopTimer();
            setModalVisibleChat(true);
            clearInterval(interval);
          }
        });
    }, 5000);
    return () => {
      clearInterval(interval);
      database().ref(`/CurrentRequestUser/${props.customerData.id}`).off();
    };

  }, []);

  

  useEffect(() => {
    let intervalId;

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            deduct_wallet();
            setIsTimerRunning(false); // Stop the timer
            return 0;
          }
          return prevTime - 1;
        });

        setTotalTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimerRunning]);

  useEffect(() => {
    startTimer();
  },[]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
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
      return `${day}/${month}/${year} ${hours}:${minutes < 10 ? '0' + minutes : minutes
        }`;
    }
  };

  const get_profile_pick = useCallback((type, options) => {
    console.log(type);
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setChatData(prev => [
            {
              from: props.firebaseId,
              image: res.assets[0].uri,
              message: '',
              timestamp: new Date().getTime(),
              to: 'dsfnsdhfjhsdjfh',
              type: 'image',
              uploading: true,
            },
            ...prev,
          ]);
          handleImageUpload(res.assets[0].uri, res.assets[0].fileName);
        }
      });
    } else {
      ImagePicker.launchImageLibrary({ ...options, includeBase64: true }, res => {
        console.log('resss===', res);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          const selectedImage = res.assets[0];

          // Access height and width


          setChatData(prev => [
            {
              from: props.firebaseId,
              image: selectedImage.uri,
              message: '',
              timestamp: new Date().getTime(),
              to: 'dsfnsdhfjhsdjfh',
              type: 'image',
              uploading: true,

            },
            ...prev,
          ]);
          handleImageUpload(selectedImage.uri, selectedImage.fileName);
        }
      });
    }
  }, []);

  const uploadImageWithProgress = async (imageUri, filename, onProgress) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const ref = storage().ref().child(`images/${filename}`);


    const metadata = {
      contentType: 'image/jpeg',
    };

    const task = ref.put(blob);
    task.on('state_changed', snapshot => {
      const progress = snapshot.bytesTransferred / snapshot.totalBytes;
      onProgress(progress); // Call the progress callback
    });
    // Wait for the upload to complete
    await task;
    const downloadURL = await ref.getDownloadURL();
    add_message(downloadURL);
    return downloadURL;
  };



  const handleImageUpload = async (imageUri, filename) => {
    try {
      setUploading(true);

      // Upload image with progress monitoring
      await uploadImageWithProgress(imageUri, filename, progress => {
        console.log('tttttssss===', imageUri, filename);
        setUploadProgress(progress);
      });

      // Image uploaded successfully
      setUploading(false);
      setUploadProgress(0);

      // Continue with sending the message
    } catch (error) {
      console.error('Error uploading image:', error);
      // Handle upload error
    }
  };


  const add_message = async (image = null) => {
    setChatData(prev => [
      ...prev,
      {
        from: props.firebaseId,
        message: image != null ? image : message,
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: image != null ? 'image' : 'text',
      },
    ]);
    if (image != null) {
      // try {
      //   const storageRef = storage().ref(`message_images/${image.base64}`);
      //   const downloadUrl = await storageRef.getDownloadURL();
      //   console.log('Image URL:', downloadUrl);
      // } catch (error) {
      //   console.log('Error retrieving image URL:', error);
      // }
    }
    database()
      .ref(`/AstroId/${props.route.params.astroData.id}`)
      .on('value', snapshot => {
        const send_msg = {
          message:
            image != null
              ? image
              : message,
          timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
          to: snapshot.val(),
          type: image != null ? 'image' : 'text',
        };
        const node = database()
          .ref(`/AstroId/${props.route.params.astroData.id}`)
          .push();
        const key = node.key;
        console.log(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`);
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: image != null ? image : message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: image != null ? 'image' : 'text',
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: image != null ? image : message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: image != null ? 'image' : 'text',
          });
        database()
          .ref(`/Chat/${props.firebaseId}/${snapshot.val()}`)
          .update(send_msg);
        database()
          .ref(`/Chat/${snapshot.val()}/${props.firebaseId}`)
          .update(send_msg);
        setMessage('');
        // get_chats();
      });
  };



  const is_typing = focus => {
    database()
      .ref(`/AstroId/${props.route.params.astroData.id}`)
      .on('value', snapshot => {
        database().ref(`/Chat/${props.firebaseId}/${snapshot.val()}`).update({
          typing: focus,
        });
        database().ref(`/Chat/${snapshot.val()}/${props.firebaseId}`).update({
          typing: focus,
        });
      });
  };

  const get_chats = () => {
    database()
      .ref(`/AstroId/${props.route.params.astroData.id}`)
      .on('value', snapshot => {
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}`)
          .on('value', value => {
            const myDataObject = value.val();
            const myDataArray = Object.keys(myDataObject)
              .sort()
              .map(key => myDataObject[key]);
            setChatData(myDataArray.reverse());
          });
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Confirm', 'Are you sure you want to go back?', [
          { text: "Don't leave", style: 'cancel', onPress: () => { } },
          {
            text: 'Yes, leave',
            style: 'destructive',
            onPress: () => go_home(),
          },
        ]);
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, [props.navigation]),
  );

  const go_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'home' }],
      }),
    );
  };

  const get_tarot_cards = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: api_url + api2_tarot_cards,
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setTarotCards(res.data.cards);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const tarot_message = item => {
    let msg =
      'Name = ' +
      props.customerData.username +
      '\nDOB = ' +
      '12-23-12' +
      '\nCity = ' +
      'New Delhi' +
      '\nlatitude = ' +
      '28.4945984335' +
      '\nlongitude = ' +
      '26.454545434' +
      '\nCountry = ' +
      'India' +
      '\nOccupation = ' +
      'Job' +
      '\nTarot Category = ' +
      'none' +
      '\nTopic of concern = ' +
      'no';
    setTarotCardVisible(false);
    setMessage(msg);
    add_message(msg);
    setTimeout(() => {
      add_message(item.image);
    }, 500);
  };

  const showimage = (image) => {
  console.log('image=',image);
  setModalImage(image);
    setModalVisible(true);
  }

  const showimage1 = (image) => {
  console.log('image=',image);
  setModalImage1(image);
    setModalVisibleastro(true);
  }

  const render_chat = ({ item, index }) => {
    return (
      <View
        key={index}
        style={{
          transform: [{ scaleY: -1 }],
        }}>
        {item.from != props.firebaseId ? (
          <View
            style={{
              flex: 0,

              alignItems: 'flex-start',
              marginTop: 15,
            }}>

            <View
              style={{
                flex: 0,
                maxWidth: width * 0.7,
                backgroundColor: "#ddd",
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: { width: -2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginLeft: 20,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.black_color8,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <View>
                  <TouchableOpacity onPress={() => showimage1(item.message)} activeOpacity={0.8}>
                    <Image
                      source={{ uri: item.message }}
                      style={{ width: width * 0.5, height: height * 0.3 }}
                    />
                  </TouchableOpacity>
                  <Modal
                    visible={modalVisibleastro}
                    transparent={true}
                    onRequestClose={() => setModalVisibleastro(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setModalVisibleastro(false)}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#00000050',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: modalImage1 }}
                          style={{ width: width * 0.8, height: height * 0.8 }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>

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
            <View
              style={{
                marginLeft: 20,
                marginBottom: 5,
                position: 'relative',
                top: -10,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 15,
                borderRightWidth: 15,
                borderBottomWidth: 30,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "#ddd",
                transform: [{ rotate: "195deg" }],
              }}>

            </View>
            <Image
              source={{ uri: props.route.params.astroData.image }}
              style={{
                width: width * 0.1,
                height: width * 0.1,
                borderRadius: (width * 0.1) / 2,
                borderWidth: 2,
                borderColor: colors.background_theme1,
                marginLeft: 10,
              }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 0,
              flexDirection: 'column',
              alignItems: 'flex-end',

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
                shadowOffset: { width: -2, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
                marginRight: 20,
              }}>
              {item.type != 'image' ? (
                <Text
                  style={{
                    fontSize: 15,
                    color: colors.background_theme1,
                  }}>
                  {item.message}{' '}
                </Text>
              ) : (
                <View>
                  <TouchableOpacity onPress={() => showimage(item.message)} activeOpacity={0.8}>
                    <Image
                      source={{ uri: item.message }}
                      style={{ width: width * 0.5, height: height * 0.3 }}
                    />
                  </TouchableOpacity>
                  <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                  >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                      <View
                        style={{
                          flex: 1,
                          backgroundColor: '#00000050',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Image
                          source={{ uri: modalImage}}
                          style={{ width: width * 0.8, height: height * 0.8 }}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>


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
            <View
              style={{
                marginRight: 20,
                marginBottom: 5,
                position: 'relative',
                top: -8,
                width: 0,
                height: 0,
                backgroundColor: "transparent",
                borderStyle: "solid",
                borderLeftWidth: 15,
                borderRightWidth: 15,
                borderBottomWidth: 30,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: colors.background_theme2,
                transform: [{ rotate: "165deg" }],
              }}>

            </View>
            <Image
              source={{ uri: provider_img_url + props.customerData.user_profile_image }}
              style={{
                width: width * 0.1,
                height: width * 0.1,
                borderRadius: (width * 0.1) / 2,
                borderWidth: 2,
                borderColor: colors.background_theme1,
                marginLeft: 10,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const end_chat_in_firebase = (result) => {
    setChatData(prev => [
      ...prev,
      {
        from: props.firebaseId,
        message: 'User ended the chat.',
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: 'text',
      },
    ]);
    database()
      .ref(`/AstroId/${props.route.params.astroData.id}`)
      .on('value', snapshot => {
        const send_msg = {
          message: 'User ended the chat.',
          timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
          to: snapshot.val(),
          type: 'text',
        };
        const node = database()
          .ref(`/AstroId/${props.route.params.astroData.id}`)
          .push();
        const key = node.key;
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: 'User ended the chat.',
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: 'User ended the chat.',
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        database()
          .ref(`/Chat/${props.firebaseId}/${snapshot.val()}`)
          .update(send_msg);
        database()
          .ref(`/Chat/${snapshot.val()}/${props.firebaseId}`)
          .update(send_msg);
        setMessage('');
        get_chats();
      });

    const dateNodeRef = database().ref(
      `/CurrentRequest/${props.route.params.astroData.id}`,
    );

    dateNodeRef
      .update({
        status: 'EndbyUser',
      })
      .then(res => {
        console.log('updatedafadsf');
      })
      .catch(err => {
        console.log(err);
      });

      const dateNodeRef1 = database().ref(
        `/CurrentRequestUser/${props.customerData.id}`,
      );
  
      dateNodeRef1
        .update({
          status: '',
        })
        .then(res => {
          console.log('updateda---');
        })
        .catch(err => {
          console.log(err);
        });
      

      console.log('Total Time:',totalTime);

    props.navigation.navigate('chatInvoice', {
      astroData: astroData,
      trans_id: props.route.params.trans_id,
      chat_id: props.route.params.chat_id,
      total_time: totalTime,
      result: result,
    });
  };

  const deduct_wallet = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + deductwallet,
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
        amount: astroData.chat_price_m,
        commission: astroData.chat_commission,
        astro_amount: astroData.chat_price_m,
        chat_id: props.route.params.chat_id,
        chat_call: '1',
        end_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        transid: props.route.params.trans_id,
        seconds:totalTime
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        end_chat_in_firebase(res.data.result);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const end_chat = () => {
    Alert.alert('Alert!', 'Are you sure to end your chat?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => deduct_wallet(),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white_color }}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
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
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Confirm', 'Are you sure you want to go back?', [
                { text: "Don't leave", style: 'cancel', onPress: () => { } },
                {
                  text: 'Yes, leave',
                  style: 'destructive',
                  onPress: () => deduct_wallet(),
                },
              ]);
            }}
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
            source={{ uri: props.route.params.astroData.image }}
            style={{
              width: width * 0.1,
              height: width * 0.1,
              borderRadius: (width * 0.1) / 2,
              borderWidth: 2,
              borderColor: colors.background_theme1,
              marginLeft: 10,
            }}
          />
          <View style={{ flex: 0, marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
              }}>
              {astroData.owner_name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
              }}>{`${minutes.toString().padStart(2, '0')}:${seconds
                .toString()
                .padStart(2, '0')} min`}</Text>


          </View>
        </View>
        <View style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
          {/* <Ionicons name="wallet" color={colors.white_color} size={28} /> */}
          <TouchableOpacity
            onPress={end_chat}
            style={{
              flex: 0,
              paddingHorizontal: 15,
              paddingVertical: 5,
              backgroundColor: colors.background_theme1,
              borderRadius: 15,
              marginLeft: 10,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              End Chat
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <ImageBackground
        // source={vedic_images.chat_background}
        style={{ flex: 1, width: width, backgroundColor: '#ededed' }}>
        <View
          style={{ flex: 1, paddingHorizontal: 10, transform: [{ scaleY: -1 }] }}>
          {chatData && (
            <FlatList
              ref={listRef}
              data={memoizedArray}
              renderItem={render_chat}
            />
          )}
        </View>

        {!isLoading && (
          <Modal
            visible={false}
            transparent={true}
            onRequestClose={() => setTarotCardVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#00000050',
                justifyContent: 'center',
                alignItems: 'center',
                // opacity: 0.4
              }}>
              <View
                style={{
                  flex: 0,
                  width: width * 0.9,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  height: height * 0.8,
                  backgroundColor: colors.background_theme1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  padding: width * 0.03,
                }}>
                {tarotCards &&
                  tarotCards.map((item, index) => (
                    <View
                      key={index}
                      style={{
                        width: width * 0.25,
                        height: width * 0.35,
                      }}>
                      <CardFlip
                        style={styles.cardContainer}
                        ref={card => (tarotRef[index] = card)}>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => {
                            tarotRef[index].flip();
                            tarot_message(item);
                          }}>
                          <Image
                            source={require('../../assets/images/card_back.jpeg')}
                            style={{
                              width: width * 0.22,
                              height: width * 0.3,
                              borderRadius: 10,
                              // resizeMode: 'contain'
                            }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.card}
                          onPress={() => tarotRef[index].flip()}>
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              width: width * 0.22,
                              height: width * 0.3,
                              borderRadius: 10,
                              // resizeMode: 'contain'
                            }}
                          />
                        </TouchableOpacity>
                      </CardFlip>
                    </View>
                  ))}
              </View>
            </View>
          </Modal>
        )}
      </ImageBackground>
      <KeyboardAvoidingView >
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.white_color,
            paddingVertical: -20,
            paddingHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => get_profile_pick(actions[1].type, actions[1].options)}
            style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="images" color={colors.black_color7} size={30} />
          </TouchableOpacity>
          <TextInput
            value={message}
            placeholder="Type here.."
            placeholderTextColor={colors.black_color8}
            onFocus={() => is_typing(1)}
            onBlur={() => is_typing(0)}
            // onSubmitEditing={add_message}
            onChangeText={text => {
              setMessage(text);
            }}
            style={{
              flex: 0,
              width: '70%',
              fontSize: 16,
              color: colors.black_color9,
              fontWeight: 'normal',
              borderWidth: 1,
              borderColor: colors.black_color8,
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 5,
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
              shadowOffset: { width: -2, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}>
            <Octicons name="arrow-right" color={colors.white_color} size={30} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Modal
        visible={modalVisibleChat}
        transparent={true}
        onRequestClose={() => setModalVisibleChat(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisibleChat(true)}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#00000050',
              justifyContent: 'center',
              alignItems: 'center',
              // opacity: 0.4
            }}>
            <View
              style={{
                flex: 0,
                width: '90%',
                alignSelf: 'center',
                backgroundColor: colors.background_theme1,
                borderRadius: 10,
              }}>


              <View style={{ flex: 0, padding: 15 }}>
                <Text
                  style={{ fontSize: 14, textAlign: 'center', color: 'black' }}>
                  Chat End By Astrologer From {astroData.owner_name}.
                </Text>



              </View>
              <View style={{ alignSelf: 'center' }}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={deduct_wallet}
                  style={{
                    backgroundColor: colors.background_theme2,
                    padding: 10,
                    borderRadius: 10,
                    margin: 10

                  }}>
                  <Text style={{ color: 'white', fontSize: 18, }}>Ok</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(CustomerChat);

const styles = StyleSheet.create({
  cardContainer: {},
  face: {
    backgroundColor: colors.white_color,
    // padding: 10
  },
  back: {},
});
