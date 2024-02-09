import {View, Text, FlatList, Dimensions} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyLoader from '../../components/MyLoader';
import {api_url, colors, fonts, liked, liked_me} from '../../config/Constants';
import {Image} from 'react-native';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const LikeByMe = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [likesData, setLikesData] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'LIKE BY ME',
    });
  }, []);
  useEffect(() => {
    get_all_likes();
  }, []);

  const get_all_likes = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + liked,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        console.log(res.data);
        setIsLoading(false);
        setLikesData(res.data.users);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const renderItem = ({item, index}) => {
    return (
      <View
        style={{
          flex: 0,
          width: '45%',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background_theme1,
          borderRadius: 5,
          padding: 5,
          shadowColor: colors.black_color2,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          marginHorizontal: width * 0.025,
          marginBottom: 15
        }}>
        <Image
          source={{uri: item.image}}
          style={{
            width: width * 0.12,
            height: width * 0.12,
            borderRadius: 1000,
          }}
        />
        <Text
          style={{
            fontSize: 14,
            color: colors.black_color8,
            fontFamily: fonts.medium,
            marginLeft: 8,
          }}>
          {item.username}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={{width: '95%', alignSelf: 'center'}}>
        {likesData && (
          <FlatList
            data={likesData}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{paddingVertical: 15}}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    flex: 0,
                    height: height * 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.black_color5,
                      fontFamily: fonts.medium,
                    }}>
                    No Data Available
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(LikeByMe);
