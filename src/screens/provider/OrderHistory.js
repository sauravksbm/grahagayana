import {View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyHeader from '../../components/MyHeader';
import {api_url, astro_order_history, colors, fonts, img_url, order_history,getFontSize} from '../../config/Constants';
import {Rating, AirbnbRating} from 'react-native-ratings';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import {connect} from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const OrderHistory = (props) => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [orderHistoryData, setOrderHistoryData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("your_pickup_order_history")}
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
      url: api_url + astro_order_history,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.providerData.id,
      },
    })
      .then(res => {
        console.log(res.data)
        setOrderHistoryData(res.data.result);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          padding: 15,
          marginBottom: 15,
          borderRadius: 10,
          shadowColor: colors.black_color3,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }}>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Finished Order No</Text>
          <Text style={styles.textPara}>{item.invoiceId}</Text>
        </View>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <View
            style={{
              flex: 0.6,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}>
            {/* {item.img_url !=
            null ? (
              <Image source={{uri: img_url + item.img_url}} style={{width: width*0.15, height: width*0.15, borderRadius: 1000}} />
            ) : (
              <MaterialIcons
                name="account-circle"
                color={colors.black_color6}
                size={width*0.15}
              />
            )} */}

            <View style={{flex: 0, marginLeft: 10}}>
              <Text style={styles.textHeading}>{item.astrologer_name}</Text>
              <Rating
                readonly={true}
                count={5}
                imageSize={14}
                startingValue={item.avg_rating}
                showRating={false}
                selectedColor={colors.background_theme2}
                style={{alignSelf: 'flex-start', marginTop: 5}}
              />
            </View>
          </View>
          {item.type == 1 ? 
          (<Ionicons name="call" color={colors.background_theme2} size={25} />)
          :
          (<Ionicons name="chatbubbles" color={colors.background_theme2} size={25} />)}
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
          <Text style={styles.textPara}>₹ {item.charge}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.textHeading}>Promotion:</Text>
          <Text style={styles.textPara}>₹ {item.price_per_min}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={{...styles.textHeading, fontSize: getFontSize(1.8)}}>
            Total Charge:
          </Text>
          <Text style={{...styles.textPara, fontSize: getFontSize(1.8)}}>
          ₹{' '}
            {item.call_log_charge_amount == null
              ? '0'
              : item.call_log_charge_amount}
          </Text>
        </View>
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
          />
        )}
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});


export default connect(mapStateToProps, null)(OrderHistory)

const styles = StyleSheet.create({
  textHeading: {
    fontSize: getFontSize(1.4),
    color: colors.black_color6,
    fontFamily: fonts.semi_bold,
  },
  textPara: {
    fontSize: getFontSize(1.4),
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