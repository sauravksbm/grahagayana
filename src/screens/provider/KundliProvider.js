import {View, Text, TouchableOpacity, Dimensions, StyleSheet,ScrollView} from 'react-native';
import React from 'react';
import MyHeader from '../../components/MyHeader';
import {useEffect} from 'react';
import {
  api_url,
  colors,
  fonts,
  kundli_get_planets,
  get_chart_all,
  major_vdasha,
  get_pdf,
  kundli_get_planets1
} from '../../config/Constants';
import {useState} from 'react';
import ShowKundliBasic from '../../navigations/ShowKundliBasic';
import ShowBasic from './ShowBasic';
import ShowKundliCharts from '../../navigations/ShowKundliCharts';
import ShowKundliPlanets from '../../navigations/ShowKundliPlanets';
import ShowKundliKpPlanets from '../../navigations/ShowKundliKpPlanets';
import ShowDashna from '../customer/ShowDashna';
import ShowPachang from '../customer/ShowPachang';
import ShowKundliKpHouseCusp from '../../navigations/ShowKundliKpHouseCusp';
import HouseReport from '../../navigations/HouseReport';
import RashiReport from '../../navigations/RashiReport';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const KundlieProvider = props => {

    console.log('data',props.route.params.data);
const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [planetData, setPlanetData] = useState(null);
  const [dashna,setDashna] = useState(null);
  const [whatShow, setWhatShow] = useState({
    basic: false,
    charts: true,
    planets: false,
    dashna: false,
    pachang:false,
    download:false,
    kp_planets: false,
    kp_houseCups: false,
    house: false,
    rashi: false
  });

  

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Show Kundli"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  

  useEffect(()=>{
    get_planets();
    get_dashna();
  },[])


  const get_planets = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + kundli_get_planets1,
      // data: {
      //   user_id: props.customerData.id,
      //   date_of_birth: props.route.params.data.dob,
      //   time_of_birth: props.route.params.data.tob,
      //   lat: props.route.params.data.latitude,
      //   lon: props.route.params.data.longitude,
      //   customer_name: props.route.params.data.customer_name,
      //   timezone: "+5:30",
      //   address: props.route.params.data.place,
      // },
      headers: {
               'Content-Type': 'multipart/form-data',
             },
      data: {
        kundli_id: props.route.params.data.kundali_id,
      }
    }).then((res)=>{
      console.log('ddd234',res.data);
      setPlanetData(res.data)
      
      setIsLoading(false)
    }).catch(err=>{
      setIsLoading(false);
      console.log(err)
    });
  };

  

  const get_dashna = async() => {

    setIsLoading(true);
     await axios({
        method: 'post',
        url: api_url + major_vdasha,
        headers: {
            'Content-Type': 'multipart/form-data'
          },
        data: {
            kundli_id:props.route.params.data.kundali_id
        },
      }).then((res)=>{
        console.log('dsfa1111',res.data);
        setDashna(res.data);
        setIsLoading(false);   
        
      }).catch(err=>{
        setIsLoading(false);
        console.log('aaa',err)
      });
  }


  

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0,
          width: '90%',
          alignSelf: 'center',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 15,
        }}>
          <ScrollView horizontal={true}>
        
          <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: true, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.charts
              ? '#d6ccc2'
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            borderBottomLeftRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.charts
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.charts
                ? 'bold'
                : '500',
            }}>
            {t('charts')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: false,pachang:true,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.pachang
              ? '#fefae0'
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.pachang
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.pachang
                ? 'bold'
                : '500',
            }}>
           {t("ascendant")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: true, charts: false, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.basic
              ? '#e9c46a'
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderLeftWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.basic
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.basic
                ? 'bold'
                : '500',
            }}>
            {t("basic")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: true,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.planets
              ? '#faedcd'
              : colors.background_theme1,
            borderWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.planets
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.planets
                ? 'bold'
                : '500',
            }}>
            {t("planetary")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: true,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.dashna
              ? colors.background_theme2
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.dashna
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.dashna
                ? 'bold'
                : '500',
            }}>
            {t("dasha")}
          </Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: true, kp_houseCups: false,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.kp_planets
              ? colors.background_theme2
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.kp_planets
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.kp_planets
                ? 'bold'
                : '500',
            }}>
            {t("kp_planets")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: true,house: false,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.kp_houseCups
              ? colors.background_theme2
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.kp_houseCups
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.kp_houseCups
                ? 'bold'
                : '500',
            }}>
            {t("Kp_house_cusp")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: true,rashi:false})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.house
              ? colors.background_theme2
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.house
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.house
                ? 'bold'
                : '500',
            }}>
            {t("house_report")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setWhatShow({basic: false, charts: false, planets: false,
              dashna: false,pachang:false,download:false,
              kp_planets: false, kp_houseCups: false,house: false,rashi:true})
          }
          style={{
            paddingLeft:20,
            paddingRight:20,
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: whatShow.rashi
              ? colors.background_theme2
              : colors.background_theme1,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderWidth: 1,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            
          }}>
          <Text
            style={{
              fontSize: 14,
              color: whatShow.rashi
                ? '#ff477e'
                : colors.black_color7,
              fontFamily: fonts.medium,
              fontWeight: whatShow.rashi
                ? 'bold'
                : '500',
            }}>
            {t("rashi_report")}
          </Text>
        </TouchableOpacity>
        </ScrollView>
      </View>
      {planetData && whatShow.charts ? (
        <ShowKundliCharts
        navigation={props.navigation}
        data={props.route.params.data}
        planetData={planetData}
        
      />
      ) :  whatShow.basic? (
        

        <ShowKundliBasic
          navigation={props.navigation}
          data={props.route.params.data}
        />
        
      ) : planetData && whatShow.planets ? (
        
        <ShowKundliPlanets
          navigation={props.navigation}
          data={props.route.params.data}
          planetData={planetData}
        />
        
        
      ) : whatShow.pachang ? (
        <ShowPachang
          navigation={props.navigation}
          data={props.route.params.data}
        />
      ) :  whatShow.kp_planets ? (
        <ShowKundliKpPlanets
          navigation={props.navigation}
          data={props.route.params.data}
        />
      ) :  whatShow.kp_houseCups ? (
        <ShowKundliKpHouseCusp
          navigation={props.navigation}
          data={props.route.params.data}
        />
      ) :  whatShow.house ? (
        <HouseReport
          navigation={props.navigation}
          data={props.route.params.data}
          planetData={planetData}
        />
      ) :  whatShow.rashi ? (
        <RashiReport
          navigation={props.navigation}
          data={props.route.params.data}
          planetData={planetData}
        />
      ) : planetData && dashna && (
        
        <ShowDashna
          navigation={props.navigation}
          data={props.route.params.data}
          planetData={planetData}
          dashna={dashna}
          
        />
      )}
      {/* { whatShow.charts  ? (
        
          
      <View style={{width: '95%', alignSelf: 'center', paddingVertical: 15,marginTop:450,position:'absolute',height:height *0.38}}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            Planets
          </Text>
          <View
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
          </View>
          
          {isPlanet ? (
            <ScrollView>
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
                <Text style={styles.rowText}>Degree</Text>
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
                  }}>
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.rowText}>{`${Math.floor(
                    planet[item],
                  )}° ${Math.floor((planet[item] % 1) * 60)}° ${Math.floor(
                    (((planet[item] % 1) * 60) % 1) * 60,
                  )}°`}</Text>
                </View>
              ))}
            </View>
            </ScrollView>
          ) : (
            <ScrollView>
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
                  <Text style={styles.rowText}>{item}</Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatra}
                  </Text>
                  <Text style={styles.rowText}>
                    {nakshatra[item].nakshatralord}
                  </Text>
                </View>
              ))}
            </View>
            </ScrollView>
          )}
         
        </View>
        
      ) : null} */}
      
    </View>
  );
};

const mapStateToProps = state => ({
  
});


export default connect(mapStateToProps, null)(KundlieProvider);

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
