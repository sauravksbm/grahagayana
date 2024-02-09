import {
  View,
  Text,
  FlatList,
  Switch,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_url,
  astrologer_offer,
  colors,
  fonts,
  get_astrologer_offer,
} from '../../config/Constants';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import { useTranslation } from 'react-i18next';



const ProviderOffer = props => {
  const {t} = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState(null);

  const offer_data = [
    {
      id: 75,
      offer_name: '75% OFF',
      display_name: '75% OFF',
      user_type: 'All Users',
      my_share: '₹ 2.5',
      at_shate: '₹ 2.5',
      custome_pays: '₹ 5.0',
    },
    {
      id: 20,
      offer_name: '20% OFF',
      display_name: '20% OFF',
      user_type: 'All Users',
      my_share: '₹ 7.5',
      at_shate: '₹ 7.5',
      custome_pays: '₹ 15.0',
    },
    {
      id: 'HBO',
      offer_name: 'Happy Birthday Offer',
      display_name: 'Happy Birthday Offer',
      user_type: 'All Users',
      my_share: '₹ 9.5',
      at_shate: '₹ -0.5',
      custome_pays: '₹ 9.0',
    },
    {
      id: 50,
      offer_name: 'Happy Hours',
      display_name: '50% OFF',
      user_type: 'All Users',
      my_share: '₹ 4.5',
      at_shate: '₹ 4.5',
      custome_pays: '₹ 9.0',
    },
  ];

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("astrologer_offers")}
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

  useEffect(() => {
    check_is_offer_active();
  }, []);

  const check_is_offer_active = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_astrologer_offer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: props.providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          setIsActive(res.data.discount);
        } else {
          success_toast(res.data.msg);
          setIsActive(false);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const is_offer_active = async (discount, type) => {
    setIsLoading(true);
    setIsActive(false);
    setType(false);
    await axios({
      method: 'post',
      url: api_url + get_astrologer_offer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: props.providerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          warnign_toast('Try after some time');
          check_is_offer_active();
          setModalVisible(false);
        } else {
          apply_offer(discount, type);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const apply_offer = async (discount, type) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + astrologer_offer,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astrologer_id: props.providerData.id,
        discount: discount,
        type: type,
      },
    })
      .then(res => {
        setIsLoading(false);
        check_is_offer_active();
        setModalVisible(false);
        success_toast('Update!');
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
          flexDirection: 'row',
          alignItems: 'flex-start',
          padding: 10,
          backgroundColor: colors.background_theme1,
          borderRadius: 10,
          shadowColor: colors.black_color3,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
          marginBottom: 15,
        }}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color6,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
            {t("offer_name")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.offer_name}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            {t("display_name")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.display_name}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            {t("user_type")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.user_type}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            {t("my_share")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.my_share}
            </Text>{' '}
            {t("at_share")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.at_shate}
            </Text>
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color6,
              fontFamily: fonts.medium,
            }}>
            {t("customer_pays")}:{' '}
            <Text style={{color: colors.background_theme2}}>
              {item.custome_pays}
            </Text>
          </Text>
        </View>
        <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme2,
              fontFamily: fonts.semi_bold,
              marginRight: 5,
            }}>
            {isActive == item.id ? 'ON' : 'OFF'}
          </Text>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isActive == item.id ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              setIsActive(item.id),
                setType(isActive == item.id),
                setModalVisible(true);
            }}
            value={isActive == item.id}
          />
        </View>
      </View>
    );
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      {/* <MyLoader isVisible={isLoading} /> */}
      <FlatList
        data={offer_data}
        renderItem={renderItem}
        contentContainerStyle={{padding: 15}}
        keyExtractor={item => item.id}
      />
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainerA}>
          <View style={{...styles.modalContainerB}}>
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
              }}>
              Apply Offer
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: colors.black_color6,
                fontFamily: fonts.medium,
                textAlign: 'center',
                marginVertical: 15,
              }}>
              It will remain active for a certain time, before that it cannot be
              deactivated.{'\n\n'}
              Do you want to proceed
            </Text>
            <TouchableOpacity
              onPress={() => is_offer_active(isActive, type ? 0 : 1)}
              style={{
                width: '100%',
                backgroundColor: colors.background_theme2,
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.background_theme1,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                check_is_offer_active();
              }}
              style={{
                width: '100%',
                paddingVertical: 8,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                  textAlign: 'center',
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(ProviderOffer);

const styles = StyleSheet.create({
  boxContainerA: {
    flex: 0,
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.green_color2,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  boxContainerB: {
    flex: 0,
    width: '90%',
    borderWidth: 1,
    borderColor: colors.white_color,
    shadowColor: colors.black_color7,
    shadowOffset: {width: -2, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: '20%',
    borderRadius: 20,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background_theme2,
  },

  modalContainerA: {
    flex: 1,
    backgroundColor: colors.black_color9 + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerB: {
    flex: 0,
    width: '90%',
    height: 250,
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
  },
  modalContainerBB: {
    flex: 0,
    width: '90%',
    backgroundColor: colors.background_theme1,
    borderRadius: 20,
    padding: 15,
    maxHeight: 300,
    overflow: 'scroll',
  },
  modalContainerC: {
    flex: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTextA: {
    fontSize: 16,
    color: colors.background_theme2,
    fontFamily: fonts.semi_bold,
  },
  modalTextB: {
    fontSize: 14,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
});
