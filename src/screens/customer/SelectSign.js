import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {api_url, colors, fonts, get_horoscope} from '../../config/Constants';
import {sign_data} from '../../config/data';
import {useState} from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const SelectSign = props => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t('select_your_sign')}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  const get_horoscope_data = async (horoscope,images) => {
   
    setIsLoading(true);
    await axios({
      method: 'get',
      url: `${api_url + get_horoscope}/${horoscope}`,
    })
      .then(res => {
        setIsLoading(false);
        console.log('hoo',res.data);
        if(res.data.status == false)
        {
          Alert.alert('Message', 'Your subscribed API key is Expired. Please Call by Admin Team', [
            {
              text: 'OK',
              onPress: () => {
                
              },
            },
          ]);
        }
        else
        {
        props.navigation.navigate('showHoroscope', {data: res.data,items:images});
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 1,
          width: '95%',
          alignSelf: 'center',
          marginVertical: 20,
        }}>
        <FlatList
          data={sign_data}
          keyExtractor={item => item.id}
          numColumns={3}
          renderItem={({item}) => (
            <TouchableOpacity onPress={()=>get_horoscope_data(item.text.toLocaleLowerCase(),item.img)} style={styles.button}>
              <Image source={item.img} style={styles.imgage} />
              <Text style={styles.text}>{item.text}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default SelectSign;

const styles = StyleSheet.create({
  button: {
    width: width * 0.28,
    height: width * 0.28,
    backgroundColor: colors.background_theme1,
    margin: width * 0.018,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: colors.black_color2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  imgage: {
    width: width * 0.15,
    height: width * 0.15,
    resizeMode: 'contain',
    tintColor:colors.background_theme2
  },
  text: {
    fontSize: 14,
    color: colors.black_color6,
    fontFamily: fonts.semi_bold,
  },
});
