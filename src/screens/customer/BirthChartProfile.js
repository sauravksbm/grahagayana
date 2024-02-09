import {View, Text, ScrollView, Image, Dimensions} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from '../../config/Constants';
import ProfileBottomButtons from '../../components/ProfileBottomButtons';
import MyLoader from '../../components/MyLoader';
import { useState } from 'react';
import { connect } from 'react-redux';

const {width, height} = Dimensions.get('screen');

const BirthChartProfile = props => {
    const [profileData] = useState(props.route.params.profileData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'Birth Chart',
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.black_color1,
        paddingHorizontal: 15,
      }}>
         <MyLoader isVisible={isLoading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingVertical: 10}}>
        <View
          style={{
            flex: 0,
            width: '65%',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.background_theme2,
            borderRadius: 1000,
            alignSelf: 'center',
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: colors.background_theme2,
            marginVertical: 10,
          }}>
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
              }}>
              Basic
            </Text>
          </View>
          <View
            style={{
              flex: 0.5,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 14,
              backgroundColor: colors.background_theme1,
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.medium,
              }}>
              Advance
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 16,
            color: colors.black_color9,
            fontFamily: fonts.bold,
            textAlign: 'center',
            marginVertical: 15,
          }}>
          Sun Sign in Pisces
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: colors.background_theme2,
            fontFamily: fonts.bold,
            marginVertical: 5,
            textAlign: 'center',
          }}>
          The Zodiac Sign of a person according to their birth date
        </Text>

        <View
          style={{
            flex: 0,
            backgroundColor: colors.background_theme3,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: colors.background_theme2,
            padding: 10,
            marginBottom: 30,
          }}>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: colors.background_theme2,
            }}>
            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderColor: colors.background_theme2,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                POLARITY {'\n'}
                <Text style={{fontSize: 15}}>Feminine</Text>
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                ELEMENT{'\n'} <Text style={{fontSize: 15}}>water</Text>
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: colors.background_theme2,
            }}>
            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
                borderRightWidth: 1,
                borderColor: colors.background_theme2,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                MODALITY{'\n'} <Text style={{fontSize: 15}}>mutable</Text>
              </Text>
            </View>
            <View
              style={{
                flex: 0.5,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 20,
                paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                RULING PLANET{'\n'} <Text style={{fontSize: 15}}>jupiter</Text>
              </Text>
            </View>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color9,
              fontFamily: fonts.medium,
              textAlign: 'center',
              marginTop: 15,
            }}>
            GENERAL COMPATIBILITY{'\n'}{' '}
            <Text style={{fontSize: 15}}>virgo</Text>
          </Text>
        </View>

        <View style={{marginBottom: 10}}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme2,
              fontFamily: fonts.semi_bold,
              marginBottom: 5,
            }}>
            POSITIVE TRAITS KEYWORDS
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              marginBottom: 10,
            }}>
            Empathic, Humble, Adaptable, Receptive
          </Text>
        </View>
        <View style={{marginBottom: 20}}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme2,
              fontFamily: fonts.semi_bold,
              marginBottom: 5,
            }}>
            NEGATIVE TRAITS KEYWORDS
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              marginBottom: 10,
            }}>
            Careless, Weak, Will, Vague
          </Text>
        </View>
        <ProfileBottomButtons
          setIsLoading={setIsLoading}
          user_id={props.customerData.id}
          another_user_id={profileData?.user_id}
          setIsRaining={props.route.params.setIsRaining}
          setAboutModalVisible={props.route.params.setAboutModalVisible}
        />
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });

export default connect(mapStateToProps, null)(BirthChartProfile);
