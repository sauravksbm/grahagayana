import {
    View,
    Text,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    Switch,
    Alert,
  } from 'react-native';
  import React from 'react';
  import {useEffect} from 'react';
  import {api_url, colors, delete_blog, fonts, get_blogs, get_blogs_user} from '../../config/Constants';
  import {PickerIOS} from '@react-native-picker/picker';
  import Entypo from 'react-native-vector-icons/Entypo';
  import {useState} from 'react';
  import axios from 'axios';
  import {connect} from 'react-redux';
  import { success_toast } from '../../components/MyToastMessage';
  import MyLoader from '../../components/MyLoader';
  import MyHeader from '../../components/MyHeader';
  // import { Switch } from 'react-native-switch';
  
  const {width, height} = Dimensions.get('screen');
  
  const ViewRemedies = props => {
    
    const [isLoading, setIsLoading] = useState(false);
    const [remediesData, setRemediesData] = useState(null);

    console.log('ddd',props.route.params.data1);
  
 
    
    useEffect(() => {
      props.navigation.setOptions({
        header: () => (
          <MyHeader
            title="View Remedies"
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
      props.navigation.addListener('focus',()=>{
        get_remedies();
      })
     
    }, []);
  
    const get_remedies = async () => {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + 'api2/get_blogs_view',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          id: props.route.params.data1,
        },
      })
        .then(res => {
          setIsLoading(false);
          console.log(res.data);
          if (res.data.status) {
            setRemediesData(res.data.blogs);
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    };
  
    const handle = (data) => {
      console.log(data);
    }
  
    
  
    const renderItem = ({item, indes}) => {
      return (
       
        <View
          style={{
            flex: 0,
            
            backgroundColor: colors.background_theme1,
            marginBottom: 15,
            borderRadius: 10,
            overflow: 'hidden',
            shadowColor: colors.black_color7,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 10,
          }}>
            
          <Image
            source={{uri: item.image}}
            style={{
              width: width * 1,
              height: width * 0.6,
              resizeMode: 'stretch',
            }}
          />
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={{padding: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.black_color9,
                    fontFamily: fonts.medium,
                  }}>
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.black_color7,
                    fontFamily: fonts.medium,
                  }}>
                  {item.description}
                </Text>
              </View>
              
              
            </View>
            
          </View>
          
        </View>
   
      );
    };
  
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyLoader isVisible={isLoading} />
        {remediesData && (
          <FlatList
            data={remediesData}
            renderItem={renderItem}
            contentContainerStyle={{padding: 15}}
          />
        )}
      </View>
    );
  };
  
  const mapStateToProps = state => ({
    
  });
  
  export default connect(mapStateToProps, null)(ViewRemedies);
  