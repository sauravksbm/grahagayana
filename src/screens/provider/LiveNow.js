import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  FlatList,
} from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, fonts } from '../../config/Constants';
import RNSpeedometer from 'react-native-speedometer';
import Modal from 'react-native-modal';
import { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import { useRef } from 'react';
import Share from 'react-native-share';
import axios from 'axios';
import { livelist, api_url, img_url_astrologer,update_live_status } from '../../config/Constants';
import { connect } from 'react-redux';
import MyLoader from '../../components/MyLoader';
import moment from 'moment';
import MyHeader from '../../components/MyHeader';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('screen');

const LiveNow = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [kundliList, setKundliList] = useState(null);
  const [history, sethistory] = useState(null);
  const {t} = useTranslation();

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: true,
      header: () => (
        <MyHeader
          title={t("live_now")}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  console.log(props.route.params.data.live_id);

  const go_live = async() => {
    await axios({
      method: 'post',
      url: api_url + update_live_status,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
        status: 3,
        
      },
    })
      .then(res => {
        console.log(res.data);    
        setIsLoading(false)
        props.navigation.navigate('HostPage',{id1:props.route.params.data.id,liveID:props.route.params.data.live_id});
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });

    
  }

  const get_live = async() => {
    await axios({
      method: 'post',
      url: api_url + update_live_status,
      headers: {
        'content-type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
        status: 3,
        
      },
    })
      .then(res => {
        console.log(res.data);    
        setIsLoading(false)
        props.navigation.navigate('HostPage',{id1:props.route.params.data.id});
      })
      .catch(err => {
        setIsLoading(false)
        console.log(err);
      });

    
  }



  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <MyLoader isVisible={isLoading} />
      <View style={{ width: '95%', alignSelf: 'center' }}>
        <View style={styles.box}>
          <View style={{}}>
            <Image
              source={{ uri: img_url_astrologer + props.providerData.img_url }}
              style={{
                width: width * 0.75,
                height: width * 0.3,
                resizeMode: 'contain',
                marginBottom: 40
              }}
            />
          </View>
          <View style={styles.text1}>
            <Text style={{ color: 'black' }}>{t("title")}: </Text>
            <Text style={{ color: 'black' }}>{props.route.params.data.title}</Text>
          </View>
          <View style={styles.text1}>
            <Text style={{ color: 'black' }}>{t("description")}: </Text>
            <Text style={{ color: 'black' }}>{props.route.params.data.description}</Text>
          </View>
          <View style={styles.text1}>
            <Text style={{ color: 'black' }}>{t("date")}: </Text>
            <Text style={{ color: 'black' }}>{props.route.params.data.date}</Text>
          </View>
          <View style={styles.text1}>
            <Text style={{ color: 'black' }}>{t("time")}: </Text>
            <Text style={{ color: 'black' }}>{props.route.params.data.time}</Text>
          </View>
          <View style={{alignItems:'center', alignContent:'center',alignSelf:'center',padding:10}}>
            <TouchableOpacity 
            onPress={go_live}
            >
              <Text style={{backgroundColor:'green',padding:10,borderRadius:10}}>{t("live_now")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(LiveNow);

const styles = StyleSheet.create({
  containerBox: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background_theme3,
    borderRadius: 10,
    shadowColor: colors.black_color5,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 15,
  },
  childContainerBox: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontSize: 16,
    color: colors.black_color,
    fontFamily: fonts.semi_bold,
    marginBottom: 15,
  },
  description: {
    fontSize: 13,
    color: colors.black_color,
    fontFamily: fonts.medium,
  },
  circle: {
    flex: 0,
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 1000,
    borderWidth: 8,
    borderColor: colors.green_color2,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontSize: 22,
    color: colors.green_color2,
    fontFamily: fonts.bold,
  },
  box: {
    margin: 20,
    padding: 20,
    backgroundColor: '#eee',
    borderRadius: 10

  },
  text1: {
    color: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10
  }
});
