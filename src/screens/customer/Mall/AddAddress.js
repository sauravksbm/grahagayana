import { View, Text, ScrollView, Image, Dimensions,Alert, TouchableOpacity,TextInput,KeyboardAvoidingView,StyleSheet } from 'react-native'
import React, { useEffect,useState } from 'react'
import MyHeader from '../../../components/MyHeader';
import MyStatusBar from '../../../components/MyStatusbar';
const { width, height } = Dimensions.get('screen');
import { colors, get_category,api_url,provider_img_url,add_address,fonts,edit_address,update_address } from '../../../config/Constants';
import axios from 'axios';
import MyLoader from '../../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';

const Addaddress =  props => {
   
const [isLoading, setIsLoading] = useState(false);
const [category, setCategory] = useState([]);
const [address,setAddress] = useState('');
const [address_line,setAddress_line] = useState(null);
const [name,setName] = useState('');
const [mobile,setMobile] = useState('');
const [altmobile,setAltmobile] = useState('');
const [landmark,setlandmark] = useState('');
const [birthPlace, setBirthPlace] = useState('');
const [latLong, setLatLong] = useState(null);
const [city,setCity] = useState(null);
const [state,setState] = useState(null);
const [pincode,setPincode] = useState(null);

const data = props?.route?.params?.data;
    console.log('dddaaaa',data);

const edit = props?.route?.params?.edit;
    
    useEffect(() => {
      {edit == null ? (props.navigation.setOptions({
        header: () => (
            <MyHeader
                title="Add Address"
                navigation={props.navigation}
                statusBar={{
                    backgroundColor: colors.background_theme2,
                    barStyle: 'light-content',
                }}
            />
        ),
    })):(props.navigation.setOptions({
      header: () => (
          <MyHeader
              title="Update Address"
              navigation={props.navigation}
              statusBar={{
                  backgroundColor: colors.background_theme2,
                  barStyle: 'light-content',
              }}
          />
      ),
  }))}
        
    }, []);

    useEffect(() => {
      getaddress();
  },[]);

  const getaddress = async() =>{

      setIsLoading(true);
      await axios({
          method: 'post',
          url: api_url + edit_address,
          headers: {
              'Content-Type': 'multipart/form-data',
            },
            data: {
              id: edit,
            },
        })

          .then(res => {
            console.log('edit==',res.data.data);
            setName(res.data.data[0].name);
            setMobile(res.data.data[0].mobile);
            setAddress(res.data.data[0].address);
            setAddress_line(res.data.data[0].address_line);
            setCity(res.data.data[0].city);
            setState(res.data.data[0].state);
            setPincode(res.data.data[0].pincode);


            setIsLoading(false)
          })
          .catch(err => {
            setIsLoading(false)
            console.log(err);
          });
    
  }


  const regex_speical = /^[A-Za-z\s]+$/;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const validation = () => {
        if (name.length == 0) {
          Alert.alert('Please enter your first name');
          return false;
        } else if (!regex_speical.test(name)) {
          Alert.alert('Please enter your Name characters only');
          return false;
        } else if (mobile.length == 0) {
            Alert.alert('Please enter your Mobile');
          return false;
        } else if (mobile.length != 10) {
            Alert.alert('Please enter your Mobile 10 digits');
          return false;
        } else if (address.length == 0) {
            Alert.alert('Please enter your address');
          return false;
        } else if (city.length == 0) {
            Alert.alert('Please enter your city');
          return false;
        } else if (state.length == 0) {
          Alert.alert('Please enter your state');
          return false;
        } else if (pincode.length == 0) {
          Alert.alert('Please upload your pincode');
          return false;
        } else {
          return true;
        }
      };

    

    const submit = async() =>{
        if(validation()) {
        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + add_address,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                user_id: props.customerData.id,
                address: address,
                name: name,
                mobile: mobile,
                address_line: address_line,
                city: city,
                state:state,
                pincode:pincode,
              },
          })

            .then(res => {
              console.log('dd',res.data);
              props.navigation.navigate('OrderAddress',{data:data});   
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
        }
    }

    const update = async() => {
      console.log('ddd');
      if(validation()) {
        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + update_address,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                id: edit,
                address: address,
                name: name,
                mobile: mobile,
                address_line: address_line,
                city: city,
                state:state,
                pincode:pincode,
              },
          })

            .then(res => {
              console.log('dd',res.data);
              props.navigation.navigate('OrderAddress',{data:data});   
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <MyLoader isVisible={isLoading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={{padding:20}}>
                <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={name}
                    placeholder="Enter Your name"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setName(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={mobile}
                    placeholder="Enter Mobile Number"
                    keyboardType="numeric"
                    maxLength={10}
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setMobile(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={address}
                    placeholder="Enter Your Address Line 1"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setAddress(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={address_line}
                    placeholder="Enter Your Address Line 2 (Optional)"
                    placeholderTextColor={colors.black_color5}
                    
                    onChangeText={text => {
                      setAddress_line(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('placeOfAddress', {
                    set_place_of_birth: setBirthPlace,
                    set_lat_long: setLatLong,
                  });
                }}
                style={styles.inputContainer}>
                
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color5,
                    marginBottom: 15,
                    marginLeft:12,
                    marginTop:15,
                    marginRight:12
                  }}>
                  {birthPlace != null ? birthPlace : 'Enter Address'}
                </Text>
              </TouchableOpacity> */}
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={city}
                    placeholder="Enter Your City"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setCity(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={state}
                    placeholder="Enter Your State"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setState(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                  />
                </KeyboardAvoidingView>
              </View>
              <View style={styles.inputContainer}>
                <KeyboardAvoidingView
                  behavior={Platform.OS == 'android' ? 'padding' : 'height'}>
                  <TextInput
                    value={pincode}
                    placeholder="Enter Your Pincode"
                    placeholderTextColor={colors.black_color5}
                    onChangeText={text => {
                      setPincode(text);
                    }}
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: colors.black_color9,
                      fontWeight: 'normal',
                    }}
                    maxLength={6}
                    keyboardType="numeric"
                  />
                </KeyboardAvoidingView>
              </View>
              {edit == null ? (<View>
                    <TouchableOpacity onPress={submit}
                    style={{backgroundColor:colors.background_theme2,
                    borderRadius:25,
                    padding:10,
                    }}
                    activeOpacity={0.8}>
                        <Text style={{color:'white',alignSelf:'center',fontSize:18}}>Add Address</Text>
                    </TouchableOpacity>
                </View>):(<View>
                    <TouchableOpacity onPress={update}
                    style={{backgroundColor:colors.background_theme2,
                    borderRadius:25,
                    padding:10,
                    }}
                    activeOpacity={0.8}>
                        <Text style={{color:'white',alignSelf:'center',fontSize:18}}>Update</Text>
                    </TouchableOpacity>
                </View>)}
                
              </View>

                
            </ScrollView >


        </View >
    )
    

};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });
  
  const mapDispatchToProps = dispatch => ({dispatch});
  
  export default connect(mapStateToProps, mapDispatchToProps)(Addaddress);

  const styles = StyleSheet.create({
    buttonContainer: {
      width: '40%',
      paddingVertical: 12,
      borderRadius: 25,
      backgroundColor: colors.background_theme2,
    },
    buttonText: {
      fontSize: 14,
      color: colors.background_theme1,
      fontFamily: fonts.bold,
      textAlign: 'center',
    },
    inputContainer: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.2,
      borderColor: colors.background_theme2,
      padding: 2,
      borderRadius:50,
      marginBottom: 20,
      padding:2
    },
    checkBoxText: {
      fontSize: 14,
      color: colors.black_color8,
      fontFamily: fonts.medium,
      textDecorationLine: 'none',
    },
  });
  
