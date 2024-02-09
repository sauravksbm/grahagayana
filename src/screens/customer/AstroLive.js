import {
    View,
    Text,
    ScrollView,
    Dimensions,
    StyleSheet,
    Touchable,
    TouchableOpacity,
    Image,
    RefreshControl,
    FlatList
  } from 'react-native';
  import React from 'react';
  import MyStatusBar from '../../components/MyStatusbar';
  import {api_url, base_url, blog, colors, fonts, get_live_list} from '../../config/Constants';
  import {useEffect} from 'react';
  import HomeHeader from '../../components/HomeHeader';
  import {useState} from 'react';
  import axios from 'axios';
  import MyLoader from '../../components/MyLoader';
  import { connect } from 'react-redux';
  import moment from 'moment/moment';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import { useFocusEffect } from '@react-navigation/native';
import { warnign_toast } from '../../components/MyToastMessage';
  
  const {width, height} = Dimensions.get('screen');
  
  const AstroLive = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [blogData, setBlogData] = useState(null);
    const [livelist,setLivelist] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
  
    useEffect(() => {
      props.navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
    useEffect(() => {
      console.log('heeee');
      get_blogs();
    }, []);

    useFocusEffect(
      React.useCallback(() => {
        get_blogs();
      }, [])
    );
  
    const get_blogs = async () => {
      
      setIsLoading(false);
      await axios({
        method: 'get',
        url: api_url + get_live_list,
      })
        .then(res => {
          
          setIsLoading(false);
          console.log(res.data.data);
          setLivelist(res.data.data);
        })
        .catch(err => {
      
          setIsLoading(false);
          console.log('das',err);
        });
    };

    const han = (liveId,astroId) => {
      
      if(props.customerData.username != null)
      {
        props.navigation.navigate('HostLive',{AstroLiveID:liveId,astro_id:astroId})
      }
      else
      {
        warnign_toast("Please Update Customer Account.");
      }
      
    }

    const renderItems = ({item, index}) => {
      return (
        <TouchableOpacity
          TouchableOpacity={0.9}
          onPress={() => han(item.live_id,item.user_id)}
          key={index}
        style={{
          flex: 0,
          width: width * 0.9,
          alignSelf: 'center',
          backgroundColor: colors.white_color,
          borderRadius: 5,
          marginVertical: 10,
          shadowColor: colors.black_color5,
          shadowOffset: {width: 2, height: 1},
          shadowOpacity: 0.1,
          shadowRadius: 10,
          zIndex: 100,
        }}>
          
        <View
          style={{
            flex: 0,
            flexDirection:'row',
            backgroundColor: '#eee',
            borderRadius:10,
            borderWidth:1,
            paddingBottom: 20,
            borderColor:'#ddd'
          }}>
            
          
          <View style={{marginBottom:5,marginLeft:10,marginTop:20,alignSelf:'center',flex:0.3}}>
            <Image
              source={{uri: item.img_url}}
              style={{
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.2,
                borderWidth: 0.5,
               
                borderColor: colors.black_color8,
              }}
            />
          </View>
          <View
          style={{
            flex: 0.5,
            alignSelf: 'center',
            
          }}>
            <View style={{flexDirection:'row'}}>
            <Text
            style={{
              fontSize: 14,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              paddingRight:10
            }}>
            {item.owner_name}
            
          </Text>
              {item.current_status == 'Offline' ? (
            <View
              style={{
                flex:  0.9,
                
                backgroundColor: 'red',
                borderTopRightRadius: 10,
                borderBottomLeftRadius: 10,              
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.medium,
                  color: colors.white_color,
                  textAlign:'center'
                }}>
                {item.current_status}
              </Text>
            </View>
          ):(
            <View
            style={{
              flex:  0.9,
              
              backgroundColor: 'green',
              borderTopRightRadius: 10,
              borderBottomLeftRadius: 10,              
            }}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.medium,
                color: colors.white_color,
                textAlign:'center'
              }}>
              {item.current_status}
            </Text>
          </View>
          )}
          
          </View>
          
          
          <Text
            style={{
              fontSize: 12,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              
            }}>
            {`Exp ${item.experience} Year`}
          </Text>
          
          </View>
          
        </View>
        </TouchableOpacity>
      );
    };

    const _listEmptyComponent = () => {
      return (
        <View style={{alignSelf:'center',marginTop:50}}>
          {/* <Text style={{color:'#000'}}>No Data Available</Text> */}
          <Image  source={require('../../assets/images/icon/novideo.png')} 
                style={{width:300,height:300,borderRadius:20}}/>
        </View>
      );
    };
  
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyStatusBar
          backgroundColor={colors.background_theme2}
          barStyle="light-content"
        />
        <HomeHeader navigation={props.navigation} />
        <MyLoader isVisible={isLoading} />
        
          <View style={{padding:5}}>
          
            {livelist ? (
              <FlatList
                data={livelist}
                renderItem={renderItems}
                keyExtractor={item => item.id}
                numColumns={1}
                ListEmptyComponent={_listEmptyComponent}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'black' }}>No data available.</Text>
                <Image  source={require('../../assets/images/icon/novideo.png')} 
                style={{width:100,height:100}}/>
              </View>
            )}
          </View>
       
      </View>
    );
  };

  const mapStateToProps = state => ({
    customerData: state.customer.customerData,
  });
  
  export default connect(mapStateToProps, null)(AstroLive);
  
  const styles = StyleSheet.create({
    noContentContainer: {
      flex: 0,
      height: height * 0.15,
      backgroundColor: colors.background_theme1,
      borderRadius: 10,
      borderColor: colors.black_color6,
      borderWidth: 1,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    socialIcon: {
      width: width * 0.16,
      height: width * 0.16,
      resizeMode: 'cover',
      borderRadius: 1000,
    },
  });
  