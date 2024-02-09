import { View, Text } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import { colors } from '../../config/Constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import KundliBirth from './KundliBirth';
import KundliPunchang from './KundliPunchang';

const Tab = createMaterialTopTabNavigator();

const ShowBasic = (props) => {
  console.log('basic');
    useEffect(() => {
        props.navigation.setOptions({
          headerShown: true,
          header: () => (
            <MyHeader
              title="Kundli"
              navigation={props.navigation}
              statusBar={{
                backgroundColor: colors.background_theme2,
                barStyle: 'light-content',
              }}
            />
          ),    });
      }, []);
  return (
    <Tab.Navigator>
      <Tab.Screen name="kundliBirthDetailes" component={KundliBirth} initialParams={{data: props.data}} />
      <Tab.Screen name="kundliPunchangDetailes" component={KundliPunchang} initialParams={{data: props.data}} />
    </Tab.Navigator>
  )
}

export default ShowBasic