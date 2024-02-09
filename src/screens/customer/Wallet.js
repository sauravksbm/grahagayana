import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  TextInput,
  Linking,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_addwallet,
  api_getRechargeplans,
  api_url,
  colors,
  fonts,
  vedic_images,
  create_phonepe_order,
  phonepe_success,
  getFontSize
} from '../../config/Constants';
import {useState} from 'react';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import {connect} from 'react-redux';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import * as CustomerActions from '../../redux/actions/CustomerActions';
import {useRef} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyLoader from '../../components/MyLoader';
import * as UserActions from '../../redux/actions/CustomerActions';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const Wallet = props => {
  console.log(props.customerData.id);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [amountData, setAmountData] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [firstOffer, setFirstOffer] = useState(null);
  const [amount, setAmount] = useState('');
  const [billDetailesOpen, setBillDetailesOpen] = useState(false);
  // const pan = useRef(new Animated.ValueXY()).current;


  const amou1 = amount * 100;

  // const panResponder = useRef(
  //   PanResponder.create({
  //     onMoveShouldSetPanResponder: () => true,
  //     onPanResponderGrant: () => {
  //       pan.setOffset({
  //         x: pan.x._value,
  //         y: pan.y._value,
  //       });
  //     },
  //     onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
  //     onPanResponderRelease: () => {
  //       pan.flattenOffset();
  //     },
  //   }),
  // ).current;

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t('recharge')}
          navigation={props.navigation}
          socialIcons={false}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    get_wallet_amount();
  }, []);

  const get_wallet_amount = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_getRechargeplans,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: JSON.stringify({
        user_id: props.customerData.id,
      }),
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        setImageData(res.data.firstoffer);
        setAmountData(res.data.records);
        setFirstOffer(res.data.records2);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const razorpay_payment = async amount => {
    
  };

  

  const phonepe = async amount => {
    console.log('ddd');
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + create_phonepe_order,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        amount: amount,
        mobile: props.customerData.phone,
      },
    })
      .then(res => {
        console.log('amount===', res.data);
        if(res.data.success == true)
        {
          setIsLoading(false);
          props.navigation.navigate('phoneView',{url:res.data.data.instrumentResponse.redirectInfo.url});
          
        }
        else
        {
          setIsLoading(false);
          Alert.alert('Try again, Payment.')
        }
        
        
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };


  const success_payment = (data) => {
    console.log('ddddsasdfadsf',data);
    props.navigation.goBack();
  }

  const error_payment = (data) => {
    console.log('error=====>',data);
    props.navigation.navigate('wallet');
  }

  const add_money = () => {
    if (amount.length != 0 || props.customerData.phone != 0) {
      phonepe(amount);
    } else {
      warnign_toast('Please Enter your amount to add your wallet.');
      return false;
    }
  };

  const phonepe_call = async(data) => {
    const data1 = {
      merchantTransactionId: data.data.merchantTransactionId,
      success: data.success,
      message: data.message,
      code:data.code,
      transactionId: data.data.transactionId,
      amount: data.data.amount,
    };
    console.log('success===>',data1);
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + phonepe_success,
      data: {
        merchantTransactionId: data.data.merchantTransactionId,
        success: data.success,
        message: data.message,
        code:data.code,
        transactionId: data.data.transactionId,
        amount: data.data.amount,
      },
    })
      .then(res => {
        console.log('sucess=>',res.data)
        if(res.data.status == 1)
        {
          props.dispatch(UserActions.setWallet(res.data.wallet));
        }
        
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  }

  return (
    <ImageBackground
      source={require('../../assets/images/login_background.png')}
      style={{flex: 1}}>
      <MyLoader isVisible={isLoading} />
      {billDetailesOpen ? (
        <View style={{flex: 1, width: '90%', alignSelf: 'center'}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                // alignSelf: 'center',
                marginVertical: 20,
              }}>
              Payment Details
            </Text>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Total Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>GST @ 18%</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Gift Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <View style={styles.rowContainer}>
              <Text style={styles.rowText}>Total Payable Amount</Text>
              <Text style={styles.rowText}>
                ₹ {parseFloat(firstOffer[0].recharge_of).toFixed(1)}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: colors.background_theme2,
                paddingVertical: 10,
                borderRadius: 5,
                marginVertical: 20,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                }}>
                Proceed payment
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text
              style={{
                fontSize: getFontSize(1.8),
                color: colors.black_color,
                fontFamily: fonts.semi_bold,
                alignSelf: 'center',
                marginVertical: 20,
              }}>
              {t('available_balance')}:{' '}
              <Text style={{color: colors.background_theme2}}>
                {props.wallet}
              </Text>
            </Text>
            <View
              style={{
                flex: 0,
                width: '95%',
                padding: 15,
                borderRadius: 10,
                borderColor: colors.black_color8,
                borderWidth: 1,
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <TextInput
                placeholder={t('enter_amount')}
                placeholderTextColor={colors.black_color7}
                keyboardType="number-pad"
                returnKeyType="done"
                onChangeText={setAmount}
                style={styles.amountInput}
              />

<TouchableOpacity
  onPress={() => add_money()}
  style={{color:'black',backgroundColor:colors.background_theme2,padding:10,margin:10,borderRadius:5}}
  activeOpacity={0.8}>
    <Text style={{color:'white',fontSize:getFontSize(1.6)}}>{t('add_money')}</Text>
  </TouchableOpacity>
                 
              
          
            </View>
            {/* {imageData == '0' && (
              <TouchableOpacity
                style={{
                  width: width * 0.95,
                  height: width * 0.32,
                  alignSelf: 'center',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.black_color,
                  marginBottom: 20,
                  overflow: 'hidden',
                  padding: 5
                }}
                onPress={() => setBillDetailesOpen(true)}>
                <ImageBackground
                  source={require('../../assets/images/permotional_banner.jpeg')}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover">
                  <View
                    style={{
                      width: '50%',
                      height: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}>
                      Get ₹ {firstOffer && (parseFloat(firstOffer[0]?.recharge_get) + parseFloat(firstOffer[0]?.recharge_of))}.0
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        textAlign: 'center',
                      }}>
                      First Recharge offer{'\n'}Recharge with {'\n'}₹ {firstOffer && parseFloat(firstOffer[0]?.recharge_of)}
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )} */}

            <View
              style={{
                width: '90%',
                alignSelf: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {amountData &&
                amountData.map((item, index) => (
                 
                  <TouchableOpacity
                    onPress={() => phonepe(item.recharge_plan_amount)}
                    key={index}
                    style={{
                      flex: 0,
                      width: '40%',
                      height: width * 0.18,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: colors.black_color,
                      backgroundColor: colors.background_theme1,
                      marginHorizontal: '5%',
                      marginBottom: '10%',
                      overflow: 'hidden',
                    }}>
                    <View style={styles.box1}>
                      <Text
                        style={
                          styles.bannerText
                        }>{`Gift ₹ ${item.recharge_plan_extra_percent}`}</Text>
                    </View>
                    <Text
                      style={{
                        fontSize: getFontSize(1.4),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      ₹ {item.recharge_plan_amount}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={{flex: 0}}>
        <Text
          style={{
            fontSize: getFontSize(1.4),
            color: colors.black_color,
            fontFamily: fonts.bold,
            textAlign: 'center',
          }}>
           {t('gst_excluded')}
        </Text>
        <Text
          style={{
            fontSize: getFontSize(1),
            color: colors.black_color,
            fontFamily: fonts.medium,
            textAlign: 'center',
            width: '95%',
            alignSelf: 'center',
            marginBottom: 10,
          }}>
           {t('for_payment')}
        </Text>
      </View>
      {/* <Animated.View
  style={{
    transform: [{ translateX: pan.x }, { translateY: pan.y }],
  }}
  {...panResponder.panHandlers}
>
  <TouchableOpacity
    onPress={() => props.navigation.navigate('userGuide')}
    style={styles.box}
  >
    <Ionicons
      name="ios-logo-whatsapp"
      color={colors.green_color1}
      size={35}
    />
  </TouchableOpacity>
</Animated.View> */}

    </ImageBackground>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    backgroundColor: colors.background_theme1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  amountInput: {
    textAlign: 'center',
    fontSize: getFontSize(1.8),
    borderBottomWidth: 1,
    width: '70%',
    borderBottomColor: colors.black_color8,
    fontFamily: fonts.medium,
    color:colors.black_color
  },

  box1: {
    width: width * 0.25,
    height: 20,
    backgroundColor: colors.background_theme2,
    justifyContent: 'center',
    position: 'absolute',
    alignItems: 'center',
    transform: [{rotate: '-50deg'}],
    overflow: 'hidden',
    right: width * 0.18,
    top: width * 0.05,
  },
  bannerText: {
    color: 'white',
    fontFamily: fonts.medium,
    fontSize: getFontSize(1),
    textAlign: 'center',
  },

  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  rowText: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
