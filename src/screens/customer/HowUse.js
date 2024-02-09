import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import { colors, fonts,getFontSize } from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
const HowUse = (props) => {
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      title: t("How"),
      headerTintColor: colors.background_theme1,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
      },
      headerTitleStyle: {
        fontSize:getFontSize(1.8)
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
            size={getFontSize(2.2)}
          />
        </TouchableOpacity>
      ),
      // headerRight: () => (
      //   <TouchableOpacity disabled>
      //   <MaterialCommunityIcons name='gesture-tap-button' color={colors.background_theme1} size={30} />
      //   </TouchableOpacity>
      // ),
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flex: 0, width: '93%', alignSelf: 'center', padding: 15, backgroundColor: colors.background_theme2, borderRadius: 10}}>
      <TouchableOpacity onPress={() => props.navigation.navigate('HowToScreenshots')}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, backgroundColor: colors.background_theme1, borderWidth: 1, borderRadius: 10, borderColor: colors.black_color8, marginBottom: 15}}>
            <MaterialCommunityIcons name='file-image' color={colors.black_color8} size={getFontSize(2.8)} />
            <Text style={{fontSize: getFontSize(1.7), color: colors.black_color8, fontFamily: fonts.medium, marginLeft: 10}}>{t("screenshots")}</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.navigation.navigate('HowToVideo')}>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, backgroundColor: colors.background_theme1, borderWidth: 1, borderRadius: 10, borderColor: colors.black_color8,}}>
            <MaterialCommunityIcons name='file-video' color={colors.black_color8} size={getFontSize(2.8)} />
            <Text style={{fontSize: getFontSize(1.7), color: colors.black_color8, fontFamily: fonts.medium, marginLeft: 10}}>{t("app_video")}</Text>
        </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default HowUse 