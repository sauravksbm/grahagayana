import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, fonts,getFontSize} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';
const Setting = props => {
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("setting")}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={()=>props.navigation.navigate('customerAccount')}
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: colors.background_theme1,
            borderRadius: 10,
            height: getFontSize(6),
            shadowColor: colors.black_color5,
            shadowOffset: {width: 1, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 5,
          }}>
          <MaterialCommunityIcons
            name="card-account-details"
            color={colors.background_theme2}
            size={getFontSize(3)}
          />
          <Text
            style={{
              flex: 0.7,
              fontSize: getFontSize(1.8),
              color: colors.black_color8,
              fontFamily: fonts.semi_bold,
            }}>
            {t("update_your")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Setting;
