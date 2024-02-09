import {View, Text,ScrollView,TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image} from 'react-native';
import React from 'react';
import {useEffect,useState} from 'react';
import MyHeader from '../components/MyHeader';
import {colors, fonts,api_url,get_chart_all,getFontSize} from '../config/Constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Sun from '../screens/customer/showkundli/Sun';
import KundliBirthDetailes from '../screens/customer/KundliBirthDetailes';
import KundliPunchangDetailes from '../screens/customer/KundliPunchangDetailes';
import Moon from '../screens/customer/showkundli/Moon';
import Chalit from '../screens/customer/showkundli/Chalit';
import Birth from '../screens/customer/showkundli/Birth';
import Hora from '../screens/customer/showkundli/Hora';
import Dreshkan from '../screens/customer/showkundli/Dreshkan';
import Chathurthamasha from '../screens/customer/showkundli/Chathurthamasha';
import Panchmansha from '../screens/customer/showkundli/Panchmansha';
import Saptamansha from '../screens/customer/showkundli/Saptamansha';
import Ashtamansha from '../screens/customer/showkundli/Ashtamansha';
import Navamansha from '../screens/customer/showkundli/Navamansha';
import Dashamansha from '../screens/customer/showkundli/Dashamansha';
import Dwadashamsha from '../screens/customer/showkundli/Dwadashamsha';
import Shodashamsha from '../screens/customer/showkundli/Shodashamsha';
import Vishamansha from '../screens/customer/showkundli/Vishamansha';
import Chaturvimshamsha from '../screens/customer/showkundli/Chaturvimshamsha';
import Bhamsha from '../screens/customer/showkundli/Bhamsha';
import Trishamansha from '../screens/customer/showkundli/Trishamansha';
import Khavedamsha from '../screens/customer/showkundli/Khavedamsha';
import Akshvedansha from '../screens/customer/showkundli/Akshvedansha';
import Shashtymsha from '../screens/customer/showkundli/Shashtymsha';
import { NavigationContainer } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
const {height} = Dimensions.get('screen');
const Tab = createMaterialTopTabNavigator();


const ShowKundliCharts = props => {

  const {t} = useTranslation();

  const [planet] = useState(props.planetData.planets);
  const [nakshatra] = useState(props.planetData.planets);
  const [isPlanet, setIsPlanet] = useState(true);
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
      <ScrollView contentContainerStyle={{ flexGrow:1,height:1100}}>
        <View style={{height:height * 0.6}}>
      <Tab.Navigator

        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarLabelStyle: {fontSize: getFontSize(1.5), fontFamily: fonts.medium},
          tabBarGap: 0,
          tabBarStyle: {flex: 0},
          tabBarItemStyle: {flex: 0, paddingHorizontal: 0, margin: 0},
        }}>
        <Tab.Screen
          name={t("birth")}
          component={Birth}
          initialParams={{data: props.data, planetData: props.planetData}}
        />
         <Tab.Screen
          name={t("chalit")}
          component={Chalit}
          initialParams={{data: props.data, planetData: props.planetData}}
        />
        <Tab.Screen
          name={t("sun")}
          component={Sun}
          initialParams={{data: props.data, planetData: props.planetData}}
        />
        <Tab.Screen
          name={t("moon")}
          component={Moon}
          initialParams={{data: props.data, planetData: props.planetData}}
        />
        <Tab.Screen
          name={t("navamansha")}
          component={Navamansha}
          initialParams={{data: props.data, planetData: props.planetData}}
      /> 
      </Tab.Navigator>
      </View>
    <View style={{flex:0,height:'auto'}}>
    <View style={{width: '95%', alignSelf: 'center', paddingVertical: 15}}>
          {/* <Text
            style={{
              fontSize: 18,
              color: colors.black_color8,
              fontFamily: fonts.medium,
              fontWeight:'bold',
              textAlign:'center',
              paddingBottom:15
            }}>
            Planetary Positions
          </Text> */}
          {/* <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 15,
            }}>
            <TouchableOpacity
              onPress={() => setIsPlanet(true)}
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 2,
                borderRadius: 1000,
                backgroundColor: isPlanet
                  ? colors.background_theme2
                  : colors.background_theme1,
                marginRight: 10,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: isPlanet
                    ? colors.background_theme1
                    : colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                MOON SIGN
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsPlanet(false)}
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 15,
                paddingVertical: 2,
                borderRadius: 1000,
                backgroundColor: !isPlanet
                  ? colors.background_theme2
                  : colors.background_theme1,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: isPlanet
                    ? colors.black_color7
                    : colors.background_theme1,
                  fontFamily: fonts.medium,
                }}>
                NAKSHATRA
              </Text>
            </TouchableOpacity>
          </View> */}
          {isPlanet ? (
            <View
              style={{
                flex: 0,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: colors.black_color7,
              }}>
              <View
                style={{
                  ...styles.rowContainer,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  backgroundColor: colors.background_theme2,
                }}>
                <Text style={styles.rowText}>{t("planet")}</Text>
                <Text style={styles.rowText}>{t("rashi")}</Text>
                <Text style={styles.rowText}>{t("degree")}</Text>
              </View>
              {Object.keys(planet).map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.rowContainer,
                    borderBottomLeftRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                    borderBottomRightRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                      display: index >= 0 && index <= 8 ? 'none' : 'flex'
                  }}>
                  <Text style={styles.rowText}>{planet[item].name}</Text>
                  <Text style={styles.rowText}>{planet[item].sign}</Text>
                  <Text style={styles.rowText}>{`${Math.floor(((Math.floor(nakshatra[item].normDegree))))}° ${Math.floor((nakshatra[item].normDegree % 1) * 60)}' ${Math.floor(((nakshatra[item].normDegree % 1) * 60) % 1 * 60)}"`}</Text>
                </View>
              ))}
               {Object.keys(planet).map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.rowContainer,
                    borderBottomLeftRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                    borderBottomRightRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                      display: index === 9 ? 'none':'flex'
                  }}>
                  <Text style={styles.rowText}>{planet[item].name}</Text>
                  <Text style={styles.rowText}>{planet[item].sign}</Text>
                  <Text style={styles.rowText}>{`${Math.floor(((Math.floor(nakshatra[item].normDegree))))}° ${Math.floor((nakshatra[item].normDegree % 1) * 60)}' ${Math.floor(((nakshatra[item].normDegree % 1) * 60) % 1 * 60)}"`}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                flex: 0,
                borderWidth: 1,
                borderRadius: 15,
                borderColor: colors.black_color7,
              }}>
              <View
                style={{
                  ...styles.rowContainer,
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  backgroundColor: colors.background_theme2,
                }}>
                <Text style={styles.rowText}>Planet</Text>
                <Text style={styles.rowText}>Nakshatra</Text>
                <Text style={styles.rowText}>Naksh Lord</Text>
                <Text style={styles.rowText}>pad</Text>
              </View>
              {Object.keys(nakshatra).map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.rowContainer,
                    borderBottomLeftRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                    borderBottomRightRadius:
                      Object.keys(planet).length == index + 1 ? 15 : 0,
                  }}>
                  <Text style={styles.rowText}>{planet[item].name}</Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatra}
                  </Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatraLord}
                  </Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatra_pad}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
    </View>
    </ScrollView>
    </View>
  );
};

export default ShowKundliCharts;

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
    fontSize: getFontSize(1.5),
    fontFamily: fonts.medium,
    color: colors.black_color9,
    textTransform: 'capitalize',
  },
});

