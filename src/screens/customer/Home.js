import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
  StyleSheet,
  Animated,
  ImageBackground,
  RefreshControl,
  Linking,
  PermissionsAndroid,
  Platform,
  Alert,
  FlatList,
  PixelRatio,
  
} from 'react-native';
import React from 'react';
import Carousel from 'react-native-reanimated-carousel';
import {useEffect} from 'react';
import {
  api2_get_profile,
  api_astrolist1,
  api_url,
  base_url,
  colors,
  fonts,
  get_notifications,
  user_get_banner,
  get_live_list,
  getFontSize
} from '../../config/Constants';
import MyStatusBar from '../../components/MyStatusbar';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {useState} from 'react';
import axios from 'axios';
import HomeSimmer from '../../components/HomeSimmer';
import HomeHeader from '../../components/HomeHeader';
import {connect} from 'react-redux';
import * as UserActions from '../../redux/actions/CustomerActions';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { warnign_toast } from '../../components/MyToastMessage';
import { useTranslation } from 'react-i18next';
import Notifee, {
 
  AuthorizationStatus,
 
} from '@notifee/react-native';

const {width, height} = Dimensions.get('screen');

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const Home = props => {
  const [bannerData, setBannerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [astoListData, setAstroListData] = useState(false);
  const [astroListDataCall,setAstroListDataCall] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [livelist,setLivelist] = useState([]);

  const {t} = useTranslation();

  console.log('firebase id===>',props.customerData.id + props.firebaseId);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, [props.notificationData]);

  

  useEffect(() => {
    get_astrologer();
    get_banners();
    update_firebase();
    get_livelist();
    props.navigation.addListener('focus', () => {
      get_my_notifications();
    });
    checkNotificationPermission();
  }, []);

  async function checkNotificationPermission() {
    const settings = await Notifee.getNotificationSettings();
  
    if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
      console.log('Notification permissions has been authorized');
    } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
      console.log('Notification permissions has been denied');
      appSetting();
    }
  }

  const appSetting = () => {
    Alert.alert("Message","Please Go to Setting for Notification Permission",[
      {
        text:'OK',
        onPress: () => {
          Linking.openSettings();
        },
      },
    ]);
  }
  

  

  useFocusEffect(
    React.useCallback(() => {
      get_astrologer();
      get_banners();
      update_firebase();
      on_referesh();
    }, [])
  );

  const update_firebase = async() => {
    const dateNodeRefUser = database().ref(
      `/CurrentRequestUser/${props.customerData.id}`,
    );

    dateNodeRefUser
      .update({
        status: '',
      })
      .then(res => {
        console.log('updatedafadsf');
      })
      .catch(err => {
        console.log(err);
      });
  }

  const get_banners = async () => {
    await axios({
      method: 'get',
      url: base_url + user_get_banner,
    })
      .then(res => {
        setBannerData(res.data.data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_my_notifications = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_notifications,
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        let un_read = res.data.records.filter(item => item.read == 0);
        props.dispatch(UserActions.setNotifications(res.data.records));
        props.dispatch(UserActions.setNotificationCounts(un_read.length));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_livelist = async() => {
    setIsLoading(false);
    await axios({
      method: 'get',
      url: api_url + get_live_list,
    })
      .then(res => {
        
        setIsLoading(false);
        console.log(res.data);
        setLivelist(res.data.data);
        
      })
      .catch(err => {
    
        setIsLoading(false);
        console.log(err);
      });
  }

  const openYouTubeVideo = (youtubeLink) => {
    // Assuming the youtubeLink is a valid YouTube video URL
    Linking.openURL(youtubeLink);
  };

  const get_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setIsLoading(false);
        
        let records = res.data.records.filter(item=>item.astro_status != '')
        setAstroListData(records);

        let records1 = res.data.records.filter(item=>item.astro_status_call != '')
        setAstroListDataCall(records1);
        
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const astrologer_list = (item) => {
    props.navigation.navigate('astrologerList',{routename:item});
  };

  const redner_banner = ({index, item}) => {
    // console.log(item);
    return (
      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item.sub_cat_img}}
          style={{width: width * 0.95, height: width / 4, borderRadius: 10}}
          resizeMode="stretch"
        />
      </View>
    );
  };

  const on_referesh = async () => {
    setRefreshing(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setRefreshing(false);
        let records = res.data.records.filter(item=>item.astro_status != '')
        setAstroListData(records);

        let records1 = res.data.records.filter(item=>item.astro_status_call != '')
        setAstroListDataCall(records1);
        // console.log(records);
      })
      .catch(err => {
        setRefreshing(false);
        console.log(err);
      });
    setIsLoading(true);
    let data = new FormData();
    data.append('user_id', props.customerData.id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        setIsLoading(false);
        props.dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });

      //livelist
      setIsLoading(false);
    await axios({
      method: 'get',
      url: api_url + get_live_list,
    })
      .then(res => {
        
        setIsLoading(false);
        console.log(res.data);
        setLivelist(res.data.data);
        
      })
      .catch(err => {
    
        setIsLoading(false);
        console.log(err);
      });
  };

  
  console.log('tt ',getFontSize(1.2));
  

  const getStatusColor = (status) => {
    if (status === 'Online') {
      return colors.green_color2;
    } else if (status === 'Busy') {
      return colors.yellow_color1; // Change to the color you want for "Busy"
    } else {
      return colors.grey_color;
    }
  };

  //live list
  const renderItems = ({ item, index }) => {
    return item.current_status === 'Live' ? (
      <TouchableOpacity
        activeOpacity={0.9} // Set the active opacity level here
        onPress={() => live(item.live_id,item.user_id)}
        key={index}
        style={{
          flex: 0,
          width: width * 0.355,
          borderRadius: 5,
          marginVertical: 10,
          shadowColor: colors.black_color5,
          shadowOffset: { width: 2, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          zIndex: 100,
          marginHorizontal: 20,
        }}
      >
        <View style={{ borderRadius: 10, borderColor: '#ddd' }}>
          <View style={{}}>
            <Image
              source={{ uri: item.img_url }}
              style={{
                width: width * 0.35,
                height: width * 0.35,
                borderRadius: 10,
                borderWidth: 0.5,
                borderColor: colors.black_color8,
              }}
            />
            <View style={{}}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                  paddingRight: 10,
                  textAlign: 'center',
                }}
              >
                {item.owner_name}
              </Text>
              <View style={{
                flex: 0.9,
              }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: fonts.medium,
                    color: 'red',
                    textAlign: 'center',
                  }}
                >
                  {item.current_status}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ) : (
      <View style={{alignSelf:'center',marginHorizontal:width * 0.35,marginTop:10,marginBottom:10}}>
        <Text style={{color:'black'}}>No Videos available</Text>
      </View>
    );
  };

  const _listEmptyComponent = () => {
    return (
      <View style={{alignSelf:'center',marginTop:20,marginBottom:20,alignSelf:'center'}}>
        <Text style={{color:'#000',textAlign:'center',marginHorizontal:width * 0.35}}>No Videos Available</Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <HomeHeader navigation={props.navigation} />
        <View style={{backgroundColor:colors.background_theme5,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:15,
        paddingRight:15}}>
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.navigate('search')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 30,
              padding: 15,
            }}>
            <Ionicons
              name="search"
              color="darkgrey"
              size={17}
              style={{ marginRight: 5 }}
            />
            <Text style={{ color: 'grey' }}> Search Here</Text>
          </TouchableOpacity>
        </View>
       
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={on_referesh} />
          }>
            
          {bannerData && (
            <Carousel
              loop
              width={width}
              height={width / 3}
              autoPlay={true}
              data={bannerData}
              scrollAnimationDuration={1500}
              autoPlayInterval={5000}
              // onSnapToItem={index => console.log('current index:', index)}
              renderItem={redner_banner}
            />
          )}
          {/* <View>
          <Text style={{color:'black',marginHorizontal:10,fontSize:getFontSize(1.8)}}>Astrologer Live</Text>
          <FlatList
          data={livelist}
          renderItem={renderItems}
          keyExtractor={item => item.id}
          numColumns={1}
          ListEmptyComponent={_listEmptyComponent}
          showsVerticalScrollIndicator={false}
          horizontal
          centerContent={true}
          
        />
          </View> */}
          <ScrollView
            nestedScrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 5,
            }}>
              <View style={{alignContent:'center',alignSelf:'center'}}>
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => props.navigation.navigate('kundli')}
              style={styles.panchangContainer}>
                <View style={styles.panchangView}> 
                <Image
                source={require('../../assets/images/1.png')}
                style={styles.panchangImage}
              />
              <Text style={styles.punchangText}>{t("kundli")}</Text>
               
              </View>
              
            </TouchableOpacity>
            
            </View>
            <View>
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => props.navigation.navigate('matching')}
              style={styles.panchangContainer}>
                 <View style={styles.panchangView}>
              <Image
                source={require('../../assets/images/2.png')}
                style={styles.panchangImage}
              />
              <Text style={styles.punchangText}>{t("matching")}</Text>
              </View>
            </TouchableOpacity>
            </View>
            <View>
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => props.navigation.navigate('selectSign')}
              style={styles.panchangContainer}>
                <View style={styles.panchangView}>
              <Image
                source={require('../../assets/images/3.png')}
                style={styles.panchangImage}
              />
              <Text style={styles.punchangText}>{t("horoscope")}</Text>
             </View>
            </TouchableOpacity>
            
            </View>
          </ScrollView>
          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 15,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.6),
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              {t("call_astrologer")}{' '}
            </Text>
            <TouchableOpacity
            activeOpacity={0.8}
              onPress={() => astrologer_list('astroCallList')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                backgroundColor:colors.background_theme2,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.2),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                }}>
                {t("view_all")}
              </Text>
            </TouchableOpacity>
          </View>
          {isLoading && <HomeSimmer isLoading={false} />}

          {!isLoading && (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
              }}>
              {astroListDataCall &&
                astroListDataCall.map((item, index) => (
                  <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('astrologerDetailes', {
                      data: item,
                      type: 'call',
                    })
                  }
                  key={index}
                  style={{
                    flex: 0,
                    width: width * 0.45,
                    marginHorizontal: width * 0.025,
                    alignSelf: 'center',
                    backgroundColor: colors.white_color,
                    borderRadius: 5,
                    marginVertical: 10,
                    shadowColor: colors.black_color5,
                    shadowOffset: {width: 2, height: 1},
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    zIndex: 100,
                    borderWidth:1,
                    borderColor:'#ddd'
                  }}>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      backgroundColor: colors.background_theme5,
                     
                    }}>
                    <View
                      style={{
                        flex: 0.16,
                        overflow: 'hidden',
                        
                        zIndex: 10,
                      }}>
                      <Image
                        source={require('../../assets/images/icon/v.png')}
                        style={{width: width * 0.07, height: width * 0.07, marginTop: 10}}
                      />
                    </View>
                    <View style={{flex: 0.6}}>
                      <Image
                        source={{uri: item.image}}
                        style={{
                          width: width * 0.30,
                          height: width * 0.30,
                          borderWidth: 0,
                          borderColor: colors.black_color8,
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 2,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 1,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: 9,
                          color: colors.black_color,
                          fontFamily: fonts.medium,
          
                          textAlign: 'center',
                        }}>
                        {'\n'}
                        {`${parseFloat(item.avg_rating).toFixed(1)}`}
                      </Text>
                      {/* <Image
                        source={require('../assets/images/icon/star.png')}
                        style={{width: 12, height: 12, marginTop: 12}}
                      /> */}
                    </View>
                  </View>
                  <View style={{height: getFontSize(2.4)}}>
                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                        backgroundColor: colors.background_theme2,
                        paddingHorizontal: 10,
                        paddingVertical: 1,
                        position: 'relative',
                        bottom: 8,
                        padding: 5,
                        justifyContent:'center',
                        borderRadius:10
                      }}>
                      
                      <Text
                        style={{
                          fontSize: getFontSize(1.4),
                          fontFamily: fonts.medium,
                          color: colors.white_color,
                        }}>
                        Recommended
                      </Text>
                      {/* <View style={{...styles.triangleShape,position:'absolute',right:-8}}></View> */}
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0,
                      width: '80%',
                      alignSelf: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black_color9,
                        fontFamily: fonts.semi_bold,
                        textAlign: 'center',
                      }}>
                      {item.shop_name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: colors.black_color7,
                        fontFamily: fonts.medium,
                      }}>
                      {item.language.slice(0,15)}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.black_color9,
                        fontFamily: fonts.semi_bold,
                        textAlign: 'center',
                      }}>
                      {`Exp ${item.experience} Year`}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('astrologerDetailes', {
                          data: item,
                          type: 'call',
                        })
                      }
                      style={{
                        flex: 0,
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 2,
                        backgroundColor: colors.background_theme2,
                        marginVertical: 20,
                        borderRadius: 5,
                      }}>
                      <Ionicons
                        name="ios-call"
                        color={colors.background_theme1}
                        size={20}
                      />
                      <Text
                        style={{
                          fontSize: 9,
                          color: colors.background_theme1,
                          fontFamily: fonts.medium,
                          textDecorationLine: 'line-through',
                          marginLeft: 5,
                        }}>
                        {`₹ ${item.consultation_price}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.background_theme1,
                          fontFamily: fonts.medium,
                          marginLeft: 5,
                        }}>
                        {`₹ ${
                          parseFloat(item?.call_commission) +
                          parseFloat(item?.call_price_m)
                        }/min`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                ))}
            </ScrollView>
          )}

          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 15,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.6),
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              {t("chat_astrologer")}{' '}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => astrologer_list('astroChatList')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 3,
                
                backgroundColor: colors.background_theme2,
                borderRadius: 20,
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.2),
                  color: colors.white_color,
                  fontFamily: fonts.medium,
                  
                }}>
                {t("view_all")}
              </Text>
            </TouchableOpacity>
          </View>
          {isLoading && <HomeSimmer isLoading={false} />}

          {!isLoading && (
            <ScrollView
              horizontal
              nestedScrollEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 15,
              }}>
              {astoListData &&
                astoListData.map((item, index) => (
                  <TouchableOpacity
                  activeOpacity={0.8}
                    key={index}
                    onPress={() =>
                      props.navigation.navigate('astrologerDetailes', {
                        data: item,
                        type: 'chat',
                      })
                    }
                    style={{
                      width: width * 0.4,
                      height: width * 0.4,
                      borderRadius: 10,
                      marginHorizontal: 10,
                      backgroundColor: colors.background_theme2,
                      marginHorizontal: 10,
                      shadowColor: colors.black_color4,
                      shadowOffset: {
                        width: 2,
                        height: 1,
                      },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      
                      {item.offer_deal != '0' ? (
                        <View
                          style={{
                            flex: 0,
                            backgroundColor: colors.background_theme2,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'flex-start',
                            paddingHorizontal: 5,
                            borderTopLeftRadius:10,
                             
                          }}>
                          <Text
                          
                            style={{
                              fontSize: getFontSize(1.5),
                              color: colors.white_color,
                              fontFamily: fonts.medium,
                            }}>
                            {item.offer_deal}
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <Text></Text>
                          </View>
                      )}
                    </View>
                    <View style={styles.box}>
                    <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        top: -width * 0.08,
                      }}>
                      <View
                        style={{
                          backgroundColor:
                          getStatusColor(item.astro_status),
                          alignSelf: 'flex-end',
                          paddingHorizontal: 7,
                          borderRadius: 8,
                          position: 'relative',
                          top: width * 0.06,
                          right: width * 0.05,
                          zIndex: 2,
                        }}>
                        <Text
                          style={{
                            fontSize: 10,
                            color: colors.white_color,
                            fontFamily: fonts.medium,
                          }}>
                          {item.astro_status}
                        </Text>
                      </View>
                      <Image
                        source={{uri: item.image}}
                        style={{
                          width: width * 0.2,
                          height: width * 0.2,
                          borderRadius: (width * 0.22) / 2,
                          borderWidth: 1,
                          borderColor: colors.background_theme2,
                          alignSelf: 'center',
                          overflow: 'hidden',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flex: 0,
                        position: 'relative',
                        bottom: width * 0.01,
                        top:-30
                      }}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.6),
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          textAlign: 'center',
                        }}>
                        {item.owner_name}
                      </Text>
                      <View
                        style={{
                          flex: 0,
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 5,
                        }}>
                        <View
                          style={{
                            flex: 0.43,
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize:getFontSize(1.4),
                              color: colors.black_color6,
                              fontFamily: fonts.medium,
                            }}>
                            {`${parseFloat(item.avg_rating).toFixed(1)}/5`}
                          </Text>
                          <Image
                            source={require('../../assets/images/icon/star.png')}
                            style={{width: 15, height: 15}}
                          />
                        </View>
                        <View
                          style={{
                            width: 1,
                            height: 12,
                            backgroundColor: colors.black_color7,
                          }}
                        />
                        <View style={{flex: 0.5}}>
                          <Text
                            style={{
                              fontSize: getFontSize(1.2),
                              color: colors.red_color1,
                              fontFamily: fonts.medium,
                              textAlign: 'center',
                            }}>
                            {`Free ${item.free_minut} min`}
                          </Text>
                        </View>
                      </View>
                    </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}
          {/* <View style={{padding:10}}>
            <TouchableOpacity onPress={() => openYouTubeVideo('https://www.youtube.com/@AstroKunj')} activeOpacity={0.8}>
                <Image source={require('../../assets/images/follow-us-on-youtube.png')} style={{width:'100%',height:80,borderRadius:20}} />
                </TouchableOpacity>
          </View> */}
          {/* <View style={styles.info}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('Notes')}>
              <Image source={require('../../assets/images/icon/home_notes.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("daily")}</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('DownloadKundali')}>
              <Image source={require('../../assets/images/icon/download.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("free_pdf")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={() => props.navigation.navigate('birhatHoroscope')}>
              <Image source={require('../../assets/images/icon/astrology.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("birhat")}</Text>
              </TouchableOpacity>             
            </View>
            <View style={[styles.row,{}]}>
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('magazine')}>
              <Image source={require('../../assets/images/icon/book.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("magazine")}</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('religion')}>
              <Image source={require('../../assets/images/icon/pray.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("religion")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={() => props.navigation.navigate('remedies')}>
              <Image source={require('../../assets/images/icon/medicine.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("remedies")}</Text>
              </TouchableOpacity>             
            </View>
            <View style={[styles.row,{}]}>
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('DailyPanchang')}>
              <Image source={require('../../assets/images/icon/hinduism.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("daily_panchang")}</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.box2} onPress={() => openYouTubeVideo('https://www.youtube.com/@AstroKunjofficial')}>
              <Image source={require('../../assets/images/icon/youtube_1.png')} style={{width:60,height:60,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("youtube")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box2} onPress={()=> props.navigation.navigate('yellowBook')} >
              <Image source={require('../../assets/images/book1.png')} style={{width:80,height:70,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("yellow_book")}</Text>
              </TouchableOpacity>         
            </View>
            <View style={[styles.row1,{}]}>
            <TouchableOpacity style={styles.box2} onPress={() =>props.navigation.navigate('auspicions')} >
              <Image source={require('../../assets/images/muhurat.png')} style={{width:85,height:85,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("muhurat")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.box2,marginTop:0}} onPress={() => openYouTubeVideo('http://www.omshivmaa.blogspot.in')} >
              <Image source={require('../../assets/images/icon/blog1.png')} style={{width:55,height:55,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={{...styles.boxtext,marginTop:10}}>{t("oma")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.box2} onPress={() => props.navigation.navigate('askQuestion')} >
              <Image source={require('../../assets/images/ask_ques.png')} style={{width:100,height:90,alignSelf:'center',resizeMode:'contain'}}/>
              <Text style={styles.boxtext}>{t("ask_a_question")}</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </View>
  );
};

const coming = () => {
  warnign_toast('Comming Soon..');
}

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  panchangContainer: {
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: colors.background_theme5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {width: 2, height: 1},
    shadowColor: colors.black_color4,
    shadowOpacity: 0.3,
    marginHorizontal: 10,
    borderWidth:1,
    borderColor:colors.background_theme6
  },
  panchangView: {
    borderRadius:300,
    backgroundColor:colors.background_theme1,
    borderWidth:1,
    borderColor:colors.background_theme6,
    height:100,
    width:100,
    alignItems:'center',
    alignSelf:'center',
    justifyContent:'center'
  },
  panchangImage: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },

  punchangText: {
    fontSize: getFontSize(1.2),
    fontWeight:'bold',
    fontFamily: fonts.medium,
    marginTop: 4,
    color:'black',
    justifyContent:'center',
    alignSelf:'center'
  },
  box : {backgroundColor:colors.white_color,marginTop:20,borderWidth:1,borderColor:'orange',borderRadius:15,height:height * 0.14},
  box2: {
    alignSelf:'center',
    
  },
  boxtext: {
    textAlign:'center',
    fontSize:getFontSize(1.5),
    fontWeight:'bold',
    paddingTop:5,
 
  },
  row: {
    flexDirection:'row',
    padding:5,
    justifyContent:'space-around',
    alignItems:'center',
    alignContent:'center',
    borderBottomWidth: 1, // Add a border to the bottom of each row
    borderColor: '#dee2e6',
    marginTop:10,
    marginBottom:10
  },
  row1: {
    flexDirection:'row',
    padding:5,
    justifyContent:'space-around',
    alignItems:'center',
    alignContent:'center',
    marginTop:10,
    marginBottom:10
    
  },
  info: {
    borderWidth:1,
    borderColor:'#dee2e6',
    margin:10,
    borderRadius:20,
    marginBottom:20,
    

  },
  rectangle: {
    width: 100 * 2,
    height: 100,
    backgroundColor: "red",
  },
  triangleShape: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: getFontSize(1.8),
    borderTopWidth: getFontSize(1.8),
    borderRightColor: 'transparent',
    borderTopColor: 'white', // Change the color as needed
    transform: [{ rotate: '-45deg' }],
    alignItems:'center',
    alignSelf:"center",
    justifyContent:"center"
    
  }

});
