import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api2_astrodate_plans,
  api2_myplans,
  api2_subscriptions_purchase,
  api_url,
  colors,
  fonts,
} from '../../config/Constants';
import MyLoader from '../../components/MyLoader';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import RazorpayCheckout from 'react-native-razorpay';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
const {width, height} = Dimensions.get('screen');

const ChoosePlan = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [planId, setPlanId] = useState(null);
  const [items, setItems] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Choose a Plan"
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

  useEffect(() => {
    get_plans();
  }, []);

  const get_plans = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: api_url + api2_astrodate_plans,
    })
      .then(res => {
        setIsLoading(false);
        setPlanData(res.data.plans);
        setPlanId(res.data.plans[0]?.id);
        setItems(res.data.plans[0]);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const razorpay_payment = async () => {
    var options = {
      description: 'Purchasing Plan',
      // image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: 'rzp_test_WuQwvZVOaPQbZC',
      amount: items?.price * 100,
      name: 'Astro King',
      // order_id: 'order_DslnoIgkIDL8Zt', //Replace this with an order_id created using Orders API.
      prefill: {
        email: props.customerData?.email,
        contact: props.customerData?.phone,
        name: props.customerData?.username,
      },
      theme: {color: colors.background_theme2},
    };
    await RazorpayCheckout.open(options)
      .then(async data => {
        console.log(data.razorpay_payment_id);
        await axios({
          method: 'post',
          url: api_url + api2_subscriptions_purchase,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            subscription_id: items.id,
            user_id: props.customerData.id,
            transaction_id: data.razorpay_payment_id,
          },
        })
          .then(res => {
            console.log(res.data);
            success_toast('Plan purchased successfully.');
            props.navigation.goBack();
          })
          .catch(err => {
            console.log(err);
            warnign_toast(
              'Your payment has not been completed. If any balance deducted, It will be refunded.',
            );
          });
        // alert(`Success: ${data.razorpay_payment_id}`);
      })
      .catch(error => {
        // handle failure
        // alert(`Error: ${error.code} | ${error.description}`);
        warnign_toast(
          `Payment has been declined Error: ${error.code} | ${error.description}`,
        );
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{marginVertical: 15}}>
          {items &&
            planData &&
            planData.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setItems(item)}
                style={{
                  ...styles.boxContainer,
                  backgroundColor:
                    items.id == item.id
                      ? colors.background_theme3
                      : colors.background_theme1,
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.background_theme2,
                    fontFamily: fonts.bold,
                  }}>
                  ₹ {item.price}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={{width: '90%', alignSelf: 'center'}}>
          {items && (
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color6,
                fontFamily: fonts.medium,
              }}>
              {items.description}
            </Text>
          )}
          {items && (
            <View
              style={{
                flex: 0,
                marginTop: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  flex: 0,
                  alignSelf: 'center',
                  borderWidth: 2,
                  borderColor: colors.black_color5,
                  height: height * 0.04,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  borderRadius: 1000,
                  backgroundColor: colors.black_color1,
                  position: 'relative',
                  top: (height * 0.04) / 2,
                  zIndex: 1,
                }}>
                <Text style={{fontSize: 10}}>Including With AstroDate</Text>
              </View>
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  padding: 20,
                  borderWidth: 2,
                  borderColor: colors.black_color5,
                  borderRadius: 15,
                }}>
                <View style={styles.itemContainer}>
                  <AntDesign
                    name="checkcircleo"
                    color={colors.background_theme2}
                    size={15}
                  />
                  <Text style={styles.itemText}>{items.likes} Like</Text>
                </View>
                <View style={styles.itemContainer}>
                  <AntDesign
                    name="checkcircleo"
                    color={colors.background_theme2}
                    size={15}
                  />
                  <Text style={styles.itemText}>See Who Likes You</Text>
                </View>
                <View style={styles.itemContainer}>
                  <AntDesign
                    name="checkcircleo"
                    color={colors.background_theme2}
                    size={15}
                  />
                  <Text style={styles.itemText}>{items.boost} Boost</Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={razorpay_payment}
        style={{
          flex: 0,
          width: '90%',
          alignSelf: 'center',
          backgroundColor: colors.background_theme2,
          marginVertical: 10,
          paddingVertical: 10,
          borderRadius: 5,
        }}>
        <Text
          style={{
            fontSize: 16,
            color: colors.background_theme1,
            fontFamily: fonts.medium,
            textAlign: 'center',
          }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(ChoosePlan);

const styles = StyleSheet.create({
  boxContainer: {
    width: width * 0.4,
    height: width * 0.3,
    borderRadius: 10,
    marginLeft: width * 0.065,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.black_color5,
    backgroundColor: colors.background_theme1,
    shadowColor: colors.black_color5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  itemContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 12,
    color: colors.black_color,
    fontFamily: fonts.medium,
    marginLeft: 5,
  },
});
