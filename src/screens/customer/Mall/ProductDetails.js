import { View, Text, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect,useState } from 'react'
import MyHeader from '../../../components/MyHeader';
import MyStatusBar from '../../../components/MyStatusbar';
const { width, height } = Dimensions.get('screen');
import { colors, get_category,api_url,provider_img_url,get_sub_category } from '../../../config/Constants';
import axios from 'axios';
import MyLoader from '../../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';

const ProductDetails = props => {
    const data = props.route.params.data

    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState([]);

    // console.log("sdsd", data)
    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Product Details"
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
        get_sub_category1();
    },[]);

    const get_sub_category1 = async() =>{
        setIsLoading(true);
        await axios({
            method: 'post',
            url: api_url + get_sub_category,
            headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: {
                category_id: data.id,
              },
          })

            .then(res => {
              console.log(res.data.data);
              setCategory(res.data.data);   
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
      
    }

    function ProductDescriptionCards() {
        return (
            <View style={{
                marginTop: 20, width: width * 0.9, padding: 10, borderRadius: 15,
                borderColor: colors.black_color,
                borderWidth: 1
            }}>

                <Text style={{ fontSize: 20, color: colors.black_color }}>
                    Benefits of E-Pooja
                </Text>
                <Text style={{ fontSize: 14, marginTop: 5, textAlign: 'justify',color:'black' }}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                </Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <MyLoader isVisible={isLoading} />
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={{
                    width: width,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: width * 0.9,
                        height: height * 0.2,
                        backgroundColor: 'green',
                        borderRadius: 20,
                        overflow: 'hidden',
                        marginTop: 20
                    }}
                    >
                        <Image source={{uri: provider_img_url + data.image}}
                            resizeMode='cover' style={{ width: '100%', height: '100%' }} />
                    </View>
                    <View style={{
                        width: width * 0.9,
                        marginVertical: 10
                    }}>
                        < Text style={{ fontSize: 22, fontWeight: 'bold', color: colors.black_color }}>
                            {data.name}
                        </Text>
                        <Text style={{ fontSize: 16, color: colors.black_color, marginVertical: 10, textAlign: 'justify' }}>
                            {data.description}
                        </Text>
                    </View>
                    <View style={{
                        width: width * 0.9,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <TouchableOpacity 
                        onPress={() => props.navigation.navigate('OrderAddress',{data:data.id})}
                        style={{ backgroundColor: colors.background_theme2, width: width * 0.3, padding: 10, borderRadius: 10 }}>
                            < Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: colors.white_color }}>
                                Book Now
                            </Text>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 22, color: colors.black_color, fontWeight: 'bold' }}>
                            ₹ {data.price}/-
                        </Text>
                    </View>
                    {/* {ProductDescriptionCards()} */}
                </View >
            </ScrollView >


        </View >
    )
    

};

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    firebaseId: state.customer.firebaseId,
  });
  
const mapDispatchToProps = dispatch => ({dispatch});
  
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);
