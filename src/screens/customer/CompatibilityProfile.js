import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from '../../config/Constants';
import {basics_data} from '../../config/data';
import ProfileBottomButtons from '../../components/ProfileBottomButtons';
import MyLoader from '../../components/MyLoader';
import { useState } from 'react';
import { connect } from 'react-redux';

const {width, height} = Dimensions.get('screen');

const CompatibilityProfile = props => {
    const [profileData] = useState(props.route.params.profileData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'Compatibility',
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
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color5,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            Verna{'\n'}
            <Text style={{color: colors.black_color9}}>60%</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color5,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            Gan{'\n'}
            <Text style={{color: colors.black_color9}}>90%</Text>
          </Text>
        </View>
        <View
          style={{
            width: width * 0.5,
            height: width * 0.5,
            alignSelf: 'center',
            borderRadius: 1000,
            overflow: 'hidden',
            marginVertical: 15,
          }}>
          <ImageBackground
            source={require('../../assets/images/chat_background.jpeg')}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            resizeMode="cover"></ImageBackground>
        </View>

        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color5,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            Verna{'\n'}
            <Text style={{color: colors.black_color9}}>60%</Text>
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color5,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            Gan{'\n'}
            <Text style={{color: colors.black_color9}}>90%</Text>
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

export default connect(mapStateToProps)(CompatibilityProfile);
