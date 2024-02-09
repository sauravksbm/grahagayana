import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView,Text,Dimensions } from 'react-native';
import { colors } from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyHeader from '../../components/MyHeader';
import { api_url, how_to_images, provider_img_url } from '../../config/Constants';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
const {width, height} = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';
const HowToScreenshots = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title={t("howtoscreenshot")}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    get_how();
  }, []);

  const get_how = () => {
    setIsLoading(true);
    axios({
      method: 'get',
      url: api_url + how_to_images,
    })
      .then((res) => {
        console.log(res.data.records);
        setImages(res.data.records);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <MyLoader isVisible={isLoading} />
        {Array.isArray(images) && images.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            
            <Image source={{ uri: item.image_url }} style={{ height: height * 0.3, width: width * 0.9,borderRadius:10,margin:10 }} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 300,
    height: 200,
  },
  itemContainer: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 10,
    elevation: 2,
    margin:10
  },
});

export default HowToScreenshots;
