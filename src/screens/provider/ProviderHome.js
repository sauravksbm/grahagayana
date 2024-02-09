import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  StyleSheet,
  Modal,
  RefreshControl,
} from 'react-native';
import React, {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyStatusBar from '../../components/MyStatusbar';
import {
  api_url,
  astrologer_dashboard,
  boost_astrologer,
  change_status,
  change_status_call,
  colors,
  fonts,
  get_boost_amount,
  next_log_status,
  vedic_images,
  mark_as_read,
  get_kundali,
  getFontSize,
  mark_as_read_message
} from '../../config/Constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import {useCallback} from 'react';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import {Rating, AirbnbRating} from 'react-native-ratings';
import RenderHtml from 'react-native-render-html';
import DateCalender from '../../components/DateCalender';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {width, height} = Dimensions.get('screen');

const ProviderHome = props => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [boostModalVisible, setBoostModalVisible] = useState(false);
  const [callStatus, setCallStatus] = useState('Offline');
  const [chatStatus, setChatStatus] = useState('Offline');
  const [isRefereshing, setIsRefereshing] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [date, setDate] = useState(null);
  const [dateVisible, setDateVisible] = useState(false);
  const [dateVisible1,setDateVisible1] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe,setRemember] = useState(false);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  
  const { data } = props.route.params || {};

  useEffect(() => {
    const dateNodeRef = database().ref(`/CurrentRequest/${props.providerData?.id}`);
    const twoMinuteTimeout = setTimeout(() => {
      dateNodeRef
        .update({
          status: '',
        })
        .then(res => {
          
        })
        .catch(err => {
          console.log(err);
        });
    }, 15000); 
    return () => {
      clearTimeout(twoMinuteTimeout);
    };
  }, []);

  


  

  useEffect(() => {
    get_dashboard();
    getCredentials();
    get_kundali_notification(data);
  }, [data]);


  const get_kundali_notification = (data) => {
    console.log('kun---',data);
    if(data?.data.kundali_id != null)
    {
      props.navigation.navigate('providerKundli',{data:data?.data})
    }
    else if(data?.data1?.redirect_app == 'Chat_request')
    {
      props.navigation.navigate('providerChatPickup',{message:data?.data1});
    }
    
  }

  

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    console.log(currentDate);
    setDate(currentDate);
    change_next_login();
    
    setDateVisible1(true);
  };

  const get_dashboard = async () => {
    console.log('get dd===========');
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        props.dispatch(ProviderActions.setDashboard(res.data));
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        setCallStatus(res.data.data2.current_status_call);
        setChatStatus(res.data.data2.current_status);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const on_referesh = useCallback(async () => {
    setIsRefereshing(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: props.providerData.id,
      },
    })
      .then(res => {
        console.log('response===>>',res.data.data2.current_status);
        console.log('response===>>',res.data.data2.current_status_call);
        setIsRefereshing(false);
        props.dispatch(ProviderActions.setDashboard(res.data));
        props.dispatch(ProviderActions.setProviderData(res.data.data2));
        setCallStatus(res.data.data2.current_status_call);
        setChatStatus(res.data.data2.current_status);
      })
      .catch(err => {
        setIsRefereshing(false);
        console.log(err);
      });
  });

  const change_call_status = async () => {
    console.log(new Date().toString());
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_status_call,
      data: {
        id: props.providerData.id,
        is_online: callStatus == 'Offline' || callStatus.length == 0 ? 1 : 0,
        wait_time_call: new Date().toString(),
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setCallModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const change_chat_status = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + change_status,
      data: {
        id: props.providerData.id,
        is_online: chatStatus == 'Offline' || chatStatus.length == 0 ? 1 : 0,
        wait_time: new Date().toString(),
      },
    })
      .then(res => {
        setIsLoading(false);
        setChatModalVisible(false);
        get_dashboard();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const change_next_login = async () => {
    setDateVisible(false);
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + next_log_status,
      data: {
        id: props.providerData.id,
        next_login: moment(date).format('yyyy-MM-dd HH:mm:ss'),
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        setDate(null);
        if (res.data.status == 1) {
          success_toast(res.data.message);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_boost_amount_data = async()=>{
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_boost_amount,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
    }).then(res=>{
      setIsLoading(false)
      console.log(res.data);
      if(res.data.status){
        console.log(props.dashboard?.data?.Walletbalance)
        if(parseFloat(props.dashboard?.data?.Walletbalance) >= parseFloat(res.data.amount)){
          boost_astrologer_profile(res.data.amount);
        }else{
          warnign_toast('You don\'t have enough balance for boost...')
        }
      }
    }).catch(err=>{
      setIsLoading(false)
      console.log(err)
    })
  }

  const goLive = async () => {

    props.navigation.navigate('live');
    
  }

  const mark = async(id) => {
    setIsLoading(true);
    console.log('sss=====',id);
     await axios({
      method: 'post',
      url: api_url + mark_as_read,
      data: {
        user_id: props.providerData.id,
        announ: id
      }
    }).then(res=>{
      setIsLoading(false)
      console.log(res.data);
      setAnnouncementVisible(true)
      success_toast('Your annoucment.');
      // on_referesh();
    }).catch(err=>{
      setIsLoading(false)
      console.log(err)
    })
  }

  const mark_message = async(id) => {
    setIsLoading(true);
    console.log('sss=====',id);
     await axios({
      method: 'post',
      url: api_url + mark_as_read_message,
      data: {
        user_id: props.providerData.id,
        message_id: id
      }
    }).then(res=>{
      setIsLoading(false)
      console.log(res.data);
      setMessageVisible(true)
      success_toast('Your Message.');
      // on_referesh();
    }).catch(err=>{
      setIsLoading(false)
      console.log(err)
    })
  }

  const boost_astrologer_profile = async(amount)=>{
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + boost_astrologer,
      data: {
        astro_id: props.providerData.id,
        amount: amount
      }
    }).then(res=>{
      setIsLoading(false)
      console.log('rest:',res.data);
      if(res.data.status == true)
      {
        Alert.alert(t("your_boost"))
      }
      else
      {
        Alert.alert(t("Please_complete"));
      }
      
    }).catch(err=>{
      setIsLoading(false)
      console.log(err)
    })
  }

  const getCredentials = async () => {
    
    try {
      const storedCredentials = await AsyncStorage.getItem('astrologerCredentials');
      console.log(storedCredentials);
      if (storedCredentials) {
        const { email: storedEmail, password: storedPassword, rememberMe: storedRememberMe } = JSON.parse(
          storedCredentials
        );

        // Use the stored values
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRemember(storedRememberMe);
      }
    } catch (error) {
      console.error('Error retrieving credentials:', error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white_color}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <View style={{flex: 0, padding: 10}}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              flex: 0.5,
              fontSize: getFontSize(1.8),
              color: colors.background_theme2,
              fontFamily: fonts.semi_bold,
            }}>
            {props.providerData.owner_name}
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('astrologerWallet')}
            style={{
              flex: 0.25,
              flexDirection: 'row',
              backgroundColor: colors.background_theme2,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 15,
              // justifyContent: 'center',
            }}>
            <Ionicons name="wallet" color={colors.white_color} size={getFontSize(2)} />
            <Text
              style={{
                fontSize: getFontSize(1.2),
                color: colors.white_color,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {t("wallet")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => props.navigation.navigate('language')}
          style={{flex:0.14,borderRadius:100,paddingHorizontal:10,backgroundColor:colors.background_theme1,paddingVertical:4.5,}}>
            <Image source={require('../../assets/images/menu/15.png')} 
            style={{width:25,height:25}}/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert('Wait', 'Are you sure to Logout?', [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Yes',
                  onPress: () => props.navigation.navigate('logout',{data: JSON.stringify({ email, password, rememberMe })}),
                },
              ]);
            }}
            style={{padding: 5,fontSize:getFontSize(1.8)}}>
            <Ionicons
              name="ios-exit"
              color={colors.background_theme2}
              size={22}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('providerProfile')}
            style={{padding: 5}}>
            <Ionicons
              name="person"
              color={colors.background_theme2}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefereshing}
              onRefresh={on_referesh}
            />
          }>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              borderBottomWidth: 1,
              borderTopWidth: 1,
              paddingVertical: 10,
              borderColor: colors.black_color5,
              marginTop: 5,
            }}>
            <View style={styles.boxContainer}>
              <Text
                style={{
                  fontSize: getFontSize(2),
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                <FontAwesome
                  name="rupee"
                  color={colors.background_theme2}
                  size={18}
                />{' '}
                {Math.abs(props.dashboard?.data?.Walletbalance)}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {t("wallet")}
              </Text>
            </View>
            <View style={styles.boxContainer}>
              <Text
                style={{
                  fontSize: getFontSize(2),
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                <FontAwesome
                  name="rupee"
                  color={colors.background_theme2}
                  size={18}
                />{' '}
                {props?.dashboard?.data?.totalincome}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {t('today_collection')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('providerFollowing')}
              style={styles.boxContainer}>
              <Text
                style={{
                  fontSize: getFontSize(2),
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                }}>
                {props.dashboard?.followers}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color8,
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}>
                {t('following')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal: 15}}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 20,
              }}>
              <TouchableOpacity
                onPress={() => setCallModalVisible(true)}
                style={{
                  ...styles.boxContainerA,
                  backgroundColor:
                    callStatus == 'Offline' || callStatus.length == 0
                      ? colors.black_color5
                      : colors.green_color2,
                }}>
                <FontAwesome
                  name="phone"
                  color={colors.white_color}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontWeight: 'normal',
                    marginLeft: 5,
                  }}>
                  {callStatus.length == 0 ? 'Offline' : callStatus}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDateVisible(true)}
                style={{
                  ...styles.boxContainerA,
                  backgroundColor: colors.black_color9,
                }}>
                <FontAwesome
                  name="phone"
                  color={colors.white_color}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontWeight: 'normal',
                    marginLeft: 5,
                  }}>
                  Next Online
                </Text>
              </TouchableOpacity>
              {dateVisible && (
                <DateTimePicker
                value={date == null ? new Date() : date}
                mode={'date'}
                display={'inline'}
                onChange={date_handle}
                maximumDate={null}
                minimumDate={new Date()}
              />
                )}
              <TouchableOpacity
                onPress={() => setChatModalVisible(true)}
                style={{
                  ...styles.boxContainerA,
                  backgroundColor:
                    chatStatus == 'Offline' || chatStatus.length == 0
                      ? colors.black_color5
                      : colors.green_color2,
                }}>
                <FontAwesome
                  name="wechat"
                  color={colors.white_color}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontWeight: 'normal',
                    marginLeft: 5,
                  }}>
                  {chatStatus.length == 0 ? 'Offline' : chatStatus}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={goLive}
                style={{
                  ...styles.boxContainerA,
                  backgroundColor: colors.background_theme2,
                }}>
                <FontAwesome
                  name="video-camera"
                  color={colors.white_color}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.white_color,
                    fontWeight: 'normal',
                    marginLeft: 5,
                  }}>
                  Go Live
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('providerOffer')}
              style={{
                flex: 0,
                padding: 12,
                marginVertical: 10,
                backgroundColor: colors.background_theme2,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                }}>
                {t("astrologer_offer")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flex: 0,
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: colors.background_theme2,
                marginTop: 15,
                borderRadius: 5,
                shadowColor: colors.black_color7,
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <View style={{flex: 0, width: '80%'}}>
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    marginBottom: 5,
                  }}>
                  {t("astrokunj_official")}{'\n'}{t("announcement_message")}{'\n'}{t("please_check")}
                </Text>
              </View>
              <View
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => mark(props?.dashboard?.data?.announcements[0].id)}
                  disabled={props.dashboard?.data?.announcements.length == 0}
                  style={{
                    flex: 0,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.white_color,
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.4),
                      color: colors.black_color,
                      fontWeight: 'normal',
                    }}>
                    {props.dashboard?.data?.announcements.length}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => mark_message(props?.dashboard?.data?.messages[0].id)}
                  disabled={props.dashboard?.data?.messages.length == 0}
                  style={{
                    flex: 0,
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background_theme1,
                    borderRadius: 4,
                    marginTop: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.4),
                      color: colors.black_color,
                      fontWeight: 'normal',
                    }}>
                    {props.dashboard?.data?.messages.length}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0,
                padding: 15,
                backgroundColor: colors.background_theme1,
                marginTop: 20,
                borderRadius: 10,
                shadowColor: colors.black_color6,
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome
                  name="bar-chart"
                  color={colors.yellow_color1}
                  size={getFontSize(2)}
                />
                <Text
                  style={{
                    fontSize: getFontSize(1.4),
                    color: colors.black_color,
                    fontWeight: 'normal',
                    marginLeft: 5,
                  }}>
                  {t("performance")}
                </Text>
              </View>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    //props.navigation.navigate('createKundali');
                  }}
                  disabled
                  style={{flex: 0}}>
                  <LinearGradient
                    colors={['#FDC830', '#F37335']}
                    style={{
                      flex: 0,
                      width: width * 0.25,
                      height: width * 0.5,
                      // justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      elevation: 8,
                      shadowColor: colors.black_color4,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 0,
                          width: 30,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#F37335',
                          borderRadius: 100,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: getFontSize(1.5),
                            color: colors.background_theme1,
                            fontFamily: fonts.medium,
                          }}>
                          1
                        </Text>
                      </View>
                      {/* <View style={{ flex: 0}}>
                    <FontAwesome name='question-circle-o' color={colors.black_color} size={18} />
                    </View> */}
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text style={{fontSize: 12, color: colors.white_color}}>
                        {t("pickup")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: getFontSize(2),
                        color: colors.black_color,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        // fontFamily: fonts.montserrat_medium,
                      }}>
                      100%
                    </Text>
                    <View style={{flex: 0, width: '80%'}}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.4),
                          color: colors.black_color,
                          marginTop: 5,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {parseFloat(
                          props?.dashboard?.performance?.pickup_rate,
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // props.navigation.navigate('horoscopMatching');
                  }}
                  disabled
                  style={{flex: 0}}>
                  <LinearGradient
                    colors={['#38ef7d', '#11998e']}
                    style={{
                      flex: 0,
                      width: width * 0.25,
                      height: width * 0.5,
                      //justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      elevation: 8,
                      shadowColor: colors.black_color4,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 0,
                          width: 30,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#11998e',
                          borderRadius: 100,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: getFontSize(1.5),
                            color: colors.background_theme1,
                            fontFamily: fonts.medium,
                          }}>
                          1
                        </Text>
                      </View>
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.4),
                          color: colors.white_color,
                          textAlign: 'center',
                        }}>
                        {t('average')}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: getFontSize(2),
                        color: colors.black_color,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        // fontFamily: fonts.montserrat_medium,
                      }}>
                      100%
                    </Text>
                    <View style={{flex: 0, width: '80%'}}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.4),
                          color: colors.black_color,
                          marginTop: 5,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {parseFloat(
                          props?.dashboard?.performance?.average_call_duration,
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    //  props.navigation.navigate('panchang');
                  }}
                  disabled
                  style={{flex: 0}}>
                  <LinearGradient
                    colors={['#ff9966', '#ff5e62']}
                    style={{
                      flex: 0,
                      width: width * 0.25,
                      height: width * 0.5,
                      //  justifyContent: 'center',
                      alignItems: 'center',
                      marginBottom: 15,
                      borderRadius: 10,
                      elevation: 8,
                      shadowColor: colors.black_color4,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flex: 0,
                          width: 30,
                          height: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#ff5e62',
                          borderRadius: 100,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            fontSize: getFontSize(1.5),
                            color: colors.background_theme1,
                            fontFamily: fonts.medium,
                          }}>
                          1
                        </Text>
                      </View>
                    </View>
                    <View style={styles.boxContainerB}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.4),
                          color: colors.white_color,
                          textAlign: 'center',
                        }}>
                        {t("overall")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: getFontSize(2),
                        color: colors.black_color,
                        marginTop: 10,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        // fontFamily: fonts.montserrat_medium,
                      }}>
                      5.0
                    </Text>
                    <View
                      style={{
                        flex: 0,
                        width: '90%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        marginTop: 15,
                      }}>
                      <Rating
                        type="custom"
                        readonly={true}
                        count={5}
                        imageSize={getFontSize(1.8)}
                        ratingColor={colors.background_theme2}
                        ratingBackgroundColor={colors.background_theme1}
                        tintColor={'#ff5e62'}
                        startingValue={parseFloat(
                          props?.dashboard?.performance?.overall_rating,
                        )}
                        showRating={false}
                        selectedColor={colors.background_theme2}
                        // style={{paddingVertical: 10}}
                      />
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('orderHistory')}
              style={{
                flex: 0,
                padding: 12,
                marginVertical: 20,
                backgroundColor: colors.background_theme2,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                }}>
               {t('your_pickup_order_history')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={get_boost_amount_data}
              style={{
                flex: 0,
                padding: getFontSize(1.4),
                marginBottom: 20,
                backgroundColor: colors.background_theme2,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                }}>
                {t('boost_your_profile')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('providerRemedies')}
              style={{
                flex: 0,
                padding: 12,
                marginBottom: 20,
                backgroundColor: colors.background_theme2,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                }}>
                {t('my_remedies')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      
      <Modal visible={callModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainerA}>
          <View
            style={{...styles.modalContainerB, borderRadius: 0, width: '80%'}}>
            <View style={{flex: 0, width: '100%'}}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                {t('change_offline_online')}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginVertical: 15,
              }}>
              {t('when_your_status_is')}
            </Text>
            <TouchableOpacity
              onPress={change_call_status}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 10,
                borderBottomWidth: 1,
                borderTopWidth: 1,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  color: colors.background_theme2,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                {t('ok')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCallModalVisible(false)}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 15,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={chatModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainerA}>
          <View
            style={{...styles.modalContainerB, borderRadius: 0, width: '80%'}}>
            <View style={{flex: 0, width: '100%'}}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                {t('change_offline_online')}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginVertical: 15,
              }}>
             {t('when_your_status_is')}
            </Text>
            <TouchableOpacity
              onPress={change_chat_status}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 10,
                borderBottomWidth: 1,
                borderTopWidth: 1,
              }}>
              <Text
                style={{
                  fontSize: 22,
                  color: colors.background_theme2,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                {t('ok')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setChatModalVisible(false)}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 15,
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={boostModalVisible}
        transparent={true}
        animationType="slide">
        <View style={styles.modalContainerA}>
          <View style={{...styles.modalContainerB}}>
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
              }}>
              Boost My Profile
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginVertical: 15,
              }}>
              You will be featured in Astrokunj and your share percentage will
              go down by 15% {'\n'}Do You want to proceed?
            </Text>
            <TouchableOpacity
              style={{
                width: '100%',
                backgroundColor: colors.background_theme2,
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={()=>setBoostModalVisible(false)}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={announcementVisible}
        transparent={true}
        onRequestClose={() => setAnnouncementVisible(false)}>
        <View style={styles.modalContainerA}>
          <View style={styles.modalContainerBB}>
            <View style={styles.modalContainerC}>
              <Text style={styles.modalTextA}>Announcement</Text>
              <TouchableOpacity
                onPress={() => setAnnouncementVisible(false)}
                style={{padding: 3}}>
                <Ionicons
                  name="ios-close-outline"
                  color={colors.black_color8}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTextB}>
              <RenderHtml
                contentWidth={width * 0.8}
                source={{
                  html: props?.dashboard?.data?.announcements[0]?.description,
                }}
              />
              
            </Text>
          </View>
        </View>
      </Modal>
      <Modal
        visible={messageVisible}
        transparent={true}
        onRequestClose={() => setMessageVisible(false)}>
        <View style={styles.modalContainerA}>
          <View style={styles.modalContainerBB}>
            <View style={styles.modalContainerC}>
              <Text style={styles.modalTextA}>Message</Text>
              <TouchableOpacity
                onPress={() => setMessageVisible(false)}
                style={{padding: 3}}>
                <Ionicons
                  name="ios-close-outline"
                  color={colors.black_color8}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalTextB}>
              <RenderHtml
                contentWidth={width * 0.8}
                source={{
                  html: props?.dashboard?.data?.messages[0]?.description,
                }}
              />
            </Text>
          </View>
        </View>
      </Modal>
      <Modal
      visible={dateVisible1}
      transparent
      onRequestClose={() => setDateVisible1(false)}>
      <TouchableOpacity
        activeOpacity={1}
        onPressOut={() => setDateVisible1(false)}
        style={{
          flex: 1,
          backgroundColor: colors.black_color9 + '80',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '95%',
            backgroundColor: colors.background_theme1,
            paddingVertical: 20,
            borderRadius: 10,
          }}>
            
          
          <TouchableOpacity onPress={()=>setDateVisible1(false)} style={{flex: 0, alignSelf: 'center', padding: 5}}>
            <Text style={{fontSize: 16, color: colors.background_theme2, fontFamily: fonts.medium}}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ProviderHome);

const styles = StyleSheet.create({
  boxContainer: {
    flex: 0,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.black_color5,
    borderRadius: 5,
  },
  boxContainerA: {
    flex: 0,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green_color2,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  boxContainerB: {
    flex: 0,
    width: '90%',
    borderWidth: 1,
    borderColor: colors.white_color,
    shadowColor: colors.black_color7,
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: '20%',
    borderRadius: 20,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background_theme2,
  },

  modalContainerA: {
    flex: 1,
    backgroundColor: colors.black_color9 + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerB: {
    flex: 0,
    width: '90%',
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  modalContainerBB: {
    flex: 0,
    width: '90%',
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    maxHeight: 300,
    overflow: 'scroll',
  },
  modalContainerC: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTextA: {
    fontSize: getFontSize(1.5),
    color: colors.background_theme2,
    fontFamily: fonts.semi_bold,
  },
  modalTextB: {
    fontSize: getFontSize(1.4),
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
