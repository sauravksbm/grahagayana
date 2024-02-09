import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {colors, fonts} from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatInvoice = props => {
  console.log(props.route.params.total_time);
  const [astroData] = useState(props.route.params.astroData);
  const [result] = useState(props.route.params.result);
  console.log('dddd==',result);
  const next_page = () => {
    props.navigation.navigate('chatRating', {
      astroData: astroData,
      total_time: result.call_log_duration_min,
      charge:result.call_log_charge_amount
    });
  };

  function getPositiveNumber(number) {
    if (number < 0) {
      return 0;
    } else {
      return number;
    }
  }
  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme2}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            flex: 0,
            width: '90%',
            backgroundColor: colors.white_color,
            borderRadius: 10,
            padding: 15,
            shadowColor: colors.black_color7,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Ionicons name="chatbubbles" color={colors.black_color} size={30} />
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              Thanks for choosing {'\n'} {astroData?.owner_name}
            </Text>
            <TouchableOpacity onPress={() => next_page()}>
              <Ionicons name="ios-close" color={colors.black_color} size={30} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0, marginTop: 20}}>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Finished ID:</Text>
              <Text style={styles.listText}>{props.route.params.trans_id}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Time:</Text>
              <Text style={styles.listText}>{`${result.call_log_duration_min} min`}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Charge:</Text>
              <Text style={styles.listText}>{`₹ ${result.call_log_invoice_amt}`}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Promotion:</Text>
              <Text style={styles.listText}>
            {`₹ ${(parseFloat(result.chat_price_m) + parseFloat(result.chat_commission)) * result.free_minut}`}
          </Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Total Charge:</Text>
              <Text style={styles.listText}>{`₹ ${result.call_log_charge_amount}`}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => next_page()}
            style={{
              flex: 0,
              width: '60%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              paddingVertical: 8,
              marginTop: 15,
              borderRadius: 1000,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              Ok
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatInvoice;

const styles = StyleSheet.create({
  listContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listText: {
    fontSize: 14,
    color: colors.black_color,
    fontFamily: fonts.medium,
  },
});
