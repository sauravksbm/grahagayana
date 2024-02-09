import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  ImageBackground
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import MyStatusBar from '../../components/MyStatusbar';
import {
  add_or_update_device_token,
  api2_get_profile,
  api_url,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
  user_web_api_login,
  user_web_api_verification_otp,
  vedic_images,
  getFontSize
} from '../../config/Constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import ZegoUIKitPrebuiltCallService, {
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  GROUP_VIDEO_CALL_CONFIG,
  GROUP_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
  ZegoInvitationType,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {ZegoLayoutMode} from '@zegocloud/zego-uikit-rn';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import MyLoader from '../../components/MyLoader';
import auth from '@react-native-firebase/auth';


const {width, height} = Dimensions.get('screen');
const CELL_COUNT = 4;

const Otp = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [otp, setOtp] = useState(props.route.params.otp);
  const [counter, setCounter] = useState(59);
  const [otpprops, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    // update_firebase_fcm(16)
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  const handle_otp = async uid => {
    if (otp == value) {
      setIsLoading(true);
      await axios({
        method: 'get',
        url:
          api_url +
          user_web_api_verification_otp +
          `number=${props.route.params.phone_number}&otp=${value}`,
      })
        .then(async res => {
          console.log(res.data);
          setIsLoading(false);
          update_fcm_token(res.data.id);
          console.log(res.data?.is_new_user);
          console.log('id===============',res.data.id);
          if (res.data?.is_new_user == '0') {
            customer_profile(res.data.id);
          } else {
            create_user_firebase_accout(res.data.id);
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    } else {
      warnign_toast('Please enter correct otp.');
    }
  };

  const create_user_firebase_accout = async id => {
    console.log('id-------------',id);
    await auth()
      .createUserWithEmailAndPassword(
        `${props.route.params.phone_number}@gmail.com`,
        '12345678',
      )
      .then(response => {
        props.dispatch(CustomerActions.setFirebaseId(response.user.uid));
        database()
          .ref(`/UserId/${id}`)
          .set(response.user.uid)
          .then(res => {
            console.log('test_data');
            props.navigation.navigate('signup', {
              phone_number: props.route.params.phone_number,
              id: id,
              flag: props.route.params?.flag,
            });
          })
          .catch(err => {
            console.log('test failed');
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
        props.navigation.navigate('signup', {
          phone_number: props.route.params.phone_number,
          id: id,
          flag: props.route.params?.flag,
        });
      });
  };

  const update_fcm_token = async user_id => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'post',
      url: api_url + add_or_update_device_token,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: user_id,
        user_type: 'user',
        device_token: fcm_token,
        token: '1',
      },
    })
      .then(res => {
        setIsLoading(false);
        database()
          .ref(`UserId/${user_id}`)
          .on('value', snapchat => {
            database().ref(`Users/${snapchat.val()}`).set({
              cover: '',
              token: fcm_token,
            });
          });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const customer_profile = async id => {
    let data = new FormData();
    data.append('user_id', id);
    console.log(id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(async res => {
        await AsyncStorage.setItem(
          'customerData',
          JSON.stringify(res.data.user_details[0]),
        );
        props.dispatch(
          CustomerActions.setCustomerData(res.data.user_details[0]),
        );
        props.dispatch(
          CustomerActions.setWallet(res.data.user_details[0].wallet),
        );
        // onUserLogin(
        //   res.data.user_details[0].id,
        //   res.data.user_details[0].username,
        // );
        get_customer_firebase_id(id);
        go_home();
        success_toast('You are logged successfully.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_customer_firebase_id = id => {
    database()
      .ref(`UserId/${id}`)
      .on('value', snapchat => {
        console.log('firebase Id otp up',snapchat?.val());
        props.dispatch(CustomerActions.setFirebaseId(snapchat?.val()));
      });
  };

  const onUserLogin = async (userID, userName) => {
    return ZegoUIKitPrebuiltCallService.init(
      call_app_id,
      call_app_sign,
      userID,
      userName,
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        requireConfig: data => {
          const callConfig =
            data.invitees.length > 1
              ? ZegoInvitationType.videoCall === data.type
                ? GROUP_VIDEO_CALL_CONFIG
                : GROUP_VOICE_CALL_CONFIG
              : ZegoInvitationType.videoCall === data.type
              ? ONE_ON_ONE_VIDEO_CALL_CONFIG
              : ONE_ON_ONE_VOICE_CALL_CONFIG;
          return {
            ...callConfig,
            onHangUp: duration => {
              props.navigation.navigate('callInvoice', {
                astro_id: data.invitees[0],
                total_time: duration,
              });
            },
            audioVideoViewConfig: {
              showSoundWavesInAudioMode: true,
            },
            bottomMenuBarConfig: {
              maxCount: 3,
              buttons: [
                ZegoMenuBarButtonName.toggleMicrophoneButton,
                ZegoMenuBarButtonName.hangUpButton,
                ZegoMenuBarButtonName.switchAudioOutputButton,
              ],
            },
            durationConfig: {
              isVisible: true,
            },
            innerText: {
              incomingVideoCallDialogTitle: 'AstroKunj',
              incomingVoiceCallPageMessage: 'AstroKunj',
              incomingVoiceCallDialogMessage: 'AstroKunj',
              incomingVoiceCallPageTitle: userName,
            },
            layout: {
              mode: ZegoLayoutMode.pictureInPicture,
              config: {
                showMyViewWithVideoOnly: false,
                isSmallViewDraggable: true,
                switchLargeOrSmallViewByClick: true,
              },
            },
            topMenuBarConfig: {
              buttons: [ZegoMenuBarButtonName.minimizingButton],
            },
            onWindowMinimized: data => {
              console.log('[Demo]CallInvitation onWindowMinimized');
            },
            onWindowMaximized: () => {
              console.log('[Demo]CallInvitation onWindowMaximized');
              props.navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen');
            },
          };
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        isIOSSandboxEnvironment: true,
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
  };

  const resend_otp = async () => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    await axios({
      method: 'get',
      url:
        api_url +
        user_web_api_login +
        `number=${props.route.params.phone_number}&token=${fcm_token}`,
    })
      .then(res => {
        setIsLoading(false)
        console.log(res.data);
        setOtp(res.data.otp)
        setCounter(60);
        success_toast('Otp send!')
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const go_home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'home',
            state: {
              routes: [
                {name: 'home2', params: {flag: props.route.params.flag}},
              ],
            },
          },
        ],
      }),
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} style={{}}>
      <KeyboardAvoidingView
        // behavior={Platform.OS == 'android' ? 'padding' : 'height'}
        style={{flex: 1}}>
          <ImageBackground
          source={require('../../assets/images/login_back.png')}
          style={{
            width: width,
            height: height,
          }}
          resizeMode="cover">
        <TouchableWithoutFeedback>
          <ScrollView  showsVerticalScrollIndicator={false}>
          <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor:'white',
                shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.58,
              elevation: 24,
              margin: 25,
              borderRadius: 20,
              marginTop:150
              }}>
                    <Image
                source={require('../../assets/images/Logo2.png')}
                style={{width: width * 0.2, height: width * 0.3, resizeMode: 'contain',position:"relative",top:-50}}
              />
              <KeyboardAvoidingView>
                  <View
                    style={{
                      flex: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    
                    <Text
                      style={{
                        fontSize: getFontSize(1.4),
                        textAlign: 'center',
                        color: colors.black_color7,
                        fontFamily: fonts.medium,
                      }}>
                      We Sent OTP Code to Verify Your Number
                    </Text>
                    <View style={{marginVertical: 2, alignItems: 'center'}}>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        
                        
                      </View>
                     
                      <View>
                        <CodeField
                          ref={ref}
                          {...otpprops}
                          // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                          value={value}
                          onChangeText={setValue}
                          cellCount={CELL_COUNT}
                          rootStyle={styles.codeFieldRoot}
                          keyboardType="number-pad"
                          textContentType="oneTimeCode"
                          renderCell={({index, symbol, isFocused}) => (
                            <Text
                              key={index}
                              style={[
                                styles.cell,
                                isFocused && styles.focusCell,
                              ]}
                              onLayout={getCellOnLayoutHandler(index)}>
                              {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                          )}
                        />
                      </View>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: 15,
                        }}>
                        <Text
                          style={{
                            fontSize: getFontSize(1.4),
                            color: colors.black_color7,
                            fontWeight: 'normal',
                          }}>
                          Resend OTP in{' '}
                        </Text>
                        <Text
                          style={{
                            fontSize: getFontSize(1.4),
                            color: colors.black_color7,
                            fontWeight: 'normal',
                          }}>
                          {counter} Seconds{' '}
                        </Text>
                        {counter == 0 && (
                          <TouchableOpacity
                          onPress={resend_otp}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: colors.background_theme2,
                                fontFamily: fonts.medium,
                              }}>
                              Resend
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={handle_otp}
                      style={{
                        width: width * 0.45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        backgroundColor: colors.background_theme2,
                        borderRadius: 25,
                        position:"relative",
                        marginTop: 5,
                        top:15
                      }}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.6),
                          color: colors.white_color,
                          fontFamily: fonts.medium,
                        }}>
                        SUBMIT
                      </Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => props.navigation.goBack()}
                      style={{flex: 0, alignSelf: 'center', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.6),
                          color: colors.background_theme4,
                          fontFamily: fonts.bold,
                        }}>
                        Change Number
                      </Text>
                    </TouchableOpacity> */}
                </View>
              </KeyboardAvoidingView>
              </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        </ImageBackground>
      </KeyboardAvoidingView>
      </ScrollView>

    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(Otp);

const styles = StyleSheet.create({
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30, fontFamily: fonts.medium},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: getFontSize(5),
    height: getFontSize(5),
    lineHeight: 32,
    fontSize: 22,
    borderWidth: 1,
    borderBottomWidth: 3,
    borderRadius: 5,
    borderColor: colors.black_color5,
    textAlign: 'center',
    marginRight: 5,
    marginHorizontal: 10,
    shadowColor: colors.black_color6,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    color:"black"
  },
  focusCell: {
    borderColor: colors.background_theme2,
  },
});
