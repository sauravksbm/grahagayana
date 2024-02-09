import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {
  api_url,
  colors,
  fonts,
  get_tarot_card_detail,
} from '../../config/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardFlip from 'react-native-card-flip';
import {useState} from 'react';
import {useRef} from 'react';
import {tarot_card} from '../../config/data';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';

const {width, height} = Dimensions.get('screen');

const NameView = ({props, setNextView}) => {
  const [name, setName] = useState('');
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView>
        <ImageBackground
          source={require('../../assets/images/starbgtarot.png')}
          style={{
            width: width * 0.8,
            height: width * 0.8,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={require('../../assets/images/card_back.jpeg')}
            style={{
              width: width * 0.3,
              height: width * 0.6,
              resizeMode: 'contain',
              marginRight: 10,
            }}
          />
        </ImageBackground>
        <View
          style={{
            flex: 1,
            width: '95%',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color,
              fontFamily: fonts.semi_bold,
              marginVertical: 15,
            }}>
            Please Enter Your Name
          </Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account"
              color={colors.black_color8}
              size={25}
            />
            <TextInput
              value={name}
              placeholder="Enter name"
              placeholderTextColor={colors.black_color5}
              onChangeText={setName}
              style={{
                flex: 0,
                marginLeft: 5,
                color: colors.black_color9,
                fontFamily: fonts.medium,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => setNextView('second')}
            style={{
              width: '80%',
              backgroundColor: colors.background_theme2,
              paddingVertical: 10,
              borderRadius: 1000,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const TapCardView = ({props, setNextView, setTarotDetailes}) => {
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tarotCardData, setTarotCardData] = useState(null);
  const [indexValue, setIndexValue] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  let cardRef = useRef();

  useEffect(() => {
    set_number_of_cards();
    set_image();
  }, []);

  const set_image = () => {
    const randomElement =
      tarot_card[Math.floor(Math.random() * tarot_card.length)];
    setImageData(randomElement);
  };

  const set_number_of_cards = () => {
    let arr = [];
    for (let i = 0; i < props.route.params.total_card; i++) {
      arr.push({img: require('../../assets/images/card_back.jpeg')});
    }
    setTarotCardData(arr);
  };

  const set_data_card = img => {
    setIndexValue(prev => prev + 1);
    let arr = tarotCardData;
    arr[indexValue] = {img: img.img};
    setTarotCardData(arr);
    cardRef.flip();
  };

  const get_tarot_data = async id => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_tarot_card_detail,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        tarot_id: id,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        setTarotDetailes(prev => [
          ...prev,
          {...res.data.data, imageData: imageData},
        ]);
        set_image();
        setIsOpen(false);
        if (indexValue == props.route.params.total_card) {
          setNextView('third');
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 10,
          }}>
          {tarotCardData &&
            tarotCardData.map((item, index) => (
              <View
                key={index}
                style={{flex: 0, flexDirection: 'row', marginHorizontal: 18}}>
                <Image
                  source={item.img}
                  style={{width: width * 0.12, height: width * 0.26}}
                />
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    backgroundColor: colors.magenta_color2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    bottom: 5,
                    right: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.background_theme1,
                      fontFamily: fonts.semi_bold,
                    }}>
                    {index + 1}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <ImageBackground
          source={require('../../assets/images/starbgtarot.png')}
          style={{
            width: width * 0.8,
            height: width * 0.8,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {imageData && (
            <CardFlip
              style={styles.cardContainer}
              ref={card => (cardRef = card)}
              onFlip={value => setIsOpen(true)}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => set_data_card(imageData)}>
                <Image
                  source={require('../../assets/images/card_back.jpeg')}
                  style={{
                    width: width * 0.3,
                    height: width * 0.6,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.card}
                // onPress={() => cardRef.flip()}
              >
                <Image
                  source={imageData.img}
                  style={{
                    width: width * 0.3,
                    height: width * 0.6,
                    resizeMode: 'contain',
                    marginRight: 10,
                  }}
                />
                <View
                  style={{
                    width: '200%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.semi_bold,
                      marginVertical: 15,
                    }}>
                    {imageData.text}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.semi_bold,
                      marginVertical: 15,
                    }}>
                    Please Click on Next Button For Pick Other Cards
                  </Text>
                </View>
              </TouchableOpacity>
            </CardFlip>
          )}
        </ImageBackground>
      </ScrollView>
      {isOpen && (
        <View
          style={{
            flex: 1,
            width: '95%',
            alignSelf: 'center',
            alignItems: 'center',
            position: 'absolute',
            bottom: 15,
          }}>
          <TouchableOpacity
            onPress={() => {
              get_tarot_data(imageData.id);
              cardRef?.flip();
            }}
            style={{
              width: '80%',
              backgroundColor: colors.background_theme2,
              paddingVertical: 10,
              borderRadius: 1000,
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const ShowDetails = ({props, setNextView, tarotDetailes}) => {
  console.log(tarotDetailes);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView>
        <View
          style={{
            flex: 0,
            width: '90%',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20,
          }}>
          {tarotDetailes.map((item, index) => (
            <View
              key={index}
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ImageBackground
                source={require('../../assets/images/starbgtarot.png')}
                style={{
                  width: width * 0.6,
                  height: width * 0.6,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={item.imageData.img}
                  style={{
                    width: width * 0.18,
                    height: width * 0.3,
                    resizeMode: 'contain',
                  }}
                />
              </ImageBackground>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.black_color9,
                  fontFamily: fonts.semi_bold,
                  marginTop: 20,
                }}>
                {item.imageData.text}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 14,
                  color: colors.black_color6,
                  fontFamily: fonts.medium,
                  marginVertical: 15,
                }}>
                {item.description}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const OneCardReading = props => {
  const [nextView, setNextView] = useState('first');
  const [tarotDetailes, setTarotDetailes] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <SafeAreaView
          style={{backgroundColor: colors.background_theme2}}
          forceInset={{top: 'always', bottom: 'never'}}>
          <View
            style={{
              flex: 0,
              height: Platform.OS == 'ios' ? 0 : StatusBar.currentHeight,
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
              paddingVertical: 10,
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
                color={colors.background_theme1}
                size={25}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 0.9,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/card_back.jpeg')}
                style={{
                  width: 20,
                  height: 30,
                  resizeMode: 'contain',
                  marginRight: 10,
                }}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 16,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                }}>
                {props.route.params.title}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      ),
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      {nextView == 'first' ? (
        <NameView props={props} setNextView={setNextView} />
      ) : nextView == 'second' ? (
        <TapCardView
          props={props}
          setNextView={setNextView}
          setTarotDetailes={setTarotDetailes}
        />
      ) : (
        <ShowDetails
          props={props}
          setNextView={setNextView}
          tarotDetailes={tarotDetailes}
        />
      )}
    </View>
  );
};

export default OneCardReading;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 10,
    marginBottom: 20,
  },
  cardContainer: {
    width: width * 0.3,
    height: width * 0.6,
  },
  card: {
    width: width * 0.3,
    height: width * 0.6,
  },
});
