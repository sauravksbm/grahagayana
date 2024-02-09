import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {
  api2_create_kundali,
  get_kundali,
  api_url,
  colors,
  fonts,
  match_making,
  getFontSize
} from '../../config/Constants';
import MyLoader from '../../components/MyLoader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useState} from 'react';
import moment from 'moment';
import {warnign_toast} from '../../components/MyToastMessage';
import axios from 'axios';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';

const NewMatching = (props,route) => {

 
  
  
  if (props.route && props.route.params && props.route.params.data && props.route.params.data.gender == 'male') {

    const {t} = useTranslation();
    const male = props.route.params.data.customer_name;
    const mtime = props.route.params.data.dob+' '+props.route.params.data.tob;
    
  const [isLoading, setIsLoading] = useState(false);
  const [maleName, setMaleName] = useState('');
  
  const [femaleName, setFemaleName] = useState('');
  const [maleDateVisible, setMaleDateVisible] = useState(false);
  const [maleDate, setMaleDate] = useState(null);
  const [maleTimeVisible, setMaleTimeVisible] = useState(false);
  const [maleTime, setMaleTime] = useState(null);
  
  const [maleAddress, setMaleAddress] = useState(null);
  
  const [maleLatLong, setMaleLatLong] = useState(null);
  const [femaleDateVisible, setFemaleDateVisible] = useState(false);
  const [femaleDate, setFemaleDate] = useState(null);
  const [femaleTimeVisible, setFemaleTimeVisible] = useState(false);
  const [femaleTime, setFemaleTime] = useState(null);

  const [femaleAddress, setFemaleAddress] = useState(null);
  const [femaleLatLong, setFemaleLatLong] = useState(null);
  const [maleKundliId, setMaleKundliId] = useState(null);
  const [femaleKundliId, setFemaleKundliId] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("new_matching"),
    });
  }, []);

  

  
  const validation = () => {
    
    if ((femaleName.length === 0)) {
      warnign_toast('Please enter female name.');
      return false;
    } else if (femaleDate === null) {
      warnign_toast('Please select female birth date.');
      return false;
    } else if (femaleTime === null) {
      warnign_toast('Please select female birth time.');
      return false;
    } else if (femaleAddress === null) {
      warnign_toast('Please select female birth address.');
      return false;
    } else {
      return true;
    }
    
  };

  const get_matching = async (id) => {
    
    
      console.log('id---',id);
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + match_making,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          male_dob: maleDate != null ? moment(maleDate).format('YYYY-MM-DD') : props.route.params.data.dob,
          male_tob: maleTime != null ? moment(maleTime).format('HH:mm:ss') : props.route.params.data.tob,
          male_lat: maleLatLong?.lat != null ? maleLatLong?.lat : props.route.params.data.latitude,
          male_long: maleLatLong?.lon != null ? maleLatLong?.lon : props.route.params.data.longitude,
          female_dob: moment(femaleDate).format('YYYY-MM-DD'),
          female_tob: moment(femaleTime).format('HH:mm:ss'),
          female_lat: femaleLatLong?.lat,
          female_long: femaleLatLong?.lon,
        },
      })
        .then(res => {
          setIsLoading(false);
          props.navigation.navigate('kundliMatch', {
            data: res.data.match_astro_details,
            maleKundliData: {
              kundali_id: props.route.params.data.kundali_id,
              customer_name: maleName != '' ? maleName : props.route.params.data.customer_name,
              dob: maleDate != null ? moment(maleDate).format('YYYY-MM-DD') : props.route.params.data.dob,
              tob: maleTime != null ? moment(maleTime).format('HH:mm:ss') : props.route.params.data.tob,
              latitude: maleLatLong?.lat != null ? maleLatLong?.lat : props.route.params.data.latitude,
              longitude: maleLatLong?.lon != null ?  maleLatLong?.lon : props.route.params.data.longitude,
              place: maleAddress != null ? maleAddress : props.route.params.data.place,
            },
            femaleKundliData: {
              kundali_id: id,
              customer_name: femaleName,
              dob: moment(femaleDate).format('YYYY-MM-DD'),
              tob: moment(femaleTime).format('HH:mm:ss'),
              latitude: femaleLatLong?.lat,
              longitude: femaleLatLong?.lon,
              place: femaleAddress,
            },
          });
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    
  };

  
  const create_female_kundli = async () => {
    if (validation()) {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_create_kundali,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        customer_name: femaleName,
        dob: moment(femaleDate).format('YYYY-MM-DD'),
        tob: moment(femaleTime).format('HH:mm:ss'),
        gender: 'female',
        latitude: femaleLatLong?.lat,
        longitude: femaleLatLong?.lon,
        place: femaleAddress,
      },
    })
      .then(res => {
        console.log('female===',res.data);
        setFemaleKundliId(res.data.kundli_id);
        get_matching(res.data.kundli_id);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
    }
  };

  const male_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMaleDateVisible(false);
    setMaleDate(currentDate || props.route.params.data.dob);
    
  };

  const male_time_handle = (event, selectedTime) => {
    setMaleTime(selectedTime);
    setMaleTimeVisible(false);
    
  };

  const female_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFemaleDateVisible(false);
    console.log(currentDate);
    setFemaleDate(currentDate);
  };

  const female_time_handle = (event, selectedTime) => {
    setFemaleTime(selectedTime);
    console.log(selectedTime);
    setFemaleTimeVisible(false);
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            paddingVertical: 15,
            alignSelf: 'center',
          }}>
          <Text style={styles.heading}>
            {t("boy_details")}
          </Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setMaleName}
                  value={male}
                  
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setMaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {
                    props.route.params.data.dob === null && maleDate === null
                      ? 'DD/MM/YYYY'
                      : (maleDate !== null
                          ? moment(maleDate).format('Do MMM YYYY')
                          : moment(props.route.params.data.dob).format('Do MMM YYYY'))
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                    {
                    mtime === null && maleTime === null
                      ? 'HH:MM AM'
                      : (maleTime !== null
                          ? moment(maleTime).format('hh:mm A')
                          : moment(mtime).format('hh:mm A'))
                  }
                 
                </Text>
              </TouchableOpacity>
            </View>
            {maleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleDate == null ? new Date() : new Date(maleDate)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={male_date_handle}
              />
            )}
            {maleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleTime == null ? new Date() : new Date(maleTime)}
                mode={'time'}
                display='spinner'
                is24Hour={false}
                onChange={male_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setMaleAddress,
                  set_lat_long: setMaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {props.route.params.data.place != null ? props.route.params.data.place : 
                t("select_location")}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>
                  {t("girl_details")}
          </Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setFemaleName}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setFemaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleDate == null
                    ? 'DD/MM/YYYY'
                    : moment(femaleDate).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFemaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleTime == null
                    ? 'HH:MM AM'
                    : moment(femaleTime).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
            {femaleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleDate == null ? new Date() : new Date(femaleTime)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={female_date_handle}
              />
            )}
            {femaleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleTime == null ? new Date() : new Date(femaleTime)}
                mode={'time'}
                display='spinner'
                is24Hour={false}
                onChange={female_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setFemaleAddress,
                  set_lat_long: setFemaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {femaleAddress != null ? femaleAddress : t("select_location")}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => create_female_kundli()}
            activeOpacity={0.8}
            style={{
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              marginTop: 30,
              marginBottom: 10,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.white_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("show_match")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  } else if (props.route && props.route.params && props.route.params.data && props.route.params.data.gender == 'female') {

    const {t} = useTranslation();
    const female = props.route.params.data.customer_name;
    const fTime = props.route.params.data.dob+' '+props.route.params.data.tob;
    
  const [isLoading, setIsLoading] = useState(false);
  const [maleName, setMaleName] = useState('');
  
  const [femaleName, setFemaleName] = useState('');
  const [maleDateVisible, setMaleDateVisible] = useState(false);
  const [maleDate, setMaleDate] = useState(null);
  const [maleTimeVisible, setMaleTimeVisible] = useState(false);
  const [maleTime, setMaleTime] = useState(null);
  
  const [maleAddress, setMaleAddress] = useState(null);
  
  const [maleLatLong, setMaleLatLong] = useState(null);
  const [femaleDateVisible, setFemaleDateVisible] = useState(false);
  const [femaleDate, setFemaleDate] = useState(null);
  const [femaleTimeVisible, setFemaleTimeVisible] = useState(false);
  const [femaleTime, setFemaleTime] = useState(null);

  const [femaleAddress, setFemaleAddress] = useState(null);
  const [femaleLatLong, setFemaleLatLong] = useState(null);
  const [maleKundliId, setMaleKundliId] = useState(null);
  const [femaleKundliId, setFemaleKundliId] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("new_matching"),
    });
  }, []);

  

  
  const validation = () => {
    
    if ((maleName.length === 0)) {
      warnign_toast('Please enter male name.');
      return false;
    } else if (maleDate === null) {
      warnign_toast('Please select male birth date.');
      return false;
    } else if (maleTime === null) {
      warnign_toast('Please select male birth time.');
      return false;
    } else if (maleAddress === null) {
      warnign_toast('Please select male birth address.');
      return false;
    } else {
      return true;
    }
    
  };

  const get_matching = async (id) => {
    
    
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + match_making,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          male_dob: moment(maleDate).format('YYYY-MM-DD'),
          male_tob: moment(maleTime).format('HH:mm:ss'),
          male_lat: maleLatLong?.lat,
          male_long: maleLatLong?.lon,
          female_dob: femaleDate != null ? femaleDate : props.route.params.data.dob,
          female_tob: femaleTime != null ? femaleTime : props.route.params.data.tob,
          female_lat: femaleLatLong?.lat != null ? femaleLatLong?.lat  : props.route.params.data.latitude,
          female_long: femaleLatLong?.lon != null ? femaleLatLong?.lon : props.route.params.data.longitude,
        },
      })
        .then(res => {
          setIsLoading(false);
          props.navigation.navigate('kundliMatch', {
            data: res.data.match_astro_details,
            maleKundliData: {
              kundali_id: id,
              customer_name: maleName,
              dob: moment(maleDate).format('YYYY-MM-DD'),
              tob: moment(maleTime).format('HH:mm:ss'),
              latitude: maleLatLong?.lat,
              longitude: maleLatLong?.lon,
              place: maleAddress,
            },
            femaleKundliData: {
              kundali_id: props.route.params.data.kundali_id,
              customer_name: femaleName != null ? femaleName : props.route.params.data.customer_name,
              dob: femaleDate != null ? femaleDate : props.route.params.data.dob,
              tob: femaleTime != null ? femaleTime : props.route.params.data.tob,
              latitude: femaleLatLong?.lat != null ? femaleLatLong?.lat : props.route.params.data.latitude,
              longitude: femaleLatLong?.lon != null ? femaleLatLong?.lon : props.route.params.data.longitude,
              place: femaleAddress != null ? femaleAddress : props.route.params.data.place,
            },
          });
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    
  };

  const create_male_kundli = async () => {
    if (validation()) {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_create_kundali,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        customer_name: maleName,
        dob: moment(maleDate).format('YYYY-MM-DD'),
        tob: moment(maleTime).format('HH:mm:ss'),
        gender: 'male',
        latitude: maleLatLong?.lat,
        longitude: maleLatLong?.lon,
        place: maleAddress,
      },
    })
      .then(res => {
        console.log(res.data);
        setMaleKundliId(res.data.kundli_id);
        get_matching(res.data.kundli_id);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
    }
  };

  

  const male_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMaleDateVisible(false);
    setMaleDate(currentDate || props.route.params.data.dob);
    
  };

  const male_time_handle = (event, selectedTime) => {
    setMaleTime(selectedTime);
    setMaleTimeVisible(false);
    
  };

  const female_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFemaleDateVisible(false);
    console.log(currentDate);
    setFemaleDate(currentDate);
  };

  const female_time_handle = (event, selectedTime) => {
    setFemaleTime(selectedTime);
    console.log(selectedTime);
    setFemaleTimeVisible(false);
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            paddingVertical: 15,
            alignSelf: 'center',
          }}>
          <Text style={styles.heading}>BOY'S DETAILS</Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setMaleName}
                  value={maleName}    
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setMaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {maleDate == null 
                    ? 'DD/MM/YYYY'
                    : moment(maleDate).format('Do MMM YYYY')}
                  
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  
                   {maleTime == null
                    ? 'HH:MM AM'
                    : moment(maleTime).format('hh:mm A')}
                 
                </Text>
              </TouchableOpacity>
            </View>
            {maleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleDate == null ? new Date() : new Date(maleDate)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={male_date_handle}
              />
            )}
            {maleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleTime == null ? new Date() : new Date(maleTime)}
                mode={'time'}
                display='spinner'
                is24Hour={false}
                onChange={male_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setMaleAddress,
                  set_lat_long: setMaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                  {maleAddress != null ? maleAddress : t("select_location")}
                
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>
            {t("girl_details")}
          </Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setFemaleName}
                  value={female}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setFemaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                    {
                    props.route.params.data.dob === null && femaleDate === null
                      ? '__/ __/ ___'
                      : (femaleDate !== null
                          ? moment(femaleDate).format('Do MMM YYYY')
                          : moment(props.route.params.data.dob).format('Do MMM YYYY'))
                  }
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFemaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                 
                    {
                    fTime === null && femaleTime === null
                      ? '00:00 AM'
                      : (maleTime !== null
                          ? moment(femaleTime).format('hh:mm A')
                          : moment(fTime).format('hh:mm A'))
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {femaleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleDate == null ? new Date() : new Date(femaleTime)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={female_date_handle}
              />
            )}
            {femaleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleTime == null ? new Date() : new Date(femaleTime)}
                mode={'time'}
                display='spinner'
                is24Hour={false}
                onChange={female_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setFemaleAddress,
                  set_lat_long: setFemaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {props.route.params.data.place != null ? props.route.params.data.place : t("select_location")}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => create_male_kundli()}
            activeOpacity={0.8}
            style={{
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              marginTop: 30,
              marginBottom: 10,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.white_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("show_match")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  }
  else
  {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
  const [maleName, setMaleName] = useState(null);
  const [femaleName, setFemaleName] = useState('');
  const [maleDateVisible, setMaleDateVisible] = useState(false);
  const [maleDate, setMaleDate] = useState(null);

  const [maleTimeVisible, setMaleTimeVisible] = useState(false);
  const [maleTime, setMaleTime] = useState(null);
  const [maleAddress, setMaleAddress] = useState(null);
  const [maleLatLong, setMaleLatLong] = useState(null);
  const [femaleDateVisible, setFemaleDateVisible] = useState(false);
  const [femaleDate, setFemaleDate] = useState(null);
  const [femaleTimeVisible, setFemaleTimeVisible] = useState(false);
  const [femaleTime, setFemaleTime] = useState(null);

  const [femaleAddress, setFemaleAddress] = useState(null);
  const [femaleLatLong, setFemaleLatLong] = useState(null);
  const [maleKundliId, setMaleKundliId] = useState(null);
  const [femaleKundliId, setFemaleKundliId] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("new_matching"),
    });
  }, []);

  // useEffect(() => {
  //   // Code that depends on maleKundliId
  //   console.log('Effect - Male Kundli ID:', maleKundliId);
  //   console.log('Effect - Male Kundli ID:', femaleKundliId);
  //   get_matching(maleKundliId,femaleKundliId)
  // }, [maleKundliId,femaleKundliId]);



  const validation = () => {
    
    if ((maleName.length === 0)) {
      warnign_toast('Please enter male name.');
      return false;
    } else if (maleDate === null) {
      warnign_toast('Please select male birth date.');
      return false;
    } else if (maleTime === null) {
      warnign_toast('Please select male birth time.');
      return false;
    } else if (maleAddress === null) {
      warnign_toast('Please select male birth address.');
      return false;
    } else if ((femaleName.length === 0)) {
      warnign_toast('Please enter female name.');
      return false;
    } else if (femaleDate === null) {
      warnign_toast('Please select female birth date.');
      return false;
    } else if (femaleTime === null) {
      warnign_toast('Please select female birth time.');
      return false;
    } else if (femaleAddress === null) {
      warnign_toast('Please select female birth address.');
      return false;
    } else {
      return true;
    }
    
  };

  

  const get_matching = async (mid,fid) => {

    if (validation()) {
           
      
      if(mid != null && fid!= null)
      {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + match_making,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          male_dob: moment(maleDate).format('YYYY-MM-DD'),
          male_tob: moment(maleTime).format('HH:mm:ss'),
          male_lat: maleLatLong?.lat,
          male_long: maleLatLong?.lon,
          female_dob: moment(femaleDate).format('YYYY-MM-DD'),
          female_tob: moment(femaleTime).format('HH:mm:ss'),
          female_lat: femaleLatLong?.lat,
          female_long: femaleLatLong?.lon,
        },
      })
        .then(res => {
          setIsLoading(false);
          if(res.data.match_astro_details.status == false)
          {
            Alert.alert('Message', 'Your subscribed API key is Expired. Please Call by Admin Team', [
              {
                text: 'OK',
                onPress: () => {
                  props.navigation.navigate('home');
                },
              },
            ]);
          }
          props.navigation.navigate('kundliMatch', {
            data: res.data.match_astro_details,
            maleKundliData: {
              kundali_id: mid,
              customer_name: maleName,
              dob: maleDate,
              tob: maleTime,
              latitude: maleLatLong?.lat,
              longitude: maleLatLong?.lon,
              place: maleAddress,
            },
            femaleKundliData: {
              kundali_id: fid,
              customer_name: femaleName,
              dob: femaleDate,
              tob: femaleTime,
              latitude: femaleLatLong?.lat,
              longitude: femaleLatLong?.lon,
              place: femaleAddress,
            },
          });
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });

      }
    }
  };

  // const create_male_kundli = async () => {
    
  //   setIsLoading(true);

  //     try {
  //       const response = await axios({
  //         method: 'post',
  //         url: api_url + api2_create_kundali,
  //         headers: {
  //           'content-type': 'multipart/form-data',
  //         },
  //         data: {
  //           user_id: props.customerData.id,
  //           customer_name: maleName,
  //           dob: moment(maleDate).format('YYYY-MM-DD'),
  //           tob: moment(maleTime).format('hh:mm:ss'),
  //           gender: 'male',
  //           latitude: maleLatLong?.lat,
  //           longitude: maleLatLong?.lon,
  //           place: maleAddress,
  //         },
  //       });

  //       setIsLoading(false);

  //       console.log('hhh', response.data);

  //       setMaleKundliId(response.data.kundli_id);
      
  //     } catch (error) {
  //       setIsLoading(false);
  //       console.error(error);
  //     }
  // };

  
  // const create_female_kundli = async () => {
  //   setIsLoading(true);
  //   await axios({
  //     method: 'post',
  //     url: api_url + api2_create_kundali,
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //     },
  //     data: {
  //       user_id: props.customerData.id,
  //       customer_name: femaleName,
  //       dob: moment(femaleDate).format('YYYY-MM-DD'),
  //       tob: moment(femaleTime).format('hh:mm:ss'),
  //       gender: 'female',
  //       latitude: femaleLatLong?.lat,
  //       longitude: femaleLatLong?.lon,
  //       place: femaleAddress,
  //     },
  //   })
  //     .then(res => {
  //       console.log(res.data);
  //       setFemaleKundliId(res.data.kundli_id);
  //       setIsLoading(false);
  //     })
  //     .catch(err => {
  //       setIsLoading(false);
  //       console.log(err);
  //     });
  // };

  const createKundlis = async () => {
    setIsLoading(true);
  
    try {
      // Create Male Kundli
      const maleResponse = await axios.post(api_url + api2_create_kundali, {
        user_id: props.customerData.id,
        customer_name: maleName,
        dob: moment(maleDate).format('YYYY-MM-DD'),
        tob: moment(maleTime).format('HH:mm:ss'),
        gender: 'male',
        latitude: maleLatLong?.lat,
        longitude: maleLatLong?.lon,
        place: maleAddress,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });
  
      console.log('Male Kundli created:', maleResponse.data);
      setMaleKundliId(maleResponse.data.kundli_id);
  
      // Create Female Kundli
      const femaleResponse = await axios.post(api_url + api2_create_kundali, {
        user_id: props.customerData.id,
        customer_name: femaleName,
        dob: moment(femaleDate).format('YYYY-MM-DD'),
        tob: moment(femaleTime).format('HH:mm:ss'),
        gender: 'female',
        latitude: femaleLatLong?.lat,
        longitude: femaleLatLong?.lon,
        place: femaleAddress,
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the content type
        },
      });
  
      console.log('Female Kundli created:', femaleResponse.data);
      setFemaleKundliId(femaleResponse.data.kundli_id);

      get_matching(maleResponse.data.kundli_id,femaleResponse.data.kundli_id);
  
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating Kundlis:', error);
    }
  };
  
  
  

  const male_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setMaleDateVisible(false);
    console.log(currentDate);
    setMaleDate(currentDate);
  };

  const male_time_handle = (event, selectedTime) => {
    setMaleTime(selectedTime);
    setMaleTimeVisible(false);
  };

  const female_date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setFemaleDateVisible(false);
    console.log(currentDate);
    setFemaleDate(currentDate);
  };

  const female_time_handle = (event, selectedTime) => {
    setFemaleTime(selectedTime);
    console.log(selectedTime);
    setFemaleTimeVisible(false);
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            paddingVertical: 15,
            alignSelf: 'center',
          }}>
          <Text style={styles.heading}>
            {t("boy_details")}
          </Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setMaleName}
                  value={maleName}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setMaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {maleDate == null 
                    ? 'DD/MM/YYYY'
                    : moment(maleDate).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {maleTime == null
                    ? 'HH:MM AM'
                    : moment(maleTime).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
            {maleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleDate == null ? new Date() : new Date(maleDate)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={male_date_handle}
              />
            )}
            {maleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={maleTime == null ? new Date() : new Date(maleTime)}
                mode={'time'}
                
                display='spinner'
                is24Hour={false}
                onChange={male_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setMaleAddress,
                  set_lat_long: setMaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {maleAddress != null ? maleAddress : t("select_location")}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heading}>
            {t("girl_details")}
          </Text>
          <View style={styles.containerBox}>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name="account"
                color={colors.black_color8}
                size={25}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                <TextInput
                  placeholder={t("enter_name")}
                  placeholderTextColor={colors.black_color5}
                  onChangeText={setFemaleName}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </KeyboardAvoidingView>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setFemaleDateVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="calendar-month-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleDate == null
                    ? 'DD/MM/YYYY'
                    : moment(femaleDate).format('Do MMM YYYY')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFemaleTimeVisible(true)}
                style={{...styles.inputContainer, flex: 0.47}}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  color={colors.black_color8}
                  size={20}
                />
                <Text
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontWeight: 'normal',
                  }}>
                  {femaleTime == null
                    ? 'HH:MM AM'
                    : moment(femaleTime).format('hh:mm A')}
                </Text>
              </TouchableOpacity>
            </View>
            {femaleDateVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleDate == null ? new Date() : new Date(femaleTime)}
                mode={'date'}
                display='spinner'
                is24Hour={false}
                onChange={female_date_handle}
              />
            )}
            {femaleTimeVisible && (
              <DateTimePicker
                testID="dateTimePicker"
                value={femaleTime == null ? new Date() : new Date(femaleTime)}
                mode={'time'}
                display='spinner'
                is24Hour={false}
                onChange={female_time_handle}
              />
            )}
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: setFemaleAddress,
                  set_lat_long: setFemaleLatLong,
                });
              }}
              style={{...styles.inputContainer, marginBottom: 5}}>
              <MaterialCommunityIcons
                name="map-marker"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {femaleAddress != null ? femaleAddress : t("select_location")}
              </Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            onPress={() => createKundlis()}
            activeOpacity={0.8}
            style={{
              width: '80%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              marginTop: 30,
              marginBottom: 10,
              paddingVertical: 8,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.white_color,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("show_match")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
  }
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(NewMatching);

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    color: colors.black_color,
    fontFamily: fonts.semi_bold,
    marginLeft:10
  },
  containerBox: {
    flex: 0,
    backgroundColor: colors.background_theme1,
    padding: 15,
    borderRadius: 5,
    shadowColor: colors.black_color5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 10,
    marginBottom: 20,
  },
});
