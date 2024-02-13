import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Consult from '../screens/Consult';
import Services from '../screens/Services';
import Article from '../screens/Article';
import Home from '../screens/customer/Home';
import AstroForCall from '../screens/customer/AstroForCall';
import AstroForChat from '../screens/customer/AstroForChat';
import AstroBlogs from '../screens/customer/AstroBlogs';
import AstroLive from '../screens/customer/AstroLive';
import AstroMall from '../screens/customer/AstroMall';
import AstroDate from '../screens/customer/AstroDate';
import {colors, fonts,getFontSize} from '../config/Constants';
const {width, height} = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}) {
  const {t} = useTranslation();
  return (
    <View
      style={styles.tabContainer}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({name: route.name, merge: true});
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={label}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={
              label == 'astroForChat' ? styles.middleButton : styles.tabButton
            }>
            {label == 'home3' ? (
              <Image
                source={require('../assets/images/icon/home.png')}
                style={{width: width * 0.08, height: width * 0.08,tintColor: isFocused ? colors.background_theme7:colors.background_theme2}}
              />
            ) : label == 'astroForCall' ? (
              <Image
                source={require('../assets/images/icon/call.png')}
                style={{width: width * 0.08, height: width * 0.08,tintColor: isFocused ? colors.background_theme7:colors.background_theme2}}
              />
            ) : label == 'astroForChat' ? (
              <View
                style={{
                  flex: 0,
                  width: width * 0.14,
                  height: width * 0.14,
                  borderRadius: (width * 0.14) / 2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth:1,
                  borderColor:colors.white_color,
                  backgroundColor: colors.background_theme2,
                }}>
                <Image
                  source={require('../assets/images/icon/chat.png')}
                  style={{width: width * 0.08, height: width * 0.08,tintColor: isFocused ? colors.background_theme7:colors.background_theme1}}
                />
              </View>
            ) : label == 'astroLive' ? (
              <Image
                source={require('../assets/images/icon/blog2.png')}
                style={{width: width * 0.08, height: width * 0.08,tintColor: isFocused ? colors.background_theme7:colors.background_theme2}}
              />
            ) : (
              <Image
                source={require('../assets/images/icon/profile2.png')}
                style={{width: width * 0.08, height: width * 0.08,tintColor: isFocused ? colors.background_theme7:colors.background_theme2,resizeMode:'contain'}}
              />)
            }
              {label != 'astroForChat' ? (
              <Text
                style={{
                  color: isFocused ? colors.background_theme7 : colors.background_theme2,
                  fontFamily: fonts.medium,
                  fontSize: getFontSize(1.4),
                  
                }}>
                {label == 'home3'
                  ? t("home")
                  : label == 'astroForCall'
                  ? t("call")
                  : label == 'astroForChat'
                  ? t("chat")
                  : label == 'astroLive'
                  ? 'Blogs'
                  : 'Profile'}
              </Text>
              ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const TabNavigator = (props) => {
  return (
    <Tab.Navigator
    initialRouteName={props.route.params?.flag == 1 ? 'astroDate' : 'home3'}
    tabBar={props => <MyTabBar {...props} />}
    screenOptions={{headerShown: true, headerShadowVisible: false}}>
    <Tab.Screen name="home3" component={Home} />
    <Tab.Screen name="astroForCall" component={AstroForCall} />
    <Tab.Screen name="astroForChat" component={AstroForChat} />
    <Tab.Screen name="astroLive" component={AstroBlogs} />
    <Tab.Screen name="astromall" component={AstroMall} />
  </Tab.Navigator>

  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background_theme1,
    borderTopLeftRadius:20,
    borderTopRightRadius: 20,
    shadowColor: colors.background_theme2,
    shadowOffset: {width: 2, height: 1},
    shadowOpacity: 0.3,
    paddingHorizontal: 5,
    elevation:10
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:10,
    paddingBottom:5
  },
  middleButton: {
    flex: 0,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
    bottom: 25,
    backfaceVisibility: 'hidden',
    shadowOffset: {
      width: 2,
      height: 1,
    },
    shadowColor: colors.black_color8,
    shadowOpacity: 0.3,
  },
});
