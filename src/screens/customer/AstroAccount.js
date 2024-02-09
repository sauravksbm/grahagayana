import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image as Img,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api2_myplans,
  api_url,
  colors,
  fonts,
  get_customer_date_profile,
} from '../../config/Constants';
import Octicons from 'react-native-vector-icons/Octicons';
import Svg, {Circle, G, Image, Text as T, Path} from 'react-native-svg';
import axios from 'axios';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import {connect} from 'react-redux';
import moment from 'moment';
import {basics_data} from '../../config/data';
const {width, height} = Dimensions.get('screen');

const radius = width * 0.22;
const percentage = 20;

const AstroAccount = props => {
  const strokeWidth = radius / 10;
  const circumference = 2 * Math.PI * radius;
  const progress = (circumference * percentage) / 100;
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [planData, setPlanData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="My Account"
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
    props.navigation.addListener('focus', () => {
      get_astrodate_profile();
      check_plans();
    });
  }, []);

  const check_plans = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_myplans,
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
          setIsPurchased(true);
          setPlanData(res.data.res[0]);
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
          setProfileData(profile);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0.35,
          backgroundColor: colors.background_theme3,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            props.navigation.navigate('astroDateRegister', {flag: 1})
          }
          style={{
            width: 35,
            height: 35,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: colors.background_theme2,
            borderRadius: 20,
            position: 'relative',
            top: 40,
            left: 45,
            zIndex: 1,
            shadowColor: colors.black_color7,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.3,
          }}>
          <Octicons name="pencil" color={colors.background_theme1} size={25} />
        </TouchableOpacity>
        <Svg width={2 * radius} height={2 * radius}>
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke={colors.black_color2}
            strokeWidth={strokeWidth}
            fill={colors.black_color}
          />
          <Circle
            cx={radius}
            cy={radius}
            r={radius - strokeWidth / 2}
            stroke={colors.background_theme2}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${progress} ${circumference}`}
            transform={`rotate(90 ${radius} ${radius})`}
            strokeLinecap="round"
            // transform={`rotate(-90 ${radius} ${radius}) translate(-${radius * 2}, 0)`}
          />

          <G>
            <Image
              x={radius / 2.8}
              y={radius / 2.8}
              width={radius * 1.2}
              height={radius * 1.2}
              preserveAspectRatio="xMidYMid slice"
              opacity="1"
              href={require('../../assets/images/logo.png')}
            />
          </G>
        </Svg>
        <View
          style={{
            backgroundColor: colors.background_theme2,
            paddingHorizontal: 15,
            borderRadius: 10,
            position: 'relative',
            bottom: 30,
            shadowColor: colors.black_color7,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.3,
          }}>
          <Text
            style={{
              fontSize: 18,
              color: colors.background_theme1,
              fontFamily: fonts.bold,
            }}>
            20% COMPLETE
          </Text>
        </View>
      </View>
      <View style={{flex: 0.7}}>
        <ScrollView contentContainerStyle={{paddingVertical: 15}}>
          {profileData && (
            <View style={{width: '95%', alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                }}>
                {props.customerData?.username}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                  marginTop: 5,
                }}>
                About Me
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color6,
                  fontFamily: fonts.medium,
                  marginVertical: 5,
                }}>
                {profileData?.short_bio}
              </Text>

              <Text
                style={{
                  fontSize: 18,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                  marginTop: 10,
                }}>
                Basics
              </Text>
              <View
                style={{
                  flex: 0,
                  width: '100%',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginBottom: 20,
                }}>
                {basics_data.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderRadius: 5,
                      borderWidth: 1,
                      borderColor: colors.black_color4,
                      padding: 5,
                      margin: 5,
                    }}>
                    <Img
                      source={item.img}
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.black_color7,
                        fontFamily: fonts.medium,
                        marginLeft: 5,
                      }}>
                      {item.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          {isPurchased ? (
            <>
              {planData && (
                <View style={{width: '95%', alignSelf: 'center'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.background_theme2,
                      fontFamily: fonts.bold,
                    }}>
                    Subscription Plan
                  </Text>
                  <View
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginVertical: 15,
                    }}>
                    <View style={styles.itemContainer}>
                      <View
                        style={{
                          flex: 0.4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          Like
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Img
                          source={require('../../assets/images/like.jpeg')}
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          {planData?.plan?.likes} Likes
                        </Text>
                      </View>
                    </View>
                    <View style={styles.itemContainer}>
                      <View
                        style={{
                          flex: 0.4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          Boost
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Img
                          source={require('../../assets/images/flash.jpeg')}
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          {planData?.plan?.boost} Boost
                        </Text>
                      </View>
                    </View>
                    <View style={styles.itemContainer}>
                      <View
                        style={{
                          flex: 0.4,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          Tenure
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Img
                          source={require('../../assets/images/tenure.jpeg')}
                          style={{
                            width: 25,
                            height: 25,
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                      <View
                        style={{
                          flex: 0.3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.background_theme2,
                            fontFamily: fonts.bold,
                          }}>
                          {planData?.plan?.days} Days
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{padding: 5}}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          flex: 0.5,
                          fontSize: 13,
                          color: colors.black_color7,
                          fontFamily: fonts.bold,
                        }}>
                        Plan Purchase Date:
                      </Text>
                      <Text
                        style={{
                          flex: 0.5,
                          fontSize: 11,
                          color: colors.black_color6,
                          fontFamily: fonts.medium,
                        }}>
                        {moment(planData?.purchase_details?.purchase_on).format(
                          'Do MMM YYYY hh:mm a',
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}>
                      <Text
                        style={{
                          flex: 0.5,
                          fontSize: 13,
                          color: colors.black_color7,
                          fontFamily: fonts.bold,
                        }}>
                        Plan Expiry Date:
                      </Text>
                      <Text
                        style={{
                          flex: 0.5,
                          fontSize: 11,
                          color: colors.black_color6,
                          fontFamily: fonts.medium,
                        }}>
                        {moment(planData?.purchase_details?.expire_on).format(
                          'Do MMM YYYY hh:mm a',
                        )}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.black_color6,
                      fontFamily: fonts.medium,
                    }}>
                    {planData?.plan?.description}
                  </Text>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('choosePlan')}
                    style={styles.button}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.background_theme1,
                        fontFamily: fonts.bold,
                        textAlign: 'center',
                      }}>
                      Update Plan
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <>
              <View style={{width: '90%', alignSelf: 'center'}}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                  }}>
                  You don't have any plan{'\n'}Please purchase
                </Text>
                <TouchableOpacity
                  onPress={() => props.navigation.navigate('choosePlan')}
                  style={styles.button}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.background_theme1,
                      fontFamily: fonts.bold,
                      textAlign: 'center',
                    }}>
                    Purchase Plan
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstroAccount);

const styles = StyleSheet.create({
  itemContainer: {
    width: width * 0.3,
    height: width * 0.35,
    backgroundColor: colors.background_theme1,
    shadowColor: colors.black_color5,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 10,
  },
  button: {
    flex: 0,
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background_theme2,
    marginTop: 25,
    paddingVertical: 10,
    borderRadius: 1000,
    shadowColor: colors.black_color7,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
