import {View, Text, ScrollView, Image, Dimensions} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, fonts} from '../../config/Constants';
import {useState} from 'react';
import moment from 'moment';

const {width, height} = Dimensions.get('screen');

const BlogDetailes = props => {
  const [blogData] = useState(props.route.params.blogData);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Blogs"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView>
        <Image
          source={{uri: blogData.blog_icon}}
          style={{width: width, height: width * 0.5}}
        />
        <View
          style={{
            flex: 0,
            width: '90%',
            alignSelf: 'center',
            marginVertical: 20,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.bold,
            }}>
            {blogData.title}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.black_color5,
              fontFamily: fonts.medium,
              fontStyle: 'italic',
            }}>
            Posted: {moment(blogData.created_at).format('Do MMM YYYY hh:mm A')}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            Category: {blogData.category_name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              marginTop: 5,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            {blogData.description.replace('<p>', '').replace('</p>', '')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default BlogDetailes;
