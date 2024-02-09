import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList,Dimensions,Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {api_astrolist1, api_url, colors, fonts} from '../../config/Constants';


import axios from 'axios';


const {width, height} = Dimensions.get('screen');

const Searchpage = props => {
  const [astoListData, setAstroListData] = useState(false);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    get_astrologer();
  }, []);

  const get_astrologer = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api_astrolist1,
    })
      .then(res => {
        setIsLoading(false);
        let arr = res.data.records;
        let filter_arr = arr.filter(item => item.astro_status != 'Online1');
        setAstroListData(filter_arr);
        setMasterDataSource(filter_arr);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const searchFilterFunction = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        const itemData = item.shop_name
          ? item.shop_name.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();

        const itemData1 = item.experience
          ? item.experience.toUpperCase()
          : ''.toUpperCase();
        const textData1 = text.toUpperCase();
        return itemData.indexOf(textData) > -1 || itemData1.indexOf(textData) > -1;
      });

      if(newData.length==0){

        // alert('No Data Found')
      }
      else{}
      setAstroListData(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setAstroListData(masterDataSource);
      setSearch(text);
    }
  };

  const renderItems = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('astrologerDetailes', {
            data: item,
            type: 'call',
          })
        }
        key={index}
        style={{
          flex: 0,
          width: width * 0.45,
          marginHorizontal: width * 0.025,
          alignSelf: 'center',
          backgroundColor: colors.white_color,
          borderRadius: 5,
          marginVertical: 10,
          shadowColor: colors.black_color5,
          shadowOffset: {width: 2, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 10,
          zIndex: 100,
          borderWidth:1,
          borderColor:'#ddd'
        }}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            backgroundColor: colors.background_theme3,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <View
            style={{
              flex: 0.28,
              overflow: 'hidden',
              position: 'absolute',
              zIndex: 10,
            }}>
            {/* <Image
              source={require('../assets/images/green-button.png')}
              style={{width: width * 0.07, height: width * 0.07, marginTop: 10}}
            /> */}
          </View>
          <View style={{flex: 0.4}}>
            <Image
              source={{uri: item.image}}
              style={{
                width: width * 0.45,
                height: width * 0.45,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderWidth: 0,
                borderColor: colors.black_color8,
              }}
            />
          </View>
          <View
            style={{
              flex: 0,
              justifyContent: 'space-around',
              alignItems: 'center',
              position: 'absolute',
              right: 1,
              flexDirection: 'row',
            }}>
            <Text
              style={{
                fontSize: 9,
                color: colors.black_color,
                fontFamily: fonts.medium,

                textAlign: 'center',
              }}>
              {'\n'}
              {`${parseFloat(item.avg_rating).toFixed(1)}`}
            </Text>
            {/* <Image
              source={require('../assets/images/icon/star.png')}
              style={{width: 12, height: 12, marginTop: 12}}
            /> */}
          </View>
        </View>
        <View style={{height: 16}}>
          <View
            style={{
              flex: 0,
              alignSelf: 'center',
              backgroundColor: colors.background_theme2,
              paddingHorizontal: 10,
              paddingVertical: 1,

              borderRadius: 10,
              position: 'relative',
              bottom: 8,
              padding: 5,
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: colors.white_color,
              }}>
              Recommended
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0,
            width: '80%',
            alignSelf: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            {item.shop_name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: colors.black_color7,
              fontFamily: fonts.medium,
            }}>
            {item.language.slice(0,15)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
            }}>
            {`Exp ${item.experience} Year`}
          </Text>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('astrologerDetailes', {
                data: item,
                type: 'call',
              })
            }
            style={{
              flex: 0,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 2,
              backgroundColor: colors.background_theme2,
              marginVertical: 20,
              borderRadius: 5,
            }}>
            <Ionicons
              name="ios-call"
              color={colors.background_theme1}
              size={20}
            />
            <Text
              style={{
                fontSize: 9,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                textDecorationLine: 'line-through',
                marginLeft: 5,
              }}>
              {`₹ ${item.consultation_price}`}
            </Text>
            <Text
              style={{
                fontSize: 11,
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                marginLeft: 5,
              }}>
              {`₹ ${
                parseFloat(item?.call_commission) +
                parseFloat(item?.call_price_m)
              }/min`}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
 
    // return (
    //   <TouchableOpacity
    //     onPress={() =>
    //       props.navigation.navigate('astrologerDetailes', {
    //         data: item,
    //         type: 'chat',
    //       })
    //     }
    //     key={index}
    //     style={{
    //       flex: 0,
    //       width: width * 0.45,
    //       marginHorizontal: width * 0.025,
    //       alignSelf: 'center',
    //       backgroundColor: colors.white_color,
    //       borderRadius: 5,
    //       marginVertical: 10,
    //       shadowColor: colors.black_color5,
    //       shadowOffset: {width: 2, height: 1},
    //       shadowOpacity: 0.1,
    //       shadowRadius: 10,
    //       zIndex:100
    //     }}>
    //     <View
    //       style={{
    //         flex: 0,
    //         flexDirection: 'row',
    //         backgroundColor: colors.background_theme3,
    //         borderTopRightRadius: 10,
    //         borderTopLeftRadius: 10,
        
    //       }}>
    //       <View style={{flex: 0.28, overflow: 'hidden',position:'absolute',zIndex:10}}>
            
            
              
              
    //           <Image
    //             source={require('../assets/images/green-button.png')}
    //             style={{width: width * 0.07, height: width * 0.07,marginTop:10}}
    //           />
              
           
    //       </View>
    //       <View style={{flex: 0.4}}>
            

    //         <Image
    //           source={{uri: item.image}}
    //           style={{
    //             width: width * 0.45,
    //             height: width * 0.45,
    //             borderTopLeftRadius:10,
    //             borderTopRightRadius:10,
    //             borderWidth: 0,
    //             borderColor: colors.black_color8,
    //           }}
    //         />
    //       </View>
    //       <View
    //         style={{
    //           flex: 0,
    //           justifyContent: 'space-around',
    //           alignItems: 'center',
    //           position:'absolute',
    //           right:1,
    //           flexDirection:'row'
    //         }}>
              
    //         <Text
    //           style={{
    //             fontSize: 9,
    //             color: colors.black_color,
    //             fontFamily: fonts.medium,
               
    //             textAlign: 'center',
    //           }}>
              
    //           {'\n'}
    //           {`${parseFloat(item.avg_rating).toFixed(1)}`}
    //         </Text>
    //         <Image source={require('../assets/images/star.png')}
    //         style={{width:12,height:12,marginTop:12}} />
    //       </View>
    //     </View>
    //     <View style={{height: 16}}>
          
    //         <View
    //           style={{
    //             flex: 0,
    //             alignSelf: 'center',
    //             backgroundColor: colors.background_theme2,
    //             paddingHorizontal: 10,
    //             paddingVertical: 1,
    //             borderTopRightRadius: 10,
    //             borderBottomLeftRadius: 10,
    //             position: 'relative',
    //             bottom: 8,
    //           }}>
    //           <Text
    //             style={{
    //               fontSize: 12,
    //               fontFamily: fonts.medium,
    //               color: colors.white_color,
    //             }}>
    //             Recommended
    //           </Text>
    //         </View>
          
    //     </View>
    //     <View
    //       style={{
    //         flex: 0,
    //         width: '80%',
    //         alignSelf: 'center',
    //         alignItems: 'center',
    //       }}>
    //       <Text
    //         style={{
    //           fontSize: 14,
    //           color: colors.black_color9,
    //           fontFamily: fonts.semi_bold,
    //           textAlign: 'center',
    //         }}>
    //         {item.shop_name}
    //       </Text>
    //       <Text
    //         style={{
    //           fontSize: 12,
    //           textAlign: 'center',
    //           color: colors.red_color1,
    //           fontFamily: fonts.medium,
    //         }}>
    //         {item.language}
    //       </Text>
    //       <Text
    //         style={{
    //           fontSize: 12,
    //           color: colors.black_color9,
    //           fontFamily: fonts.semi_bold,
    //           textAlign: 'center',
    //         }}>
    //         {`Exp ${item.experience} Year`}
    //       </Text>
    //       <TouchableOpacity
    //         onPress={() =>
    //           props.navigation.navigate('astrologerDetailes', {
    //             data: item,
    //             type: 'chat',
    //           })
    //         }
    //         style={{
    //           flex: 0,
    //           width: '100%',
    //           flexDirection: 'row',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           paddingVertical: 2,
    //           backgroundColor: colors.background_theme2,
    //           marginVertical: 20,
    //           borderRadius: 5,
    //         }}>
    //         <Ionicons
    //           name="chatbox-ellipses"
    //           color={colors.background_theme1}
    //           size={20}
    //         />
    //         <Text
    //           style={{
    //             fontSize: 9,
    //             color: colors.background_theme1,
    //             fontFamily: fonts.medium,
    //             textDecorationLine: 'line-through',
    //             marginLeft: 5,
    //           }}>
    //           {`₹ ${item.consultation_price}`}
    //         </Text>
    //         <Text
    //           style={{
    //             fontSize: 11,
    //             color: colors.background_theme1,
    //             fontFamily: fonts.medium,
    //             marginLeft: 5,
    //           }}>
    //           {`₹ ${
    //             parseFloat(item?.call_commission) +
    //             parseFloat(item?.call_price_m)
    //           }/min`}
    //         </Text>
    //       </TouchableOpacity>
    //     </View>
    //   </TouchableOpacity>
    // );
  };


  return (
    <View style={{padding: 10, backgroundColor: 'white', }}>
      <View style={{elevation:2,shadowColor:'black'}}>
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 25,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth:1,
          
        }}>
        <Icon name="search" size={15} color="grey" style={{marginLeft:width*0.035}}/>
        <TextInput
          placeholder="Search"
          placeholderTextColor="grey"
          onChangeText={text => searchFilterFunction(text)}
          style={{flex: 1, marginLeft: 5, color: 'black'}}
        />
      </View>
      </View>
      {astoListData && (
        <FlatList
          data={astoListData}
          renderItem={renderItems}
          keyExtractor={item => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Searchpage;
