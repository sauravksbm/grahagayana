import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AstroCallList from '../screens/customer/AstroCallList';
import AstroChatList from '../screens/customer/AstroChatList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useEffect} from 'react';
import {colors, fonts} from '../config/Constants';
import LiveList from '../screens/provider/LiveList';
import CreateLive from '../screens/provider/CreateLive';
import MyHeader from '../components/MyHeader';
import { useTranslation } from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const Live = props => {
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title={t('live')}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),    });
  }, []);
  return (
    <Tab.Navigator
    screenOptions={
      { tabBarStyle: {backgroundColor: colors.background_theme2},
      tabBarLabelStyle: {fontFamily: fonts.medium},
      tabBarActiveTintColor:  colors.background_theme1,
      tabBarInactiveTintColor: colors.black_color2,
      tabBarIndicatorStyle: {backgroundColor: colors.background_theme1}
        
      }
    }>
      <Tab.Screen name="livelist" component={LiveList} />
      <Tab.Screen name="createlist" component={CreateLive} />
    </Tab.Navigator>
  );
};

export default Live;
