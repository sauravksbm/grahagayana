import { View, Text } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import MyHeader from '../components/MyHeader';
import { colors,getFontSize } from '../config/Constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import KundliBirthDetailes from '../screens/customer/KundliBirthDetailes';
import KundliPunchangDetailes from '../screens/customer/KundliPunchangDetailes';
import { useTranslation } from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const ShowKundliBasic = (props) => {
  const {t} = useTranslation();
  console.log('basic');
    useEffect(() => {
        props.navigation.setOptions({
          headerShown: true,
          header: () => (
            <MyHeader
              title={t("kundli")}
              navigation={props.navigation}
              statusBar={{
                backgroundColor: colors.background_theme2,
                barStyle: 'light-content',
              }}
          
              id={props.data.kundali_id}
            />
          ),    });
      }, []);
  return (
    <Tab.Navigator>
      <Tab.Screen name="kundliBirthDetailes" component={KundliBirthDetailes} initialParams={{data: props.data}} />
      <Tab.Screen name="kundliPunchangDetailes" component={KundliPunchangDetailes} initialParams={{data: props.data}} />
    </Tab.Navigator>
  )
}

export default ShowKundliBasic

