import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import MyStatusBar from '../../components/MyStatusbar';
import {api_url, base_url, blog, colors, fonts} from '../../config/Constants';
import {useEffect} from 'react';
import HomeHeader from '../../components/HomeHeader';
import {useState} from 'react';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import moment from 'moment/moment';

const {width, height} = Dimensions.get('screen');

const AstroBlogs = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    get_blogs();
  }, []);

  const get_blogs = async () => {
    setIsLoading(false);
    await axios({
      method: 'get',
      url: api_url + blog,
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data.data);
        setBlogData(res.data.data);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <HomeHeader navigation={props.navigation} />
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View style={{flex: 0, width: '95%', alignSelf: 'center'}}>
          {/* <View style={styles.noContentContainer}>
            <Text
              style={{
                fontSize: 16,
                color: colors.black_color8,
                fontFamily: fonts.semi_bold,
              }}>
              No Content
            </Text>
          </View> */}
          {/* <View
            style={{
              flex: 0,
              height: height * 0.16,
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/youtube_logo.jpeg')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/instagram_logo.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/facebook_logo.png')}
                style={styles.socialIcon}
              />
            </TouchableOpacity>
          </View> */}
          {blogData &&
            blogData.map((item, index) => (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('blogDetailes', {
                    blogData: item,
                  })
                }
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  backgroundColor: colors.background_theme1,
                  shadowColor: colors.black_color2,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.3,
                  marginBottom: 20,
                  marginTop:10,
                  borderWidth:1,
                  borderColor:colors.background_theme2,
                  borderRadius:10
                }}>
                <Image
                  source={{uri: item.blog_icon}}
                  style={{width: width * 0.3, height: width * 0.32}}
                />
                <View style={{flex: 1, paddingHorizontal: 10, paddingTop: 5}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color8,
                      fontFamily: fonts.bold,
                    }}>
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black_color5,
                      fontFamily: fonts.medium,
                      fontStyle: 'italic',
                    }}>
                    Posted:{' '}
                    {moment(item.created_at).format('Do MMM YYYY hh:mm A')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black_color6,
                      fontFamily: fonts.medium,
                    }}>
                    Category: {item.category_name}
                  </Text>
                  <Text
                    numberOfLines={2}
                    style={{
                      fontSize: 13,
                      marginTop: 5,
                      color: colors.black_color6,
                      fontFamily: fonts.medium,
                    }}>
                    {item.description.replace('<p>', '').replace('</p>', '')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AstroBlogs;

const styles = StyleSheet.create({
  noContentContainer: {
    flex: 0,
    height: height * 0.15,
    backgroundColor: colors.background_theme1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    borderWidth: 1,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: width * 0.16,
    height: width * 0.16,
    resizeMode: 'cover',
    borderRadius: 1000,
  },
});
