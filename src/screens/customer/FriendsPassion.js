import {
  View,
  Text,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import MyLoader from '../../components/MyLoader';
import {colors, fonts} from '../../config/Constants';
import {connect} from 'react-redux';

const {width, height} = Dimensions.get('screen');

const FriendsPassion = props => {
  // const [passionData] = useState(props.route.params.passionData);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'PASSION',
    });
  }, []);
 
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('recommendedProfile', {profileData: item})
        }
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
      </TouchableOpacity>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <View style={{width: '95%', alignSelf: 'center'}}>
        {props.passionData && (
          <FlatList
            data={props.passionData}
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
  passionData: state.astrologer.passionData,
});

export default connect(mapStateToProps, null)(FriendsPassion);
