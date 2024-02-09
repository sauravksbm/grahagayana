import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {
  about_friend,
  api2_all_users,
  api2_is_customer_register,
  api_url,
  base_url,
  boost_profile,
  colors,
  fonts,
  user_get_banner,
} from '../../config/Constants';
import {useEffect} from 'react';
import HomeHeader from '../../components/HomeHeader';
import TypingAnimation from '../../components/TypingAnimation';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-reanimated-carousel';
import MyLoader from '../../components/MyLoader';
import Modal from 'react-native-modal';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import {useRef} from 'react';

const {width, height} = Dimensions.get('screen');

const fadeData = [
  "Ready to find your perfect match? Let's get started!",
  'Looking for Love?" Our app has got you covered!',
  'Find the love of your life with just a swipe.',
  'Join our dating community and discover your soulmate.',
  "Swipe right to find the one you've been looking for.",
  'Are you ready for your next great adventure? Fint it here.',
  'Join our app and start your journey to love today.',
  'Find someone special with just a tap of your finger.',
  "Looking for something real? You've come to the right place.",
  'Love is just a swipe away. Are you ready to find it?',
]; // Array of items

const AstroDate = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegiser] = useState(false);
  const [bannerData, setBannerData] = useState(null);
  const [isRender, setIsRender] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // Index of current item
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      is_register();
    });
  }, []);

  useEffect(() => {
    const fadeInOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500, // Fade-in duration (0.5 seconds)
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500, // Fade-out duration (0.5 seconds)
            useNativeDriver: true,
          }).start(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % fadeData.length); // Move to the next item
          });
        }, 5000); // Delay before transitioning to the next item (2 seconds)
      });
    };

    fadeInOut(); // Start the fade-in and fade-out animation

    return () => {
      fadeAnim.setValue(0); // Reset the animation value on unmounting
    };
  }, [currentIndex]);

  const get_banners = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_all_users,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setBannerData(shuffleArray(res.data.users));
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const is_register = async () => {
    setIsLoading(false);
    await axios({
      method: 'post',
      url: api_url + api2_is_customer_register,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.msg == 'already register') {
          setIsRegiser(true);
          get_banners();
        }
        // get_banners();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const boost_your_profile = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + boost_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setModalVisible(false);
        setIsLoading(false);
        if (res.data.status) {
          success_toast(res.data.msg);
        } else {
          warnign_toast(res.data.msg);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_friends_detailes = async(friend_id)=>{
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + about_friend,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        user_id: props.customerData.id,
        friend_id: friend_id
      }
    }).then(res=>{
      setIsLoading(false)
      if(res.data.status){
        props.navigation.navigate('recommendedProfile', {profileData: res.data.details, imageData: res.data.image})
      }
    }).catch(err=>{
      setIsLoading(false)
      console.log(err)
    })
  }

  const redner_banner = ({index, item}) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={()=>get_friends_detailes(item.user_id)}>
          <Image
            source={{uri: item.image}}
            style={{
              width: width * 0.8,
              height: height * 0.42,
              borderRadius: 10,
            }}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <HomeHeader navigation={props.navigation} />
      <MyLoader isVisible={isLoading} />
      {!isRegister ? (
        <View style={{flex: 1, paddingVertical: 15}}>
          <View
            style={{
              flex: 0,
              alignSelf: 'center',
              width: height * 0.2,
              height: height * 0.2,
              backgroundColor: colors.black_color,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              borderWidth: 5,
              borderColor: colors.background_theme1,
              shadowColor: colors.black_color6,
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.3,
              shadowRadius: 10,
              marginBottom: 20,
            }}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{
                width: height * 0.15,
                height: height * 0.15,
                resizeMode: 'contain',
              }}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              maxHeight: height * 0.3,
              width: '90%',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                color: colors.background_theme2,
                fontFamily: fonts.bold,
                textAlign: 'center',
                marginBottom: 20,
              }}>
              AstroDate
            </Text>
            {/* <TypingAnimation text={typing_text} /> */}
            <Animated.View
              style={{
                opacity: fadeAnim, // Apply opacity animation
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.black_color9,
                  fontFamily: fonts.bold,
                  textAlign: 'center',
                }}>
                {fadeData[currentIndex]}
              </Text>
            </Animated.View>
          </ScrollView>
          <View
            style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('astroDateRegister')}
              style={{
                flex: 0,
                width: width * 0.8,
                backgroundColor: colors.background_theme2,
                alignSelf: 'center',
                paddingVertical: 10,
                borderRadius: 1000,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.bold,
                  textAlign: 'center',
                }}>
                CONTINUE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            paddingVertical: 15,
            backgroundColor: colors.background_theme2,
          }}>
          <View style={{flex: 1, width: '90%', alignSelf: 'center'}}>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setBannerData(prev => shuffleArray(prev)),
                    setIsRender(prev => !prev);
                }}
                style={{padding: 5}}>
                <Ionicons
                  name="ios-refresh"
                  color={colors.background_theme1}
                  size={25}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('astroAccount')}
                style={{padding: 5}}>
                <Ionicons
                  name="person-circle"
                  color={colors.background_theme1}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.95,
                backgroundColor: colors.background_theme1,
                borderRadius: 10,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              {bannerData && (
                <Carousel
                  loop
                  width={width * 0.8}
                  height={height * 0.45}
                  autoPlay={false}
                  data={bannerData}
                  scrollAnimationDuration={100}
                  autoPlayInterval={5000}
                  renderItem={redner_banner}
                  style={{alignSelf: 'center'}}
                />
              )}
              <TouchableOpacity
                onPress={get_banners}
                style={{
                  flex: 0,
                  width: width * 0.78,
                  backgroundColor: colors.background_theme2,
                  alignSelf: 'center',
                  paddingVertical: 10,
                  justifyContent: 'center',
                  borderRadius: 1000,
                  marginTop: height * 0.02,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Reshuffles Cards
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 0,
                  width: width * 0.78,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('connectWithFriends')
                  }
                  style={{
                    flex: 0,
                    width: width * 0.38,
                    backgroundColor: colors.background_theme2,
                    alignSelf: 'center',
                    paddingVertical: 10,
                    justifyContent: 'center',
                    borderRadius: 1000,
                    marginTop: height * 0.02,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.background_theme1,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    Find Friend
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    flex: 0,
                    width: width * 0.38,
                    backgroundColor: colors.background_theme2,
                    alignSelf: 'center',
                    paddingVertical: 10,
                    justifyContent: 'center',
                    borderRadius: 1000,
                    marginTop: height * 0.02,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.background_theme1,
                      fontFamily: fonts.medium,
                      textAlign: 'center',
                    }}>
                    Boost Profile
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        style={{padding: 0, margin: 0}}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            width: '90%',
            alignSelf: 'center',
            paddingVertical: 10,
            backgroundColor: colors.background_theme1,
            borderRadius: 10,
          }}>
          <View
            style={{
              flex: 0,
              width: '70%',
              alignSelf: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
              }}>
              AstroDate
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
                marginTop: 15,
              }}>
              Are you sure want to Boost Your profle?
            </Text>
            <View
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginVertical: 20,
              }}>
              <TouchableOpacity
                onPress={boost_your_profile}
                style={{
                  width: '45%',
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 6,
                  borderRadius: 1000,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: '45%',
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 6,
                  borderRadius: 1000,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstroDate);
