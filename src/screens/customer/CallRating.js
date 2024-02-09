import {
    View,
    Text,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TextInput,
  } from 'react-native';
  import React from 'react';
  import {useEffect} from 'react';
  import MyHeader from '../../components/MyHeader';
  import {api_addreview, api_url, colors, fonts,api2_get_profile} from '../../config/Constants';
  import {Rating} from 'react-native-ratings';
  import {useState} from 'react';
  import axios from 'axios';
  import {warnign_toast} from '../../components/MyToastMessage';
  import {connect} from 'react-redux';
  import {CommonActions} from '@react-navigation/native';
  import * as CustomerActions from '../../redux/actions/CustomerActions';
  import MyLoader from '../../components/MyLoader';
  
  const {width, height} = Dimensions.get('screen');
  
  const my_services = [
    {
      id: 1,
      text: 'Slowly responded',
    },
    {
      id: 2,
      text: 'Less explanation',
    },
    {
      id: 3,
      text: 'Politeness',
    },
    {
      id: 4,
      text: 'Too costly',
    },
  ];
  
  const CallRating = props => {
    const [astroData] = useState(props.route.params?.astroData);
    const [ratingCounts, setRatingCounts] = useState(0);
    const [comments,setComments] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectService, setSelectService] = useState([]);
    useEffect(() => {
      props.navigation.setOptions({
        header: () => (
          <MyHeader
            title="Service feedback is important"
            navigation={props.navigation}
            statusBar={{
              backgroundColor: colors.background_theme2,
              barStyle: 'light-content',
            }}
          />
        ),
      });
    }, [selectService.length]);
  
    const on_submit = async () => {
      if (selectService.length == 0) {
        warnign_toast('Please select a service for review.');
      } else {
        setIsLoading(true);
        await axios({
          method: 'post',
          url: api_url + api_addreview,
          data: {
            user_id: props.customerData.id,
            vendor_id: astroData.id,
            listing_id: 1,
            child_cat_id: 1,
            star: ratingCounts,
            review: 'sdnfkdshfjkdshjf',
            transid: 'dsnfksdjfhdjsf',
            comments: comments,
          },
        })
          .then(res => {
            setIsLoading(false);
            console.log(res.data);
            customer_profile();
           
          })
          .catch(err => {
            setIsLoading(false);
            console.log(err);
          });
      }
    };
  
    const customer_profile = async id => {
      let data = new FormData();
      data.append('user_id', props.customerData.id);
      await axios({
        method: 'post',
        url: api_url + api2_get_profile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: data,
      })
        .then(res => {
          console.log('aaa===',res.data);
          props.dispatch(
            CustomerActions.setWallet(res.data.user_details[0]?.wallet),
          );
          home();
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    const home = () => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'home'}],
        }),
      );
    };
  
    const on_rating = rate => {
      setRatingCounts(rate);
      console.log(rate);
    };
  
    function getPositiveNumber(number) {
      if (number < 0) {
        return 0;
      } else {
        return number;
      }
    }
  
    const handletextchange = (text) => {
      setComments(text);
    };
  
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyLoader isVisible={isLoading} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{width: '90%', alignSelf: 'center', paddingVertical: 20}}>
            <KeyboardAvoidingView
              behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
              <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={
                    astroData?.image != null || astroData?.image != ''
                      ? {uri: astroData?.image}
                      : require('../../assets/images/logo.png')
                  }
                  style={{
                    width: width * 0.22,
                    height: width * 0.22,
                    resizeMode: 'contain',
                  }}
                />
                <View style={{marginLeft: 15}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: colors.black_color,
                      fontFamily: fonts.bold,
                    }}>
                    {astroData?.owner_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                    }}>
                    Time Spend:{' '}
                    {`${props.route.params.total_time} min`}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: colors.black_color,
                      fontFamily: fonts.medium,
                    }}>
                    Total Charge:{' '}
                    {`₹ ${astroData.total}`}
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 20,
                  color: colors.black_color,
                  fontFamily: fonts.bold,
                  marginVertical: 15,
                }}>
                Please rate our service
              </Text>
              <Rating
                startingValue={0}
                type="custom"
                onFinishRating={on_rating}
                ratingCount={5}
                style={{alignSelf: 'flex-start'}}
                ratingColor={colors.yellow_color1}
                ratingBackgroundColor={colors.black_color2}
                tintColor={colors.black_color1}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginVertical: 15,
                }}>
                Please rate our service
              </Text>
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {my_services.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      let finded =
                        selectService.findIndex(index => index.id == item.id) !=
                        -1;
                      console.warn(finded);
                      if (finded) {
                        let index = selectService.findIndex(i => i.id == item.id);
                        let arr = [];
                        for (let i in selectService) {
                          if (i != index) {
                            arr.push(selectService[i]);
                          }
                        }
                        setSelectService(arr);
                      } else {
                        setSelectService(prev => [...prev, item]);
                      }
                    }}
                    key={index}
                    style={{
                      ...styles.serviceContainer,
                      backgroundColor:
                        selectService.findIndex(index => index.id == item.id) !=
                        -1
                          ? colors.yellow_color1
                          : null,
                    }}>
                    <Text style={styles.serviceText}>{item.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text
                style={{
                  fontSize: 18,
                  color: colors.black_color,
                  fontFamily: fonts.semi_bold,
                  marginVertical: 15,
                }}>
                Comments
              </Text>
  
              <TextInput
                placeholder="Type here your comments..."
                placeholderTextColor={colors.black_color5}
                keyboardType="default"
                keyboardAppearance="dark"
                onChangeText={handletextchange}
                multiline={true}
                style={{
                  height: height * 0.18,
                  borderWidth: 1,
                  borderColor: colors.yellow_color1,
                  borderRadius: 5,
                  padding: 5,
                  color:'black',
                  verticalAlign:'top',
                  textAlignVertical:'top'
                }}
              />
              <TouchableOpacity
                onPress={on_submit}
                style={{
                  flex: 0,
                  backgroundColor: colors.background_theme2,
                  marginVertical: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderRadius: 6,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                  }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  const mapStateToProps = state => ({
    customerData: state.customer.customerData,
  });
  
  export default connect(mapStateToProps, null)(CallRating);
  
  const styles = StyleSheet.create({
    serviceContainer: {
      width: width * 0.43,
      paddingVertical: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.yellow_color1,
      borderRadius: 5,
      marginBottom: 15,
    },
    serviceText: {
      fontSize: 14,
      color: colors.black_color,
      fontFamily: fonts.medium,
    },
  });
  