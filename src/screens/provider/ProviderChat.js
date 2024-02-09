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
} from 'react-native';
import React, {useCallback} from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  api2_tarot_cards,
  api_url,
  colors,
  deductwallet,
  fonts,
  img_url_astrologer
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import MyStatusBar from '../../components/MyStatusbar';
import {vedic_images} from '../../config/Constants';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import moment from 'moment';
import {useMemo} from 'react';
import CardFlip from 'react-native-card-flip';
import axios from 'axios';
import {useRef} from 'react';
import MyLoader from '../../components/MyLoader';
import * as ImagePicker from 'react-native-image-picker';
import {actions} from '../../config/data';
import RNFetchBlob from 'rn-fetch-blob';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const {width, height} = Dimensions.get('screen');

const ProviderChat = props => {;
  // console.log(img_url_astrologer + props.providerData.img_url)
  let listRef = useRef(null);
  const [message, setMessage] = useState('');
  const [chatData, setChatData] = useState(null);
  const [tarotCardVisible, setTarotCardVisible] = useState(false);
  const [tarotCards, setTarotCards] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectImage, setSelectImage] = useState(null);
  const [totalTime, setTotalTime] = useState(0)
  const [modalVisibleChat, setModalVisibleChat] = useState(false);
  const [modalVisibleChat1, setModalVisibleChat1] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalImage1, setModalImage1] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleastro, setModalVisibleastro] = useState(false);
  const [timeLeft, setTimeLeft] = useState(
    (
      parseFloat(props.route.params.customerData.wallet) /
      (parseFloat(props.providerData.chat_price_m) + 
      parseFloat(props.providerData.chat_commission))
    ).toFixed(0) * 60,
  );
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const memoizedArray = useMemo(() => chatData, [chatData]);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(()=>{
    get_chats();
    const interval = setInterval(() => {
      database()
        .ref(`/CurrentRequest/${props.providerData.id}`)
        .on('value', async snapshot => {
          if (snapshot.val()?.status == 'EndbyUser') {
           
            setModalVisibleChat(true);
            clearInterval(interval);
          } else if(snapshot.val()?.status == 'RejectByUser') {
            setModalVisibleChat1(true);
            clearInterval(interval);
          }
        });
    }, 5000);
    return () => {
      clearInterval(interval);
      database().ref(`/CurrentRequest/${props.providerData.id}`).off();
    };
  }, []);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setTimeLeft(prevTime => {
  //       if (prevTime <= 0) {
  //         clearInterval(intervalId); // Stop the interval when time reaches 0 or goes negative
  //         return 0; // Set time left to 0
  //       }
  //       return prevTime - 1;
  //     });

  //     setTotalTime(prev => prev + 1);
  //   }, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);

  const home1 = () => {
    props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{name: 'providerHome'}],
              }),
            );
  };

  

  const is_typing = focus => {
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
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
    console.log(`/UserId/${props.route.params.customerData.user_id}`)
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
      .on('value', snapshot => {
        console.log(`/Messages/${props.firebaseId}/${snapshot.val()}`)
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
  
  const get_profile_pick = useCallback((type, options) => {
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
      ImagePicker.launchImageLibrary({...options, includeBase64: true}, res => {
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
    }
  }, []);

  const uploadImageWithProgress = async (imageUri, filename, onProgress) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const ref = storage().ref().child(`images/${filename}`);

    // Listen for upload progress events
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
    console.log('dddssdfs===',image);
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
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
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
          .ref(`/UserId/${props.route.params.customerData.user_id}`)
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

  const end_chat = async() => {
    await AsyncStorage.setItem('request', '0')
    Alert.alert('Alert!', 'Are you sure to end your chat?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => go_home(),
      },
    ]);
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

  const go_home = async(image = null) => {
    setChatData(prev => [
      ...prev,
      {
        from: props.firebaseId,
        message: 'Astrologer ended in chat',
        timestamp: new Date().getTime(),
        to: 'dsfnsdhfjhsdjfh',
        type: image != null ? 'image' : 'text',
      },
    ]);
    database()
      .ref(`/UserId/${props.route.params.customerData.user_id}`)
      .on('value', snapshot => {
        const send_msg = {
          message: 'Astrologer ended the chat.',
          timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
          to: snapshot.val(),
          type: 'text',
        };
        const node = database()
          .ref(`/UserId/${props.route.params.customerData.user_id}`)
          .push();
        const key = node.key;
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: 'Astrologer ended the chat.',
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: 'Astrologer ended the chat.',
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
        `/CurrentRequestUser/${props.route.params.customerData.user_id}`,
      );

      dateNodeRef
        .update({
          status: 'EndbyAstrologer',
        })
        .then(res => {
          console.log('updatedafadsf');
        })
        .catch(err => {
          console.log(err);
        });

    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'providerHome'}],
      }),
    );
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

  const render_chat = ({item, index}) => {
    return (
      <View
        key={index}
        style={{
          transform: [{scaleY: -1}],
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
                backgroundColor: '#ddd',
                padding: 10,
                borderRadius: 10,
                shadowColor: colors.black_color8,
                shadowOffset: {width: -2, height: 2},
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
                marginBottom:5,
                position:'relative',
                top:-10,
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
              source={{uri: props.route.params.customerData.profile_pic}}
              style={{ width: width * 0.1,
                height: width * 0.1,
                borderRadius: (width * 0.1) / 2,
                borderWidth: 2,
                borderColor: colors.background_theme1,
                marginLeft: 10}}
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
                shadowOffset: {width: -2, height: 2},
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
                marginBottom:5,
                position:'relative',
                top:-8,
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
              source={{ uri: img_url_astrologer + props.providerData.img_url }}
              style={{width: width * 0.1,
                height: width * 0.1,
                borderRadius: (width * 0.1) / 2,
                borderWidth: 2,
                borderColor: colors.background_theme1,
                marginLeft: 10}}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white_color}}>
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
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Confirm', 'Are you sure you want to go back?', [
                {text: "Don't leave", style: 'cancel', onPress: () => {}},
                {
                  text: 'Yes, leave',
                  style: 'destructive',
                  onPress: () => go_home(),
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
            source={{uri: props.route.params.customerData.profile_pic}}
            style={{
              width: width * 0.1,
              height: width * 0.1,
              borderRadius: (width * 0.1) / 2,
              borderWidth: 2,
              borderColor: colors.background_theme1,
              marginLeft: 10,
            }}
          />
          <View style={{flex: 0, marginLeft: 10}}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
              }}>
              {props.route.params?.customerData?.username}
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
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => props.navigation.navigate('providerKundli',{data:props.route.params.customerData})}>
          {/* <Ionicons name="wallet" color={colors.white_color} size={28} /> */}
          <Image source={require('../../assets/images/kundli1.png')} width={20} height={20} />
          </TouchableOpacity>
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
        style={{flex: 1, width: width,backgroundColor:'#ededed'}}>
        <View
          style={{flex: 1, paddingHorizontal: 10, transform: [{scaleY: -1}]}}>
          {chatData && (
            <FlatList
              ref={listRef}
              data={memoizedArray}
              renderItem={render_chat}
            />
          )}
        </View>
      </ImageBackground>
      <KeyboardAvoidingView >
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.white_color,
            paddingVertical: 10,
            paddingHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={()=>get_profile_pick(actions[1].type, actions[1].options)}
            style={{flex: 0, justifyContent: 'center', alignItems: 'center'}}>
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
              shadowOffset: {width: -2, height: 2},
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
                
                
                <View style={{flex: 0, padding: 15}}>
                  <Text
                    style={{fontSize: 14, textAlign: 'center', color: 'black'}}>
                    Chat End By User From {props.route.params.customerData?.username}.
                  </Text>
                            
                  
                  
                </View>
                <View style={{alignSelf:'center'}}>
                <TouchableOpacity 
                activeOpacity={0.8}
                onPress={home1}
                style={{
                  backgroundColor:colors.background_theme2,
                  padding:10,
                  borderRadius:10,
                  margin:10

}}>
    <Text style={{color:'white',fontSize:18,}}>Ok</Text>
</TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={modalVisibleChat1}
          transparent={true}
          onRequestClose={() => setModalVisibleChat1(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleChat1(true)}>
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
                
                
                <View style={{flex: 0, padding: 15}}>
                  <Text
                    style={{fontSize: 14, textAlign: 'center', color: 'black'}}>
                    Sorry!!! Chat Rejected by user from {props.route.params.customerData?.username}.
                  </Text>
                            
                  
                  
                </View>
                <View style={{alignSelf:'center'}}>
                <TouchableOpacity 
                activeOpacity={0.8}
                onPress={go_home}
                style={{
                  backgroundColor:colors.background_theme2,
                  padding:10,
                  borderRadius:10,
                  margin:10

}}>
    <Text style={{color:'white',fontSize:18,}}>Ok</Text>
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
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
  firebaseId: state.provider.firebaseId,
});

const mapDispatchToProps = dispatch =>({dispatch})

export default connect(mapStateToProps, mapDispatchToProps)(ProviderChat);
