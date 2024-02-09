import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React from 'react';
  import {useEffect} from 'react';
  import {api_astrolist1, api_url, colors, fonts} from '../../config/Constants';
  import {StyleSheet} from 'react-native';
  import {useState} from 'react';
  import axios from 'axios';
  import MyLoader from '../../components/MyLoader';
  import moment from 'moment';
  
  const {width, height} = Dimensions.get('screen');
  
  const KundliBirth = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [astoListData, setAstroListData] = useState(null);
    useEffect(() => {
      props.navigation.setOptions({
        tabBarLabel: 'BIRTH DETAIL',
      });
    }, []);
  
    useEffect(() => {
      get_astrologer();
    }, []);
  
    const get_astrologer = async () => {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + api_astrolist1,
      })
        .then(res => {
          setIsLoading(false);
          setAstroListData(res.data.records);
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    };
    
    console.log('test',props.route.params.data.tob);
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyLoader isVisible={isLoading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme1,
              marginVertical: 10,
              borderRadius: 15,
              shadowColor: colors.black_color5,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}>
            <View style={styles.itmeContainer}>
              <Text style={styles.itemText}>Name</Text>
              <Text style={styles.itemText}>
                {props.route.params.data.customer_name}
              </Text>
            </View>
            <View
              style={{
                ...styles.itmeContainer,
                backgroundColor: colors.background_theme2,
              }}>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                Date
              </Text>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                {moment(props.route.params.data.dob, 'YYYY-MM-DD').format(
                  'DD MMM YYYY',
                )}
              </Text>
            </View>
            <View style={styles.itmeContainer}>
              <Text style={styles.itemText}>Time</Text>
              <Text style={styles.itemText}>
                {props.route.params.data.tob}
              </Text>
            </View>
            <View
              style={{
                ...styles.itmeContainer,
                backgroundColor: colors.background_theme2,
              }}>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                Place
              </Text>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                {props.route.params.data.place}
              </Text>
            </View>
            <View style={styles.itmeContainer}>
              <Text style={styles.itemText}>Latitude</Text>
              <Text style={styles.itemText}>
                {props.route.params.data.latitude}
              </Text>
            </View>
            <View
              style={{
                ...styles.itmeContainer,
                backgroundColor: colors.background_theme2,
              }}>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                Longitude
              </Text>
              <Text style={{...styles.itemText, color: colors.background_theme1}}>
                {props.route.params.data.longitude}
              </Text>
            </View>
            <View style={styles.itmeContainer}>
              <Text style={styles.itemText}>Time Zone</Text>
              <Text style={styles.itemText}>GMT+05:30</Text>
            </View>
          </View>
          {/* <View
            style={{
              flex: 0,
              backgroundColor: colors.background_theme2,
              padding: 15,
              marginTop: 15,
            }}>
            <Text
              style={{
                fontSize: 15,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
              }}>
              Connect with recommended astrologers
            </Text>
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              style={{marginVertical: 20}}>
              {astoListData &&
                astoListData.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 0,
                      width: width * 0.38,
                      backgroundColor: colors.background_theme1,
                      borderRadius: 5,
                      padding: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: colors.black_color6,
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                      marginRight: 15,
                    }}>
                    <Image
                      source={{uri: item.image}}
                      style={{
                        width: width * 0.2,
                        height: width * 0.2,
                        borderRadius: 10000,
                        borderWidth: 0.5,
                        borderColor: colors.background_theme2,
                      }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 14,
                        color: colors.black_color9,
                        fontFamily: fonts.semi_bold,
                        marginTop: 5,
                      }}>
                      {item.shop_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        marginTop: 5,
                      }}>
                      ₹ 10.0/min
                    </Text>
                    <TouchableOpacity
                      onPress={()=>{
                        props.navigation.navigate('astrologerDetailes', {data: item, type: 'chat'})
                      }}
                      style={{
                        flex: 0,
                        width: '100%',
                        backgroundColor: colors.background_theme2,
                        paddingVertical: 2,
                        marginTop: 8,
                        borderRadius: 100,
                        marginBottom: 3,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 14,
                          color: colors.background_theme1,
                          fontFamily: fonts.medium,
                        }}>
                        Connect
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </ScrollView>
          </View> */}
        </ScrollView>
      </View>
    );
  };
  
  export default KundliBirth;
  
  const styles = StyleSheet.create({
    itmeContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
    },
    itemText: {
      flex: 0.5,
      fontSize: 14,
      color: colors.black_color8,
      fontFamily: fonts.medium,
    },
  });
  