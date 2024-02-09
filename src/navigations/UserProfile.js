import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import AboutProfile from '../screens/customer/AboutProfile';
import BirthChartProfile from '../screens/customer/BirthChartProfile';
import CompatibilityProfile from '../screens/customer/CompatibilityProfile';
import {colors, fonts} from '../config/Constants';

const Tab = createMaterialTopTabNavigator();

const UserProfile = props => {
  console.log(props.profileData)
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarLabelStyle: {
          fontSize: 13,
          fontFamily: fonts.medium,
          textTransform: 'capitalize',
        },
        tabBarGap: 0,
        tabBarStyle: {
          flex: 0,
          borderTopColor: colors.black_color4,
          borderBottomColor: colors.black_color4,
          borderTopWidth: 1,
          borderBottomWidth: 1,
        },
        tabBarItemStyle: {flex: 0, paddingHorizontal: 0, margin: 0},
        tabBarActiveTintColor: colors.background_theme2,
        tabBarInactiveTintColor: colors.black_color7,
      }}>
      <Tab.Screen
        name="aboutProfile"
        component={AboutProfile}
        initialParams={{
          profileData: props.profileData,
          setIsRaining: props.setIsRaining,
          setAboutModalVisible: props.setAboutModalVisible,
        }}
      />
      <Tab.Screen
        name="birthChartProfile"
        component={BirthChartProfile}
        initialParams={{
          profileData: props.profileData,
          setIsRaining: props.setIsRaining,
          setAboutModalVisible: props.setAboutModalVisible,
        }}
      />
      <Tab.Screen
        name="compatibilityProfile"
        component={CompatibilityProfile}
        initialParams={{
          profileData: props.profileData,
          setIsRaining: props.setIsRaining,
          setAboutModalVisible: props.setAboutModalVisible,
        }}
      />
    </Tab.Navigator>
  );
};

export default UserProfile;
