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
  ImageBackground,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors, fonts} from '../../config/Constants';
import RNSpeedometer from 'react-native-speedometer';
import Modal from 'react-native-modal';
import {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import {useRef} from 'react';
import Share from 'react-native-share';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const KundliMatch = props => {

  const {t} = useTranslation();

  const [matchingData] = useState(props.route.params.data);
  const [maleKundliData] = useState(props.route.params.maleKundliData);
  const [femaleKundliData] = useState(props.route.params.femaleKundliData);
  const [modalVisible, setModalVisible] = useState(false);
  const ref = useRef();

  console.log('test',femaleKundliData);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <SafeAreaView
          style={{backgroundColor: colors.background_theme2}}
          forceInset={{top: 'always', bottom: 'never'}}>
          <View
            style={{
              flex: 0,
              height: Platform.OS == 'android' ? 0 : StatusBar.currentHeight,
              backgroundColor: colors.background_theme2,
            }}>
            <StatusBar
              translucent
              backgroundColor={colors.background_theme2}
              barStyle={'light-content'}
            />
          </View>
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
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
                  props.navigation.goBack();
                }}
                style={{
                  flex: 0,
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="arrow-back"
                  color={colors.black_color}
                  size={25}
                />
              </TouchableOpacity>
              <View style={{flex: 0}}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    color: colors.black_color,
                    fontFamily: fonts.medium,
                  }}>
                  {t("kundli_matching")}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: colors.white_color,
                paddingHorizontal: 10,
                paddingVertical: 2,
                borderRadius: 1000,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color8,
                  fontFamily: fonts.medium,
                  marginRight: 5,
                }}>
                {t("share")}
              </Text>
              <Ionicons
                name="ios-logo-whatsapp"
                color={colors.green_color1}
                size={25}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ),
    });
  }, []);

  const share_matching = async () => {
    setModalVisible(false);
    ref.current.capture().then(uri => {
      console.log(uri);
      let options = {
        title:
          'Checkout the AstroKunj marriage compatibility report for Ranjeet and xxx.',
        url: uri,
      };
      Share.open(options)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            backgroundColor: colors.background_theme2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 50,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}>
          <Text
            style={{
              fontSize: 20,
              color: colors.black_color,
              fontFamily: fonts.semi_bold,
              marginTop: 15,
              marginBottom: 10,
            }}>
            {t("Compatibility_Score")}
          </Text>
          <RNSpeedometer
            value={parseFloat(matchingData?.total?.received_points)}
            size={width * 0.7}
            maxValue={36}
            allowedDecimals={1}
            innerCircleStyle={{backgroundColor: colors.background_theme2}}
            labelWrapperStyle={{
              backgroundColor: colors.white_color,
              alignSelf: 'center',
              paddingHorizontal: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: colors.green_color2,
              marginTop: 25,
            }}
          />
        </View>
        <View style={{width: '95%', alignSelf: 'center', marginTop: 50}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.semi_bold,
              fontSize: 18,
              color: colors.black_color8,
              marginBottom: 20,
            }}>
            {t("details")}
          </Text>
          <View style={{...styles.containerBox, backgroundColor: '#deab90'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("varna")}</Text>
              <Text style={styles.description}>
                {t("varna_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#8a5a44'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#8a5a44',
                }}>{`${matchingData?.varna?.received_points}/${matchingData?.varna?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#ffb3c1'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("love")}</Text>
              <Text style={styles.description}>
                {t("love_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#c9184a'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#c9184a',
                }}>{`${matchingData?.bhakut?.received_points}/${matchingData?.bhakut?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#cfe1b9'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("mental")}</Text>
              <Text style={styles.description}>
                {t("mental_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#87986a'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#87986a',
                }}>{`${matchingData?.maitri?.received_points}/${matchingData?.maitri?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#d7e3fc'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("health")}</Text>
              <Text style={styles.description}>
                {t("health_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#00a6fb'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#00a6fb',
                }}>{`${matchingData?.nadi?.received_points}/${matchingData?.nadi?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#fbc3bc'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("dominance")}</Text>
              <Text style={styles.description}>
                {t("dominance_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#f38375'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#f38375',
                }}>{`${matchingData?.vashya?.received_points}/${matchingData?.vashya?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#b7efc5'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("temperament")}</Text>
              <Text style={styles.description}>
                {t("temperament_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#25a244'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#25a244',
                }}>{`${matchingData?.gan?.received_points}/${matchingData?.gan?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#fffae5'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("destiny")}</Text>
              <Text style={styles.description}>
                {t("destiny_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#ffe14c'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#ffe14c',
                }}>{`${matchingData?.tara?.received_points}/${matchingData?.tara?.total_points}`}</Text>
            </View>
          </View>
          <View style={{...styles.containerBox, backgroundColor: '#f1a7a9'}}>
            <View style={styles.childContainerBox}>
              <Text style={styles.heading}>{t("physical")}</Text>
              <Text style={styles.description}>
               {t("physical_t")}
              </Text>
            </View>
            <View style={{...styles.circle, borderColor: '#e35053'}}>
              <Text
                style={{
                  ...styles.circleText,
                  color: '#e35053',
                }}>{`${matchingData?.yoni?.received_points}/${matchingData?.yoni?.total_points}`}</Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: fonts.bold,
              fontSize: 22,
              color: colors.black_color,
              marginVertical: 20,
            }}>
            {t("manglik_r")}
          </Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 30,
            }}>
            <View
              style={{
                flex: 0.4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginTop: 10,
                }}>
                {maleKundliData?.customer_name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.red_color1,
                  fontFamily: fonts.medium,
                  marginTop: 5,
                }}>
                {t("manglik")}
              </Text>
              <TouchableOpacity
                onPress={()=>{
                    props.navigation.navigate('showKundli', {data: maleKundliData})
                }}
                style={{
                  width: '80%',
                  backgroundColor: colors.background_theme2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                  }}>
                  {t("view_kundli")}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flex: 0.2,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/wedding-hands.png')}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  resizeMode: 'contain',
                }}
              />
            </View>
            <View
              style={{
                flex: 0.4,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{
                  width: width * 0.2,
                  height: width * 0.2,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginTop: 10,
                }}>
                {femaleKundliData?.customer_name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.red_color1,
                  fontFamily: fonts.medium,
                  marginTop: 5,
                }}>
                {t("manglik")}
              </Text>
              <TouchableOpacity
                onPress={()=>{
                    props.navigation.navigate('showKundli', {data: femaleKundliData})
                }}
                style={{
                  width: '80%',
                  backgroundColor: colors.background_theme2,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 5,
                  borderRadius: 5,
                  marginTop: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color,
                    fontFamily: fonts.semi_bold,
                  }}>
                  {t("view_kundli")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 0,
              padding: 10,
              backgroundColor: colors.background_theme2,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color,
                fontFamily: fonts.medium,
              }}>
              {t("astrokunj_conclusion")}
            </Text>
            <View style={{flex: 1, marginTop: 10}}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                }}>
                {matchingData?.conclusion?.report}
              </Text>
            </View>
            <TouchableOpacity
              onPress={()=>props.navigation.navigate('astrologerList',{test: 'astroChatList'})}
              style={{
                flex: 0,
                backgroundColor: colors.background_theme1,
                marginTop: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                }}>
               {t("chat_with_astrologer")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                flex: 0,
                backgroundColor: colors.background_theme1,
                marginTop: 20,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                }}>
                {t("share_my")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={modalVisible}
        deviceWidth={width}
        deviceHeight={Dimensions.get('window').height}
        backdropColor={colors.black_color}
        onBackdropPress={() => setModalVisible(false)}>
        <ViewShot
          ref={ref}
          options={{fileName: 'Your-File-Name', format: 'jpg', quality: 0.9}}
          style={{flex: 1}}>
          <ImageBackground
            source={require('../../assets/images/space-start.jpeg')}
            style={{width: '100%', height: '100%', alignSelf: 'center'}}>
            <View
              style={{
                flex: 0.2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{
                  width: width * 0.08,
                  height: width * 0.08,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                  marginLeft: 5,
                }}>
                {t("astrokunj")}
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={{
                    width: width * 0.13,
                    height: width * 0.13,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.semi_bold,
                    marginTop: 10,
                  }}>
                  {maleKundliData?.customer_name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.red_color1,
                    fontFamily: fonts.medium,
                    marginTop: 5,
                  }}>
                  {t("manglik")}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.2,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/wedding-hands.png')}
                  style={{
                    width: width * 0.2,
                    height: width * 0.2,
                    resizeMode: 'contain',
                  }}
                />
              </View>
              <View
                style={{
                  flex: 0.4,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/images/logo.png')}
                  style={{
                    width: width * 0.13,
                    height: width * 0.13,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.semi_bold,
                    marginTop: 10,
                  }}>
                  {femaleKundliData?.customer_name}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.red_color1,
                    fontFamily: fonts.medium,
                    marginTop: 5,
                  }}>
                 {t("manglik")}
                </Text>
              </View>
            </View>
            <View style={{flex: 0.42}}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.background_theme2,
                  fontFamily: fonts.semi_bold,
                  textAlign: 'center',
                }}>
                {t("Compatibility_Score")}
              </Text>
              <RNSpeedometer
                value={parseFloat(matchingData?.total?.received_points)}
                size={width * 0.5}
                maxValue={36}
                allowedDecimals={1}
                innerCircleStyle={{backgroundColor: colors.black_color}}
                labelStyle={{
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  fontSize: 14,
                }}
                labelNoteStyle={{fontSize: 12, fontFamily: fonts.medium}}
                labelWrapperStyle={{
                  backgroundColor: colors.black_color,
                  alignSelf: 'center',
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: colors.green_color2,
                  marginTop: 25,
                }}
              />
            </View>
            <LinearGradient
              colors={[colors.background_theme2, colors.background_theme1]}
              style={{
                flex: 0.3,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 10,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color,
                  fontFamily: fonts.bold,
                  textAlign: 'center',
                }}>
                {t("astrokunj_conclusion")}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.black_color,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                  marginTop: 10,
                }}>
                {matchingData?.conclusion?.report}
              </Text>
            </LinearGradient>
          </ImageBackground>
        </ViewShot>

        <TouchableOpacity
          onPress={share_matching}
          activeOpacity={0.8}
          style={{
            flex: 0,
            backgroundColor: colors.background_theme2,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
            }}>
              {t("share")}
          </Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default KundliMatch;

const styles = StyleSheet.create({
  containerBox: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background_theme3,
    borderRadius: 10,
    shadowColor: colors.black_color5,
    shadowOffset: {width: 0, height: 1},
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
});
