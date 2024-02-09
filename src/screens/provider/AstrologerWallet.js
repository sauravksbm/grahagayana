import {View, Text, FlatList} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {
  api_url,
  colors,
  fonts,
  get_astro_payments,
} from '../../config/Constants';
import DropDownPicker from 'react-native-dropdown-picker';
import {useState} from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import { useTranslation } from 'react-i18next';

const AstrologerWallet = props => {
  const {t} = useTranslation()
  const [marriedStatusOpen, setMarriedStatusOpen] = useState(false);
  const [marriedValue, setMarriedValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [paybleAmount, setPaybleAmount] = useState(0);
  const [marriedItems, setMarriedItems] = useState([
    {label: 'Today', value: '0'},
    {label: 'January-2023', value: '1'},
    {label: 'February-2023', value: '2'},
    {label: 'March-2023', value: '3'},
    {label: 'April-2023', value: '4'},
    {label: 'May-2023', value: '5'},
    {label: 'June-2023', value: '6'},
    {label: 'July-2023', value: '7'},
    {label: 'August-2023', value: '8'},
    {label: 'September-2023', value: '9'},
    {label: 'October-2023', value: '10'},
    {label: 'November-2023', value: '11'},
    {label: 'December-2023', value: '12'},
  ]);
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("wallet")}
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
    setMarriedValue(new Date().getMonth().toString())
    get_payments(new Date().getMonth().toString());
  }, []);

  const get_payments = async (month) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_astro_payments,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
        month: month,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          setPaybleAmount(res.data.total_paid);
          setPaymentData(res.data.res);
        }
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
          backgroundColor: colors.background_theme1,
          borderRadius: 5,
          shadowColor: colors.black_color3,
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.3,
          shadowRadius: 5,
          padding: 10,
          marginBottom: 15
        }}>
        <Text
          style={{
            fontSize: 18,
            color: colors.black_color9,
            fontFamily: fonts.bold,
            textAlign: 'center',
            marginBottom: 15,
          }}>
          {t("orderid")}: {item.id}
        </Text>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color8,
              fontFamily: fonts.medium,
            }}>
            {t("note1")}: {item.note}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color8,
              fontFamily: fonts.semi_bold,
            }}>
            ₹ {item.amount}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 12,
            color: colors.black_color8,
            fontFamily: fonts.medium,
            textAlign: 'right',
          }}>
         {item.created_at}
        </Text>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <MyLoader isVisible={isLoading} />
      <View style={{width: '90%', alignSelf: 'center', marginTop: 15}}>
        <DropDownPicker
          open={marriedStatusOpen}
          //   onOpen={onMarriedOpen}
          placeholder="June-2023"
          listMode="SCROLLVIEW"
          value={marriedValue}
          items={marriedItems}
          setOpen={setMarriedStatusOpen}
          setValue={setMarriedValue}
          setItems={setMarriedItems}
          onChangeValue={(item)=>{
            get_payments(item)
          }}
          style={{
            marginBottom: 20,
            borderWidth: 1,
            borderColor: colors.black_color3,
            zIndex: 99,
          }}
          dropDownDirection="AUTO"
          bottomOffset={10}
          dropDownContainerStyle={{
            backgroundColor: colors.background_theme1,
            shadowColor: colors.black_color3,
            borderWidth: 1,
            borderColor: colors.black_color3,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            marginBottom: 10,
            zIndex: 99,
          }}
        />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flex: 0.23,
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("available_balance")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              ₹ {props.dashboard?.data?.Walletbalance}
            </Text>
          </View>
          <View
            style={{
              flex: 0.23,
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("pg_charge")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              2%
            </Text>
          </View>
          <View
            style={{
              flex: 0.23,
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("TDS")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              10%
            </Text>
          </View>
          <View
            style={{
              flex: 0.23,
              height: 70,
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color8,
                fontFamily: fonts.medium,
                textAlign: 'center',
              }}>
              {t("Payable")}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color9,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              ₹ {paybleAmount}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{flex: 1, width: '95%', alignSelf: 'center', marginTop: 15, zIndex: -1}}>
        {paymentData && <FlatList data={paymentData} renderItem={renderItem} />}
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
  dashboard: state.provider.dashboard,
});

export default connect(mapStateToProps, null)(AstrologerWallet);
