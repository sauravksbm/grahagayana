import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import {
  edit_kundali,
  api2_my_kundali,
  api_url,
  get_kundali,
  colors,
  fonts,
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { success_toast, warnign_toast } from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { connect } from 'react-redux';
import MyHeader from '../../components/MyHeader';
const { width, height } = Dimensions.get('window');
const moment1 = require('moment-timezone');
const genderData = [
  { id: 1, title: 'Male' },
  { id: 2, title: 'Female' },
];

const EditKundli = props => {
  const time = props.route.params.data1.dob + ' ' + props.route.params.data1.tob;
  console.log(time)
  
  // Convert to Indian Standard Time (IST)
  const istTime = time;
  // Format the IST time as a string



  const [name, setName] = useState(props.route.params.data1.customer_name);
  const [birthPlace, setBirthPlace] = useState(props.route.params.data1.place);
  const [dob, setDob] = useState(props.route.params.data1.dob);
  const [dobVisible, setDobVisible] = useState(false);
  const [tob, setTob] = useState(istTime);
  const [tobVisible, setTobVisible] = useState(false);
  const [latLong, setLatLong] = useState({
    lat: props.route.params.data1.latitude,
    lon: props.route.params.data1.longitude
  });
  const str = props.route.params.data1.gender;
  const capitalizedStr = str.charAt(0).toUpperCase() + str.slice(1);


  const [gender, setGender] = useState(capitalizedStr);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('dd');
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Edit kundli"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);


  

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDobVisible(false);
    setDob(currentDate);
  };



  const time_handle = (event, selectedTime) => {
    setTobVisible(false);
    if (event.type == 'set') {
      setTob(selectedTime);
    }

  };

  const validation = () => {
    if (name.length == 0) {
      warnign_toast('Please enter name.');
      return false;
    } else if (birthPlace == null) {
      warnign_toast('Please enter birth place.');
      return false;
    } else if (dob == null) {
      warnign_toast('Please select date of birth.');
      return false;
    } else if (tob == null) {
      warnign_toast('Please select time of birth.');
      return false;
    } else if (birthPlace == null) {
      warnign_toast('Please enter your birth place.');
      return false;
    } else {
      return true;
    }
  };

  const create_kundli = async () => {
    console.log(name);
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + edit_kundali,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          kundli_id: props.route.params.data1.kundali_id,
          customer_name: name,
          dob: moment(dob).format('YYYY-MM-DD'),
          tob: moment(tob).format('HH:mm:ss'),
          gender: gender,
          latitude: latLong?.lat,
          longitude: latLong?.lon,
          place: birthPlace,
        },
      })
        .then(res => {
          console.log('ssss', res.data);
          setIsLoading(false)
          success_toast('Kunli Updated successfully.')
          props.navigation.goBack()
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err);
        });
    }
  };

  var d = new Date(tob);
  console.log(d.getUTCHours()); // Hours
  console.log(d.getUTCMinutes());
  console.log(d.getUTCSeconds());

  const formattedTime = tob ? d.getUTCHours() + ':' + d.getUTCMinutes() : 'Date and Time';
  console.log('tob:  ', tob, 'formattedTime', formattedTime);


  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="account"
            color={colors.black_color8}
            size={25}
          />
          <TextInput
            value={name}
            placeholder="Enter full name"
            placeholderTextColor={colors.black_color5}
            onChangeText={setName}
            style={{
              flex: 1,
              marginLeft: 5,
              color: colors.black_color9,
              fontFamily: fonts.medium,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('placeOfBirth', {
              set_place_of_birth: setBirthPlace,
              set_lat_long: setLatLong
            });
          }}
          style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            color={colors.black_color8}
            size={25}
          />
          <Text style={{ fontSize: 14, color: colors.black_color7 }}>
            {birthPlace != null ? birthPlace : 'birth place'}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flex: 0,
            width: '100%',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => setDobVisible(true)}
            style={{ ...styles.inputContainer, width: '45%' }}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={colors.black_color8}
              size={25}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {dob == null ? 'date of birth' : moment(dob).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTobVisible(true)}
            style={{ ...styles.inputContainer, width: '45%' }}>
            <MaterialCommunityIcons
              name="clock-outline"
              color={colors.black_color8}
              size={25}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {tob === null ? 'Date and Time' : moment(tob).format('HH:mm')}
            </Text>
          </TouchableOpacity>
        </View>
        {dobVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob != null ? new Date(dob) : new Date()}
            mode={'date'}
            display='spinner'
            onChange={date_handle}
          />
        )}
        {tobVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tob instanceof Date ? tob : new Date()}
            mode={'time'}
            is24Hour={false}
            display='spinner'
            timeZoneName='Asia/Kolkata'
            onChange={time_handle}
            style={{}}
          />
        )}
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Image
            source={require('../../assets/images/icon/gender.png')}
            style={{ width: width * 0.08, height: width * 0.08, marginTop: 25, marginRight: 10, resizeMode: 'contain' }}

          />
          <View
            style={{
              flex: 0,
              width: '85%',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.background_theme2,
              flexDirection: 'row',
              alignSelf: 'center',
            }}>

            {genderData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setGender(item.title)}
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  width: '50%',
                  alignSelf: 'center',
                  backgroundColor:
                    item.title == gender
                      ? colors.background_theme2
                      : colors.background_theme1,
                  height: height * 0.07,
                  borderRadius: 10,
                  borderWidth: item.title == gender ? 1 : 0,
                  borderColor: colors.background_theme2,
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}>


                <Text
                  style={{
                    fontSize: 14,
                    color:
                      item.title != gender
                        ? colors.black_color7
                        : colors.background_theme1,
                    fontFamily: fonts.medium,
                    marginLeft: 5,
                  }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={create_kundli} activeOpacity={0.8} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Update kundli</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(EditKundli);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: height * 0.03,
    height: height * 0.52,
    backgroundColor: '#fafdf6',
    alignSelf: 'center',
    borderRadius: 5,
    shadowColor: colors.black_color4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 15,
    elevation: 8
  },
  buttonContainer: {
    width: '100%',
    height: height * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: colors.background_theme2,
    marginTop: height * 0.04,
  },
  buttonText: {
    fontSize: 16,
    color: colors.background_theme1,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    // height: height * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: colors.background_theme2,
    padding: 10,
    marginBottom: height * 0.02,
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
});
