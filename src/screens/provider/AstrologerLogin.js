import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {
  add_or_update_device_token,
  api_url,
  astrologer_dashboard,
  astrologer_login,
  base_url,
  colors,
  fonts,
  vedic_images,
  getFontSize
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ProviderActions from '../../redux/actions/ProviderActions';
import axios from 'axios';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import MyLoader from '../../components/MyLoader';
import { Switch } from 'react-native-switch';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const {width, height} = Dimensions.get('screen');

const AstrologerLogin = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authemail,setAuthEmail] = useState('');
  const [rememberMe,setRemember] = useState(false);
  console.log('das',rememberMe);
  useEffect(() => {
    get_token();
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    getCredentials();
  },[]);

  const get_token = async () => {
    let fcm_token = await messaging().getToken();
    setFcmToken(fcmToken);
  };

  const email_validation = e => {
    let email = e;
    let filter =
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(email.value)) {
      // Yay! valid
      return true;
    } else {
      return false;
    }
  };

  const validation = () => {
    if (email.length == 0) {
      Alert.alert('Please enter your email');
      return false;
    } else if (email_validation) {
      Alert.alert('Please enter correct email address.');
      return false;
    } else if (password.length == 0) {
      Alert.alert('Please enter your password.');
    } else {
      return true;
    }
  };

  const login = async () => {
    console.log(base_url + astrologer_login);
    setIsLoading(true);
    await axios({
      method: 'post',
      url: base_url + astrologer_login,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        email: email,
        password: password,
      },
    })
      .then(async res => {
        setIsLoading(false);
        if (rememberMe === true) {
          //user wants to be remembered.
            rememberUser();
          } else {
            forgetUser();
          }
        if (res.data?.success == '200' && res.data?.status == 'login') {
          await AsyncStorage.setItem(
            'ProviderData',
            JSON.stringify(res.data.data),
          );
          console.log(res.data.auth);
          setAuthEmail(res.data.auth);
          sign_in_with_email_and_password(res.data.data);
        } else if(res.data?.success == '200' && res.data?.status == 'Block') {
          Alert.alert('Your account is blocked please contact Astrokunj admin team');
        } else {
          Alert.alert('Plese check your email and password.');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const auth_sign = async(astrologer) => {
    setIsLoading(true);
    let fcm_token = await messaging().getToken();
    auth()
  .createUserWithEmailAndPassword(email, '12345678')
  .then((response) => {
    setIsLoading(false);
    console.log(response.user.uid);
    console.log('User account created & signed in!');
    props.dispatch(ProviderActions.setFirebaseId(response.user.uid));
        database()
          .ref(`/Users/${response.user.uid}`)
          .set({
            token: fcm_token,
            name: astrologer.owner_name,
            email: email,
            image: astrologer?.img_url,
            date: new Date().getTime(),
          })
          .then(res => {
            update_fcm_token(astrologer.id, response.user.uid);
          })
          .catch(err => {
            console.log(err);
            
          });

        database()
          .ref(`/AstroId/${astrologer.id}`)
          .set(response.user.uid)
          .then(res => {})
          .catch(err => {
            console.log(err);
          });
  })
  .catch(error => {
    setIsLoading(false);
    if (error.code === 'auth/email-already-in-use') {
      console.log('That email address is already in use!');
    }

    if (error.code === 'auth/invalid-email') {
      console.log('That email address is invalid!');
    }

    console.error(error);
  });
  }

  const provider_dashboard = async id =>{
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {
        setIsLoading(false)
       props.dispatch(ProviderActions.setDashboard(res.data));
       props.dispatch(ProviderActions.setProviderData(res.data.data2));
       home();
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });
  }

  const sign_in_with_email_and_password = async astrologer => {
    console.log('sign');
    let fcm_token = await messaging().getToken();
    console.log(email);
    setIsLoading(true)
    await auth()
      .signInWithEmailAndPassword(email, '12345678')
      .then(response => {
        setIsLoading(false)
        console.log(response.user.uid);
        props.dispatch(ProviderActions.setFirebaseId(response.user.uid));
        database()
          .ref(`/Users/${response.user.uid}`)
          .set({
            token: fcm_token,
            name: astrologer.owner_name,
            email: email,
            image: astrologer?.img_url,
            date: new Date().getTime(),
          })
          .then(res => {
            update_fcm_token(astrologer.id, response.user.uid);
          })
          .catch(err => {
            console.log(err);
          });

          database()
          .ref(`/AstroId/${astrologer.id}`)
          .set(response.user.uid)
          .then(res => {
           
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        setIsLoading(false);
        console.log('eerrrr');
        console.log(err);
        auth_sign(astrologer);
        
      });
  };

  const update_fcm_token = async (user_id, uid) => {
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
        user_type: 'astrologer',
        device_token: fcm_token,
        token: uid,
      },
    })
      .then(res => {
        setIsLoading(false);
        provider_dashboard(user_id);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'providerHome'}],
      }),
    );
  };

  

  const rememberUser = async (rem) => {
    try {
      const credentials = JSON.stringify({ email, password, rememberMe });
      console.log(credentials);
      await AsyncStorage.setItem('astrologerCredentials', credentials);
      console.log('Credentials saved successfully');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };
  
  const getCredentials = async () => {
    
    try {
      const storedCredentials = await AsyncStorage.getItem('astrologerCredentials');
      console.log(storedCredentials);
      if (storedCredentials) {
        const { email: storedEmail, password: storedPassword, rememberMe: storedRememberMe } = JSON.parse(
          storedCredentials
        );
          console.log('aaaa',storedEmail,storedPassword,storedRememberMe);
        // Use the stored values
        setEmail(storedEmail);
        setPassword(storedPassword);
        setRemember(storedRememberMe);
      }
    } catch (error) {
      console.error('Error retrieving credentials:', error);
    }
  };
  
  const forgetUser = async () => {
      try {
        await AsyncStorage.removeItem('astrologer_login_save');
      } catch (error) {
       // Error removing
       console.log(error);
      }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white_color}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <MyLoader isVisible={isLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'height' : 'padding'}
        style={{flex: 1}}>
        <ScrollView style={{flex: 0}}>
        <Image source={require('../../assets/images/astrologers.png')} style={{position:'absolute',width:'100%',height:'45%'}} />
          <View style={{padding:20,paddingBottom:20}}>
          <View style={{padding:5,borderRadius:20,paddingTop:100,paddingRight:50}}>
            
            <Text style={{color:'black',paddingLeft:30,paddingRight:30,paddingTop:15,paddingBottom:10,fontSize:getFontSize(1.7),textAlign:'justify',fontWeight:'bold',color:'black'}}>
            "Join us on a journey where your astrological brilliance not only earns respect but also unlocks unparalleled prosperity."
            </Text>
            {/* <Text style={{color:'black',paddingLeft:30,paddingRight:30,paddingBottom:10,fontSize:18,textAlign:'justify',color:'#ff3c38',fontWeight:'bold'}}>
            "हमारे साथ जुड़ें एक ऐसे सफर पर, जहां आपकी ज्योतिषीय चमक न केवल सम्मान प्राप्त करती है, बल्कि असाधारण समृद्धि का दरवाजा भी खुलता है।"
            </Text> */}
          </View>
          </View>
          <View
            style={{
              flex: 0,
              width: width * 0.8,
              alignSelf: 'center',
              marginTop: 0,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.8),
                color: colors.background_theme2,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              Only Login For Astrologer
            </Text>
            

            <View style={{flex: 0}}>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="email"
                  color={colors.black_color8}
                  size={getFontSize(1.8)}
                />
                <TextInput
                  value={email}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  placeholderTextColor={colors.black_color5}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  style={{
                    flex: 0,
                    width: '80%',
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                  }}
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="lock"
                  color={colors.black_color8}
                  size={getFontSize(1.8)}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  placeholderTextColor={colors.black_color5}
                  secureTextEntry={true}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  style={{
                    flex: 0,
                    width: '80%',
                    marginLeft: 5,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                  }}
                />
              </View>
              <View style={{flexDirection:'row'}}>
              
               <BouncyCheckbox
                size={getFontSize(1.8)}
                fillColor={colors.background_theme4}
                onPress={(value) => setRemember(value)}
                innerIconStyle={{
                  borderRadius: 5,
                  backgroundColor: rememberMe
                    ? colors.background_theme4
                    : colors.background_theme1,
                }}
                isChecked={rememberMe}
              />
                <Text>Remember Me</Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('forgetPassword')}
                style={{flex: 0, alignSelf: 'flex-end', marginTop: 10}}>
                <Text
                  style={{
                    fontSize: getFontSize(1.8),
                    color: colors.black_color8,
                    fontFamily: fonts.medium,
                  }}>
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (validation) {
                    login();
                  }
                }}
                style={{
                  flex: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 25,
                  borderRadius: width * 0.55,
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.8),
                    color: colors.white_color,
                    fontWeight: 'normal',
                  }}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('verifiedAstrologer')}
                activeOpacity={1}
                style={{
                  flex: 0,
                  width: '80%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderWidth: 2,
                  borderRadius: 10000,
                  borderColor: colors.pink_color3,
                  marginVertical: 15,
                  backgroundColor: colors.yellow_color4,
                  shadowColor: colors.black_color5,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  marginTop:30
                }}>
                <View
                  style={{
                    flex: 0,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderWidth: 2,
                    borderColor: colors.pink_color3,
                    borderRadius: 30,
                    right: 1,
                  }}>
                  <MaterialCommunityIcons
                    name="account-check"
                    color={colors.background_theme2}
                    size={getFontSize(2.8)}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: getFontSize(1.6),
                    color: colors.black_color8,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Astrologer Sign-up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(null, mapDispatchToProps)(AstrologerLogin);

const styles = StyleSheet.create({
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderWidth: 1,
    borderColor: colors.black_color6,
    borderRadius: 25,
    marginTop: 15,
    fontFamily: fonts.medium,
    paddingLeft:10
  },
});
