import { View, Text, ScrollView, Image,Alert, Dimensions, TouchableOpacity,FlatList,RefreshControl } from 'react-native'
import React, { useEffect,useState } from 'react'
import MyHeader from '../../../components/MyHeader';
import MyStatusBar from '../../../components/MyStatusbar';
const { width, height } = Dimensions.get('screen');
import { colors, get_category,api_url,provider_img_url,get_address,delete_address } from '../../../config/Constants';
import axios from 'axios';
import MyLoader from '../../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { add } from 'react-native-reanimated';

const OrderAddress =  props => {

    const data = props?.route?.params?.data;
    console.log('ddd',data);
   
const [isLoading, setIsLoading] = useState(false);
const [address, setAddress] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);
const [isRefreshing, setIsRefreshing] = useState(false);

    
    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Order Address"
                    navigation={props.navigation}
                    statusBar={{
                        backgroundColor: colors.background_theme2,
                        barStyle: 'light-content',
                    }}
                />
            ),
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
          getaddress();
        }, [])
      );
    

    useEffect(() => {
        getaddress();
    },[]);

    const getaddress = async() =>{

        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + get_address,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                user_id: props.customerData.id,
              },
          })

            .then(res => {
              console.log(res.data.data);
              setAddress(res.data.data);   
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
      
    }

    const handleRefresh = () => {
        setIsRefreshing(true);
        getaddress();
        setIsRefreshing(false);
      };

    const deleteaddress = async(id) =>{

        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + delete_address,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                id: id,
              },
          })

            .then(res => {
              console.log(res.data.data);
                
              setIsLoading(false)
              handleRefresh();
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err,'===');
            });
      
    }

    const button1 = () =>
    {
        console.log('ttt',selectedAddress);
        if(!selectedAddress)
        {
            Alert.alert("Please Select an Address");
            return false;
        }
        else
        {
            props.navigation.navigate('OrderBooking',{data:data,address_id:selectedAddress.id,mobile:selectedAddress.mobile});
        }
    }

    const edit = (id) => {
      props.navigation.navigate('addaddress',{data:data,edit:id})
    }

    const Address_add = ({ item, selected, onSelect }) => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onSelect(item)}
            style={{
              borderRadius: 10,
              backgroundColor: selected ? 'grey' : '#ddd',
              margin: 10,
              padding: 20,
            }}
          >
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <View style={{ }}>
            <Text style={{ color: selected ? 'white' : 'black', fontSize: 18 }}>{item.mobile}</Text>
            <View>
              <Text style={{color:'black',fontSize: 18}}>Address:</Text>
              <Text style={{ color: selected ? 'white' : 'black' }}>
                 {item.address}
              </Text>
              {item.address_line ? ( <Text style={{ color: selected ? 'white' : 'black' }}>
                {item.address_line}
              </Text>):null}
              <Text style={{ color: selected ? 'white' : 'black' }}>{item.city}</Text>
              <Text style={{ color: selected ? 'white' : 'black' }}>{item.state}</Text>
              <Text style={{ color: selected ? 'white' : 'black' }}>{item.pincode}</Text>
              </View>
              
            </View>
            <View style={{justifyContent:'space-between'}}>
            <View>
                <TouchableOpacity onPress={() => deleteaddress(item.id)}>
                <MaterialIcons 
                      name="delete"
                      color={colors.black_color7}
                      size={25}
                    />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress={() => edit(item.id)}>
                <MaterialIcons 
                      name="edit"
                      color={colors.black_color7}
                      size={25}
                    />
                </TouchableOpacity>
            </View>
            </View>
            </View>    
          </TouchableOpacity>
        );
      };

      const handleSelect = (address) => {
        console.log(address.id);
        setSelectedAddress(address);
      };

    return (
        <View style={{ flex: 1 }}>
            <MyLoader isVisible={isLoading} />
           
                <View style={{ paddingBottom: 60,flex:1}}>
                <FlatList
                data={address}
                numColumns={1}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Address_add
                    item={item}
                    selected={selectedAddress === item}
                    onSelect={handleSelect}
                    />
                )}
                refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={handleRefresh}
                      colors={['#007AFF']} // Customize the loading spinner color
                    />
                  }
                />
                    </View>
                    <View style={{justifyContent:'flex-end',alignItems:'flex-end',margin:20}}>
                        <TouchableOpacity onPress={() => props.navigation.navigate('addaddress',{data:data})} 
                        style={{
                            right:0,
                            backgroundColor:colors.background_theme2,
                            width:50,
                            justifyContent:'center',
                            borderRadius:100,
                            
                        }}
                        activeOpacity={0.8}
                        >
                            <Text style={{color:'white',fontSize:34,alignSelf:'center'}}>+</Text>
                        </TouchableOpacity>
                        </View>
                        <View>
                        <TouchableOpacity onPress={() => button1()} 
                        style={{backgroundColor:colors.background_theme2,
                        margin:20,padding:10,borderRadius:20}}
                        activeOpacity={0.8}>
                            <Text style={{color:'white',fontSize:18,alignSelf:'center'}}>Set Address</Text>
                        </TouchableOpacity>
                    </View>
        </View >
    )
    

};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });
  
  const mapDispatchToProps = dispatch => ({dispatch});
  
  export default connect(mapStateToProps, mapDispatchToProps)(OrderAddress);
