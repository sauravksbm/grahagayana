import {View, Text, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fonts,getFontSize} from '../config/Constants';
import {connect} from 'react-redux';
import { openFacebook, openInstagram, openYoutube } from './Methods';
import { useTranslation } from 'react-i18next';

const HomeHeader = props => {

  const {t} = useTranslation();

  return (
    <View
      style={{
        flex: 0,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 12,
        backgroundColor: colors.white_color,
      }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.navigation.openDrawer()}
        style={{flex: 0.1}}>
        <FontAwesome name="bars" color={colors.black_color} size={25} />
      </TouchableOpacity>
      <Image source={require('../assets/images/Logo2.png')}
      style={{width:40,height:40,flex:0.1,resizeMode:'contain'}} />
      <Text
        style={{
          flex: 0.4,
          fontFamily: fonts.bold,
          color: colors.black_color,
          fontSize:getFontSize(1.6),
          marginLeft:10
        }}>
        {/* Hi,{props.customerData.first_name} */}
        {t('astrokunj')}
      </Text>
      
      <TouchableOpacity
        onPress={() => props.navigation.navigate('notifications')}
        style={{flex: 0.1, flexDirection: 'row'}}>
          {
            props?.notificationCounts != 0 &&  <View
            style={{
              flex: 0.1,
              width: 20,
              height: 20,
              backgroundColor: colors.red_color1,
              borderRadius: getFontSize(1.2),
              justifyContent: 'center',
              position: 'absolute',
              left: getFontSize(1),
              bottom: getFontSize(1),
              zIndex: 1,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.2),
                fontFamily: fonts.medium,
                textAlign: 'center',
                color: colors.white_color,

              }}>
              {props?.notificationCounts}
            </Text>
          </View>
          }
        <FontAwesome name="bell" color={colors.black_color8} size={getFontSize(2)} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.navigation.navigate('wallet')}
        style={{
          flex: 0.3,
          flexDirection: 'row',
          backgroundColor: colors.background_theme2,
          padding: getFontSize(0.6),
          borderRadius: 15,
          justifyContent: 'center',
        }}>
        <Ionicons name="wallet" color={colors.white_color} size={15} />
        <Text
          style={{
            fontSize: getFontSize(1.2),
            color: colors.white_color,
            fontFamily: fonts.medium,
          }}>
          {`₹ ${parseFloat(props.wallet).toFixed(0)}`}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  notificationCounts: state.customer.notificationCounts,
});

export default connect(mapStateToProps)(HomeHeader);
