import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  accept_chat,
  api_callintake,
  api_callintakesubmit,
  api_getastrochatstatus,
  api_url,
  base_url,
  colors,
  fonts,
  kundli_get_kundli,
  user_chat_in,
  api2_create_kundali,
  create_kundali_chat,
  getFontSize
} from '../../config/Constants';
import DropDownPicker from 'react-native-dropdown-picker';
import {Picker, PickerIOS} from '@react-native-picker/picker';
import {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import axios from 'axios';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import database from '@react-native-firebase/database';
import {CommonActions} from '@react-navigation/native';
import {warnign_toast} from '../../components/MyToastMessage';
const {width, height} = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';

const ChatIntakeForm = props => {
  const {t} = useTranslation();
  // console.log('tes');
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [isBirthDetails, setIsBirthDetailes] = useState(true);
  const [isBirthPickerVisible, setBirthPickerVisible] = useState(false);
  const [isGenderPickerVisible, setIsGenderPickerVisible] = useState(false);
  const [gender, setGender] = useState(t("male"));
  const [isTarotPickerVisible, setIsTarotPickerVisible] = useState(false);
  const [tarot, setTarot] = useState('Select Category');
  const [dateVisible, setDateVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [timeVisible, setTimeVisible] = useState(false);
  const [time, setTime] = useState(new Date());
  const [time1,setTime1] = useState(new Date());
  const [birthPlace, setBirthPlace] = useState(null);
  const [maritalPickerVisible, setMaritalPickerVisible] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('Select Marital');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleChat,setModalVisibleChat] = useState(false);
  const [modalVisibleReject,setModalVisibleReject] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [question, setQuestion] = useState('');
  const [kundliId, setKundliId] = useState(null);
  const [latLong, setLatLong] = useState('');
  const [chatId, setChatId] = useState(null);

  const [timer, setTimer] = useState(null);
  const [countdownFinished, setCountdownFinished] = useState(false);

  const [timer1, setTimer1] = useState(null);
  const [countdownFinished1, setCountdownFinished1] = useState(false);

  // console.log('ffff=========',props.firebaseId);
  console.log('test---',astroData);

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

  useEffect(() => {
    if(timer != null) {
    if (timer1 > 0) {
      const countdown = setInterval(() => {
        setTimer1(timer1 - 1);
      }, 1000); 
      
      return () => {
        clearInterval(countdown);
      };
    } else {
      setCountdownFinished1(true); // Stop the countdown when it reaches 0
    }
  } 
  }, [timer1]);

  useEffect(() => {
    if (countdownFinished1) {
      props.navigation.goBack();
    }
  }, [countdownFinished1, props.navigation]);

  // Convert the remaining seconds into minutes and seconds
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  const minutes1 = Math.floor(timer1 / 60);
  const seconds1 = timer1 % 60;

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("chat_intake_form")}
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
    const interval = setInterval(() => {
      database()
      .ref(`/CurrentRequest/${astroData.id}`)
      .on('value', async snapshot => {
        if (snapshot.val()?.status == 'Accept') {
          await accept_chat_transid();
          clearInterval(interval)
        } else if(snapshot.val()?.status == 'Reject') {
          rejected();
        }
      });
    }, 5000);
    return () => {
      clearInterval(interval);
      database().ref(`/CurrentRequest/${astroData.id}`).off();
    };
  }, [chatId]);

  const rejected = async() => {
    setModalVisibleChat(false);
    setModalVisibleReject(true);
    setTimer1(3);
  }

  
  const check_status = async () => {
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
          if (res.data.online) {
            get_kundali();
          } else {
            warnign_toast('Astrologer is Busy');
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
    } else {
      return true;
    }
  };

  const on_submit = async () => {
    const data1 = {
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
      kundli_id: kundliId,
    };
    console.log('data:',data1);
    if (validation()) {
      setModalVisible(false);
      setIsLoading(true);
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
          kundli_id: kundliId,
        },
      })
        .then(res => {
          console.log('result:',res.data);
          setIsLoading(false);
          update_kundli_in_firebase();
          request_to_astrologer();
          current_request_for_chat();
          database()
            .ref(`AstroId/${astroData.id}`)
            .on('value', snapshot => {
              const userMessage = database()
                .ref(`/Messages/${props.firebaseId}/${snapshot.val()}`)
                .push();
              const messageId = userMessage.key;
              const notificationRef = database().ref(
                `/Notifications/${snapshot.val()}`,
              );
              const notificationId = notificationRef.key;
              database().ref(`/Notifications/${notificationId}`).set({
                from: props.firebaseId,
                type: 'message',
              });
            });
            setModalVisibleChat(true);
          add_message();
          console.log('test');
          send_request();
        })
        .catch(err => {
          console.log('fff',err);
          setIsLoading(false);
        });
    }
  };

  const accept_chat_transid = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + accept_chat,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data)
        props.navigation.dispatch(
          CommonActions.reset({
            index: 3,
            routes: [
              {
                name: 'chatPickup',
                params: {
                  astro_id: astroData.id,
                  trans_id: res.data.result.transid,
                  chat_id: chatId
                },
              },
            ],
          }),
        );
        console.log(res.data);
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const update_kundli_in_firebase = () => {
    console.log(kundliId);
    let id = `Uid=${props.customerData.id}Astroid=${astroData.id}`;
    console.log(id);
    database().ref(`KundaliID/${id}`).set(kundliId);
    // database().ref(`KundaliID/${id}`).once('value').then(res=>{
    //   console.log(res.exists())
    //   if(res.exists()){
    //     database().ref(`KundaliID/${id}`).set(kundliId)
    //   }else{
    //     database().ref(`KundaliID/${id}`).update(kundliId)
    //   }
    // })
  };

  const send_request = async () => {
    
    console.log('request');
    setIsLoading(true);
    await axios({
      method: 'post',
      url: base_url + user_chat_in, 
      headers: {
        'Content-Type': 'multipart/form-data',
      }, 
      data: {
        u_id:props.customerData.id,
        a_id:astroData.id,
        form_id:2,
        in_id:moment(new Date()).format('DD-MM-YYYY HH:MM:ss'),
        message:'Chat in Time',
        dob:moment(date).format('DD-MM-YYYY'),
        tob:moment(time).format('HH:MM:SS'),
        lat:latLong.lat,
        long:latLong.lon,
        address:birthPlace,
        kundli_id:kundliId,
      }
    })
      .then(res => {
        console.log(res.data);
        console.log(res.data.chat_id);
        setChatId(res.data.chat_id)
        setIsLoading(false);
        setTimer(60);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const add_message = () => {
    let message =
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
      '' +
      '\nTopic of concern = ' +
      'no';
    database()
      .ref(`/AstroId/${astroData.id}`)
      .on('value', snapshot => {
        const node = database().ref(`/UserId/${astroData.id}`).push();
        const key = node.key;
        database()
          .ref(`/Messages/${props.firebaseId}/${snapshot.val()}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
            astro: '1'
          });
        database()
          .ref(`/Messages/${snapshot.val()}/${props.firebaseId}/${key}`)
          .set({
            from: props.firebaseId,
            image: 'image = null',
            message: message,
            timestamp: new Date().getTime(),
            to: snapshot.val(),
            type: 'text',
          });
        // database()
        //   .ref(`/Chat/${props.firebaseId}/${snapshot.val()}`)
        //   .update(send_msg);
        // database()
        //   .ref(`/Chat/${snapshot.val()}/${props.firebaseId}`)
        //   .update(send_msg);
      });
  };

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
            // setDate(moment(data.dob, 'DD-MM-YYYY'));
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
    setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + create_kundali_chat,
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
          console.log('dsfafd',res.data);
          setIsLoading(false)
          setKundliId(res.data.kundli_id);
          setModalVisible(true);
        })
        .catch(err => {
          setIsLoading(false)
          console.log(err);
        });
    
  };

  const send_notification = () => {
    database()
      .ref(`/UserId/${317}`)
      .on('value', snapshot => {
        const notificationRef = database()
          .ref(`/Notifications/${snapshot.val()}`)
          .push();
        const notificationId = notificationRef.key;
        database()
          .ref(`/Notifications/${snapshot.val()}/${notificationId}`)
          .set({
            from: props.firebaseId,
            type: 'message',
          });
      });
  };

  const request_to_astrologer = () => {
    const astrologerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `Request send to ${astroData.owner_name}`,
      name: astroData.owner_name,
      pic: astroData.image,
      rid: astroData.id,
      status: '',
      timestamp: new Date().getTime(),
    };

    const customerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `message`,
      name: name,
      pic: 'url',
      rid: props.customerData.id,
      // sid: props.customerData.id,
      status: 'Pending',
      timestamp: new Date().getTime(),
    };

    const customerNodeRef = database().ref(
      `/Request/${astroData.id}/${props.customerData.id}`,
    );
    const astrologerNodeRef = database().ref(
      `/Request/${props.customerData.id}/${astroData.id}`,
    );
    customerNodeRef.update(customerData);
    astrologerNodeRef.update(astrologerData);
  };

  const current_request_for_chat = () => {
    const astrologerData = {
      date: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      msg: `Request send to ${astroData.owner_name}`,
      name: astroData.owner_name,
      pic: astroData.image,
      rid: astroData.id,
      sid: props.customerData.id,
      status: 'Pending',
      timestamp: new Date().getTime(),
    };
    const nodeRef = database().ref(`/CurrentRequest/${astroData.id}`);
    nodeRef.update(astrologerData);
  };

  const handle_date = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    console.log('rrrr');
    setDate(currentDate);
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
            <Text style={styles.heading}>
              {t("do")}
            </Text>
            <View style={{borderWidth:1,borderColor:'#ddd',marginTop:10,borderRadius:5,
          backgroundColor:colors.black_color1,height:50}}>
              <Picker
                selectedValue={isBirthDetails}
                themeVariant="dark"
                onValueChange={(itemValue, itemIndex) => {
                  setIsBirthDetailes(itemValue);
                  setBirthPickerVisible(false);
                }}
                style={{ color: 'black' }}
               >
                <Picker.Item label={t("yes")} value={true} style={{fontSize:getFontSize(1.6)}}/>
                <Picker.Item label={t("no")} value={false} style={{fontSize:getFontSize(1.6)}} />
              </Picker>
              </View>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("name")}</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor={colors.black_color8}
              onChangeText={setName}
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                color: colors.black_color,
                borderRadius: 5,
                borderWidth:1,
                borderColor:'#ddd',
                fontSize:getFontSize(1.6)
              }}>
              {name}
            </TextInput>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("phone_number")}</Text>
            <TextInput
              placeholder="Enter your phone number"
              placeholderTextColor={colors.black_color8}
              keyboardType="number-pad"
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                color: colors.black_color,
                borderRadius: 5,
                borderWidth:1,
                borderColor:'#ddd',
                fontSize:getFontSize(1.6)
              }}>
              {phoneNumber}
            </TextInput>
          </View>
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("gender")}</Text>
            
              <View style={{borderWidth:1,borderColor:'#ddd',marginTop:10,borderRadius:5,
          backgroundColor:colors.black_color1,height:50}}>
              <Picker
                selectedValue={gender}
                themeVariant="dark"
                onValueChange={(itemValue, itemIndex) => {
                  setGender(itemValue);
                  setIsGenderPickerVisible(false);
                }}
                style={{padding: 0, margin: 0,color:'black'}}>
                <Picker.Item label={t("male")} value="Male" style={{fontSize:getFontSize(1.6)}} />
                <Picker.Item label={t("female")} value="Female" style={{fontSize:getFontSize(1.6)}} />
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
                  color: colors.black_color,
                  marginTop: 10,
                  borderWidth:1,
                borderColor:'#ddd'
                }}>
                <Text style={{color: colors.black_color,fontSize:getFontSize(1.5)}}>{moment(date).format('DD-MM-YYYY')}</Text>
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
                borderColor:'#ddd'
                }}>
                <Text style={{color: colors.black_color,fontSize:getFontSize(1.5)}}>{moment(time).format('HH:mm a')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {dateVisible && (
            <DateTimePicker value={date}
             mode="date"
              onChange={handle_date}
              display='spinner' />
          )}
          {timeVisible && (
            <DateTimePicker
              value={new Date(time)}
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
                  fontSize: getFontSize(1.5),
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {birthPlace == null ? t("select_birth") : birthPlace}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={styles.itemRowContainer}>
            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                Current Location
              </Text>
              <TouchableOpacity
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  color: colors.black_color,
                  marginTop: 10,
                }}>
                <Text style={{color:'black'}}>Select State</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                {' '}
              </Text>
              <TouchableOpacity
                style={{
                  flex: 0,
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text style={{color:'black'}}>Select City</Text>
              </TouchableOpacity>
            </View>
          </View> */}
          <View style={styles.itemRowContainer}>
            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.5),
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {t("marital_status")}
              </Text>
              <View style={{borderWidth:1,borderColor:'#ddd',marginTop:10,borderRadius:5,
          backgroundColor:colors.black_color1,width:width * 0.4,height:50,color:'black'}}>
              
            <Picker
              selectedValue={maritalStatus}
              themeVariant="dark"
              onValueChange={(itemValue, itemIndex) => {
                setMaritalStatus(itemValue);
                setMaritalPickerVisible(false);
              }}
              style={{ color: 'black' }}
              >
              <Picker.Item label="Select Marital" value="Select Marital" style={{fontSize:getFontSize(1.6)}} />
              <Picker.Item label="Married" value="Married" style={{fontSize:getFontSize(1.6)}}/>
              <Picker.Item label="Unmarried" value="Unmarried" style={{fontSize:getFontSize(1.6)}}/>
              <Picker.Item label="Other" value="Other" style={{fontSize:getFontSize(1.6)}}/>
            </Picker>
         
              </View>
            </View>
            <View style={{flex: 0.5, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.5),
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                }}>
                {t("occuption")}
              </Text>
              <TextInput
                placeholder={t("enter_your_occupation")}
                placeholderTextColor={colors.black_color8}
                style={{
                  width: '90%',
                  padding: 10,
                  backgroundColor: colors.black_color1,
                  marginTop: 10,
                  borderRadius: 5,
                  borderWidth:1,
                borderColor:'#ddd',
                fontSize:getFontSize(1.5)
                }}>
                {occupation}
              </TextInput>
            </View>
          </View>
          
          <View style={styles.itemContainer}>
            <Text style={styles.heading}>{t("questions")}</Text>
            <TextInput
              placeholder={t("type_your")}
              placeholderTextColor={colors.black_color8}
              multiline={true}
              scrollEnabled
              numberOfLines={10}
              textAlignVertical='top'
              style={{
                padding: 10,
                backgroundColor: colors.black_color1,
                marginTop: 10,
                borderRadius: 5,
                height: 150,
                color: colors.black_color,
                borderWidth:1,
                borderColor:'#ddd'
              }}
            />
          </View>
          {/* <View style={styles.itemContainer}>
            <Text style={styles.heading}>Tarot Category</Text>
            <TouchableOpacity
              onPress={() => setIsTarotPickerVisible(true)}
              style={styles.pickerButton}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                }}>
                {tarot}
              </Text>
            </TouchableOpacity>
            {isTarotPickerVisible && (
              <PickerIOS
                selectedValue={gender}
                themeVariant="dark"
                onValueChange={(itemValue, itemIndex) => {
                  setTarot(itemValue);
                  setIsTarotPickerVisible(false);
                }}
                style={{padding: 0, margin: 0}}>
                <Picker.Item label="Select Category" value="Select Category" />
                <Picker.Item label="Health" value="Health" />
                <Picker.Item label="Love" value="Love" />
                <Picker.Item label="Money" value="Money" />
              </PickerIOS>
            )}
          </View> */}
          <TouchableOpacity onPress={check_status} style={styles.submitButton}>
            <Text
              style={{
                fontSize: getFontSize(1.5),
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {`${t("start_chat_with")} ${props.route.params.data?.owner_name}`}
            </Text>
          </TouchableOpacity>
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
                // opacity: 0.4
              }}>
              <View
                style={{
                  flex: 0,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: colors.background_theme1,
                }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.8),
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                    padding: 15,
                  }}>
                  Astrologer can Chat in these languages
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
                      fontSize: getFontSize(1.8),
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
                  borderRadius:10
                }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.5),
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                    padding: 15,
                  }}>
                  Your chat session request is placed successfully.
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
                  <Text style={{fontSize:getFontSize(1.5),textAlign:'center',color:'black'}}>You will receive chat from {astroData?.owner_name}.</Text>
                  <Text style={{fontSize:getFontSize(1.7),textAlign:'center',color:'black',fontWeight:'bold',marginTop:5}}>{astroData?.owner_name}</Text>
                  <Text style={{fontSize:getFontSize(1.6),textAlign:'center',color:colors.background_theme2,marginTop:10}}>Within</Text>
                  <Text style={{fontSize:getFontSize(1.7),fontWeight:'bold',color:'white',textAlign:'center',backgroundColor:colors.background_theme2,width:'20%',alignSelf:'center',borderRadius:10}}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</Text>
                  <Text style={{color:'black',borderWidth:1,borderColor:colors.background_theme2,borderRadius:10,width:'40%',alignSelf:'center',textAlign:'center',marginTop:10}}>Stay Connected</Text>
                  <Text style={{color:'black',fontSize:getFontSize(1.2),textAlign:'center',marginTop:10}}>Your billing will start after they accept the chat request.</Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          visible={modalVisibleReject}
          transparent={true}
          onRequestClose={() => setModalVisibleReject(false)}>
          <TouchableWithoutFeedback onPress={() => setModalVisibleReject(true)}>
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
                  Your chat has been rejected.
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
                  <Text style={{fontSize:getFontSize(2),textAlign:'center',color:'black'}}>Your chat has been rejected by {astroData?.owner_name}.</Text>
                  <Text style={{ fontSize: getFontSize(1.7), fontWeight: 'bold', color: 'white', textAlign: 'center', backgroundColor: colors.background_theme2, width: '20%', alignSelf: 'center', borderRadius: 10 }}>
                    {`${minutes1}:${seconds1 < 10 ? `0${seconds1}` : seconds1}`}
                  </Text>
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

export default connect(mapStateToProps, null)(ChatIntakeForm);

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
    borderColor:'#ddd'
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
