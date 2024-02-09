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
import { useEffect } from 'react';
import { api_url, colors, delete_blog, fonts, get_blogs, toggle_blog, getFontSize } from '../../config/Constants';
import { Picker } from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import { useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { success_toast } from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
// import { Switch } from 'react-native-switch';
import { useTranslation } from 'react-i18next';
const { width, height } = Dimensions.get('screen');
import { Menu, Divider, Provider } from 'react-native-paper';

const AllRemedies = props => {
  const { t } = useTranslation();
  const [editOpen, setEditOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [remediesData, setRemediesData] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [itemStates, setItemStates] = useState({});

  const openMenu = (blogId) => {
    setItemStates((prevItemStates) => ({
      ...prevItemStates,
      [blogId]: { menuVisible: true, selectedItem: blogId },
    }));
  };

  const closeMenu = (blogId) => {
    setItemStates((prevItemStates) => ({
      ...prevItemStates,
      [blogId]: { menuVisible: false, selectedItem: null },
    }));
  };

  const handleMenuItemPress = (menuItem, blogId) => {
    console.log(`Menu item ${menuItem} pressed for ${blogId}`);
    closeMenu(blogId);
    if (menuItem == 'delete') {
      Alert.alert('Delete', 'Really want to delete Blog ?', [
        {
          text: 'Delete',
          style: 'cancel',
          onPress: () => delete_my_blog(blogId),
        },
        {
          text: 'No',
          style: 'destructive',
          onPress: () => console.log('no'),
        },
      ]);
    } else {
      console.log('no');
    }
  }

  const edithandlemenu = (menuItem, blogId,item) => {
    closeMenu(blogId);
    if (menuItem == 'edit') {
      props.navigation.navigate('createRemedies', {
        data: item,
      });
    } else {
      console.log('no');
    }
  }

  

  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("all_remedies"),
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      get_remedies();
    })

  }, []);

  const get_remedies = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_blogs,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        astro_id: props.providerData.id,
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

  const delete_my_blog = async (blog_id) => {
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + delete_blog,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        blog_id: blog_id
      }
    }).then(res => {
      console.log(res.data)
      setIsLoading(false)
      success_toast('Successfully deleted.');
      get_remedies();
    }).catch(err => {
      setIsLoading(false)
      console.log(err)
    })
  }

  const change_status = async (blog_id) => {
    setIsLoading(true)
    await axios({
      method: 'post',
      url: api_url + toggle_blog,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        blog_id: blog_id
      }
    }).then(res => {
      console.log(res.data)
      setIsLoading(false)
      get_remedies();
    }).catch(err => {
      setIsLoading(false)
      console.log(err)
    })
  }

  const renderItem = ({ item, indes }) => {
    const { blog_id, menuVisible, selectedItem } = itemStates[item.blog_id] || {};
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          backgroundColor: colors.background_theme1,
          marginBottom: 15,
          borderRadius: 10,
          overflow: 'hidden',
          shadowColor: colors.black_color7,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: width * 0.3,
            height: width * 0.4,
            resizeMode: 'stretch',
          }}
        />
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontSize: getFontSize(1.6),
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                }}>
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                }}>
                {item.description}
              </Text>
            </View>

            
            <View style={{
               alignSelf:'flex-end',
               right:0,
               top:0,
              position:'absolute',
             
            }}>
            <Menu
           
              visible={menuVisible}
              onDismiss={() => closeMenu(item.blog_id)}
              anchor={<Text style={{ color: 'white', }}>{selectedItem ? item.blog_id : ''}</Text>}
              contentStyle={{ marginTop: -60, marginRight: 5,zIndex:100 }}
            >
              <Menu.Item 
              onPress={() => handleMenuItemPress('delete', item.blog_id)} 
              title="Delete"
              style={{ backgroundColor: 'lightgray', padding: 15,top:-10 }}
              titleStyle={{ color: 'blue', fontSize: 16 }} />
              <Menu.Item 
              onPress={() => edithandlemenu('edit',item.blog_id, item)} 
              title="Edit"
              style={{ backgroundColor: 'lightgray', padding: 15,top:-10 }}
              titleStyle={{ color: 'blue', fontSize: 16 }} />
            </Menu>
            </View>
            <TouchableOpacity onPress={() => openMenu(item.blog_id)} style={{ padding: 5 }}>
              <Entypo name="dots-three-vertical" color="black" />
            </TouchableOpacity>

          </View>

          <View
            style={{
              flex: 0,
              width: '50%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.background_theme2,
              alignSelf: 'flex-end',
              margin: 5,
              borderRadius: 5,
              paddingHorizontal: 10,
              paddingVertical: 4,
              zIndex: -1,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.2),
                color: colors.background_theme1,
                fontFamily: fonts.medium,
                marginRight: 5,
              }}>
              {item.status == '1' ? 'Active' : 'Inactive'}
            </Text>
            <Switch
              value={item.status == '1'}
              trackColor={{
                false: colors.black_color5,
                true: colors.green_color2,
              }}
              onValueChange={() => {
                change_status(item.blog_id)
              }}
              ios_backgroundColor="#3e3e3e"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <Provider>
      <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
        <MyLoader isVisible={isLoading} />
        {remediesData && (
          <FlatList
            data={remediesData}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 15 }}
          />
        )}
      </View>
    </Provider>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(AllRemedies);
