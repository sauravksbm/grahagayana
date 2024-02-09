import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, { useState } from 'react';
import {colors, fonts} from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import Ionicons from 'react-native-vector-icons/Ionicons';


const CallInvoice = (props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [astroData] = useState(props.route.params.astroData)
    const [call] = useState(props.route.params.call)
    const call_end = async()=>{

    }
    const next_page = () => {
      const call_time = formatSeconds(call.call_log_duration_min);
        props.navigation.navigate('callRating',
        {
          total_time:call_time,
          astroData: {
            id:call.astro_id,
            owner_name:call.owner_name,
            chat_price_m:call.chat_price_m,
            chat_commission:call.chat_commission,
            free_minut:call.free_minut,
            image:call.image,
            total:call.tot_carge.slice(0,4),
          }
        });
      };

      function formatSeconds(seconds) {
        // Calculate minutes and remaining seconds
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
      
        // Ensure both minutes and remaining seconds are two digits
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      
        // Combine minutes and seconds with a colon
        return `${formattedMinutes}:${formattedSeconds}`;
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
            <Ionicons name="call" color={colors.black_color} size={30} />
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color,
                fontFamily: fonts.bold,
                textAlign: 'center',
              }}>
              Thanks for choosing {'\n'} {call.owner_name}
            </Text>
            <TouchableOpacity onPress={() => next_page()}>
              <Ionicons name="ios-close" color={colors.black_color} size={30} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 0, marginTop: 20}}>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Finished ID:</Text>
              <Text style={styles.listText}>{call.invoiceId}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Time:</Text>
              <Text style={styles.listText}>{formatSeconds(call.call_log_duration_min)} min</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Charge:</Text>
              <Text style={styles.listText}>₹ {call.charge.slice(0, 4)}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Promotion:</Text>
              <Text style={styles.listText}>₹ {call.free_minut * (parseFloat(call.call_price_m) + parseFloat(call.call_commission))}</Text>
            </View>
            <View style={styles.listContainer}>
              <Text style={styles.listText}>Total Charge:</Text>
              <Text style={styles.listText}>₹ {call.tot_carge.slice(0,4)}</Text>
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
  )
}

export default CallInvoice

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