import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {api_astrolist1, api_url, colors, fonts} from '../../config/Constants';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyHeader from '../../components/MyHeader';
import { useTranslation } from 'react-i18next';
const {width, height} = Dimensions.get('screen');
import { useFocusEffect } from '@react-navigation/native';
const AstroForCall = props => {
  const {t} = useTranslation();
  const [astoListData, setAstroListData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("astrologer_call")}
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
    props.navigation.setOptions({
      header: () => (
        <MyHeader
        title={t("astrologer_call")}
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
    get_astrologer();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      get_astrologer();
    }, [])
  );

  const get_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setIsLoading(false);
        let arr = res.data.records
        let filter_arr = arr.filter(item=>item.astro_status != '')
        setAstroListData(filter_arr);
        setMasterDataSource(filter_arr);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.shop_name
          ? item.shop_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setAstroListData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setAstroListData(masterDataSource);
      setSearch(text);
    }
  };

  const rounditem = (item) => {
    const wallet = (item).toString();
    const slice11 = wallet.slice(0, 4);
    return slice11;
  };

  const language = (item) => {
    const languageString = item;
    const languagesArray = languageString.split(',');

// Extract Dogri and Gujarati
  const lang = languagesArray[0] +','+languagesArray[1];
  

  return lang;


  }

  const getStatusColor = status => {
    switch (status) {
      case 'Online':
        return '#57cc99';
      case 'Offline':
        return '#f94144';
      case 'Busy':
        return '#adb5bd';
      default:
        return 'white';
    }
  };
  

  const renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
      activeOpacity={1}
        onPress={() =>
          props.navigation.navigate('astrologerDetailes', {
            data: item,
            type: 'call',
          })
        }
        key={index}
        style={{
          flex: 0,
          width: width * 0.95,
          marginHorizontal: width * 0.025,
          alignSelf: 'center',
          backgroundColor: colors.white_color,
          borderRadius: 50,
          marginVertical: 10,
          shadowColor: colors.black_color5,
          shadowOffset: {width: 2, height: 1},
          shadowOpacity: 5,
          shadowRadius: 10,
          zIndex: 100,
          elevation:5
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            backgroundColor: colors.background_theme1,
            borderRadius:16,
            elevation:3
            
          }}>
          
          <View style={{
          width:'30%',
          borderRadius: 16,
          backgroundColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.52,
          shadowRadius: 2.22,
          elevation: 2,
          
       }}>
         <View style={{
           backgroundColor: '#fff',
           borderRadius: 16,
           overflow: 'hidden',
           padding:10
         }}>
            <Image
              source={{uri: item.image}}
              style={{
                width: width * 0.23,
                height: width * 0.3,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: colors.black_color8,
              }}
            />
            <View
            style={{
              flex: 0.3,
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 9,
                color: colors.black_color,
                fontFamily: fonts.medium,
                marginTop: 5,
                textAlign: 'center',
              }}>
              <Ionicons name="star" color={colors.yellow_color1} size={20} />
              {'\n'}
              {`${parseFloat(item.avg_rating).toFixed(1)} / 5`}
            </Text>
          </View>
        </View>
        </View>
          <View
          style={{
            flex: 0,
            width: '70%',
            padding:20
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'left',
              fontWeight:'bold'
            }}>
            {item.shop_name}
          </Text>
          
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'left',
            }}>
            {`Exp ${item.experience} Year`}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'left',
            }}>
            {`Language: ${language(item.language)}`}
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('astrologerDetailes', {
                data: item,
                type: 'call',
              })
            }
            style={{
              flex: 0,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding:10,
              backgroundColor: colors.background_theme2,
              marginVertical: 15,
              borderRadius: 10,
              
            }}>
            <Ionicons
              name="ios-call"
              color={colors.black_color}
              size={20}
            />
            <Text
              style={{
                fontSize: 9,
                color: colors.black_color,
                fontFamily: fonts.medium,
                textDecorationLine: 'line-through',
                marginLeft: 5,
              }}>
              {`₹ ${item.consultation_price}`}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.black_color,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {`₹ ${rounditem(parseFloat(item?.call_commission) + parseFloat(item?.call_price_m))}/min`}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{
         position:'absolute',
          padding:10,
          right:2
          
        }}>
            <Text style={{color:'white',
          borderWidth:1,
          borderColor:colors.background_theme1,
          borderRadius:20,
          padding:8,
          fontSize:14,
          fontWeight:'bold',
          backgroundColor: getStatusColor(item.current_status_call)}}>{item.current_status_call}</Text>
        </View>
        
          </View>
        
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          paddingVertical: 10,
        }}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderRadius: 1000,
            borderWidth: 1,
          }}>
          <Ionicons name="search" color={colors.black_color6} size={22} />
          <TextInput
            value={search}
            placeholder="Search Astrologer by name..."
            placeholderTextColor={colors.black_color6}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              color: colors.black_color8,
              padding: 8,
            }}
          />
        </View>
      </View>
      {astoListData && (
        <FlatList
          data={astoListData}
          renderItem={renderItems}
          keyExtractor={item => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default AstroForCall;
