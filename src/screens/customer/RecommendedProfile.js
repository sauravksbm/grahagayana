import {
  View,
  Text,
  Touchable,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_url,
  base_url,
  colors,
  fonts,
  get_customer_date_profile,
  get_gifts,
  get_user_details,
  send_friend_request,
  send_gift,
  user_get_banner,
} from '../../config/Constants';
import {useState} from 'react';
import Carousel from 'react-native-reanimated-carousel';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import axios from 'axios';
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  info_toast,
  success_toast,
  warnign_toast,
} from '../../components/MyToastMessage';
import UserProfile from '../../navigations/UserProfile';
import {match_making} from '../../config/Constants';
import {connect} from 'react-redux';
import RainingFlowers from '../../components/RainingFlowers';
import MyLoader from '../../components/MyLoader';

const {width, height} = Dimensions.get('screen');

const RecommendedProfile = props => {
  const [profileData] = useState(props.route.params.profileData);
  const [bannerData] = useState(props.route.params.imageData);
  const [giftData, setGiftData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [giftItem, setGiftItem] = useState(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [isRaining, setIsRaining] = useState(false);
  const [selfAndUserData, setSelfAndUserData] = useState(null);
  console.log(profileData)
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={profileData.username}
          navigation={props.navigation}
          socialIcons={false}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    get_gift_data();
    get_profile_detailes();
    get_astrodate_profile();
  }, []);

  useEffect(() => {
    get_profile_detailes();
    if(isRaining){
      setTimeout(()=>{
        setIsRaining(false)
      },10000)
    }
  }, [isRaining]);

  const get_gift_data = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_gifts,
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          setGiftData(res.data.gifts);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const send_gift_data = async gift => {
    setIsLoading(true);
    setModalVisible(false);
    await axios({
      method: 'post',
      url: api_url + send_gift,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        another_user_id: profileData.user_id,
        user_id: props.customerData.id,
        gift_id: gift.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          setIsRaining(true)
          success_toast(res.data.msg);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_astrodate_profile = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_customer_date_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          let profile = res.data.profile;
          get_matching(profile);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_profile_detailes = async () => {
    setIsLoading(true);
    console.log( {
      user_id: profileData.user_id,
      self_user_id: props.customerData.id,
    })
    await axios({
      method: 'post',
      url: api_url + get_user_details,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: profileData.user_id,
        self_user_id: props.customerData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        if (res.data.status) {
          setSelfAndUserData(res.data);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_matching = async data => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + match_making,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        male_dob: data.dob,
        male_tob: data?.tob,
        male_lat: data?.tob,
        male_long: data?.longitude,
        female_dob: profileData?.dob,
        female_tob: profileData?.tob,
        female_lat: profileData?.latitude,
        female_long: profileData?.longitude,
      },
    })
      .then(res => {
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const sed_chat_request = async () => {
    if (!selfAndUserData?.request_send) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + send_friend_request,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.customerData.id,
          another_user_id: profileData.user_id,
        },
      })
        .then(res => {
          setIsLoading(false);
          console.log(res.data);
          success_toast('Request send...')
          get_profile_detailes();
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    } else {
      success_toast('Your requset is already send.');
      setTimeout(() => {
        if (selfAndUserData?.my_request_status == 0) {
          info_toast('Request accept in pending');
        } else if (selfAndUserData?.my_request_status == 0) {
          success_toast('Your request has been accepted.');
        } else {
          warnign_toast('Your request has been rejected.');
        }
      }, 3000);
    }
  };

  const redner_banner = ({index, item}) => {
    return (
      <View
        style={{
          flex: 1,
          // borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{uri: item.image}}
          style={{width: width * 0.95, height: height * 0.6, borderRadius: 10}}
          resizeMode="stretch"
        />
      </View>
    );
  };

  return (
    <GestureHandlerRootView
      style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={{flex: 1}}>
        {bannerData && (
          <Carousel
            // loop
            width={width}
            height={height * 0.6}
            // autoPlay={true}
            data={bannerData}
            scrollAnimationDuration={150}
            autoPlayInterval={5000}
            // onSnapToItem={index => console.log('current index:', index)}
            renderItem={redner_banner}
            style={{marginTop: height * 0.1}}
          />
        )}
        <View
          style={{
            width: width * 0.2,
            position: 'absolute',
            bottom: height * 0.1,
            left: 15,
          }}>
          {giftData &&
            giftData.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  setGiftItem(item);
                  setModalVisible(true);
                }}
                key={index}
                style={styles.docContainer}>
                <Image
                  source={
                    index == 0
                      ? require('../../assets/images/rose.jpeg')
                      : index == 1
                      ? require('../../assets/images/chocklate.jpeg')
                      : index == 2
                      ? require('../../assets/images/gift.jpeg')
                      : require('../../assets/images/baloon.jpeg')
                  }
                  style={{width: '100%', height: '100%'}}
                />
              </TouchableOpacity>
            ))}
        </View>
      </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginBottom: 10,
        }}>
        <View
          style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
          onPress={()=>{
            if(selfAndUserData?.like_count == 0){
              info_toast('No Like Found')
            }
          }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 12,
                color: colors.black_color9,
                fontFamily: fonts.medium,
                top: 5,
              }}>
              {selfAndUserData && selfAndUserData?.like_count}
            </Text>
            <Ionicons
              name="heart"
              color={
                selfAndUserData?.is_liked
                  ? colors.pink_color3
                  : colors.black_color8
              }
              size={width * 0.12}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => info_toast('Comming soon...')}
          style={{
            flex: 0.3,
            flexDirection: 'row',
            padding: 5,
            backgroundColor: colors.background_theme2,
            borderRadius: 10000,
            alignItems: 'center',
            justifyContent: 'space-around',
            height: width * 0.11,
          }}>
          <Ionicons
            name="call"
            color={colors.background_theme1}
            size={width * 0.06}
          />
          <Text
            style={{
              flex: 0.8,
              fontSize: 11,
              fontFamily: fonts.semi_bold,
              color: colors.background_theme1,
            }}>
            Call with Friends
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={sed_chat_request}
          style={{
            flex: 0.3,
            flexDirection: 'row',
            padding: 5,
            backgroundColor: colors.background_theme2,
            borderRadius: 10000,
            alignItems: 'center',
            height: width * 0.11,
            justifyContent: 'space-around',
          }}>
          <Ionicons
            name="chatbox-ellipses"
            color={colors.background_theme1}
            size={width * 0.06}
          />
          <Text
            style={{
              flex: 0.8,
              fontSize: 11,
              fontFamily: fonts.semi_bold,
              color: colors.background_theme1,
            }}>
            Requested
          </Text>
        </TouchableOpacity>
        <View
          style={{flex: 0.15, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => setAboutModalVisible(true)}
            style={{
              width: width * 0.11,
              height: width * 0.11,
              backgroundColor: colors.background_theme1,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: colors.black_color6,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
            <Ionicons
              name="md-arrow-up-circle-sharp"
              color={colors.black_color8}
              size={width * 0.1}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isRaining && <RainingFlowers />}

      <Modal
        isVisible={modalVisible}
        transparent
        style={{margin: 0, padding: 0}}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          onPressOut={() => setModalVisible(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.black_color9 + '90',
          }}>
          <View
            style={{
              flex: 0,
              width: '85%',
              backgroundColor: colors.background_theme1,
              borderRadius: 10,
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
              }}>
              Send Rose
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.medium,
                marginVertical: 15,
              }}>
              Gift Price ₹ {giftItem?.amount}
            </Text>
            <View
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                marginBottom: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  send_gift_data(giftItem);
                }}
                style={{
                  width: '40%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.background_theme2,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: '40%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  backgroundColor: colors.background_theme2,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal
        isVisible={aboutModalVisible}
        useNativeDriver={true}
        style={{padding: 0, margin: 0}}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setAboutModalVisible(false)}>
        <View
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: colors.background_theme1,
            paddingHorizontal: 5,
            paddingTop: 20,
            position: 'absolute',
            bottom: 0,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            height: height * 0.8,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              onPress={() => setAboutModalVisible(false)}
              style={{padding: 5}}>
              <AntDesign name="left" color={colors.black_color9} size={20} />
            </TouchableOpacity>
            <View style={{flex: 0.9, paddingLeft: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>{`${profileData?.username}, ${profileData?.age}`}</Text>
            </View>
          </View>
          <UserProfile
            profileData={profileData}
            setIsRaining={setIsRaining}
            setAboutModalVisible={setAboutModalVisible}
          />
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  notificationData: state.customer.notificationData,
});

export default connect(mapStateToProps, null)(RecommendedProfile);

const styles = StyleSheet.create({
  docContainer: {
    width: width * 0.12,
    height: width * 0.12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
});
