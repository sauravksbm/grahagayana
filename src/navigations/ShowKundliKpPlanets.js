import {View, Text,StyleSheet,ScrollView,TouchableOpacity} from 'react-native';
import React from 'react';
import {useEffect,useState} from 'react';
import MyHeader from '../components/MyHeader';
import {api_url, colors,fonts, get_Kpplanets,getFontSize} from '../config/Constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import KundliMoonSign from '../screens/customer/KundliMoonSign';
import KundliNakshatra from '../screens/customer/KundliNakshatra';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

const ShowKundliKpPlanets = props => {

  const {t} = useTranslation();
  const [nakshatra,setdata] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownVisibility, setDropdownVisibility] = useState({});
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

  useEffect(() => {
    kp();
  },[]);

  console.log(props.data.kundali_id)

  const kp = () => {
    setIsLoading(true);
    axios({
        method:'post',
        url: api_url + get_Kpplanets,
        headers: {
            'Content-Type': 'multipart/form-data',
          },
        data: {
            kundli_id: props.data.kundali_id,
            lang:t("lang")
        }
    }).then(res => {
        console.log(res.data);
        setdata(res.data.planets);
    }).catch( err =>{
        console.log(err);
    })
  }

  const toggleDropdown = (item) => {
    setDropdownVisibility({
      ...dropdownVisibility,
      [item]: !dropdownVisibility[item],
    });
  };

  const calculateColor = (value) => {
    // Example: Assign colors based on a range (adjust as needed)
    if (value >= 0 && value <= 0) {
      return '#ffc8dd';
    } else if (value >= 1 && value <=1) {
      return '#bde0fe';
    } else if (value >= 2 && value <=2) {
      return '#d6ccc2';
    } else if (value >=3  && value <= 3) {
      return '#fcf6bd';
    } else if (value >= 4 && value <=4) {
      return '#c9ada7';
    } else if (value >= 5 && value <=5) {
      return '#f6bd60';
    } else if (value >= 6 && value <=6) {
      return '#f7c59f';
    } else if (value >= 7 && value <=7) {
      return '#ccff33';
    } else if (value >= 8 && value <=8) {
      return '#d3d3d3';
    } else {
      return '#f4e409'; 
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
            style={{
              ...styles.itmeContainer,
              backgroundColor: '#8ecae6',
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <Text style={{...styles.itemText2, color: colors.background_theme1}}>
              {t("planet")}
            </Text>
            <Text style={{...styles.itemText2, color: colors.background_theme1}}>
             {t("degree")}
            </Text>

            <Text style={{...styles.itemText3, color: colors.background_theme1}}>
              {t("sl")}
            </Text>
            <Text style={{...styles.itemText3, color: colors.background_theme1}}>
              {t("nl")}
            </Text>
            <Text style={{...styles.itemText3, color: colors.background_theme1}}>
              {t("sb")}
            </Text>
            <Text style={{...styles.itemText3, color: colors.background_theme1}}>
              {t("ss")}
            </Text>
            
          </View>
        {nakshatra && (
            <View
          style={{
            flex: 0,
            width: '100%',
            alignSelf: 'center',
            backgroundColor: colors.background_theme1,
            borderRadius: 15,
            shadowColor: colors.black_color5,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          
          
          {Object.keys(nakshatra).map((item, index) => (
            
            <View key={index} style={{display: index >= 0 && index <= 8 ? 'none' : 'flex'}}>
              
              <TouchableOpacity onPress={() => toggleDropdown(item)} activeOpacity={1}>
                <View style={[styles.itmeContainer,{backgroundColor:calculateColor(item)}]}>
                  <Text style={styles.itemText}>
                    {nakshatra[item].planet_name}
                    {nakshatra[item].is_retro !== false ? (
                <Text>(R)</Text>
              ):(null)}
                    </Text>
                  <Text style={styles.itemText}>{`${Math.floor(((Math.floor(nakshatra[item].norm_degree))))}° ${Math.floor((nakshatra[item].norm_degree % 1) * 60)}' ${Math.floor(((nakshatra[item].norm_degree % 1) * 60) % 1 * 60)}"`}
</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sign_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].nakshatra_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sub_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sub_sub_lord.slice(0,2)}</Text>
                  
                  
                </View>
              </TouchableOpacity>

            
            </View>
          ))}

{Object.keys(nakshatra).map((item, index) => (
            
            <View key={index} style={{display: index === 9 ? 'none':'flex'}}>
              
              <TouchableOpacity onPress={() => toggleDropdown(item)} activeOpacity={1}>
                <View style={[styles.itmeContainer,{backgroundColor:calculateColor(item)}]}>
                  <Text style={styles.itemText}>
                    {nakshatra[item].planet_name}
                    {nakshatra[item].is_retro !== false ? (
                <Text>(R)</Text>
              ):(null)}
                    </Text>
                  <Text style={styles.itemText}>{`${Math.floor(((Math.floor(nakshatra[item].norm_degree))))}° ${Math.floor((nakshatra[item].norm_degree % 1) * 60)}' ${Math.floor(((nakshatra[item].norm_degree % 1) * 60) % 1 * 60)}"`}
</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sign_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].nakshatra_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sub_lord.slice(0,2)}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].sub_sub_lord.slice(0,2)}</Text>
                  
                  
                </View>
              </TouchableOpacity>

            
            </View>
          ))}
        </View>
        )}
        
      </ScrollView>
    </View>
  );
};


export default ShowKundliKpPlanets;

const styles = StyleSheet.create({
  itmeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:18,
    paddingBottom:18,
    paddingRight:8,
    paddingLeft:8
    
  },
  itemText: {
    flex: 0.24,
    fontSize: getFontSize(1.5),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontWeight:'bold'
  },
  itemText2: {
    flex: 0.26,
    fontSize: getFontSize(1.6),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontWeight:'bold'
  },
  itemText1: {
    flex: 0.24,
    fontSize: getFontSize(1.3),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  itemText3: {
    flex: 0.15,
    fontSize: getFontSize(1.6),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontWeight:'bold'
  },
  dropdownContent: {
    backgroundColor: 'white',
       
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1, // Add a border to the bottom of each row
    borderColor: 'gray', // Set the border color
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1, // Add a border to the right of each cell
    borderColor: 'gray', // Set the border color
  },
  textCenter: {
    textAlign: 'center',
    color:'black'
  },
});
