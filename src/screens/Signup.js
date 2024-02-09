import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  api2_get_countries,
  api2_get_profile,
  api_url,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
  upload_customer_pic,
} from '../config/Constants';
import MyStatusBar from '../components/MyStatusbar';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import {CommonActions} from '@react-navigation/native';
import axios from 'axios';
import * as CustomerActions from '../redux/actions/CustomerActions';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';
import moment from 'moment';
import {useCallback} from 'react';
import {actions} from '../config/data';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import ZegoUIKitPrebuiltCallService, {
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import RNFetchBlob from 'rn-fetch-blob';
import {success_toast, warnign_toast} from '../components/MyToastMessage';
import MyLoader from '../components/MyLoader';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';

const {width, height} = Dimensions.get('screen');

const Signup = props => {
  console.log(props.route.params.id)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(
    props.route.params.phone_number,
  );
  const [male, setMale] = useState(true);
  const [female, setFemale] = useState(false);
  const [birthPlace, setBirthPlace] = useState(null);
  const [buttonStatus, setButtonStatus] = useState(true);
  const [countryData, setCountryData] = useState(null);
  const [country, setCountry] = useState(null);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dateShow, setDateShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);
  const [time, setTime] = useState(null);
  const [latLong, setLatLong] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [baseSixtyFourData, setbaseSixtyFourData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      title: 'Register',
      headerTintColor: colors.background_theme1,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{flex: 0}}>
          <AntDesign
            name="arrowleft"
            color={colors.background_theme1}
            size={25}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={customer_profile}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
            Skip
          </Text>
        </TouchableOpacity>
      ),
    });
  }, []);

  useEffect(() => {
    get_countries();
  }, []);

  const get_countries = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_get_countries,
    })
      .then(res => {
        setCountryData(res.data.countries);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const emain_validation = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      return true;
    } else {
      return false;
    }
  };

  const renderItem = ({ item }) => (
    <Text>{item.name}</Text>
  );

  const alphabeticRegex = /^[A-Za-z\s]+$/;

  const validation = () => {
    if (firstName.length == 0) {
      warnign_toast('Please enter your first name');
      return false;
    } else if (!alphabeticRegex.test(firstName)) {
      warnign_toast('Please enter your First Name Characters only');
      return false;
    } else if (lastName.length == 0) {
      warnign_toast('Please enter your last name');
      return false;
    } else if (!alphabeticRegex.test(lastName)) {
      warnign_toast('Please enter your Last Name Characters only');
      return false;
    } else if (email.length == 0) {
      warnign_toast('Please enter your email address');
      return false;
    } else if (emain_validation()) {
      warnign_toast('Please enter your correct email address');
      return false;
    } else if (country == null) {
      warnign_toast('Please select your country');
      return false;
    } else if (birthPlace == null) {
      warnign_toast('Please select your Place of Birth');
      return false;
    } else {
      return true;
    }
  };

  const update_profile = async () => {
    if (validation()) {
      
      setIsLoading(true);
      
      if(profileImage !== null)
      {
        RNFetchBlob.fetch(
          'POST',
          api_url + upload_customer_pic,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {name: 'id', data: props.route.params.id.toString()},
            {name: 'first_name', data: firstName},
            {name: 'last_name', data: lastName},
            {name: 'email', data: email},
            {name: 'gender', data: male ? 'Male' : 'Female'},
            {name: 'mobile', data: props.route.params.phone_number},
            {name: 'place_of_birth', data: birthPlace},
            {name: 'country', data: 'India'},
            {name: 'type', data: 'phone'},
            {name: 'time_of_birth', data: moment(time).format('hh:mm:ss')},
            {name: 'date_of_birth', data: moment(date).format('YYYY-MM-DD')},
            {
              name: 'image',
              data: baseSixtyFourData.toString(),
            },
          ],
        )
          .then(async res => {
            setIsLoading(false);
            console.log(res.data);
            // const response = JSON.parse(res.data);
            // console.log(response);
            await customer_profile();
          })
          .catch(err => {
            setIsLoading(false);
            console.log(err);
          });
      }
      else
      {
        RNFetchBlob.fetch(
          'POST',
          api_url + upload_customer_pic,
          {
            'Content-Type': 'multipart/form-data',
          },
          [
            {name: 'id', data: props.route.params.id.toString()},
            {name: 'first_name', data: firstName},
            {name: 'last_name', data: lastName},
            {name: 'email', data: email},
            {name: 'gender', data: male ? 'Male' : 'Female'},
            {name: 'mobile', data: props.route.params.phone_number},
            {name: 'place_of_birth', data: birthPlace},
            {name: 'country', data: 'India'},
            {name: 'type', data: 'phone'},
            {name: 'time_of_birth', data: moment(time).format('hh:mm:ss')},
            {name: 'date_of_birth', data: moment(date).format('YYYY-MM-DD')},
          ],
        )
          .then(async res => {
            setIsLoading(false);
            console.log(res.data);
            // const response = JSON.parse(res.data);
            // console.log(response);
            await customer_profile();
          })
          .catch(err => {
            setIsLoading(false);
            console.log(err);
          });
      }
      

     
    }
  };

  const customer_profile = async () => {
    let data = new FormData();
    data.append('user_id', props.route.params.id);
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
          CustomerActions.setWallet(res.data.user_details[0]?.wallet),
        );
        get_customer_firebase_id(props.route.params.id);
        go_home();
        success_toast('You are signed successfully.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_customer_firebase_id = id => {
    database()
      .ref(`UserId/${id}`)
      .on('value', snapchat => {
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
          incomingCallFileName: 'zego_incoming.m4r',
          outgoingCallFileName: 'zego_outgoing.m4r',
        },
        requireConfig: data => {
          return {
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
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

            ///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
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

  const get_profile_pick = useCallback((type, options) => {
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        setModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, res => {
        setModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    }
  }, []);

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateShow(false);
    setDate(currentDate);
  };

  const time_handle = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeShow(false);
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
                {name: 'home2', params: {flag: props.route.params?.flag}},
              ],
            },
          },
        ],
      }),
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            paddingVertical: 15,
          }}>
          <TouchableOpacity
            onPress={() => setButtonStatus(true)}
            style={{
              ...styles.buttonContainer,
              backgroundColor: buttonStatus
                ? colors.background_theme2
                : colors.background_theme1,
            }}>
            <Text
              style={{
                ...styles.buttonText,
                color: buttonStatus
                  ? colors.background_theme1
                  : colors.black_color8,
              }}>
              Upload Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setButtonStatus(false)}
            style={{
              ...styles.buttonContainer,
              backgroundColor: !buttonStatus
                ? colors.background_theme2
                : colors.background_theme1,
            }}>
            <Text
              style={{
                ...styles.buttonText,
                color: !buttonStatus
                  ? colors.background_theme1
                  : colors.black_color8,
              }}>
              Upload Photo
            </Text>
          </TouchableOpacity>
        </View>
        {buttonStatus ? (
          <View style={{flex: 1, margin: 15}}>
            <View
              style={{
                flex: 0,
                width: '100%',
                backgroundColor: colors.white_color,
                padding: 10,
              }}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={firstName}
                    placeholder="Enter first name"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setFirstName(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                  <TextInput
                    value={lastName}
                    placeholder="Enter Last name"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setLastName(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={25}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                  <TextInput
                    value={email}
                    placeholder="Enter email"
                    keyboardType="email-address"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setEmail(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone"
                  color={colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={phoneNumber}
                  editable={false}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={colors.black_color5}
                  onChangeText={text => {
                    setFirstName(text);
                  }}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => setDateShow(true)}
                style={[styles.inputContainer,{paddingTop:10,paddingBottom:10}]}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={30}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {date == null
                    ? 'Select Date Of Birth'
                    : moment(date).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>
              {dateShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={date == null ? new Date() : date}
                  maximumDate={new Date()}
                  mode={'date'}
                  is24Hour={true}
                  display='spinner'
                  minimumDate={new Date(1900, 1, 1)}
                  onChange={date_handle}
                />
              )}
              <TouchableOpacity
                onPress={() => setTimeShow(true)}
                style={[styles.inputContainer,{paddingTop:10,paddingBottom:10}]}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={25}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {time == null
                    ? 'Select Time Of Birth'
                    : moment(time).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
              {timeShow && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={time == null ? new Date() : time}
                  mode={'time'}
                  display='spinner'
                  is24Hour={false}
                  onChange={time_handle}
                />
              )}
              {countryData && (
                
                <View style={{ flex: 1 }}>
                <DropDownPicker
                  schema={{
                    label: 'name', // required
                    value: 'id', // required
                    icon: 'icon',
                    parent: 'parent',
                    selectable: 'selectable',
                    disabled: 'disabled',
                    testID: 'testID',
                    containerStyle: 'containerStyle',
                    labelStyle: 'labelStyle',
                  }}
                  open={open}
                  placeholder="Select country"
                  value={country}
                  items={countryData}
                  setOpen={setOpen}
                  setValue={setCountry}
                  setItems={setCountryData}
                  style={{marginBottom: 20}}
                  listMode='MODAL'
                  searchable={true}
                  scrollViewProps={{
                    nestedScrollEnabled: true,
                  }}
                />
                
                </View>
                
              )}
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('placeOfBirth', {
                    set_place_of_birth: setBirthPlace,
                    set_lat_long: setLatLong,
                  });
                }}
                style={[styles.inputContainer,{paddingTop:10,paddingBottom:10}]}>
                <MaterialCommunityIcons
                  name="map-marker"
                  color={colors.black_color8}
                  size={25}
                />
                <Text style={{fontSize: 14, color: colors.black_color7}}>
                  {birthPlace != null ? birthPlace : 'Place of Birth'}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2,
                  marginTop: 20,
                }}>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={male}
                    disableBuiltInState
                    text="Male"
                    textStyle={styles.checkBoxText}
                    onPress={() => {
                      setMale(true);
                      setFemale(false);
                    }}
                  />
                </View>
                <View
                  style={{
                    flex: 0.5,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <BouncyCheckbox
                    size={20}
                    fillColor={colors.background_theme2}
                    unfillColor="#FFFFFF"
                    isChecked={female}
                    disableBuiltInState
                    text="Female"
                    textStyle={styles.checkBoxText}
                    onPress={() => {
                      setMale(false);
                      setFemale(true);
                    }}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2,
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  onPress={update_profile}
                  style={{
                    flex: 0,
                    width: width * 0.7,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: width * 0.05,
                    backgroundColor: colors.background_theme2,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.white_color,
                      fontWeight: 'normal',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
            style={{flex: 1, margin: 15}}>
            <View
              style={{flex: 0, justifyContent: 'center', alignItems: 'center'}}>
              {/* <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 15,
                }}>
                Welcome to AstroKing
              </Text> */}
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 25,
                }}>
                Profile Upload
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                {profileImage == null ? (
                  <MaterialIcons
                    name="account-circle"
                    color={colors.black_color8}
                    size={80}
                  />
                ) : (
                  <Image
                    source={{uri: profileImage}}
                    style={{
                      width: width * 0.2,
                      height: width * 0.2,
                      borderRadius: 1000,
                    }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme2,
                    fontWeight: 'normal',
                    textAlign: 'center',
                    marginTop: 1,
                  }}>
                  Submit photo
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0,
                width: '100%',
                backgroundColor: colors.white_color,
                padding: 15,
                marginTop: 20,
                borderRadius: 5,
                shadowColor: colors.black_color6,
                shadowOffset: {
                  width: -2,
                  height: 2,
                },
                shadowOpacity: 0.3,
              }}>
              <View
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingBottom: 2,
                  paddingHorizontal: 2,
                  marginTop: 30,
                }}>
                <TouchableOpacity
                  onPress={update_profile}
                  style={{
                    flex: 0,
                    width: width * 0.7,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderRadius: width * 0.05,
                    backgroundColor: colors.background_theme2,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.white_color,
                      fontWeight: 'normal',
                    }}>
                    Upload Picture
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </ScrollView>
      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        style={{padding: 0, margin: 0}}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            flex: 0,
            width: '100%',
            backgroundColor: colors.background_theme1,
            padding: 20,
            position: 'absolute',
            bottom: 0,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            {actions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => get_profile_pick(item.type, item.options)}
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <Ionicons
                  name={item.title == 'Camera' ? 'camera' : 'image'}
                  size={25}
                  color={colors.blue_color5}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme2,
                    fontFamily: fonts.medium,
                    marginLeft: 5,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(Signup);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: colors.background_theme2,
  },
  buttonText: {
    fontSize: 14,
    color: colors.background_theme1,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 2,
    marginBottom: 20,
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});
