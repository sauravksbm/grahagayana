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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../components/MyStatusbar';
import {fonts, vedic_colors, vedic_images} from '../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ProviderActions from '../redux/actions/ProviderActions';
import axios from 'axios';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('screen');

const ProviderLogin = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

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
    console.log({email: email, password: password});
    await axios({
      method: 'post',
      url: 'https://vaidicguru.com/astro/user/astrologer_login.php',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        email: email,
        password: password,
      },
    })
      .then(async res => {
        console.log(res.data);
        if (res.data?.success == '200') {
          props?.dispatch(ProviderActions.setProviderData(res.data.data));
          await AsyncStorage.setItem(
            'ProviderData',
            JSON.stringify(res.data.data),
          );
          home();
        } else {
          Alert.alert('Plese check your email and password.');
        }
      })
      .catch(err => {
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

  return (
    <View style={{flex: 1, backgroundColor: vedic_colors.white_color}}>
      <MyStatusBar
        backgroundColor={vedic_colors.yellow_color1}
        barStyle="light-content"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView style={{flex: 0}}>
          <Image
            source={vedic_images.provider_login}
            style={{width: width, height: width * 0.65, resizeMode: 'cover'}}
          />
          <View
            style={{
              flex: 0,
              width: width * 0.8,
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 22,
                color: vedic_colors.black_color9,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Only For Astrologer
            </Text>
            <Text
              style={{
                fontSize: 22,
                color: vedic_colors.yellow_color1,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: 3,
              }}>
              Login
            </Text>
            <View style={{flex: 0, marginTop: 25}}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderWidth: 1,
                  borderColor: vedic_colors.green_color1,
                  borderRadius: 5,
                }}>
                <MaterialCommunityIcons
                  name="email"
                  color={vedic_colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={email}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  placeholderTextColor={vedic_colors.black_color5}
                  onChangeText={text => {
                    setEmail(text);
                  }}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: vedic_colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 10,
                  borderWidth: 1,
                  borderColor: vedic_colors.green_color1,
                  borderRadius: 5,
                  marginTop: 15,
                }}>
                <MaterialCommunityIcons
                  name="lock"
                  color={vedic_colors.black_color8}
                  size={25}
                />
                <TextInput
                  value={password}
                  placeholder="Password"
                  placeholderTextColor={vedic_colors.black_color5}
                  secureTextEntry={true}
                  onChangeText={text => {
                    setPassword(text);
                  }}
                  style={{
                    flex: 0,
                    marginLeft: 5,
                    color: vedic_colors.black_color9,
                    fontWeight: 'normal',
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('forgetPassword')}
                style={{flex: 0, alignSelf: 'flex-end', marginTop: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: vedic_colors.black_color8,
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
                  backgroundColor: vedic_colors.yellow_color1,
                  paddingVertical: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: vedic_colors.white_color,
                    fontFamily: fonts.medium
                  }}>
                  LOGIN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <View
                  style={{
                    flex: 0,
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    borderWidth: 2,
                    borderColor: vedic_colors.yellow_color1,
                    borderRadius: 30,
                    marginTop: 20,
                  }}>
                  <MaterialCommunityIcons
                    name="account-check"
                    color={vedic_colors.yellow_color1}
                    size={35}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: vedic_colors.black_color8,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                    marginTop: 10,
                  }}>
                  Verified{'\n'}Astrologer
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

export default connect(null, mapDispatchToProps)(ProviderLogin);
