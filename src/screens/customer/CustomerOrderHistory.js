import {View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyHeader from '../../components/MyHeader';
import {api_url, colors, fonts, order_history,getFontSize} from '../../config/Constants';
import {Rating, AirbnbRating} from 'react-native-ratings';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const CustomerOrderHistory = props => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("order_history")}
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
    get_order_history();
  }, []);

  const get_order_history = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + order_history,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setOrderHistoryData(res.data.result);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const _listEmptyComponent = () => {
    return (
      <View style={{alignSelf:'center',marginTop:50}}>
        <Text style={{fontSize: 16, color: colors.red_color1, fontFamily: fonts.medium, textAlign: 'center'}}>You have not any Order history yet</Text>
        {/* <Image  source={require('../../assets/images/icon/novideo.png')} 
              style={{width:300,height:300,borderRadius:20}}/> */}
      </View>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: '#ede0d4',
          padding: 20,
          margin:10,
          marginBottom: 15,
          borderRadius: 15,
          shadowColor: colors.black_color3,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
          borderWidth:1,
          borderColor:'#7f5539'
        }}>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Order No:</Text>
          <Text style={styles.textPara}>{item.invoice}</Text>
        </View>
        <View>
          <Text style={{borderTopWidth:1,borderColor:'#e6ccb2'}}></Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Type:</Text>
          {item.type == 1 ? (<Text style={styles.textPara}>
            Call
            </Text>) : (<Text style={styles.textPara}>
            Chat
            </Text>)         
            }
          
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Time:</Text>
          <Text style={styles.textPara}>{item.call_log_cr_date}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Time spent:</Text>
          <Text style={styles.textPara}>{item.call_log_duration_min}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Charge:</Text>
          <Text style={styles.textPara}>₹ {item.call_log_invoice_amt}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Promotion:</Text>
          <Text style={styles.textPara}>₹ {(item.price_per_min) * item.free_minut}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={{...styles.textHeading, fontSize: getFontSize(1.8)}}>
            Total Charge:
          </Text>
          <Text style={{...styles.textPara, fontSize: getFontSize(1.8)}}>
          ₹ {' '}
            {item.call_log_charge_amount == null
              ? '0'
              : item.call_log_charge_amount}
          </Text>
        </View>
        {/* <View style={{...styles.rowContainer, marginTop: 10}}>
          <TouchableOpacity
            style={{
              flex: 0.33,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              paddingVertical: 5,
            }}>
            <Ionicons
              name="chatbubbles"
              color={colors.background_theme1}
              size={22}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                marginLeft: 2,
              }}>
              Call Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              paddingVertical: 5,
            }}>
            <Ionicons
              name="chatbubbles"
              color={colors.background_theme1}
              size={22}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                marginLeft: 2,
              }}>
              Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('userGuide')}
            style={{
              flex: 0.3,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.background_theme2,
              borderRadius: 1000,
              paddingVertical: 5,
            }}>
            <Ionicons
              name="chatbubbles"
              color={colors.background_theme1}
              size={22}
            />
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                marginLeft: 2,
              }}>
              Help
            </Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={{flex: 1, width: '95%', alignSelf: 'center'}}>
        {orderHistoryData && (
          <FlatList
            data={orderHistoryData}
            renderItem={renderItem}
            keyExtractor={item => item.call_log_id}
            style={{paddingTop: 15}}
            ListEmptyComponent={_listEmptyComponent}
          />
        )}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

export default connect(mapStateToProps, null)(CustomerOrderHistory);

const styles = StyleSheet.create({
  textHeading: {
    fontSize: getFontSize(1.4),
    color: colors.black_color6,
    fontFamily: fonts.semi_bold,
  },
  textPara: {
    fontSize: getFontSize(1.2),
    color: colors.black_color6,
    fontFamily: fonts.medium,
  },
  rowContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  childRowContainer: {},
});
