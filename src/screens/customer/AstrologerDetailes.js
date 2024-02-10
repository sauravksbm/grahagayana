import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  // Modal,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_astrodetails,
  api_checkfollowing,
  api_follow,
  api_getastrochatstatus,
  api_url,
  base_url,
  colors,
  fonts,
  user_review,
  getFontSize
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { useState } from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import RenderHtml from 'react-native-render-html';
const { width, height } = Dimensions.get('screen');
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const AstrologerDetailes = props => {
  const { t } = useTranslation();
  const [purpose] = useState(props.route.params.type);
  const [astroData] = useState(props.route.params.data);
  const [isLoading, setIsLoading] = useState(false);
  const [astroDetailes, setAstroDetailes] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatStatus, setChatStaus] = useState(t("chat_now"));
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [isFollow, setIsfollow] = useState('0');
  const [follower, setFollower] = useState('0');



  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("astrologer_details")}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  const Link = () => {
    console.log(astroData.id);
    props.navigation.navigate('allRemedies', { astro: props.route.params.data })
  }

  useEffect(() => {
    if (purpose == 'chat') {
      check_status();
    }
    check_is_follow();
    get_astro_detailes();
    get_user_review();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (purpose == 'chat') {
        check_status();
      }
      check_is_follow();
      get_astro_detailes();
      get_user_review();
    }, [])
  );

  const get_astro_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: astroData?.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setAstroDetailes(res.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const check_status = async () => {
    console.log(astroData.id);
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_getastrochatstatus,
      data: {
        astro_id: astroData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        if (res.data.online) {
          setChatStaus(t("chat_now"));
        } else {
          setChatStaus(res.data.data.current_status);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const get_user_review = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: base_url + user_review + `id=${astroData?.id}&type=astrologer`,
    })
      .then(res => {
        console.log(res.data)
        setIsLoading(false);
        setReviewData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const priceString1 = `${purpose === 'chat' ? parseFloat(astroData.chat_price_m) + parseFloat(astroData.chat_commission) : parseFloat(astroData.call_price_m) + parseFloat(astroData.call_commission)}`;

  const check_wallet = () => {
    console.log(priceString1);
    const phone = props.customerData.phone;
    if (parseFloat(props.wallet) <= priceString1) {

      setWalletModalVisible(true);
    } else if (phone == 0) {
      Alert.alert('Message', 'Please update the customer account', [
        {
          text: 'OK',
          onPress: () => {
            props.navigation.navigate('customerAccount');
          },

        },
      ])

    } else {
      console.log('test');
      setModalVisible(true);
    }
  };

  const check_is_follow = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_checkfollowing,
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.records != null) {
          setIsfollow(res.data.records.status);
        } else {
          setIsfollow(0);
        }
        setFollower(res.data.counts);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const follow_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_follow,
      data: {
        user_id: props.customerData.id,
        astro_id: astroData.id,
        status: isFollow == '1' ? 0 : 1,
      },
    })
      .then(res => {
        setIsLoading(false);
        check_is_follow();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const startIndex = 0;
  const endIndex = 4;

  const priceString = `${purpose === 'chat' ? parseFloat(astroData.chat_price_m) + parseFloat(astroData.chat_commission) : parseFloat(astroData.call_price_m) + parseFloat(astroData.call_commission)}`;
  const slicedPrice = priceString.slice(startIndex, endIndex);
  console.log('astroData?.image:', astroData?.image, getFontSize(30));

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ flex: 1 }}>
        {astroDetailes && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                flex: 0,
                backgroundColor: colors.background_theme2,
                paddingTop: 10,
              }}>
              <View style={{ flexDirection: "column", justifyContent: 'center', alignItems: "center", }}>
                <Image
                  source={{ uri: astroData?.image }}
                  style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    borderWidth: 2,
                    borderRadius: (width * 0.25) / 2,
                    borderColor: colors.white_color,
                    position: 'relative',
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 4.65,
                  }}
                />
                <Text
                  style={{
                    fontSize: getFontSize(3.6),
                    color: colors.white_color,
                    fontFamily: fonts.bold,
                    textTransform: 'uppercase',
                    marginTop: 10
                  }}>
                  {astroData?.owner_name}
                </Text>
                <Text
                  style={{
                    fontSize: getFontSize(2.6),
                    color: colors.white_color,
                    fontFamily: fonts.light,
                    textTransform: 'uppercase',
                    marginTop: 8,
                    marginBottom: 10
                  }}>
                  {astroData?.owner_name}
                </Text>
              </View>
              <View style={{
                flex: 1,
                alignItems: 'center',
                zIndex: 1,
              }}>
                <View style={[styles.btn, {
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5, // For Android
                }]}>
                  <View style={styles.buttonContainer}>
                    <Image
                      source={require('../../assets/images/icon/language.png')}
                      style={styles.buttonImage}
                    />
                    <Text style={styles.buttonText}> {astroDetailes?.records[0]?.language}</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Image
                      source={require('../../assets/images/sidemenu/payment.png')}
                      style={styles.buttonImage}
                    />
                    <Text style={styles.buttonText}>{astroDetailes?.records[0]?.experience} Years of Experience</Text>
                  </View>
                  <View style={styles.buttonContainer}>
                    <Image
                      source={require('../../assets/images/sidemenu/payment.png')}
                      style={styles.buttonImage}
                    />
                    <Text style={styles.buttonText}>{astroDetailes?.records[0]?.experience} Years of Experience</Text>
                  </View>
                </View>
              </View>

              <View style={{
                // width: width * 0.8,
                // borderWidth: 0.4,
                borderTopLeftRadius: (width * 0.1) * 1,
                borderTopRightRadius: (width * 0.1) * 1,
                // height: 100,
                backgroundColor: colors.white_color,
                position: "relative",
                top: -60,
                paddingTop: 60,
                paddingLeft: 16
              }}>
                <Text
                  style={{
                    fontSize: getFontSize(2.7),
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                  }}>
                  {t("consulation_charge")}
                </Text>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.5),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      marginLeft: 5,
                      marginRight: 5
                    }}>
                    {`₹ ${slicedPrice}`}
                  </Text>
                  <Text
                    style={{
                      fontSize: getFontSize(1.5),
                      color: colors.red_color1,
                      fontFamily: fonts.medium,
                      textDecorationLine: 'line-through',
                    }}>
                    {`₹ ${astroDetailes?.records[0]?.consultation_price}/min`}
                  </Text>


                  <Image source={require('../../assets/images/offer.png')}
                    style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                </View>
                <Text
                  style={{
                    fontSize: getFontSize(1.6),
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                    fontWeight: 'bold'
                  }}>
                  {parseFloat(
                    astroDetailes?.records[0]?.avg_rating,
                  ).toPrecision(2)}

                </Text>
                <Rating
                  readonly={true}
                  count={5}
                  imageSize={getFontSize(1.5)}
                  startingValue={parseFloat(
                    astroDetailes?.records[0]?.avg_rating,
                  )}
                  showRating={false}
                  selectedColor={'#ff7b00'}
                  ratingColor={'#ff7b00'}
                  ratingBackgroundColor={'#ff7b00'}
                // style={{paddingVertical: 10}}
                />
                {/* <View
                  style={{
                    flex: 0,
                    width: width * 0.25,
                    height: width * 0.25,
                    borderRadius: (width * 0.25) / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: colors.background_theme1,
                    borderWidth: 1,
                    borderColor: colors.background_theme2,
                    position: 'relative',
                    top: 6,
                    right: 6,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.6),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      fontWeight: 'bold'
                    }}>
                    {parseFloat(
                      astroDetailes?.records[0]?.avg_rating,
                    ).toPrecision(2)}

                  </Text>
                  <Rating
                    readonly={true}
                    count={5}
                    imageSize={getFontSize(1.5)}
                    startingValue={parseFloat(
                      astroDetailes?.records[0]?.avg_rating,
                    )}
                    showRating={false}
                    selectedColor={'#ff7b00'}
                    ratingColor={'#ff7b00'}
                    ratingBackgroundColor={'#ff7b00'}
                  // style={{paddingVertical: 10}}
                  />
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      fontSize: getFontSize(2.3),
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                    marginBottom: 10,
                    marginTop:10
                    }}>
                    {t("about_astrologer")}
                  </Text>

                  <Text
                    style={{
                      fontSize: getFontSize(1.5),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      marginTop: 5,
                    }}>
                    <RenderHtml
                      contentWidth={getFontSize(30)}
                      source={{
                        html: `<div style="color: black; max-width: 320px;">${astroDetailes?.records[0]?.long_bio}</div>`,
                      }}
                    />
                  </Text>
                  <Image source={require('../../assets/images/4.png')}
                    style={{ width: 30, height: 30, marginRight: 40 }} />
                </View>
                <Text
                  style={{
                    fontSize: getFontSize(1.7),
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                  }}>
                  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
                  {/* {t("about_astrologer")} */}
                </Text>
                <Text
                  style={{
                    fontSize: getFontSize(2.3),
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                    marginBottom: 10,
                    marginTop:10
                  }}>
                  {t("Rating_reviews")}
                </Text>
                <Image source={require('../../assets/images/following.png')}
                    style={{ width: 25, height: 25, resizeMode: 'contain' }} />


                    
                {reviewData &&
                  reviewData.map((item, index) => (
                    <View style={{
                      borderRadius: 16,
                      backgroundColor: 'transparent',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      marginTop: 5
                    }}>
                      <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        overflow: 'hidden',
                        padding: 5
                      }}>
                        <View
                          key={index}
                          style={{ flex: 0, flexDirection: 'row', marginBottom: 15 }}>
                          <Image
                            source={item.user_profile_image != null ? { uri: item.user_profile_image } : require('../../assets/images/logo.png')}
                            style={{
                              width: width * 0.15,
                              height: width * 0.15,
                              borderWidth: 0.5,
                              borderColor: colors.background_theme2,
                              borderRadius: 5,
                            }}
                          />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text
                              style={{
                                fontSize: getFontSize(1.4),
                                color: colors.black_color,
                                fontFamily: fonts.semi_bold,
                              }}>
                              {item.username}

                            </Text>
                            <Text
                              style={{
                                // width: '40%',
                                fontSize: getFontSize(1.4),
                                color: colors.black_color7,
                                fontFamily: fonts.medium,
                              }}>
                              {item.rating_comment}
                            </Text>
                            <Rating
                              readonly={true}
                              count={5}
                              imageSize={getFontSize(1.6)}
                              startingValue={parseFloat(item.star).toFixed(1)}
                              ratingColor={colors.yellow_color1}
                              ratingBackgroundColor={colors.black_color4}
                              tintColor={colors.black_color1}
                              showRating={false}
                              selectedColor={colors.yellow_color1}
                              style={{ alignSelf: 'flex-start', marginTop: 5 }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                <View style={{ flex: 0, marginBottom: 15 }}>
                  {reviewData &&
                    reviewData.map((item, index) => (
                      <View style={{
                        borderRadius: 16,
                        backgroundColor: 'transparent',
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.22,
                        shadowRadius: 2.22,
                        elevation: 3,
                        marginTop: 5
                      }}>
                        <View style={{
                          backgroundColor: '#fff',
                          borderRadius: 16,
                          overflow: 'hidden',
                          padding: 5
                        }}>
                          <View
                            key={index}
                            style={{ flex: 0, flexDirection: 'row', marginBottom: 15 }}>
                            <Image
                              source={item.user_profile_image != null ? { uri: item.user_profile_image } : require('../../assets/images/logo.png')}
                              style={{
                                width: width * 0.15,
                                height: width * 0.15,
                                borderWidth: 0.5,
                                borderColor: colors.background_theme2,
                                borderRadius: 5,
                              }}
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <Text
                                style={{
                                  fontSize: getFontSize(1.4),
                                  color: colors.black_color,
                                  fontFamily: fonts.semi_bold,
                                }}>
                                {item.username}

                              </Text>
                              <Text
                                style={{
                                  // width: '40%',
                                  fontSize: getFontSize(1.4),
                                  color: colors.black_color7,
                                  fontFamily: fonts.medium,
                                }}>
                                {item.rating_comment}
                              </Text>
                              <Rating
                                readonly={true}
                                count={5}
                                imageSize={getFontSize(1.6)}
                                startingValue={parseFloat(item.star).toFixed(1)}
                                ratingColor={colors.yellow_color1}
                                ratingBackgroundColor={colors.black_color4}
                                tintColor={colors.black_color1}
                                showRating={false}
                                selectedColor={colors.yellow_color1}
                                style={{ alignSelf: 'flex-start', marginTop: 5 }}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                </View>

              </View>



              {/* <View
                style={{
                  flex: 0,
                  width: '80%',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  backgroundColor: colors.background_theme1,
                  borderRadius: 20,
                  paddingVertical: width * 0.08,
                  marginTop: 10,
                }}>
                <Image
                  source={{ uri: astroData?.image }}
                  style={{
                    width: width * 0.25,
                    height: width * 0.25,
                    borderWidth: 2,
                    borderRadius: (width * 0.25) / 2,
                    borderColor: colors.background_theme2,
                    position: 'relative',
                    // left: (-width * 0.25) / 2,
                    // marginLeft:10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.30,
                    shadowRadius: 4.65,
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    position: 'relative',
                    justifyContent: 'center',
                    left: (-width * 0.25) / 2.5,
                  }}>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <Ionicons
                      name="people-circle-sharp"
                      color={colors.black_color}
                      size={15}
                    />
                    <Text
                      style={{
                        width: '100%',
                        marginLeft: 5,
                        fontSize: getFontSize(1.4),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      {[
                        ...[
                          astroDetailes?.mainexpertise.map(item => item.name),
                        ],
                      ].join(',')}
                    </Text>
                  </View>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <MaterialCommunityIcons
                      name="google-translate"
                      color={colors.black_color}
                      size={15}
                    />
                    <Text
                      style={{
                        width: '100%',
                        marginLeft: 5,
                        fontSize: getFontSize(1.4),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      {astroDetailes?.records[0]?.language}
                    </Text>
                  </View>
                  <View
                    style={{ flex: 0, flexDirection: 'row', marginBottom: 2 }}>
                    <MaterialIcons
                      name="explicit"
                      color={colors.black_color}
                      size={15}
                    />
                    <Text
                      style={{
                        width: '100%',
                        marginLeft: 5,
                        fontSize: getFontSize(1.3),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      {`${t("experience")}: ${astroDetailes?.records[0]?.experience}-Years`}
                    </Text>
                  </View>
                </View>
              </View> */}
              {/* <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  position: 'relative',
                  bottom: 12,
                }}>
                <TouchableOpacity
                  style={{
                    flex: 0,
                    width: '30%',
                    paddingVertical: 2,
                    backgroundColor: colors.background_theme2,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.3),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    {t("today_deal")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={follow_astrologer}
                  style={{
                    flex: 0,
                    width: '30%',
                    paddingVertical: 2,
                    backgroundColor: colors.background_theme2,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.3),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    {isFollow == 1
                      ? `${t("following")} ${follower}`
                      : `${t("follow")} ${follower}`}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 0,
                    width: '30%',
                    paddingVertical: 2,
                    backgroundColor: colors.background_theme2,
                    borderRadius: 20,
                  }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.3),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    {t("special_offer")}
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
            <View
              style={{
                flex: 0,
                width: '95%',
                alignSelf: 'center',
                paddingVertical: 20,
                padding: 10,
                backgroundColor: 'white',
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }}>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 15,
                }}>
                {/* <View style={{ flex: 0.6 }}> */}
                  {/* <Text
                    style={{
                      fontSize: getFontSize(1.7),
                      color: colors.black_color,
                      fontFamily: fonts.bold,
                    }}>
                    {t("consulation_charge")}
                  </Text> */}
                  {/* <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}>
                    <Text
                      style={{
                        fontSize: getFontSize(1.5),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                        marginLeft: 5,
                        marginRight: 5
                      }}>
                      {`₹ ${slicedPrice}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: getFontSize(1.5),
                        color: colors.red_color1,
                        fontFamily: fonts.medium,
                        textDecorationLine: 'line-through',
                      }}>
                      {`₹ ${astroDetailes?.records[0]?.consultation_price}/min`}
                    </Text>


                    <Image source={require('../../assets/images/offer.png')}
                      style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                  </View> */}
                {/* </View> */}
                {/* <View
                  style={{
                    flex: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      flex: 0,
                      width: width * 0.25,
                      height: width * 0.25,
                      borderRadius: (width * 0.25) / 2,
                      backgroundColor: colors.background_theme2,
                    }}>
                    <View
                      style={{
                        flex: 0,
                        width: width * 0.25,
                        height: width * 0.25,
                        borderRadius: (width * 0.25) / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.background_theme1,
                        borderWidth: 1,
                        borderColor: colors.background_theme2,
                        position: 'relative',
                        top: 6,
                        right: 6,
                      }}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.6),
                          color: colors.black_color,
                          fontFamily: fonts.medium,
                          fontWeight: 'bold'
                        }}>
                        {parseFloat(
                          astroDetailes?.records[0]?.avg_rating,
                        ).toPrecision(2)}

                      </Text>
                      <Rating
                        readonly={true}
                        count={5}
                        imageSize={getFontSize(1.5)}
                        startingValue={parseFloat(
                          astroDetailes?.records[0]?.avg_rating,
                        )}
                        showRating={false}
                        selectedColor={'#ff7b00'}
                        ratingColor={'#ff7b00'}
                        ratingBackgroundColor={'#ff7b00'}
                      // style={{paddingVertical: 10}}
                      />
                    </View>
                  </View>
                </View> */}

              </View>
              {/* <View style={{ flex: 0, marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text
                    style={{
                      fontSize: getFontSize(1.7),
                      color: colors.black_color,
                      fontFamily: fonts.bold,
                    }}>
                    {t("about_astrologer")}
                  </Text>
                  <Image source={require('../../assets/images/4.png')}
                    style={{ width: 30, height: 30, marginRight: 40 }} />
                </View>

                <View style={{
                  borderRadius: 16,
                  backgroundColor: 'transparent',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.22,
                  shadowRadius: 2.22,
                  elevation: 3,
                  marginTop: 5
                }}>
                  <View style={{
                    backgroundColor: '#fff',
                    borderRadius: 16,
                    overflow: 'hidden',
                    padding: 5
                  }}>
                    <Text
                      style={{
                        fontSize: getFontSize(1.5),
                        color: colors.black_color8,
                        fontFamily: fonts.medium,
                        marginTop: 5,
                      }}>
                      <RenderHtml
                        contentWidth={getFontSize(30)}
                        source={{
                          html: `<div style="color: black; max-width: 320px;">${astroDetailes?.records[0]?.long_bio}</div>`,
                        }}
                      />
                    </Text>
                    <TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 14,
                      color: 'blue',
                      fontFamily: fonts.medium,
                      textDecorationLine: 'underline',
                    }}>
                    Read more
                  </Text>
                </TouchableOpacity>
                  </View>
                </View>

              </View> */}
              {/* <View style={{ flex: 0, marginBottom: 15 }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{ flex: 0.6 }}>
                    <Text
                      style={{
                        fontSize: getFontSize(1.7),
                        color: colors.black_color,
                        fontFamily: fonts.bold,
                      }}>
                      {t("remedies")}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.4,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      onPress={() => Link()}
                      style={{
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: colors.background_theme2,
                        borderRadius: 10,
                        alignSelf: 'flex-end',
                      }}>
                      <Text
                        style={{
                          fontSize: getFontSize(1.3),
                          color: colors.black_color8,
                          fontFamily: fonts.medium,
                        }}>
                        {t("view_all")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color7,
                    fontFamily: fonts.medium,
                    padding: 5,
                  }}>
                  No Remedies Available...
                </Text>
              </View> */}
              {/* <View style={{ flex: 0, marginBottom: 15 }}>
                <Text
                  style={{
                    fontSize: getFontSize(1.7),
                    color: colors.black_color,
                    fontFamily: fonts.bold,
                    marginBottom: 10,
                  }}>
                  {t("Rating_reviews")}
                </Text>
                {reviewData &&
                  reviewData.map((item, index) => (
                    <View style={{
                      borderRadius: 16,
                      backgroundColor: 'transparent',
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.22,
                      shadowRadius: 2.22,
                      elevation: 3,
                      marginTop: 5
                    }}>
                      <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        overflow: 'hidden',
                        padding: 5
                      }}>
                        <View
                          key={index}
                          style={{ flex: 0, flexDirection: 'row', marginBottom: 15 }}>
                          <Image
                            source={item.user_profile_image != null ? { uri: item.user_profile_image } : require('../../assets/images/logo.png')}
                            style={{
                              width: width * 0.15,
                              height: width * 0.15,
                              borderWidth: 0.5,
                              borderColor: colors.background_theme2,
                              borderRadius: 5,
                            }}
                          />
                          <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text
                              style={{
                                fontSize: getFontSize(1.4),
                                color: colors.black_color,
                                fontFamily: fonts.semi_bold,
                              }}>
                              {item.username}

                            </Text>
                            <Text
                              style={{
                                // width: '40%',
                                fontSize: getFontSize(1.4),
                                color: colors.black_color7,
                                fontFamily: fonts.medium,
                              }}>
                              {item.rating_comment}
                            </Text>
                            <Rating
                              readonly={true}
                              count={5}
                              imageSize={getFontSize(1.6)}
                              startingValue={parseFloat(item.star).toFixed(1)}
                              ratingColor={colors.yellow_color1}
                              ratingBackgroundColor={colors.black_color4}
                              tintColor={colors.black_color1}
                              showRating={false}
                              selectedColor={colors.yellow_color1}
                              style={{ alignSelf: 'flex-start', marginTop: 5 }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
              </View> */}
            </View>
            <Modal
              isVisible={modalVisible}
              deviceWidth={width}
              deviceHeight={Dimensions.get('window').height}
              backdropColor={colors.black_color}
              style={{ padding: 0, margin: 0 }}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 0,
                    width: '100%',
                    padding: 15,
                    backgroundColor: colors.background_theme1,
                    position: 'absolute',
                    bottom: 0,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ flex: 0, alignSelf: 'flex-end', padding: 5 }}>
                    <Ionicons
                      name="ios-close-outline"
                      color={colors.black_color}
                      size={getFontSize(2.4)}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 15,
                    }}>
                    <Text
                      style={{
                        flex: 0.8,
                        fontSize: getFontSize(1.7),
                        color: colors.black_color,
                        fontFamily: fonts.bold,
                      }}>
                      {t("balance")}
                    </Text>
                    <Text
                      style={{
                        flex: 0.6,
                        fontSize: getFontSize(1.7),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      ₹ {props.wallet}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 15,
                    }}>
                    <Text
                      style={{
                        flex: 0.8,
                        fontSize: getFontSize(1.7),
                        color: colors.black_color,
                        fontFamily: fonts.bold,
                      }}>
                      {t("max_time")}
                    </Text>
                    <Text
                      style={{
                        flex: 0.6,
                        fontSize: getFontSize(1.7),
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      {(
                        parseFloat(props.wallet) /
                        parseFloat(
                          purpose == 'chat'
                            ? parseFloat(astroData.chat_price_m) + parseFloat(astroData.chat_commission)
                            : parseFloat(astroData.call_price_m) + parseFloat(astroData.call_commission),
                        )
                      ).toFixed(0)}{' '}
                      Mins
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      if (purpose == 'chat') {
                        console.log('hiii');
                        props.navigation.navigate('chatIntakeForm', {
                          data: astroData,
                        });
                      } else {
                        props.navigation.navigate('callIntakeForm', {
                          data: astroData,
                        });
                      }
                    }}
                    style={{
                      flex: 0,
                      width: '100%',
                      marginVertical: 10,
                      alignSelf: 'center',
                      paddingVertical: 5,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-around',
                      backgroundColor: colors.background_theme2,
                      borderRadius: 20,
                    }}>
                    <MaterialIcons
                      name={purpose == 'chat' ? 'chat' : 'call'}
                      color={colors.background_theme1}
                      size={getFontSize(2.2)}
                    />
                    <Text
                      style={{
                        flex: 0.6,
                        fontSize: getFontSize(1.7),
                        color: colors.background_theme1,
                        fontFamily: fonts.bold,
                      }}>
                      {purpose == 'chat'
                        ? t("start_chat_session")
                        : t("start_call_session")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              isVisible={walletModalVisible}
              deviceWidth={width}
              deviceHeight={Dimensions.get('window').height}
              backdropColor={colors.black_color}
              style={{ padding: 0, margin: 0 }}
              onBackdropPress={() => setWalletModalVisible(false)}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flex: 0,
                    width: '90%',
                    backgroundColor: colors.background_theme2,
                    borderRadius: 10,
                  }}>
                  <View style={{ padding: 15, alignSelf: 'center' }}>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          flex: 0.9,
                          fontFamily: fonts.bold,
                          fontSize: getFontSize(1.7),
                          color: colors.background_theme1,
                        }}>
                        Insufficient Wallet Balance!!
                      </Text>
                      <TouchableOpacity
                        onPress={() => setWalletModalVisible(false)}
                        style={{ flex: 0, alignSelf: 'flex-end', padding: 5 }}>
                        <Ionicons
                          name="ios-close-outline"
                          color={colors.black_color}
                          size={getFontSize(2.5)}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flex: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 15,
                      }}>
                      <Text
                        style={{
                          flex: 0.8,
                          fontSize: getFontSize(1.7),
                          color: colors.white_color,
                          fontFamily: fonts.bold,
                        }}>
                        Current Balance
                      </Text>
                      <Text
                        style={{
                          flex: 0.6,
                          fontSize: getFontSize(1.7),
                          color: colors.background_theme1,
                          fontFamily: fonts.bold,
                        }}>
                        ₹ {props.wallet}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: getFontSize(1.5),
                        color: colors.black_color9,
                        fontFamily: fonts.medium,
                      }}>
                      You must have at least 3 minutes of talking time in your
                      wallet
                    </Text>
                    <Text
                      style={{
                        fontSize: getFontSize(1.8),
                        color: colors.black_color9,
                        fontFamily: fonts.bold,
                        marginVertical: 15,
                      }}>
                      Minimum wallet balance is required ₹ 12.0
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('wallet')}
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 15,
                      backgroundColor: colors.background_theme1,
                      paddingVertical: 10,
                    }}>
                    <Text
                      style={{
                        flex: 0.8,
                        fontSize: getFontSize(2.2),
                        color: colors.background_theme2,
                        fontFamily: fonts.bold,
                        textAlign: 'center',
                      }}>
                      Recharge
                    </Text>
                    <Text
                      style={{
                        flex: 0.6,
                        fontSize: 16,
                        color: colors.black_color,
                        fontFamily: fonts.medium,
                      }}>
                      2857 Mins
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        )}
      </View>
      <TouchableOpacity
        disabled={chatStatus == 'Busy At' || chatStatus == 'Offline'}
        onPress={() => check_wallet()}
        style={{
          flex: 0,
          width: '80%',
          padding: 2,
          alignSelf: 'center',
          marginVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          backgroundColor:
            chatStatus == 'Busy At'
              ? colors.yellow_color1
              : chatStatus == 'Offline' ? colors.black_color5 : colors.background_theme2,
          borderRadius: 25,
        }}>
        <Ionicons
          name={purpose == 'chat' ? 'ios-chatbubbles-sharp' : 'ios-call'}
          color={colors.white_color}
          size={getFontSize(2.2)}
        />
        <Text
          style={{
            flex: 0.5,
            fontSize: getFontSize(1.8),
            color: colors.background_theme1,
            fontFamily: fonts.medium,
            textAlign: 'center',
          }}>
          {purpose == 'chat' ? chatStatus : t('call_now')}
        </Text>
        <View style={{ flex: 0, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: getFontSize(1.4),
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
            {`₹ ${slicedPrice}`}
          </Text>
          <Text
            style={{
              fontSize: getFontSize(1.4),
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
            Per min
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstrologerDetailes);
const styles = StyleSheet.create({
  btn: {
    width: width * 0.8,
    borderWidth: 0.4,
    borderRadius: (width * 0.25) / 2,
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
    borderColor: colors.white_color,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background_theme2
  },
  buttonContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    paddingLeft: 30,
  },
  buttonImage: {
    width: width * 0.06,
    height: width * 0.06,
    tintColor: colors.white_color
  },
  buttonText: {
    fontSize: getFontSize(1.5),
    color: colors.white_color,
    fontFamily: fonts.semi_bold,
    marginLeft: 20,
  },

})
