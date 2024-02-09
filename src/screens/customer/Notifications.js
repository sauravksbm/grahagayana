import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import MyHeader from '../../components/MyHeader';
import { colors, fonts } from '../../config/Constants';
import { connect } from 'react-redux';
import { Image } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width, height } = Dimensions.get('screen');

const Notifications = (props) => {
  const { t } = useTranslation();

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t('notification')}
          socialIcons={false}
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          props.navigation.navigate('notificationDetailes', {
            notificationData: item,
          })
        }
        style={{
          flex: 0,
          padding: 15,
          backgroundColor: item.read == 0 ? colors.background_theme2 : colors.background_theme1,
          marginBottom: 15,
          borderRadius: 10,
          shadowColor: colors.black_color8,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
        }}>
        <View style={{ flex: 0, flexDirection: 'row' }}>
          <Image
            source={
              item.image_url.length != 0
                ? { uri: item.image_url }
                : require('../../assets/images/logo.png')
            }
            style={{
              width: width * 0.18,
              height: width * 0.18,
              borderRadius: 1000,
            }}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: item.read == 0 ? colors.background_theme1 : colors.black_color7,
                fontFamily: fonts.semi_bold,
                marginBottom: 5,
              }}>
              {item.title}
            </Text>
            <Text
              numberOfLines={3}
              style={{
                fontSize: 12,
                color: item.read == 0 ? colors.background_theme1 : colors.black_color6,
                fontFamily: fonts.medium,
              }}>
              {item.description}
            </Text>
          </View>
        </View>
        <Text
          style={{
            textAlign: 'right',
            fontSize: 12,
            color: item.read == 0 ? colors.background_theme1 : colors.black_color6,
            fontFamily: fonts.medium,
          }}>
          {item.created_date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      {props.notificationData && props.notificationData.length > 0 ? (
        <FlatList
          data={props.notificationData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={{ padding: 10 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>---No notification---</Text>
        </View>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  notificationData: state.customer.notificationData,
});

export default connect(mapStateToProps, null)(Notifications);
