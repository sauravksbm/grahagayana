import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  // Modal,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
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
  img_url,
  user_review,
  getFontSize
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Rating, AirbnbRating} from 'react-native-ratings';
import {useState} from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import RenderHtml from 'react-native-render-html';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');
const ProviderProfile = props => {
  const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [astroDetailes, setAstroDetailes] = useState(null);
    const [reviewData, setReviewData] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [chatStatus, setChatStaus] = useState('Chat Now');
    const [walletModalVisible, setWalletModalVisible] = useState(false);
    const [isFollow, setIsfollow] = useState('0');
    const [follower, setFollower] = useState('0');
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("astrologer_details")}
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
    get_astro_detailes();
    get_user_review();
  }, []);

  const get_astro_detailes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrodetails,
      data: {
        id: props.providerData.id,
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
  const get_user_review = async () => {
    setIsLoading(true);
    await axios({
      method: 'get',
      url: base_url + user_review + `id=${props.providerData.id}&type=astrologer`,
    })
      .then(res => {
        setIsLoading(false);
        setReviewData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const startIndex = 0;
  const endIndex = 4;

  const priceString = `${parseFloat(astroDetailes?.records[0]?.chat_price_m) + parseFloat(astroDetailes?.records[0]?.chat_commission) }`;
  const slicedPrice = priceString.slice(startIndex, endIndex);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
    <MyLoader isVisible={isLoading} />
    <View style={{flex: 1}}>
      {astroDetailes && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 0,
              backgroundColor: colors.black_color,
              paddingHorizontal: 15,
              paddingTop: 15,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.6),
                color: colors.white_color,
                fontFamily: fonts.bold,
                textTransform: 'uppercase',
              }}>
              {astroDetailes.records[0]?.owner_name}
            </Text>
            <View
              style={{
                flex: 0,
                width: '80%',
                alignSelf: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                backgroundColor: colors.background_theme1,
                borderRadius: 20,
                paddingVertical: width * 0.08,
                marginTop: 15,
              }}>
              <Image
                source={{uri: astroDetailes.records[0]?.image}}
                style={{
                  width: width * 0.25,
                  height: width * 0.25,
                  borderWidth: 1,
                  borderRadius: (width * 0.25) / 2,
                  borderColor: colors.background_theme2,
                  position: 'relative',
                  left: (-width * 0.25) / 2,
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
                  style={{flex: 0, flexDirection: 'row', marginBottom: 2}}>
                  <Ionicons
                    name="people-circle-sharp"
                    color={colors.black_color}
                    size={getFontSize(2)}
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
                  style={{flex: 0, flexDirection: 'row', marginBottom: 2}}>
                  <MaterialCommunityIcons
                    name="google-translate"
                    color={colors.black_color}
                    size={getFontSize(2)}
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
                  style={{flex: 0, flexDirection: 'row', marginBottom: 2}}>
                  <MaterialIcons
                    name="explicit"
                    color={colors.black_color}
                    size={getFontSize(2)}
                  />
                  <Text
                    style={{
                      width: '100%',
                      marginLeft: 5,
                      fontSize: getFontSize(1.4),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                    }}>
                    {`${t('experience')}: ${astroDetailes?.records[0]?.experience}-Years`}
                  </Text>
                </View>
              </View>
            </View>
            <View
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
                    fontSize: getFontSize(1.4),
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  {t("today_deal")}
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
                    fontSize: getFontSize(1.4),
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  {t('special_offer')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              paddingVertical: 20,
            }}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 15,
              }}>
              <View style={{flex: 0.6}}>
                <Text
                  style={{
                    fontSize: getFontSize(1.8),
                    color: colors.background_theme2,
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
                      fontSize: getFontSize(1.4),
                      color: colors.red_color1,
                      fontFamily: fonts.medium,
                      textDecorationLine: 'line-through',
                    }}>
                    {`₹ ${astroDetailes?.records[0]?.consultation_price}/min`}
                  </Text>
                  <Text
                    style={{
                      fontSize: getFontSize(1.4),
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                      marginLeft: 10,
                    }}>
                    {`₹ ${
                      slicedPrice
                    }/min`}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                    <MaterialIcons name='verified' color={colors.green_color2} size={22} />
                 <Text style={{fontSize: 14, color: colors.background_theme2, fontFamily: fonts.bold, marginTop: 5}}>{t('verified')}</Text>
              </View>
            </View>
            <View style={{flex: 0, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.8),
                  color: colors.background_theme2,
                  fontFamily: fonts.bold,
                }}>
                {t('about_astrologer')}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.2),
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                  marginTop: 5,
                }}>
                <RenderHtml
                      contentWidth={320}
                      source={{
                        html: `<div style="color: black; max-width: 320px;">${astroDetailes?.records[0]?.long_bio}</div>`,
                      }}
                    />
              </Text>
              <TouchableOpacity>
                {/* <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme2,
                    fontFamily: fonts.medium,
                    textDecorationLine: 'underline',
                  }}>
                  {t('read_more')}
                </Text> */}
              </TouchableOpacity>
            </View>
            <View style={{flex: 0, marginBottom: 15}}>
              <Text
                style={{
                  fontSize: getFontSize(1.8),
                  color: colors.background_theme2,
                  fontFamily: fonts.bold,
                  marginBottom: 10,
                }}>
                {t('rating_and_review')}
              </Text>
              {reviewData &&
                reviewData.map((item, index) => (
                  <View
                  key={index}
                  style={{flex: 0, flexDirection: 'row', marginBottom: 15}}>
                  <Image
                    source={item.user_profile_image != null ? {uri: item.user_profile_image} : require('../../assets/images/logo.png')}
                    style={{
                      width: width * 0.15,
                      height: width * 0.15,
                      borderWidth: 0.5,
                      borderColor: colors.background_theme2,
                      borderRadius: 5,
                    }}
                  />
                  <View style={{flex: 1, marginLeft: 10}}>
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
                      imageSize={getFontSize(1.8)}
                      startingValue={parseFloat(item.star).toFixed(1)}
                      ratingColor={colors.yellow_color1}
                      ratingBackgroundColor={colors.black_color4}
                      tintColor={colors.black_color1}
                      showRating={false}
                      selectedColor={colors.yellow_color1}
                      style={{alignSelf: 'flex-start', marginTop: 5}}
                    />
                  </View>
                </View>
                ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(ProviderProfile);
