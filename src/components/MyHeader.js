import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  PermissionsAndroid,
  Alert,
  Platform
} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fonts,getFontSize} from '../config/Constants';
import { openFacebook, openInstagram, openYoutube } from './Methods';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import { Buffer } from 'buffer';



const MyHeader = ({navigation, title, statusBar, socialIcons = false,download = false,id}) => {



  const click = async(id) => {
    console.log(id);
    const api = `https://grahagyana.com/api/api2/get_pdf?kundli=${id}`;
    
    if (Platform.OS === 'android' && Platform.Version < 30) {
      
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, proceed with the download
          const { dirs } = RNFetchBlob.fs;
     
          await RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              mediaScannable: true,
              title: 'Astrokunj.pdf',
              path: `${dirs.DownloadDir}/Astrokunj.pdf`,
            },
          })
            .fetch('GET', api)
            .then((res) => {
              console.log('The file saved to ', res.path());
            })
            .catch((e) => {
              console.log(e);
            });
  
          
        } else {
          // Permission denied
          Alert.alert('Permission Denied!', 'You need to give storage permission to download the file');
        }
      } catch (error) {
        console.error('Error:', error);
      }

    } else {
      try {
       
         
          const { dirs } = RNFetchBlob.fs;
     
          await RNFetchBlob.config({
            fileCache: true,
            addAndroidDownloads: {
              useDownloadManager: true,
              notification: true,
              mediaScannable: true,
              title: 'Astrokunj.pdf',
              path: `${dirs.DownloadDir}/Astrokunj.pdf`,
            },
          })
            .fetch('GET', api)
            .then((res) => {
              console.log('The file saved to ', res.path());
            })
            .catch((e) => {
              console.log(e);
            });
      } catch (error) {
        console.error('Error:', error);
      }
    }
    

  }
  

  return (
    <SafeAreaView
      style={{backgroundColor: colors.background_theme2}}
      forceInset={{top: 'always', bottom: 'never'}}>
      <View
        style={{
          flex: 0,
          height: 0,
          backgroundColor: statusBar?.backgroundColor,
        }}>
        <StatusBar
          translucent
          backgroundColor={statusBar?.backgroundColor}
          barStyle={statusBar?.barStyle}
        />
      </View>
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingVertical: 12,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            flex: 0,
            width: '15%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Ionicons
            name="arrow-back"
            color={colors.background_theme1}
            size={getFontSize(2.5)}
          />
        </TouchableOpacity>
        <View style={{flex: 0.8}}>
          <Text
            numberOfLines={1}
            style={{
              fontSize: getFontSize(1.7),
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
            {title}
          </Text>
        </View>
        <View style={{}}>
        {download && (
           <TouchableOpacity onPress={()=> click(id)}>
           <Text
             style={{
               fontSize: getFontSize(1.5),
               color: colors.background_theme1,
               fontFamily: fonts.medium,
               borderBottomWidth:1,
               borderColor:'white'
             }}>
             Download
           </Text>
         </TouchableOpacity>
        ) }
        </View>
      </View>
     
 


    </SafeAreaView>
  );
};

export default MyHeader;
