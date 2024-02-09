import { View, Text, ScrollView, Dimensions, TextInput, TouchableOpacity, ImageBackground,FlatList, StyleSheet, RefreshControl } from 'react-native'
import React, { useEffect,useState } from 'react'
import MyStatusBar from '../../../components/MyStatusbar';
import { colors, get_category,api_url,provider_img_url,get_sub_category,fonts } from '../../../config/Constants';
import HomeHeader from '../../../components/HomeHeader';
import Icon from 'react-native-vector-icons/AntDesign'
// import { FlatList } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('screen');
import axios from 'axios';
import MyHeader from '../../../components/MyHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MyLoader from '../../../components/MyLoader';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

const CategoryList = props => {

    const data = props.route.params.data;
    console.log(data);

    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState([]);
    const [search, setSearch] = useState('');
    const [masterDataSource, setMasterDataSource] = useState([]);
       
    useEffect(() => {
        props.navigation.setOptions({
            header: () => (
                <MyHeader
                    title="Category List"
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

    useFocusEffect(
      React.useCallback(() => {
        get_sub_category1();
      }, [])
    );

    

    const get_sub_category1 = async() =>{
      setIsLoading(true)
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
              console.log('data====',res.data.data);
              setCategory(res.data.data);  
              setMasterDataSource(res.data.data);
              setIsLoading(false)
            })
            .catch(err => {
              setIsLoading(false)
              console.log(err);
            });
      
    }

    const searchFilterFunction = text => {
        // Check if searched text is not blank
        if (text) {
          // Inserted text is not blank
          // Filter the masterDataSource and update FilteredDataSource
          const newData = masterDataSource.filter(function (item) {
            // Applying filter for the inserted text in search bar
            const itemData = item.name
              ? item.name.toUpperCase()
              : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          });
          setCategory(newData);
          setSearch(text);
        } else {
          // Inserted text is blank
          // Update FilteredDataSource with masterDataSource
          setCategory(masterDataSource);
          setSearch(text);
        }
      };

      const ProductCard = ({index,item}) => {
        // console.log('sssssssssssss==============',item);
        return (
    
            
            <TouchableOpacity style={styles.card}
                key={index}
                activeOpacity={0.9}
            >
                <ImageBackground source={{uri:provider_img_url + item.image }} style={{height:height  * 0.25,width:width*0.4, backgroundColor:'rgba(0,0,0,1)',opacity:0.7 }}>
                    <View style={{backgroundColor:'black'}}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center'}}>
                    <Text style={{right:2,
                        color:colors.background_theme1,
                        fontStyle:'bold',
                        padding:5,
                        borderBottomLeftRadius:10,
                        
                        marginBottom:80
                        }}>{'\u20B9'} {item.price}</Text>
                        <TouchableOpacity 
                        activeOpacity={0.8}
                        onPress={() =>
                    props.navigation.navigate('productdetails', { data: item })
                }>
                        <Text style={{fontSize:14,color:colors.background_theme1,borderRadius:20,
                        borderWidth:1,borderColor:colors.background_theme1,padding:5,
                        marginBottom:80}}>Book Now</Text></TouchableOpacity>
                    </View>
                    </View>
                </ImageBackground>
            </TouchableOpacity>

        );
    };

    return (
        <View style={{ flex: 1 }}>
            <MyStatusBar
                backgroundColor={colors.background_theme2}
                barStyle="light-content"
            />
             <MyLoader isVisible={isLoading} />
            <View style={{ flex: 0, backgroundColor: colors.black_color1 }}>
                     {/* <ScrollView>       */}
                     <View
        style={{
          flex: 0,
          backgroundColor: colors.background_theme1,
          marginTop:10
          
        }}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            borderRadius: 1000,
            borderWidth: 1,
           
          }}>
          <Ionicons name="search" color={colors.black_color6} size={22} />
          <TextInput
            value={search}
            placeholder="Search Category List by name..."
            placeholderTextColor={colors.black_color6}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              color: colors.black_color8,
              padding: 8,
            }}
          />
        </View>
      </View>
                    <View style={{ paddingBottom: 60,paddingLeft:20}}>
                        <FlatList
                            data={category}
                            numColumns={2}
                            keyExtractor={(item) => item.id}
                            renderItem={ProductCard}
                        />
                    </View>
                    {/* </ScrollView> */}
            </View>
        </View>
    )
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);


const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        width: width * 0.4,
        borderRadius: 10,
        overflow: 'hidden',
        height: height * 0.25,
        margin: 10,
        elevation: 4,
    },
    backgroundImage: {
        flex: 1, // Make the background cover the entire component
        resizeMode: 'cover', // Set how the image should be resized to cover the container
    },
    name: {
        fontSize: 16,
        paddingTop:105,
        bottom: 10,
        textAlign: 'center',
        color: colors.white_color,
        fontWeight: 'bold',
        width: '100%',
      
    }
});

