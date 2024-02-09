import { View, Text,TouchableOpacity,ScrollView,StyleSheet } from 'react-native'
import React,{useEffect,useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors,getFontSize } from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { api_url,whaticanask } from '../../config/Constants';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './i18n';

const Language = (props) => {
    const { t,i18n } = useTranslation()
  useEffect(() => {
    props.navigation.setOptions({
      title: t("ln"),
      headerTintColor: colors.black_color,
      headerShown: true,
      headerStyle: {
        backgroundColor: colors.background_theme2,
      },
      headerTitleStyle: {
        fontSize: getFontSize(2), // Set the desired font size here
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
          style={{flex: 0}}>
          <AntDesign
            name="arrowleft"
            color={colors.black_color}
            size={getFontSize(2.2)}
          />
        </TouchableOpacity>
      ),
      
    }),[]});

    const changeLanguage = async (language) => {
      // Save the selected language in AsyncStorage
      await AsyncStorage.setItem('selectedLanguage', language);
  
      // Change the language using i18next
      i18n.changeLanguage(language);
    };
    
    

  return (
    <View style={{margin:20}}>
        <TouchableOpacity 
        style={{backgroundColor:'#ddd',padding:20,borderRadius:10,marginBottom:20}} 
        activeOpacity={0.8}
        onPress={() => changeLanguage('en')}>
        <Text style={{fontSize:22,fontWeight:'bold',fontSize:getFontSize(1.8)}}>{t("en")}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={{backgroundColor:'#ddd',padding:20,borderRadius:10}} 
        activeOpacity={0.8}
        onPress={() => changeLanguage('hi')}>
        <Text style={{fontSize:22,fontWeight:'bold',fontSize:getFontSize(1.8)}}>{t("hi")}</Text>
        </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  itemHeader: {
    padding: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color:colors.black_color
  },
  itemContent: {
    padding: 16,
    color:colors.black_color,
    fontSize:12,
    backgroundColor:'#f1f1f1'
  },
});

export default Language