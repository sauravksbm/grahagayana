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
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const AllRemedies = props => {
  const {t} = useTranslation();
  const [editOpen, setEditOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remediesData, setRemediesData] = useState(null);

  const [ astro_id ] = useState(props.route.params.astro);
  console.log(astro_id?.id);
  
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title={t("all_remedies")}
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
      url: api_url + get_blogs_user,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: astro_id?.id,
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
    console.log('dddaaaaa===',data);
    props.navigation.navigate('ViewRememdies',{data1:data.blog_id});
  }

  

  const renderItem = ({item, indes}) => {
    return (
      <TouchableOpacity onPress={() => handle(item)}
        >
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
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
            width: width * 0.3,
            height: width * 0.4,
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
                {item.description.slice(0,100) + '....'}
              </Text>
            </View>
            
            
          </View>
          
        </View>
        
      </View>
      </TouchableOpacity>
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

export default connect(mapStateToProps, null)(AllRemedies);
