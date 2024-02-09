import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity,FlatList,RefreshControl,Alert } from 'react-native'
import React, { useEffect,useState } from 'react'
import MyHeader from '../../../components/MyHeader';
import MyStatusBar from '../../../components/MyStatusbar';
const { width, height } = Dimensions.get('screen');
import { colors, get_category,api_url,provider_img_url,mall_create_phonepe_order,delete_address,get_sub_category_booking } from '../../../config/Constants';
import axios from 'axios';
import MyLoader from '../../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';


const OrderBooking =  props => {
   
    const id_booking = props.route.params.data;
    const address_id = props.route.params.address_id;
    const mobile = props.route.params.mobile;

    console.log('aadr',address_id);
    
    
const [isLoading, setIsLoading] = useState(false);
const [address, setAddress] = useState([]);
const [selectedAddress, setSelectedAddress] = useState(null);
const [isRefreshing, setIsRefreshing] = useState(false);
const [category,setCategory] = useState(false);



    
    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Order Booking"
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
          
        }, [])
      );

      useEffect(() => {
        get_sub_category1();
    },[]);

    const get_sub_category1 = async() =>{
        console.log(id_booking)
        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + get_sub_category_booking,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                id: id_booking,
              },
          })

            .then(res => {
              console.log('ddd',res.data.data);
              setCategory(res.data.data);   
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
      
    }
    
    // Phone Gateway
    const Phonepe_create_order = async(amount,cateID,ID,Price,AddressID) => {
        let data = {
            user_id: props.customerData.id,
            amount: amount,
            cate_id:cateID,
            id:ID,
            price:Price,
            Address:AddressID,
          };

          console.log(data);

    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + mall_create_phonepe_order,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
        amount: amount,
        cate_id:cateID,
        id:ID,
        price:Price,
        Address:AddressID,
      },
    })
      .then(res => {
        console.log('amount===', res.data);
        if(res.data.success == true)
        {
          setIsLoading(false);
          props.navigation.navigate('phoneView',{url:res.data.data.instrumentResponse.redirectInfo.url});
          
        }
        else
        {
          setIsLoading(false);
          Alert.alert('Try again, Payment.')
        }
        
        
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
    }
    

    const booking = ({index,item}) => {
        return (
            <View style={{flex:1}}>
            <View style={{margin:10,padding:10,justifyContent:'space-between',flexDirection:'row'}}> 
                <View style={{padding:10}}>
                    <Text style={{color:'black',fontSize:15,padding:5}}>Category ID</Text>
                    <Text style={{color:'black',fontSize:15,padding:5}}>Description</Text>
                    
                </View>
                <View style={{padding:10}}>
                    <Text style={{color:'black',fontSize:15,padding:5}}>{item.category_id}</Text>
                    <Text style={{color:'black',fontSize:15,padding:5}}>{item.description}</Text>
       
                </View>
            </View>
            <View style={{justifyContent:'space-between',flexDirection:'row',padding:20}}> 
                <View style={{padding:10}}>
                    
                    <Text style={{color:'black',fontSize:15,padding:5}}>Total</Text>
                </View>
                <View style={{padding:10}}>
                    
                    <Text style={{color:'black',fontSize:15,padding:5}}>{item.price}</Text>
                </View>
            </View>
            <View style={{alignSelf:'center',alignItems:'center'}}>
           
            <TouchableOpacity
                onPress={() => Phonepe_create_order(item.price,item.category_id,item.id,item.price,address_id)}
                style={{ backgroundColor: 'green', padding: 20, borderRadius: 10 }}>
                <Text style={{ color: 'white', fontSize: 18 }}>Payment</Text>
            </TouchableOpacity>
            </View>
            </View>
        )
    }
    
    
    return (
        <View style={{ flex: 1 }}>
            <MyLoader isVisible={isLoading} />
           
                <View style={{ flex:1}}>
                <FlatList
                data={category}
                numColumns={1}
                keyExtractor={(item) => item.id}
                renderItem={booking}
               
                />
                   </View>
        </View >
    )
    

};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });
  
  const mapDispatchToProps = dispatch => ({dispatch});
  
  export default connect(mapStateToProps, mapDispatchToProps)(OrderBooking);

  
