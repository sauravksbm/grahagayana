import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {
  colors,
  get_category,
  api_url,
  provider_img_url,
  fonts,
} from '../../config/Constants';
import HomeHeader from '../../components/HomeHeader';
import Icon from 'react-native-vector-icons/AntDesign';
const {width, height} = Dimensions.get('screen');
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';

export default function AstroMall(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, [props.notificationData]);

  useEffect(() => {
    get_category1();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      get_category1();
    }, []),
  );

  const get_category1 = async () => {
    await axios({
      method: 'post',
      url: api_url + get_category,
    })
      .then(res => {
        console.log('dddd=========', res.data.data);
        setCategory(res.data.data);
        setMasterDataSource(res.data.data);
        setIsLoading(false);
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
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setCategory(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setCategory(masterDataSource);
      setSearch(text);
    }
  };

  const ProductCard = ({item, index}) => {
    return (
      <TouchableOpacity
        style={[styles.card]}
        onPress={() => props.navigation.navigate('categoryList', {data: item})}
        key={index}>
        <ImageBackground
          source={{uri: provider_img_url + item.image}}
          style={{height: height * 0.25, width: width * 0.4}}>
          {/* <Text style={styles.name}>{product.name}</Text> */}
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <View style={{flex: 0, backgroundColor: colors.black_color1}}>
        <HomeHeader navigation={props.navigation} headerTitle={'Astro Mall'} />

        <View
          style={{
            flex: 0,
            backgroundColor: colors.background_theme1,
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
              backgroundColor: colors.background_theme1,
            }}>
            <Ionicons name="search" color={colors.black_color6} size={22} />
            <TextInput
              value={search}
              placeholder="Search Mall by name..."
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
        <View
          style={{
            flex: 0,
            paddingBottom: 60,
            marginBottom: 160,
            paddingLeft: 20,
            backgroundColor: colors.background_theme1,
          }}>
          <FlatList
            data={category}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={ProductCard}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    width: width * 0.4,
    borderRadius: 10,
    overflow: 'hidden',
    height: height * 0.25,
    margin: 10,
    elevation: 4,
  },
  backgroundImage: {
    flex: 1, // Make the background cover the entire component
    resizeMode: 'cover', // Set how the image should be resized to cover the container
  },
  name: {
    fontSize: 18,
    position: 'absolute',
    bottom: 10,
    textAlign: 'center',
    color: colors.white_color,
    fontWeight: 'bold',
    width: '100%',
    backgroundColor: colors.background_theme2,
  },
  leftItem: {
    marginLeft: 0, // Left-align the first item
  },
  centeredItem: {
    marginLeft: 'auto', // Center-align the rest of the items
    marginRight: 'auto', // Center-align the rest of the items
  },
});
