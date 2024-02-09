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
  Image,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api2_get_countries,
  api2_get_profile,
  api_url,
  base_url,
  colors,
  fonts,
  upload_customer_pic,
  getFontSize
} from '../../config/Constants';
import {useState} from 'react';
import {connect} from 'react-redux';
import {actions} from '../../config/data';
import * as ImagePicker from 'react-native-image-picker';
import {useCallback} from 'react';
import MyLoader from '../../components/MyLoader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import RNFetchBlob from 'rn-fetch-blob';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const CustomerAccount = props => {
  const {t} = useTranslation();
  const [firstName, setFirstName] = useState(props.customerData?.first_name);
  const [lastName, setLastName] = useState(props.customerData?.last_name);
  const [email, setEmail] = useState(props.customerData?.email);
  const [phoneNumber, setPhoneNumber] = useState(props.customerData?.phone);
  const [male, setMale] = useState(false);
  const [female, setFemale] = useState(false);
  const [birthPlace, setBirthPlace] = useState(
    props.customerData?.place_of_birth,
  );
  const [buttonStatus, setButtonStatus] = useState(true);
  const [countryData, setCountryData] = useState(null);
  const [country, setCountry] = useState(props.customerData?.country);
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

  console.log(date);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("myAccount")}
          navigation={props.navigation}
          socialIcons={false}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    console.log('aa')
    get_countries();
    if (props.customerData?.date_of_birth != null) {
      console.log('aaa');
      setDate(new Date(props.customerData?.date_of_birth));
    }
    else
    {
      console.log('adsaf');
      
    }
    if (props.customerData?.time_of_birth != null) {
      setTime(
        new Date(
          props.customerData?.date_of_birth +
            'T' +
            props.customerData?.time_of_birth,
        ),
      );
    }
    if (props.customerData?.user_profile_image != null) {
      setProfileImage(
        base_url + 'admin/' + props?.customerData?.user_profile_image,
      );
    }
    if (props.customerData?.gender == 'Male') {
      setMale(true);
    } else if(props.customerData?.gender == 'Female') {
      setFemale(true);
    }
  }, []);

  const get_countries = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_countries,
    })
      .then(res => {
        setIsLoading(false);
        setCountryData(res.data.countries);
      })
      .catch(err => {
        setIsLoading(false);
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

  const validation = () => {
    if (firstName.length == 0) {
      warnign_toast('Please enter your first name');
      return false;
    } else if (lastName.length == 0) {
      warnign_toast('Please enter your last name');
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
      warnign_toast('Please enter your birth address');
      return false;
    } else {
      return true;
    }
  };

  const update_profile = async () => {
    if (validation()) {
      setIsLoading(true);
      let arr = [];
      arr.push({name: 'id', data: props.customerData.id.toString()});
      arr.push({name: 'first_name', data: firstName});
      arr.push({name: 'last_name', data: lastName});
      arr.push({name: 'email', data: email});
      arr.push({name: 'gender', data: male ? 'Male' : 'Female'});
      arr.push({name: 'mobile', data: phoneNumber});
      arr.push({name: 'place_of_birth', data: birthPlace});
      arr.push({name: 'country', data: country});
      arr.push({name: 'type', data: 'phone'});
      arr.push({name: 'time_of_birth', data: moment(time).format('HH:mm:ss')});
      arr.push({name: 'lat', data: latLong?.lat.toString()})
      arr.push({name: 'lon', data: latLong?.lon.toString()})
      arr.push({
        name: 'date_of_birth',
        data: moment(date).format('YYYY-MM-DD'),
      });
      if (profileImage.slice(0, 4) != 'http') {
        arr.push({
          name: 'image',
          data: baseSixtyFourData.toString(),
        });
      }
      console.log(arr)
      console.log( api_url + upload_customer_pic)

      RNFetchBlob.fetch(
        'POST',
        api_url + upload_customer_pic,
        {
          'Content-Type': 'multipart/form-data',
        },
        arr,
      )
        .then(async res => {
          console.log(res.data)
          setIsLoading(false);
          await customer_profile();
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const customer_profile = async () => {
    let data = new FormData();
    data.append('user_id', props.customerData.id);
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
        // props.dispatch(
        //   CustomerActions.setWallet(res.data.user_details[0].wallet),
        // );
        go_home();
        success_toast('Update Successfully.');
      })
      .catch(err => {
        console.log(err);
      });
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
        routes: [{name: 'home'}],
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
              {t("update_profile")}
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
              {t("update_photo")}
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
                  size={getFontSize(2)}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
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
                      fontSize:getFontSize(1.4)
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="account"
                  color={colors.black_color8}
                  size={getFontSize(2)}
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
                      fontSize:getFontSize(1.4)
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              {props.customerData.email == null ? (
                <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
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
                      fontSize:getFontSize(1.4)
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              ):(<View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={email}
                    editable={false}
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
                      fontSize:getFontSize(1.4)
                    }}
                  />
                </KeyboardAvoidingView>
              </View>)}
              
              {props.customerData.phone != 0 ? (
                <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <TextInput
                  value={phoneNumber}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={colors.black_color5}
                  onChangeText={text => {
                    setPhoneNumber(text);
                  }}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                    fontSize:getFontSize(1.4)
                  }}
                />
              </View>
              ):(<View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="phone"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <TextInput
                  value={phoneNumber}
                  editable={false}
                  placeholder="Enter Mobile Number"
                  placeholderTextColor={colors.black_color5}
                  onChangeText={text => {
                    setPhoneNumber(text);
                  }}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                    fontSize:getFontSize(1.4)
                  }}
                />
              </View>)}
              
              <TouchableOpacity
                onPress={() => setDateShow(true)}
                style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                    fontSize:getFontSize(1.4)
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
                  display='spinner'
                  minimumDate={new Date(1900, 1, 1)}
                  is24Hour={true}
                  onChange={date_handle}
                />
              )}
              <TouchableOpacity
                onPress={() => setTimeShow(true)}
                style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                    fontSize:getFontSize(1.4)
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
                <DropDownPicker
                  schema={{
                    label: 'name', // required
                    value: 'name', // required
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
              )}
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('placeOfBirth', {
                    set_place_of_birth: setBirthPlace,
                    set_lat_long: setLatLong,
                  });
                }}
                style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="map-marker"
                  color={colors.black_color8}
                  size={25}
                />
                <Text style={{fontSize: getFontSize(1.4), color: colors.black_color7}}>
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
                    size={getFontSize(1.8)}
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
                    size={getFontSize(1.8)}
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
                      fontSize: getFontSize(1.6),
                      color: colors.white_color,
                      fontWeight: 'normal',
                    }}>
                    Update
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
              <Text
                style={{
                  fontSize: getFontSize(1.8),
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 15,
                }}>
               {t("welcome")}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.8),
                  color: colors.black_color7,
                  fontWeight: 'normal',
                  textAlign: 'center',
                  marginTop: 25,
                }}>
                {t("profile_upload")}
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
                    fontSize: getFontSize(1.6),
                    color: colors.background_theme2,
                    fontWeight: 'normal',
                    textAlign: 'center',
                    marginTop: 1,
                  }}>
                  {t("select_photo")}
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
                      fontSize: getFontSize(1.6),
                      color: colors.white_color,
                      fontWeight: 'normal',
                    }}>
                    {t("update")}
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
                    fontSize: getFontSize(1.5),
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

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CustomerAccount);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: colors.background_theme2,
  },
  buttonText: {
    fontSize: getFontSize(1.4),
    color: colors.background_theme1,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth:1,
    borderColor: colors.black_color6,
    padding: 5,
    marginBottom: 20,
  },
  checkBoxText: {
    fontSize: getFontSize(1.4),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});
