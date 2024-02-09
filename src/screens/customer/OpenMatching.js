import {
    View,
    Text,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Image,
    FlatList,
    RefreshControl
  } from 'react-native';
  import React from 'react';
  import {useEffect} from 'react';
  import {api2_my_kundali, api_url,delete_kundali,kundali_search, colors, fonts} from '../../config/Constants';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import {useState} from 'react';
  import axios from 'axios';
  import {connect} from 'react-redux';
  import Entypo from 'react-native-vector-icons/Entypo';
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
  import { useFocusEffect } from '@react-navigation/native';
  import MyLoader from '../../components/MyLoader';
  const {width, height} = Dimensions.get('screen');
  import { useNavigation } from '@react-navigation/native';
  import moment from 'moment';
  import { useTranslation } from 'react-i18next';
  
  const OpenMatching = props => {
    const {t} = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState(search);
    const [kundliList, setKundliList] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [masterDataSource, setMasterDataSource] = useState([]);

    const navigation = useNavigation();
  
    useEffect(() => {
      props.navigation.setOptions({
        tabBarLabel: t("open_matching"),
      });
    }, []);
  
    useEffect(() => {
      get_kundli();
    }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        get_kundli();
      }, [])
    );
  
    const handleRefresh = () => {
      setIsRefreshing(true);
      get_kundli();
      setIsRefreshing(false);
    };
  
    const get_kundli = async () => {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + api2_my_kundali,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.customerData.id,
        },
      })
        .then(res => {
          console.log(res.data);
          setKundliList(res.data.kudali);
          setMasterDataSource(res.data.kudali);
          setIsLoading(false);
        })
        .catch(err => {
          console.log(err);
        });
    };
  
    const handel_delete = (id) => {
      console.log(id);
      setIsLoading(true);
       axios({
        method: 'post',
        url: api_url + delete_kundali,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: id,
        },
      })
        .then(res => {
          console.log(res.data);
          setIsLoading(false);
          handleRefresh();
         
        })
        .catch(err => {
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
          const itemData = item.customer_name
            ? item.customer_name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setKundliList(newData);
        setSearch(text);
      } else {
        // Inserted text is blank
        // Update FilteredDataSource with masterDataSource
        setKundliList(masterDataSource);
        setSearch(text);
      }
    };
  
    
  
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyLoader isVisible={isLoading} />
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            width: '90%',
            alignSelf: 'center',
            marginVertical: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.black_color7,
            padding: 5,
          }}>
          <Ionicons name="search" color={colors.black_color7} size={25} />
          <TextInput
            placeholder={t("s_k_b_n")}
            placeholderTextColor={colors.black_color5}
            onChangeText={text => searchFilterFunction(text)}
            style={{
              fontSize: 14,
              color: colors.black_color7,
              fontFamily: fonts.medium,
              padding: 5,
              flex:1
            }}
          />
         
         
        
        </View>
        <View style={{width: '95%', alignSelf: 'center'}}>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 10,
              fontFamily: fonts.medium,
              color: colors.black_color7,
            }}>
            {/* Recent kundli */}
          </Text>
          {kundliList && (
            <FlatList
              data={kundliList}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={['#007AFF']} // Customize the loading spinner color
                />
              }
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={()=> props.navigation.navigate('newMatching', {data: item})}
                  activeOpacity={0.6}
                  key={index}
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 15,
                    paddingVertical: 10, 
                    backgroundColor: colors.background_theme1,
                    marginBottom: 15,
                    borderRadius: 5,
                    shadowColor: colors.black_color4,
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                  }}>
                  <View
                    style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{color:colors.black_color,borderWidth:2,fontSize:18,paddingLeft:12,paddingRight:8,padding:5,borderRadius:width * 0.1,borderColor:'red'}}>{item.customer_name.charAt(0)}</Text>
                    <View style={{marginLeft: 10}}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.black_color,
                          fontFamily: fonts.bold,
                          fontWeight:'bold'
                        }}>
                        {item.customer_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.black_color7,
                          fontFamily: fonts.medium,
                        }}>
                        {`${item.dob} ${moment(item.tob,"HH:mm:ss").format("HH:mm")}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.black_color7,
                          fontFamily: fonts.medium,
                        }}>
                        {item.place}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                  style={{right:50,position:'absolute'}}
                  onPress={()=>props.navigation.navigate('editkundli',{data1:item})}
                  >
                    <Entypo
                      name="edit"
                      color={colors.black_color7}
                      size={25}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                  style={{right:10,position:'absolute'}}
                  onPress={()=>handel_delete(item.kundali_id)}>
                    <MaterialIcons 
                      name="delete"
                      color={colors.black_color7}
                      size={25}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    );
  };
  
  const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });
  
  export default connect(mapStateToProps, null)(OpenMatching);
  