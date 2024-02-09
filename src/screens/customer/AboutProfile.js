import {View, Text, ScrollView, Image, Dimensions} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from '../../config/Constants';
import {basics_data} from '../../config/data';
import ProfileBottomButtons from '../../components/ProfileBottomButtons';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const AboutProfile = props => {
  const [profileData] = useState(props.route.params.profileData);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'About',
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
        <Text
          style={{
            fontSize: 18,
            color: colors.black_color8,
            fontFamily: fonts.medium,
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
          I am good Girl
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
              <Image
                source={item.img}
                style={{width: 15, height: 15, resizeMode: 'contain'}}
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

export default connect(mapStateToProps, null)(AboutProfile);
