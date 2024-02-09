import {View, Text, Image, Dimensions, FlatList} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import {colors, fonts} from '../../config/Constants';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const FriendsLocation = props => {
  // const [locationData] = useState(props.route.params.locationData);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'LOCATION',
    });
  }, []);

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
          marginBottom: 15,
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
            flex: 1,
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
      <View style={{width: '95%', alignSelf: 'center'}}>
        {props.locationData && (
          <FlatList
            data={props.locationData}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={{paddingVertical: 15}}
            showsVerticalScrollIndicator={false}
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
                    No Data Available...
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
  locationData: state.astrologer.locationData,
});

export default connect(mapStateToProps, null)(FriendsLocation);
