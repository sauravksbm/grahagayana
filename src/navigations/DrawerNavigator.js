import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking
} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import { api2_logout, api_url, base_url, colors, fonts, getFontSize } from '../config/Constants';
import { connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { CommonActions, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Share from 'react-native-share';
import { openFacebook, openInstagram, openLinkedIn } from '../components/Methods';
import { useEffect } from 'react';
const { width, height } = Dimensions.get('screen');
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const Drawer = createDrawerNavigator();
import { useTranslation } from 'react-i18next';

function CustomDrawerContent(props) {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const logout = () => {
    Alert.alert(
      'Logout',
      'You sure, you want to Logout?',
      [
        {
          text: 'CANCEL',
          style: 'cancel'
        },
        {
          style: 'destructive',
          text: 'LOGOUT',
          onPress: () => on_logout()
        }
      ]
    )
  }


  const logout1 = () => {
    Alert.alert(
      'Logout',
      'You sure, you want to Logout?',
      [
        {
          text: 'CANCEL',
          style: 'cancel'
        },
        {
          style: 'destructive',
          text: 'LOGOUT',
          onPress: () => on_logout1()
        }
      ]
    )
  }


  const openWhatsApp = () => {
    // Replace PHONE_NUMBER with the desired phone number (including the country code)
    const phoneNumber = '7004690216';

    // Replace YOUR_MESSAGE with the optional message (URL-encoded if necessary)
    const message = 'Hello%2C%20I%20have%20a%20question';

    // Create the WhatsApp link
    const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

    // Open the link using the Linking module
    Linking.openURL(whatsappURL)
      .then((data) => {
        console.log('WhatsApp opened successfully');
      })
      .catch(() => {
        console.error('An error occurred while opening WhatsApp');
      });
  };

  //share
  const share_app = async () => {
    let options = {
      title: 'Checkout the Astrokunj marriage compatibility report for Ranjeet and xxx.',
      url: 'https://play.google.com/store/apps/details?id=com.ksbm.grahagyana&hl=en-IN', // Replace with your actual URL
    };

    try {
      const res = await Share.open(options);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const on_logout = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_logout,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        user_id: props.props?.customerData?.id
      }
    }).then((res) => {
      if (res.data.status) {
        AsyncStorage.clear();
        GoogleSignin.revokeAccess();
        GoogleSignin.signOut();
        go_login();
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const go_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'login' }]
      })
    )
  }

  const on_logout1 = async () => {
    await axios({
      method: 'post',
      url: api_url + api2_logout,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        user_id: props.props?.customerData?.id
      }
    }).then((res) => {
      if (res.data.status) {
        AsyncStorage.clear();
        go_login1();
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const go_login1 = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'verifiedAstrologer' }]
      })
    )
  }





  useEffect(() => {
    get_kundali_notification();
  }, []);

  const get_kundali_notification = () => {
    const { data } = props.props?.route.params || {};
    console.log('ddd', data);
    const id = data?.data?.redirect_app;
    switch (id) {
      case 'notifications':
        props.props?.navigation.navigate('notifications', { data: data?.data })
        break;
      default:
        break;
    }
  }



  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: 20 }} />
      <DrawerContentScrollView {...props.props1}>
        <View
          style={{
            justifyContent: "space-between",
            flexDirection: 'row',
            alignContent: "center",
            backgroundColor: colors.white_color,
            paddingHorizontal: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 10,
              height: 20
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            borderBottomWidth: 0.2,
            marginBottom: 5
          }}>
          <Image
            source={{
              uri: base_url + 'admin/' + props.props?.customerData?.user_profile_image,
            }}
            style={{
              width: width * 0.12,
              height: width * 0.12,
              borderWidth: 1,
              borderColor: colors.white_color,
              borderRadius: (width * 0.25) / 2,
            }}
          />
          <View style={{
            margin: 10,
            flex: 1,

          }}>
            <Text
              style={{
                fontSize: getFontSize(1.7),
                color: colors.black_color,
                fontFamily: fonts.bold,
              }}>
              {props.props.customerData?.username}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              {props.props.customerData?.phone != 0 && (
                props.props.customerData?.phone
              )}
            </Text>

          </View>
          <TouchableOpacity
            // onPress={() => navigation.navigate('customerAccount')}
            style={{
              height: 30,
              borderRadius: 13,
              borderColor: colors.background_theme2,
              borderWidth: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background_theme2,
              marginTop: 10,
              paddingHorizontal: 10
            }}>
            <Image
              source={require('../assets/images/menu/1.png')}
              style={{ width: 20, height: 20, tintColor: 'white' }}
            />
            <Text style={{ color: colors.white_color, marginLeft: 10 }}> ₹ {props.props.wallet}</Text>
          </TouchableOpacity>

        </View>
        <View style={{
          width: width,
          backgroundColor: colors.white_color,
          // margin:10s
        }}>
          <View>


            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={[styles.buttonContainer2]}>
                <Image
                  source={require('../assets/images/menu/wallet.png')}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText2}>{t("wallet_balance")}  ₹ {props.props.wallet}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={styles.buttonContainer2}>
                <Image
                  source={require('../assets/images/menu/wallet.png')}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText2}>{t("wallet_balance")}  ₹ {props.props.wallet}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={styles.buttonContainer2}>
                <Image
                  source={require('../assets/images/menu/wallet.png')}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText2}>{t("wallet_balance")}  ₹ {props.props.wallet}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={styles.buttonContainer2}>
                <Image
                  source={require('../assets/images/menu/wallet.png')}
                  style={styles.buttonImage}
                />
                <Text style={styles.buttonText2}>{t("wallet_balance")}  ₹ {props.props.wallet}</Text>
              </TouchableOpacity>
            </View>
          </View>



        </View>
        <View style={{
          // flex: 1,
          width: '100%',
          paddingLeft:10,
          // padding: 20,
          alignSelf: 'center',
          // backgroundColor: colors.background_theme7,
          // marginTop: 20,
          height: height * 1,
        }}>
          <TouchableOpacity onPress={() => navigation.navigate('wallet')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/wallet.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("wallet_balance")}  ₹ {props.props.wallet}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('billHistory')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/payment.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("payment_bill")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('customerOrderHistory')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/follow.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("order_history")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('customerMallHistory')}
            style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/follow.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>Astromall Order History</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('following')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/follow.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("following")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('howUse')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/app.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("How")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('askAstrologer')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/ask.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("What")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('AstrologerSignUp')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/astrologer.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("astrologer_sign")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openWhatsApp} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/help.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("help")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/help.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("rate")}</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('language')}>
            <Image
              source={require('../assets/images/menu/language.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("ln")}</Text>
          </TouchableOpacity> */}
          <TouchableOpacity style={styles.buttonContainer} onPress={() => share_app()}>
            <Image
              source={require('../assets/images/menu/share.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("share")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('setting')} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/settings.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("setting")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.buttonContainer}>
            <Image
              source={require('../assets/images/menu/logout.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.buttonText}>{t("logout")}</Text>
          </TouchableOpacity>
          {/* <View style={{flexDirection:'row',alignSelf:'center',justifyContent:'space-around'}}>
          <TouchableOpacity style={{paddingHorizontal:10}} activeOpacity={0.8}
           onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61552323625258')}>
            <Image source={require('../assets/images/facebook1.png')} style={styles.iconimg}/>
          </TouchableOpacity>
          <TouchableOpacity style={{paddingHorizontal:10}} activeOpacity={0.8}
           onPress={() => Linking.openURL('https://www.instagram.com/astrokunjofficial?utm_source=qr&igshid=YTlmZjI0ZWMzOA==')}>
            <Image source={require('../assets/images/instagram1.png')} style={styles.iconimg}/>
          </TouchableOpacity>
          </View> */}
        </View>


      </DrawerContentScrollView>
    </View>
  );
}

const DrawerNavigator = props => {
  return (
    <Drawer.Navigator
      drawerContent={props1 => (
        <CustomDrawerContent props1={props1} props={props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: width * 0.85,
          alignSelf: 'center',
          backgroundColor: colors.background_theme2,
          elevation: 8,
          borderTopRightRadius: 40,
          borderBottomRightRadius: 40,
          shadowColor: colors.black_color6,
        },
      }}>
      <Drawer.Screen name="home2" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(DrawerNavigator);

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    padding: 8,
  },
  buttonContainer2: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding:5,
    margin: 10,
    backgroundColor: colors.side_bar_background,
    borderRadius: 5
  },
  buttonImage: {
    width: width * 0.06,
    height: width * 0.06,
    // backgroundColor:'white',
  },
  buttonText: {
    fontSize: getFontSize(1.5),
    color: colors.white_color,
    fontFamily: fonts.medium,
    marginLeft: 10,
  },
  buttonText2: {
    fontSize: getFontSize(1.5),
    color: colors.black_color,
    fontFamily: fonts.bold,
    marginLeft: 10,
  },
  socialLogo: {
    width: width * 0.08,
    height: width * 0.08,
  },
  iconimg: {
    width: width * 0.1,
    height: height * 0.1,
    resizeMode: 'contain',
  }
});
