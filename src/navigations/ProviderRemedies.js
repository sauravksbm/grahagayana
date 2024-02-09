import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {useEffect} from 'react';
import {colors, fonts} from '../config/Constants';
import MyStatusBar from '../components/MyStatusbar';
import OpenKundli from '../screens/customer/OpenKundli';
import NewKundli from '../screens/customer/NewKundli';
import MyHeader from '../components/MyHeader';
import AllRemedies from '../screens/provider/AllRemedies';
import CreateRemedies from '../screens/provider/CreateRemedies';
import { useTranslation } from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const ProviderRemedies = (props) => {
  const {t} = useTranslation();
    useEffect(() => {
        props.navigation.setOptions({
          headerShown: true,
          header: () => (
            <MyHeader
              title={t("my_remedies")}
              socialIcons={false}
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
        screenOptions={{
            tabBarStyle: {backgroundColor: colors.background_theme2},
            tabBarLabelStyle: {fontFamily: fonts.medium},
            tabBarActiveTintColor:  colors.background_theme1,
            tabBarInactiveTintColor: colors.black_color2,
            tabBarIndicatorStyle: {backgroundColor: colors.background_theme1}
        }}
        >
          <Tab.Screen name="allRemedies" component={AllRemedies} />
          <Tab.Screen name="createRemedies" component={CreateRemedies} />
        </Tab.Navigator>
      );
    };

export default ProviderRemedies