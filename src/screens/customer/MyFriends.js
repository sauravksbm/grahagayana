import {
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {
  all_request,
  api_url,
  colors,
  fonts,
  update_request,
} from '../../config/Constants';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import {warnign_toast} from '../../components/MyToastMessage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import moment from 'moment';

const {width, height} = Dimensions.get('screen');

const MyFriends = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [requestItem, setRequestItem] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'FRIEND REQUEST',
    });
  }, []);

  useEffect(() => {
    get_all_requests();
  }, []);

  const get_all_requests = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + all_request,
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
        setRequestData(res.data.requests);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const update_accept_reject_request = async (id, status) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + update_request,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        id: id,
        status: status,
      },
    })
      .then(res => {
        setIsLoading(false);
        console.log(res.data);
        setModalVisible(false);
        if (status == 1) {
          add_message(requestItem);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const add_message = async (requestItem, image = null) => {
    const send_msg = {
      from: requestItem?.user_id,
      message: `Hello my name is ${requestItem.username}, How are you?`,
      timestamp: new Date().getTime(),
      to: props.customerData.id,
      type: 'text',
    };

    const add_msg = {
      message: `Hello my name is ${requestItem.username}, How are you?`,
      timestamp: moment(new Date()).format('DD-MM-YYYY HH:MM:ss '),
      type: 'text',
    };

    const node = database().ref(`/UserId/${props.customerData?.id}`).push();
    const key = node.key;
    database()
      .ref(`/Messages/${requestItem?.user_id}/${props.customerData.id}/${key}`)
      .set(send_msg);
    database()
      .ref(`/Messages/${props.customerData.id}/${requestItem?.user_id}/${key}`)
      .set(send_msg);
    database()
      .ref(`/Chat/${requestItem?.user_id}/${props.customerData.id}`)
      .update(add_msg);
    database()
      .ref(`/Chat/${props.customerData.id}/${requestItem?.user_id}`)
      .update(add_msg);

    props.navigation.navigate('astrodateChat', {
      profileData: requestItem,
    });
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (item.type == 'send') {
            if (item.status == 0) {
              warnign_toast('Your request pending...');
            } else {
              props.navigation.navigate('astrodateChat', {profileData: item});
            }
          } else {
            if (item.status == 0) {
              setRequestItem(item);
              setModalVisible(true);
            } else {
              props.navigation.navigate('astrodateChat', {profileData: item});
            }
          }
        }}
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
            flex: 0.9,
            fontSize: 14,
            color: colors.black_color8,
            fontFamily: fonts.medium,
            marginLeft: 8,
          }}>
          {item.username}
        </Text>
        <View style={{flex: 0, transform: [{rotate: '90deg'}]}}>
          <Ionicons
            name={
              item.type == 'send'
                ? 'ios-return-up-back'
                : 'ios-return-up-forward'
            }
            size={15}
            color={colors.background_theme2}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={{flex: 1, width: '95%', alignSelf: 'center'}}>
        {requestData && (
          <FlatList
            data={requestData}
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
                    No Data Available...
                  </Text>
                </View>
              );
            }}
          />
        )}
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableOpacity
          onPressOut={() => setModalVisible(false)}
          style={styles.modalContainerA}>
          <View style={{...styles.modalContainerB}}>
            <Image
              source={{uri: requestItem?.image}}
              style={{
                width: width * 0.18,
                height: width * 0.18,
                borderRadius: 1000,
                position: 'absolute',
                top: (-width * 0.18) / 2,
              }}
            />
            <Text
              style={{
                fontSize: 18,
                color: colors.background_theme2,
                fontFamily: fonts.semi_bold,
                marginVertical: width * 0.06,
              }}>
              {requestItem?.username}
            </Text>
            <View
              style={{
                flex: 0,
                width: '100%',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => {
                  update_accept_reject_request(requestItem?.id, 1);
                }}
                style={{
                  width: '40%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  marginBottom: 20,
                  backgroundColor: colors.red_color1,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  Reject
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  update_accept_reject_request(requestItem?.id, 1);
                }}
                style={{
                  width: '40%',
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
                  Accept
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  update_accept_reject_request(requestItem?.id, 3);
                }}
                style={{
                  width: '40%',
                  paddingVertical: 8,
                  borderRadius: 5,
                  marginBottom: 20,
                  backgroundColor: colors.red_color1,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                    textAlign: 'center',
                  }}>
                  DND
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(MyFriends);

const styles = StyleSheet.create({
  modalContainerA: {
    flex: 1,
    backgroundColor: colors.black_color9 + '80',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainerB: {
    flex: 0,
    width: '90%',
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
