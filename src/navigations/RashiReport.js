import {View, Text,ScrollView,TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image} from 'react-native';
  import React from 'react';
  import {useEffect,useState} from 'react';
  import MyHeader from '../components/MyHeader';
  import {colors, fonts,api_url,getFontSize} from '../config/Constants';
  import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
 import SunHouse from '../screens/customer/houseReport/Sun';
 import MoonRashi from '../screens/customer/RashiReport/moon';
 import MarsRashi from '../screens/customer/RashiReport/mars';
 import MercuryRashi from '../screens/customer/RashiReport/mercury';
  import JupiterRashi from '../screens/customer/RashiReport/jupiter';
  import VenusRashi from '../screens/customer/RashiReport/venus';
  import KetuRashi from '../screens/customer/RashiReport/Ketu';
  import RahuRashi from '../screens/customer/RashiReport/Rahu';
   
  import { useTranslation } from 'react-i18next';
  
  const {height} = Dimensions.get('screen');
  const Tab = createMaterialTopTabNavigator();
  
  const HouseReport = props => {

    const {t} = useTranslation();
  
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
        ),
      });
    }, []);
  
  
  
  
    return (
      <View style={{flex:1}}>
        
          
        <Tab.Navigator
  
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarLabelStyle: {fontSize: getFontSize(1.4), fontFamily: fonts.medium},
            tabBarGap: 0,
            tabBarStyle: {flex: 0},
            tabBarItemStyle: {flex: 0, paddingHorizontal: 0, margin: 0},
          }}>
          
         
          <Tab.Screen
            name={t("moon1")}
            component={MoonRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("mars1")}
            component={MarsRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("mercury1")}
            component={MercuryRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("jupiter1")}
            component={JupiterRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("venus1")}
            component={VenusRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("rahu1")}
            component={RahuRashi}
            initialParams={{data: props.data}}
          />
          <Tab.Screen
            name={t("ketu1")}
            component={KetuRashi}
            initialParams={{data: props.data}}
          />
        </Tab.Navigator>
        </View>
      
     
      
    );
  };
  
  export default HouseReport;
  
  const styles = StyleSheet.create({
    rowContainer: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_theme1,
    },
    rowText: {
      flex: 0.5,
      textAlign: 'center',
      paddingVertical: 10,
      fontSize: 14,
      fontFamily: fonts.medium,
      color: colors.black_color9,
      textTransform: 'capitalize',
    },
  });
  
  