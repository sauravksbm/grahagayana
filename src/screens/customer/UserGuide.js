import {View, Text, TouchableOpacity, Image, Linking} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';

const UserGuide = props => {
  useEffect(() => {
    props.navigation.setOptions({
      title: 'User Guide(FAQs)',
      headerTintColor: colors.background_theme1,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{flex: 0}}>
          <AntDesign
            name="arrowleft"
            color={colors.background_theme1}
            size={25}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity>
          <Image
            source={require('../../assets/images/faqs_icon.png')}
            style={{width: 30, height: 30}}
          />
        </TouchableOpacity>
      ),
    });
  }, []);


const openWhatsApp = () => {
    const phoneNumber = '+919319727430'; // Replace with the user's phone number
  
    // Create the WhatsApp URL with the phone number
    const url = `whatsapp://send?text=&phone=${phoneNumber}`;
  
    // Open the WhatsApp URL
    Linking.openURL(url).catch((error) => console.log('Error opening WhatsApp: ', error));
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <View style={{flex: 1}}></View>
      <TouchableOpacity
        onPress={openWhatsApp}
        style={{
          flex: 0,
          width: '95%',
          marginBottom: 10,
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1000,
          backgroundColor: colors.background_theme2,
          paddingVertical: 5,
        }}>
        <Text
          style={{
            fontSize: 14,
            color: colors.background_theme1,
            fontFamily: fonts.semi_bold,
          }}>
          Chat With Support Team
        </Text>
        <Image
          source={require('../../assets/images/whatsapp_logo.png')}
          style={{width: 30, height: 30, marginLeft: 10}}
        />
      </TouchableOpacity>
    </View>
  );
};

export default UserGuide;
