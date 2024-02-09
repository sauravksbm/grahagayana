import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
Alert,
Platform
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {api_astrolist1, api_url, colors, fonts,get_panchang,getFontSize} from '../../config/Constants';
import {StyleSheet} from 'react-native';
import {useState} from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');

const DownloadKundli = props => {
  console.log('pppp',props.data.kundali_id);
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [pachang, setPachang] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      
    });
  }, []);

  const click = async() => {
      console.log(props.data.kundali_id);
      const api = `https://grahagyana.com/api/api2/get_pdf?kundli=${props.data.kundali_id}`;
      
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
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: '#fafdf6',
            marginVertical: 10,
            borderRadius: 15,
            shadowColor: colors.black_color5,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation:6
          }}>
              
              <View style={styles.itemContainer}>
                  {/* <Text style={styles.itemText}>Download</Text> */}
                  <Text style={{fontSize:getFontSize(1.8)}}>
                    {t("download_title")}
                  </Text>
                  <View>
                  <TouchableOpacity 
                  onPress={() => click()}
                  style={{ color: 'black', padding: 10, fontSize: getFontSize(1.8), textAlign: 'justify' }}
                  
                  >
                    <Text style={{
                      backgroundColor:'red',
                      padding:10,
                      color:'white',
                      fontSize:getFontSize(2),
                      marginTop:20
                    }}>
                      {t("download_pdf")}
                      </Text> 
                  </TouchableOpacity>
                  </View>
              </View>
              
          
         
          
        </View>
        
      </ScrollView>
    </View>
  );
};

export default DownloadKundli;

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    
    alignItems: 'center',
    padding: 15,
    alignSelf:'center'
  },
  itemText: {
    
    fontSize: 22,
    color: 'red',
    fontFamily: fonts.medium,
    fontWeight:'bold',
    textAlign:'center'
  },
});
