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
import {useEffect} from 'react';
import {useState} from 'react';
import {
  api2_create_kundali,
  api_url,
  colors,
  fonts,
  getFontSize
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import {connect} from 'react-redux';
import DatePicker from 'react-native-date-picker'
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('window');


const NewKundli = props => {
  const {t} = useTranslation();
const genderData = [
  {id: 1, title: "Male"},
  {id: 2, title: "Female"},
];
  const [name, setName] = useState('');
  const [birthPlace, setBirthPlace] = useState(null);
  const [dob, setDob] = useState(null);
  const [dobVisible, setDobVisible] = useState(false);
  const [tob, setTob] = useState(null);
  const [tob1, setTob1] = useState(null);
  const [tobVisible, setTobVisible] = useState(false);
  const [latLong, setLatLong] = useState(null)
  const [gender, setGender] = useState("Male");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("new_kundli"),
    });
  }, []);

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDobVisible(false);
    setDob(currentDate);
  };

  const time_handle = (event, selectedTime) => {
    setTobVisible(false);
    console.log(selectedTime);
    setTob(selectedTime); 
    const utcDate = new Date(selectedTime);
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const seconds = localDate.getSeconds().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    console.log('Formatted Time:', formattedTime);

    setTob1(formattedTime);
    // Set the formatted time to the tob state
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
    const data = {
      user_id: props.customerData.id,
      customer_name: name,
      dob: moment(dob).format('YYYY-MM-DD'),
      tob: moment(tob).format('hh:mm:ss'),
      test: tob1,
      gender: gender.toLowerCase(),
      latitude: latLong?.lat,
      longitude: latLong?.lon,
      place: birthPlace,
    };
    console.log(data);
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
          customer_name: name,
          dob: moment(dob).format('YYYY-MM-DD'),
          tob: tob1,
          gender: gender.toLowerCase(),
          latitude: latLong?.lat,
          longitude: latLong?.lon,
          place: birthPlace,
        },
      })
        .then(res => {
          console.log(res.data);
          setIsLoading(false)
          success_toast('Kunli created successfully.')
          if(res.data.status == true)
          {
            props.navigation.navigate('showKundli', {data: res.data.data})
          }
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err);
        });
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="account"
            color={colors.black_color8}
            size={getFontSize(2)}
          />
          <TextInput
            value={name}
            placeholder={t("enter_name")}
            placeholderTextColor={colors.black_color5}
            onChangeText={setName}
            style={{
              flex: 1,
              marginLeft: 5,
              color: colors.black_color9,
              fontSize:getFontSize(1.4),
              padding:0
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
            size={getFontSize(2)}
          />
          <Text style={{fontSize: getFontSize(1.4), color: colors.black_color7}}>
            {birthPlace != null ? birthPlace : t("place_of_birth")}
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
            style={{...styles.inputContainer, width: '45%'}}>
            <MaterialCommunityIcons
              name="calendar-month-outline"
              color={colors.black_color8}
              size={getFontSize(2)}
            />
            <Text
              style={{
                fontSize: getFontSize(1.4),
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {dob == null ? t("date_of_birth") : moment(dob).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTobVisible(true)}
            style={{...styles.inputContainer, width: '45%'}}>
            <MaterialCommunityIcons
              name="clock-outline"
              color={colors.black_color8}
              size={getFontSize(2)}
            />
            <Text
              style={{
                fontSize: getFontSize(1.4),
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {tob == null ? t("time_of_birth") : moment(tob).format('HH:mm a')}
            </Text>
          </TouchableOpacity>
        </View>
        {dobVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob != null ? dob : new Date()}
            mode={'date'}
            display='spinner'
            maximumDate={new Date(2050, 11, 31)}
            minimumDate={new Date(1900, 1, 1)}
            onChange={date_handle}
            
          />
        )}
        {tobVisible && (
         
          <DateTimePicker
            testID="dateTimePicker"
            value={tob != null ? tob : new Date()}
            mode={'time'}
            display='spinner'
            is24Hour={false}
            timeZoneName={'Asia/Kolkata'}
            onChange={time_handle}
          />
        )}
        <View style={{flexDirection:'row'}}>
          <Image source={require('../../assets/images/gender.png')}
          style={{width:getFontSize(3),height:getFontSize(3),marginTop:getFontSize(2),resizeMode:'contain'}}/>
        <View
          style={{
            flex: 0,
            width: '85%',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.black_color6,
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
              {/* <Ionicons
                name="male"
                color={
                  item.title != gender
                    ? colors.black_color7
                    : colors.background_theme1
                }
                size={25}
              /> */}
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color:
                    item.title != gender
                      ? colors.black_color7
                      : colors.background_theme1,
                  fontFamily: fonts.medium,
                  marginLeft: 5,
                }}>
                  {item.title == "Male" ?(t("male")):(t("female"))}
                
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        </View>
        <TouchableOpacity onPress={create_kundli} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{t("get_kundli")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(NewKundli);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: height * 0.03,
    height: height * 0.52,
    backgroundColor: '#fafdf6',
    alignSelf: 'center',
    borderRadius: 15,
    shadowColor: colors.black_color4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    padding: 15,
    elevation:8,
    
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
    fontSize: getFontSize(1.6),
    color: colors.black_color,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    // height: height * 0.07,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
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
