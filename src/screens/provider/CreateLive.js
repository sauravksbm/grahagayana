import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  api2_create_kundali,
  api_url,
  colors,
  create_live,
  check_live,
  fonts,
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('window');

const genderData = [
  {id: 1, title: 'Male'},
  {id: 2, title: 'Female'},
];

const CreateLive = props => {
  const {t} = useTranslation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(null);
  const [birthPlace, setBirthPlace] = useState(null);
  const [dob, setDob] = useState(null);
  const [dobVisible, setDobVisible] = useState(false);
  const [tob, setTob] = useState(null);
  const [tobVisible, setTobVisible] = useState(false);
  const [latLong, setLatLong] = useState(null)
  const [gender, setGender] = useState('Male');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t('create_live'),
      header: () => (
        <MyHeader
          socialIcons={false}
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
    setTob(selectedTime);
  };

  const check_verify = async() => {
    await axios({
        method: 'post',
        url: api_url + check_live,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
        astro_id: props.providerData.id,
        },
      })
        .then(res => {
          const verify = res.data?.data[0]?.verify;
          if(verify == 2 || verify == null)
          {
            createlive();
          } 
          else
          {
            warnign_toast('Already Create Live exits...');
            
          }  
        })
        .catch(err => {
          setIsLoading(false)
          console.log('error===============>',err);
        });

}

  const validation = () => {
    if (title.length == 0) {
      warnign_toast('Please enter name.');
      return false;
    } else if (description == null) {
      warnign_toast('Please Enter description.');
      return false;
    } else if (dob == null) {
      warnign_toast('Please select date of birth.');
      return false;
    } else if (tob == null) {
      warnign_toast('Please select time of birth.');
      return false;
    } else {
      return true;
    }
  };

  const createlive = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + create_live,
        headers: {
          'content-type': 'multipart/form-data',
        },
        data: {
          user_id: props.providerData.id,
          title: title,
          description: description,
          curr_status: 'Offline',
          date: moment(dob).format('YYYY-MM-DD'),
          time: moment(tob).format('hh:mm:ss'),
          experience: props.providerData.experience,
        },
      })
        .then(res => {
          console.log(res.data);    
          setIsLoading(false)
          success_toast('Create Live Sucessfully.')
          props.navigation.goBack()
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
            size={20}
          />
          <TextInput
            value={title}
            placeholder={t('enter_title_name')}
            placeholderTextColor={colors.black_color5}
            onChangeText={setTitle}
            style={{
              flex: 1,
              marginLeft: 5,
              color: colors.black_color9,
              fontFamily: fonts.medium,
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="account"
            color={colors.black_color8}
            size={20}
          />
          <TextInput
            value={description}
            placeholder={t('enter_description')}
            placeholderTextColor={colors.black_color5}
            onChangeText={setDescription}
            style={{
              flex: 1,
              marginLeft: 5,
              color: colors.black_color9,
              fontFamily: fonts.medium,
            }}
          />
        </View>
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
              size={25}
            />
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {dob == null ? t('date') : moment(dob).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTobVisible(true)}
            style={{...styles.inputContainer, width: '45%'}}>
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
              {tob == null ? t('time') : moment(tob).format('hh:mm a')}
            </Text>
          </TouchableOpacity>
        </View>
        {dobVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dob != null ? dob : new Date()}
            mode={'date'}
            minimumDate={new Date()}
            onChange={date_handle}
          />
        )}
        {tobVisible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tob != null ? tob : new Date()}
            mode={'time'}
            is24Hour={true}
            onChange={time_handle}
          />
        )}
        
        <TouchableOpacity onPress={check_verify} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>{t('get_create')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(CreateLive);

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginTop: height * 0.03,
    height: height * 0.52,
    backgroundColor: colors.background_theme1,
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
