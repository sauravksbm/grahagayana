import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_astro_call_to_astrologer,
  api_callintake,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  call_app_id,
  call_app_sign,
  colors,
  fonts,
  kundli_get_kundli,
  deduct_reponse,
  user_chat_in,
  api2_create_kundali,
  create_kundali_call,
  getFontSize
} from '../../config/Constants';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import database from '@react-native-firebase/database';
import {CommonActions} from '@react-navigation/native';
import * as UserActions from '../../redux/actions/CustomerActions';
import { warnign_toast } from '../../components/MyToastMessage';
const {width, height} = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';


const CallIntakeForm = props => {
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isBirthDetails, setIsBirthDetailes] = useState(true);
  const [isBirthPickerVisible, setBirthPickerVisible] = useState(false);
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [gender, setGender] = useState('Male');
  const [isTarotPickerVisible, setIsTarotPickerVisible] = useState(false);
  const [tarot, setTarot] = useState('Select Category');
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeVisible, setTimeVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [time1,setTime1] = useState(null);
  const [birthPlace, setBirthPlace] = useState(null);
  const [maritalPickerVisible, setMaritalPickerVisible] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('Select Marital');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleCall,setModalVisibleCall] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [latLong, setLatLong] = useState(null);
  const [question, setQuestion] = useState('');
  const [kundliId, setKundliId] = useState(null);
  const [isCallable, setIsCallable] = useState(false);
  const [invoiceid,setinvoiceid] = useState(false);

  const {t} = useTranslation();


  const [timer, setTimer] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState(false);

  

  
 

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("call_intake_form")}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    get_form_detailes();
  }, []);

  useEffect(() => {
    if(timer != null) {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        setCountdownFinished(true); // Stop the countdown when it reaches 0
      }
    }, 1000); // Update the timer every 1 second
    return () => {
      clearInterval(countdown); 
    };
  }
  }, [timer]);

  useEffect(() => {
    if (countdownFinished) {
      props.navigation.goBack(); 
    }
  }, [countdownFinished, props.navigation]);

  const check_status = async () => {
    console.log(birthPlace);
    if (validation()) {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_getastrochatstatus,
      data: {
        astro_id: astroData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data.online);
        if (res.data.online) {
          setModalVisible(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  };

  
  const validation = () => {
    if (birthPlace == null) {
      warnign_toast('Please enter your birth place');
      return false;
    } if(time1 == null) {
      warnign_toast('Please enter your Date of Birth');
      return false;
    }
    else {
      return true;
    }
  };
 

  const on_submit = async () => {
    console.log('dfas');
    let data = {
      user_id: props.customerData.id,
      customer_name: name,
      dob: moment(date).format('YYYY-MM-DD'),
      tob: time1,
      gender: gender.toLowerCase(),
      latitude: latLong?.lat,
      longitude: latLong?.lon,
      place: birthPlace,
    };
    console.log(data);
     await axios({
      method:'post',
      url: api_url + create_kundali_call,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        customer_name: name,
        dob: moment(date).format('YYYY-MM-DD'),
        tob: time1,
        gender: gender.toLowerCase(),
        latitude: latLong?.lat,
        longitude: latLong?.lon,
        place: birthPlace,
      },
    }).then(res => {
      setIsLoading(false);
      console.log('asdfsa--',res.data);
      setKundliId(res.data.kundli_id);
      details(res.data.kundli_id);
    })
    .catch(err => {
      setIsLoading(false);
      console.log(err);
    });
    setIsLoading(true);
  };

    const details =  async(id) => {
      await axios({
        method: 'post',
        url: api_url + api_callintakesubmit,
        data: {
          user_id: props.customerData.id,
          firstname: name,
          lastname: '',
          countrycode: '+91',
          phone: phoneNumber,
          email: '',
          gender: gender,
          astro_id: astroData.id,
          chat_call: '1',
          dob: moment(date).format('DD-MM-YYYY'),
          tob: moment(time).format('HH:MM:SS'),
          city: 'New Delhi',
          state: '',
          country: 'New Delhi',
          marital: maritalStatus,
          occupation: occupation,
          topic: '',
          question: question,
          dob_current: 'yes',
          partner_name: '',
          partner_dob: '',
          partner_tob: '',
          partner_city: '',
          partner_state: '',
          partner_country: '',
          kundli_id: id,
        },
    })
    .then(res =>{
      console.log(res.data);
      invoice_id(id);
    })
    .catch(err => {
      console.log(err);
    })

  };

   
  const invoice_id = async(id) => {
    await axios({
    
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_user_id: astroData.id,
        user_id: props.customerData.id,
        moblie_no: props.customerData.phone,
        kundali:id,
      },
    })
    .then(res => {
      console.log('tttddd',res.data);
      setModalVisible(false);
      if(res.data.status == 0)
      {
        Alert.alert('Message',res.data.message,[
          {
            text: 'OK',
            onPress: () => {
              props.navigation.navigate('home');
            },
          },
        ]);
      }
      else
      {
        setinvoiceid(res.data);
        setTimer(60);
        
        setModalVisibleCall(true);
      }

    })
    .catch(err => {
      console.log(err);
    })
    console.log('test1');
    props.dispatch(UserActions.setCallInvoiceId(invoiceid));
    
  } 

    const deduct = async() =>
    {
      await axios({
        method: 'post',
        url: api_url + deduct_reponse,
        data: {
          transid:invoiceid.call_id,
        },
      }).then(res => {
        setIsLoading(false);
        console.log(res.data);
        props.navigation.navigate('callInvoice', {
          
        });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
    }

    // Convert the remaining seconds into minutes and seconds
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  

  const get_form_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_callintake,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        let data = res.data.records[0];
        if (typeof res.data.records[0]?.id != 'undefined') {
          setName(data.firstname);
          setPhoneNumber(data.phone);
          setGender(data.gender);
          if (data.dob) {
            setDate(moment(data.dob, 'DD-MM-YYYY'));
          }
          if (data.tob) {
            // setTime(moment(data.tob, 'hh:mm:ss'));
          }
          // setBirthPlace(data.place_birth);
          setMaritalStatus(data.marital);
          setOccupation(data.occupation);
        }
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const get_kundali = async () => {
    console.log('test1');
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
          dob: moment(date).format('YYYY-MM-DD'),
          tob: time1,
          gender: gender.toLowerCase(),
          latitude: latLong?.lat,
          longitude: latLong?.lon,
          place: birthPlace,
        },
      })
        .then(res => {
          console.log(res.data);
          setIsLoading(false)
          setKundliId(res.data.kundli_id);
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err);
        });
    
  };


  const handle_date = (event, selectedDate) => {
    setDate(selectedDate);
    setDateVisible(false);
  };

  const handle_time = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeVisible(false);
    const utcDate = new Date(selectedTime);
    const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));

    const hours = localDate.getHours().toString().padStart(2, '0');
    const minutes = localDate.getMinutes().toString().padStart(2, '0');
    const seconds = localDate.getSeconds().toString().padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    console.log('Formatted Time:', formattedTime);

    setTime1(formattedTime);
  };

  const set_place_of_birth = text => {
    setBirthPlace(text);
  };

  const returnTrue = () => {
    return Promise.resolve(true);
  };

  const get_invoice_id = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astro_call_to_astrologer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: astroData.id,
        kundli_id: kundliId,
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        props.dispatch(UserActions.setCallInvoiceId(res.data));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black_color1,
        justifyContent: 'center',
      }}>
      <MyLoader isVisible={isLoading} />
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("name")}</Text>
            <TextInput
              placeholder={t("enter_name")}
              placeholderTextColor={colors.black_color8}
              onChangeText={setName}
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
                color:'black',
                fontSize:getFontSize(1.6),
                borderWidth:1,
                borderColor:'grey'
              }}>
              {name}
            </TextInput>
          </View>
          {/* <View style={styles.itemContainer}>
            <Text style={styles.heading}>Phone Number</Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor={colors.black_color8}
              keyboardType="number-pad"
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
              }}
            />
          </View> */}
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("gender")}</Text>
            <View style={{borderColor:'#ddd',marginTop:10,borderRadius:5,
          backgroundColor:colors.black_color1,height:getFontSize(6),borderWidth:1,
          borderColor:'grey'}}>
              <Picker
                selectedValue={gender}
                themeVariant="light"
                onValueChange={(itemValue, itemIndex) => {
                  setGender(itemValue);
                  setIsGenderPickerVisible(false);
                }}
                style={{padding: 0, margin: 0,color:'black',fontSize:getFontSize(1.6)}}>
                <Picker.Item label={t("male")} value="Male" style={{fontSize:getFontSize(1.6)}} />
                <Picker.Item label={t("female")} value="Female" style={{fontSize:getFontSize(1.6)}}/>
              </Picker>
              </View>
          </View>
          <View style={styles.itemRowContainer}>
            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.6),
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                 
                }}>
                {t("date_of_birth")}
              </Text>
              <TouchableOpacity
                onPress={() => setDateVisible(true)}
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                  borderWidth:1,
                borderColor:'grey'
                }}>
                <Text style={{color:'black',fontSize:getFontSize(1.6)}}>{moment(date).format('DD-MM-YYYY')}</Text>
              </TouchableOpacity>
            </View>

            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.6),
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                {t("time_of_birth")}
              </Text>
              <TouchableOpacity
                onPress={() => setTimeVisible(true)}
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                  borderWidth:1,
                borderColor:'grey'
                }}>
                <Text style={{color:'black',fontSize:getFontSize(1.6)}}>{time1 != null ? time1: t("time")}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {dateVisible && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display='spinner'
                  minimumDate={new Date(1900, 1, 1)}
              onChange={handle_date}
            />
          )}
          {timeVisible && (
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              is24Hour={false}
              onChange={handle_time}
            />
          )}
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("place_of_birth")}</Text>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('placeOfBirth', {
                  set_place_of_birth: set_place_of_birth,
                  set_lat_long: setLatLong,
                })
              }
              style={styles.pickerButton}>
              <Text
                style={{
                  fontSize: getFontSize(1.6),
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                  
                }}>
                {birthPlace}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 0, alignSelf: 'center', marginVertical: 20}}>
          <TouchableOpacity
          onPress={check_status}
          style={{
              backgroundColor:colors.background_theme2,
              padding:10,
              borderRadius:10,
              width:200,
              alignContent:'center',
              alignSelf:'center',
              justifyContent:'center'
          }}
          ><Text style={{color:'black',textAlign:'center',fontSize:getFontSize(1.7)}}>
            {t("start_call_with")} {astroData?.owner_name}</Text> 
          </TouchableOpacity>
          
          </View>
        </ScrollView>
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#00000050',
                justifyContent: 'center',
                alignItems: 'center',
                
              }}>
              <View
                style={{
                  flex: 0,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: colors.background_theme1,
                  borderRadius:10
                }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.9),
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                    padding: 15,
                  }}>
                  Astrologer can talk in these languages
                </Text>
                <View
                  style={{
                    flex: 0,
                    height: 1,
                    marginBottom: 15,
                    marginTop: 1,
                    backgroundColor: colors.yellow_color1,
                  }}
                />
                <View style={{flex: 0, padding: 15}}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.9),
                      fontFamily: fonts.bold,
                      color: colors.black_color,
                      textAlign: 'center',
                    }}>
                    {astroData?.owner_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: getFontSize(1.7),
                      color: colors.black_color8,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                      marginVertical: 5,
                    }}>
                    {astroData?.language}
                  </Text>
                  <TouchableOpacity
                    onPress={on_submit}
                    style={{
                      flex: 0,
                      width: '80%',
                      alignSelf: 'center',
                      paddingVertical: 10,
                      borderRadius: 5,
                      backgroundColor: colors.background_theme2,
                      marginVertical: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: getFontSize(1.7),
                        color: colors.background_theme1,
                        fontFamily: fonts.bold,
                        textAlign: 'center',
                      }}>
                      Start
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={modalVisibleCall}
          transparent={true}
          onRequestClose={() => setModalVisibleCall(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleCall(true)}>
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
                  borderRadius:10
                }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.7),
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                    padding: 15,
                  }}>
                  Your call session request is placed successfully.
                </Text>
                <View
                  style={{
                    flex: 0,
                    height: 1,
                    marginBottom: 15,
                    marginTop: 1,
                    backgroundColor: colors.yellow_color1,
                  }}
                />
                <View style={{flex: 0, padding: 15}}>
                  <Text style={{fontSize:getFontSize(1.7),textAlign:'center',color:'black'}}>You will receive Call from {astroData?.owner_name}.</Text>
                  <Text style={{fontSize:getFontSize(1.6),textAlign:'center',color:'black',fontWeight:'bold',marginTop:5}}>{astroData?.owner_name}</Text>
                  <Text style={{fontSize:getFontSize(1.6),textAlign:'center',color:colors.background_theme2,marginTop:10}}>Within</Text>
                  <Text style={{fontSize:getFontSize(1.7),fontWeight:'bold',color:'white',textAlign:'center',backgroundColor:colors.background_theme2,width:'20%',alignSelf:'center',borderRadius:10}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
                  <Text style={{color:'black',borderWidth:1,borderColor:colors.background_theme2,borderRadius:10,width:'40%',alignSelf:'center',textAlign:'center',marginTop:10}}>Stay Connected</Text>
                  <Text style={{color:'black',fontSize:getFontSize(1.4),textAlign:'center',marginTop:10}}>Your billing will start after they accept the call request.</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CallIntakeForm);

const styles = StyleSheet.create({
  container: {
    width: width * 0.92,
    height: height * 0.85,
    backgroundColor: colors.background_theme1,
    alignSelf: 'center',
    shadowColor: colors.black_color7,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  itemContainer: {
    flex: 0,
    marginBottom: 15,
    
  },
  itemRowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  heading: {
    fontSize: getFontSize(1.6),
    color: colors.black_color8,
    fontFamily: fonts.medium,
  },
  pickerButton: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.black_color1,
    borderRadius: 5,
    marginTop: 10,
    borderWidth:1,
    borderColor:'grey'
  },
  submitButton: {
    flex: 0,
    width: '80%',
    alignSelf: 'center',
    backgroundColor: colors.background_theme2,
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: colors.black_color8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginVertical: 10,
  },
});
