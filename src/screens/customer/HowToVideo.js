import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ScrollView,Text,Dimensions,Linking  } from 'react-native';
import { colors } from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MyHeader from '../../components/MyHeader';
import { api_url, howtousevideos, provider_img_url } from '../../config/Constants';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
const {width, height} = Dimensions.get('screen');
import { useTranslation } from 'react-i18next';
const HowToVideo = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const {t} = useTranslation();
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title={t("howtovideo")}
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
      url: api_url + howtousevideos,
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
        <TouchableOpacity
        activeOpacity={0.8}
            key={index}
            style={styles.itemContainer}
            onPress={() => openYouTubeVideo(item.link)} // Replace with the actual key from your item data
        >   
            { item.image_url == null ? (
                <Image
            source={require('../../assets/images/icon/youtube.png')} width={50} height={10}
            style={{ height: height * 0.2, width: width * 0.8,margin:10,resizeMode:'contain' }}
            />
            ):(
<Image
            source={{ uri: item.image_url }}
            style={{ height: height * 0.2, width: width * 0.85, borderRadius: 10, margin: 10 }}
            />
            )}
            
        </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const openYouTubeVideo = (youtubeLink) => {
    // Assuming the youtubeLink is a valid YouTube video URL
    Linking.openURL(youtubeLink);
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

export default HowToVideo;
