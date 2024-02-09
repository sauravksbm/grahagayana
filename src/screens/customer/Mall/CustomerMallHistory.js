import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import MyHeader from '../../../components/MyHeader';
  import {api_url, colors, fonts, order_history,astro_mall_order_history,provider_img_url} from '../../../config/Constants';
  import {Rating, AirbnbRating} from 'react-native-ratings';
  import MyLoader from '../../../components/MyLoader';
  import axios from 'axios';
  import {connect} from 'react-redux';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  
  const {width, height} = Dimensions.get('screen');
  
  const CustomerAstromallHistory = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [orderHistoryData, setOrderHistoryData] = useState(null);
    useEffect(() => {
      props.navigation.setOptions({
        header: () => (
          <MyHeader
            title="Astromall Order History"
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
        url: api_url + astro_mall_order_history,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.customerData.id,
        },
      })
        .then(res => {
          setOrderHistoryData(res.data.data);
          console.log(res.data);
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
            padding: 0,
            marginBottom: 15,
            borderRadius: 10,
            shadowColor: colors.black_color3,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            borderWidth: 1,
            borderColor: colors.background_theme2,
          }}>
          <View
            style={{
              backgroundColor: colors.background_theme2,
              padding: 10,
              flexDirection: 'row',
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}>
            <Text style={styles.textHeading}>Order Date: </Text>
            <Text style={styles.textPara}>{item.datetime}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.textHeading}>Image:</Text>
            <Image source={{uri: provider_img_url + item.goods.image}} style={{width:75,height:75}} />
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.textHeading}>Name:</Text>
            <Text style={styles.textPara}>{item.goods.name}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={styles.textHeading}>Price:</Text>
            <Text style={styles.textPara}>{item.goods.price}</Text>
          </View>
          
          <View style={[styles.rowContainer]}>
            <Text style={styles.textHeading}>Order address:</Text>
            <Text style={[styles.textPara,{textAlign:'right'}]}>{item.address.name}{'\n'}{item.address.address}{'\n'}
            {item.address.address_line}{'\n'}{item.address.city}{'\n'}{item.address.state},{item.address.pincode}</Text>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{...styles.textHeading, fontSize: 16}}>
              Total Price:
            </Text>
            <Text style={{...styles.textPara, fontSize: 16}}>
              ₹{' '}
              {item.final_price}
            </Text>
          </View>
          <View style={{...styles.rowContainer, marginTop: 10}}></View>
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
  };
  
  const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    firebaseId: state.customer.firebaseId,
  });
  
  export default connect(mapStateToProps, null)(CustomerAstromallHistory);
  
  const styles = StyleSheet.create({
    textHeading: {
      fontSize: 13,
      color: colors.black_color6,
      fontFamily: fonts.semi_bold,
    },
    textPara: {
      fontSize: 12,
      color: colors.black_color6,
      fontFamily: fonts.medium,
    },
    rowContainer: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 5,
      padding: 5,
    },
    childRowContainer: {},
  });
  