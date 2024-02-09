import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {useEffect} from 'react';
import {api_url, colors, create_blog, fonts,getFontSize,update_blog} from '../../config/Constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {actions} from '../../config/data';
import * as ImagePicker from 'react-native-image-picker';
import {useCallback} from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import MyLoader from '../../components/MyLoader';
import {connect} from 'react-redux';
import { useTranslation } from 'react-i18next';

const {width, height} = Dimensions.get('screen');

const CreateRemedies = props => {
  const {t} = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [remediesTitle, setRemediesTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [baseSixtyFourData, setbaseSixtyFourData] = useState(null);
  const [blogid,setBlogId] = useState(null);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: t("create_remedies"),
    });
  }, []);

  

  useEffect(() => {
    props.navigation.addListener('focus', () => {
      console.log('afas');
      if (typeof props.route?.params?.data != 'undefined') {
        console.log('asf---',props.route?.params?.data);
        setRemediesTitle(props.route.params.data?.title);
        setDescription(props.route.params.data?.description);
        setProfileImage(props.route.params.data?.image);
        setBlogId(props.route.params?.data?.blog_id);
      }
    });
  }, [props.route?.params?.data]);

  const get_profile_pick = useCallback((type, options) => {
    if (type == 'capture') {
      ImagePicker.launchCamera(options, res => {
        setImageModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    } else {
      ImagePicker.launchImageLibrary(options, res => {
        setImageModalVisible(false);
        if (res.didCancel) {
          console.log('user cancel');
        } else if (res.errorCode) {
          console.log(res.errorCode);
        } else if (res.errorMessage) {
          console.log(res.errorMessage);
        } else {
          setProfileImage(res.assets[0].uri);
          setbaseSixtyFourData(res.assets[0].base64);
          // profile_picture_update(res.assets[0].uri);
        }
      });
    }
  }, []);

  const validation = () => {
    if (remediesTitle.length == 0) {
      warnign_toast('Please enter the title.');
      return false;
    } else if (description.length == 0) {
      warnign_toast('Please enter the description.');
      return false;
    } else if (profileImage == null) {
      warnign_toast('Please select an image.');
      return false;
    } else {
      return true;
    }
  };

  const create_remedies = async () => {
    if (validation()) {
      setIsLoading(true);
      await RNFetchBlob.fetch(
        'POST',
        api_url + create_blog,
        {
          'Content-Type': 'multipart/form-data',
        },
        [
          {name: 'astro_id', data: props.providerData.id.toString()},
          {name: 'title', data: remediesTitle},
          {name: 'description', data: description},
          {
            name: 'image',
            data: baseSixtyFourData.toString(),
          },
        ],
      )
        .then(res => {
          setIsLoading(false);
          if (JSON.parse(res.data).status) {
            success_toast('Successfully created.');
            setRemediesTitle('');
            setDescription('');
            setProfileImage(null);
            setbaseSixtyFourData(null);
            props.navigation.goBack();
          } else {
            warnign_toast('Please try again.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const update_remedies = async () => {
    if (validation()) {
      setIsLoading(true);
      let arr = [
        {name: 'blog_id', data: blogid},
        {name: 'title', data: remediesTitle},
        {name: 'description', data: description},
      ];
      if (profileImage.slice(0, 4) == 'http') {
        arr.push({
          name: 'image',
          data: null,
        });
      } else {
        arr.push({
        name: 'image',
        data: baseSixtyFourData.toString(),
      });
      }
      await RNFetchBlob.fetch(
        'POST',
        api_url + update_blog,
        {
          'Content-Type': 'multipart/form-data',
        },
        arr,
      )
        .then(res => {
          setIsLoading(false);
          console.log(res.data)
          if (JSON.parse(res.data).status) {
            props.navigation.goBack();
            success_toast('Successfully updated.');
          } else {
            warnign_toast('Please try again.');
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.black_color2}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View
          style={{
            flex: 0,
            width: '92%',
            backgroundColor: colors.background_theme1,
            alignSelf: 'center',
            marginVertical: 20,
            borderRadius: 10,
            shadowColor: colors.black_color3,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
            padding: 15,
          }}>
          <Text
            style={{
              fontSize: getFontSize(1.3),
              color: colors.black_color9,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
            {t("remedies_title")}
          </Text>
          <TextInput
            value={remediesTitle}
            placeholder= {t('enter_title')}
            placeholderTextColor={colors.black_color5}
            onChangeText={setRemediesTitle}
            style={{
              width: '100%',
              padding: getFontSize(1),
              borderWidth: 1,
              borderRadius: 1000,
              borderColor: colors.background_theme2,
              marginBottom: 15,
              fontSize:getFontSize(1.4)
            }}
          />
          <Text
            style={{
              fontSize: getFontSize(1.4),
              color: colors.black_color9,
              fontFamily: fonts.medium,
              marginBottom: 10,
            }}>
           {t('remedies_description')}
          </Text>
          <TextInput
            value={description}
            placeholder={t('enter_description')}
            placeholderTextColor={colors.black_color5}
            onChangeText={setDescription}
            multiline
            style={{
              width: '100%',
              padding: getFontSize(1.4),
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.background_theme2,
              marginBottom: 15,
              height: height * 0.18,
              textAlignVertical:'top'
            }}
          />
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View>
                <Text
                style={{
                  fontSize: getFontSize(1.4),
                  color: colors.black_color9,
                  fontFamily: fonts.medium,
                }}>
                {t('remedies_image')}
                </Text>
                <TouchableOpacity onPress={() => setImageModalVisible(true)}
                activeOpacity={0.8}
                >
                  <Text style={{color:'white',
                  fontSize:getFontSize(1.6),
                  padding:5,
                  backgroundColor:colors.background_theme2,
                  borderRadius:10,marginTop:10}}>Upload Image</Text>
                </TouchableOpacity>
              </View>
            
            <TouchableOpacity onPress={() => setImageModalVisible(true)}>
              <Image
                source={
                  profileImage != null
                    ? {uri: profileImage}
                    : require('../../assets/images/Logo2.png')
                }
                style={{
                  width: width * 0.28,
                  height: width * 0.28,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (typeof props.route.params?.data != 'undefined') {
                update_remedies();
              } else {
                create_remedies();
              }
            }}
            style={{
              flex: 0,
              backgroundColor: colors.background_theme2,
              paddingVertical: 12,
              borderRadius: 5,
              marginVertical: 20,
            }}>
            <Text
              style={{
                fontSize: getFontSize(1.5),
                color: colors.background_theme1,
                fontFamily: fonts.semi_bold,
                textAlign: 'center',
              }}>
              {typeof props.route.params?.data != 'undefined'
                ? 'Update Blog'
                : t('create_remedies')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black_color9 + '80',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              flex: 0,
              width: '90%',
              backgroundColor: colors.black_color2,
              borderRadius: 20,
              paddingHorizontal: 15,
              paddingTop: 15,
              borderWidth: 1,
              borderColor: colors.background_theme2,
            }}>
            <View style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity style={{padding: 5}} onPress={() => setImageModalVisible(false)}>
                <AntDesign name="left" size={getFontSize(2)} color={colors.black_color9} />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 0.95,
                  fontSize: getFontSize(1.8),
                  color: colors.black_color9,
                  fontFamily: fonts.bold,
                  textAlign: 'center',
                }}>
                {t("upload_image")}
              </Text>
            </View>
            <View
              style={{
                flex: 0,
                width: '95%',
                margin: 20,
                alignSelf: 'center',
                backgroundColor: colors.background_theme1,
                marginTop: 60,
                borderRadius: 10,
                shadowColor: colors.black_color5,
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.3,
                shadowRadius: 5,
              }}>
              <View
                style={{position: 'absolute', top: -40, alignSelf: 'center'}}>
                <Ionicons
                  name="cloud-upload"
                  color={colors.background_theme2}
                  size={getFontSize(6)}
                />
              </View>
              <View style={{marginTop: 50, width: '90%', alignSelf: 'center'}}>
                {actions.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => get_profile_pick(item.type, item.options)}
                    style={{
                      flex: 0,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: colors.background_theme2,
                      marginBottom: 20,
                      padding: 10,
                      borderRadius: 5,
                      shadowColor: colors.black_color3,
                      shadowOffset: {width: 0, height: 1},
                      shadowOpacity: 0.3,
                      shadowRadius: 5,
                    }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.background_theme1,
                      }}>
                      <Ionicons
                        name="camera-outline"
                        color={colors.background_theme2}
                        size={getFontSize(3)}
                      />
                    </View>
                    <View style={{flex: 0.8}}>
                      <Text
                        style={{
                          fontSize: getFontSize(2),
                          color: colors.background_theme1,
                          fontFamily: fonts.semi_bold,
                        }}>
                        {item.title == 'Camera' ? t("take_photo") : t("upload_photo")}
                      </Text>
                      <Text
                        style={{
                          fontSize: getFontSize(1.5),
                          color: colors.background_theme1,
                          fontFamily: fonts.medium,
                        }}>
                        {t("Size")}: 2.5
                      </Text>
                    </View>
                    <AntDesign
                      name="right"
                      color={colors.background_theme1}
                      size={getFontSize(2)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  providerData: state.provider.providerData,
});

export default connect(mapStateToProps, null)(CreateRemedies);
