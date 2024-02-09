import {View, Text,StyleSheet,ScrollView,TouchableOpacity} from 'react-native';
import React from 'react';
import {useEffect,useState} from 'react';
import MyHeader from '../components/MyHeader';
import {colors,fonts,getFontSize} from '../config/Constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import KundliMoonSign from '../screens/customer/KundliMoonSign';
import KundliNakshatra from '../screens/customer/KundliNakshatra';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useTranslation } from 'react-i18next';
const Tab = createMaterialTopTabNavigator();

const ShowKundliPlanets = props => {
  const {t} = useTranslation();
  const [nakshatra] = useState(props.planetData.planets);
  const [selectedItem, setSelectedItem] = useState(null);
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
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: colors.background_theme1,
            marginVertical: 10,
            borderRadius: 15,
            shadowColor: colors.black_color5,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          {/* <View
            style={{
              ...styles.itmeContainer,
              backgroundColor: colors.background_theme2,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <Text style={{...styles.itemText2, color: colors.background_theme1}}>
              Planet
            </Text>
            <Text style={{...styles.itemText2, color: colors.background_theme1}}>
              Nakshatra
            </Text>

            <Text style={{...styles.itemText2, color: colors.background_theme1}}>
              Pad
            </Text>
            
          </View> */}
          {Object.keys(nakshatra).map((item, index) => (
            
            <View key={index} style={{display: index >= 0 && index <= 8 ? 'none' : 'flex'}}>
              
              <TouchableOpacity onPress={() => toggleDropdown(item)} activeOpacity={1}>
                <View style={[styles.itmeContainer,{backgroundColor:calculateColor(item)}]}>
                  <Text style={styles.itemText}>{nakshatra[item].name}</Text>
                  <Text style={styles.itemText1}>{`${Math.floor(((Math.floor(nakshatra[item].normDegree))))}° ${Math.floor((nakshatra[item].normDegree % 1) * 60)}' ${Math.floor(((nakshatra[item].normDegree % 1) * 60) % 1 * 60)}"`}
</Text>
                  <Text style={styles.itemText}>{nakshatra[item].nakshatra}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].nakshatra_pad}</Text>
                  <Text style={styles.itemText}>
                    
                    {nakshatra[item].isRetro == 'true' ? (
                      <View style={{}}>
                        <Text
                          style={[
                            {color: 'white', backgroundColor: 'blue', borderRadius: 10, padding: 5, fontSize: 10},
                          ]}>
                          R
                        </Text>
                      </View>
                    ) : (
                      <Text style={{}}></Text>
                    )}
                    
                  </Text>
                  {dropdownVisibility[item] ? (
                    <AntDesign name="up" color={colors.black_color} size={20} />
                  ) : (
                    <AntDesign name="down" color={colors.black_color} size={20} />
                  )}
                </View>
              </TouchableOpacity>

              {dropdownVisibility[item] && (
                <View style={styles.dropdownContent}>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("sign_lord")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].signLord}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nakshtra")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatra}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nak_loard")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatraLord}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("house")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].house}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nak_pad")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatra_pad}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("retroGrade")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].isRetro}</Text>
                    </View>
                  </View>
                </View>
              )}

            </View>
          ))}
          {Object.keys(nakshatra).map((item, index) => (
            
            <View key={index} style={{display: index === 9 ? 'none':'flex'}}>
              
              <TouchableOpacity onPress={() => toggleDropdown(item)} activeOpacity={1}>
                <View style={[styles.itmeContainer,{backgroundColor:calculateColor(item)}]}>
                  <Text style={styles.itemText}>{nakshatra[item].name}</Text>
                  <Text style={styles.itemText1}>{`${Math.floor(((Math.floor(nakshatra[item].normDegree))))}° ${Math.floor((nakshatra[item].normDegree % 1) * 60)}' ${Math.floor(((nakshatra[item].normDegree % 1) * 60) % 1 * 60)}"`}
</Text>
                  <Text style={styles.itemText}>{nakshatra[item].nakshatra}</Text>
                  <Text style={styles.itemText3}>{nakshatra[item].nakshatra_pad}</Text>
                  <Text style={styles.itemText}>
                    
                    {nakshatra[item].isRetro == 'true' ? (
                      <View style={{}}>
                        <Text
                          style={[
                            {color: 'white', backgroundColor: 'blue', borderRadius: 10, padding: 5, fontSize: 10},
                          ]}>
                          R
                        </Text>
                      </View>
                    ) : (
                      <Text style={{}}></Text>
                    )}
                    
                  </Text>
                  {dropdownVisibility[item] ? (
                    <AntDesign name="up" color={colors.black_color} size={20} />
                  ) : (
                    <AntDesign name="down" color={colors.black_color} size={20} />
                  )}
                </View>
              </TouchableOpacity>

              {dropdownVisibility[item] && (
                <View style={styles.dropdownContent}>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("sign_lord")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].signLord}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nakshtra")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatra}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nak_loard")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatraLord}</Text>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("house")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].house}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("nak_pad")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].nakshatra_pad}</Text>
                    </View>
                    <View style={styles.cell}>
                      <Text style={styles.textCenter}>{t("retroGrade")}</Text>
                      <Text style={styles.textCenter}>{nakshatra[item].isRetro}</Text>
                    </View>
                  </View>
                </View>
              )}

            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};


export default ShowKundliPlanets;

const styles = StyleSheet.create({
  itmeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop:20,
    paddingBottom:20,
    paddingRight:8,
    paddingLeft:8
    
  },
  itemText: {
    flex: 0.24,
    fontSize: getFontSize(1.4),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
    fontWeight:'bold'
  },
  itemText2: {
    flex: 0.26,
    fontSize: getFontSize(1.4),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  itemText1: {
    flex: 0.24,
    fontSize: getFontSize(1.4),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
  itemText3: {
    flex: 0.15,
    fontSize: getFontSize(1.4),
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
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
    color:'black',
    fontSize:getFontSize(1.4)
  },
});
