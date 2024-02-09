import {
    View,
    Text,
    Dimensions,
    ScrollView,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Linking
  } from 'react-native';
  import React from 'react';
  import {useEffect} from 'react';
  import {api_url, colors, fonts, get_language,get_skill,get_Experties_data,getFontSize} from '../../config/Constants';
  import MyStatusBar from '../../components/MyStatusbar';
  import {useState} from 'react';
  import axios from 'axios';
  import MyLoader from '../../components/MyLoader';
  import AntDesign from 'react-native-vector-icons/AntDesign';
  import DateTimePicker from '@react-native-community/datetimepicker';
  import BouncyCheckbox from 'react-native-bouncy-checkbox';
  import moment from 'moment';
  import { MultipleSelectList } from 'react-native-dropdown-select-list';
  import { useTranslation } from 'react-i18next';
  
  const {width, height} = Dimensions.get('screen');

  
  const AstrologerSignUpUser = props => {
      const {t} = useTranslation();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [currentLocation, setCurrentLocation] = useState('');
    const [language, setLanguage] = useState('');
    const [experties, setExperties] = useState('');
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('');
    const [city,setCtiy] = useState('');
    const [state,setState] = useState('');
    const [country,setCountry] = useState('');
    const [pincode,setPincode] = useState('');
    const [date, setDate] = useState(null);
    const [dateShow, setDateShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [male, setMale] = useState(true);
    const [female, setFemale] = useState(false);
    const [video,setVideo] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [selected, setSelected] = React.useState([]);
    const [selected1, setSelected1] = React.useState([]);
    const [selected2, setSelected2] = React.useState([]);
    const [getLanguage,setGetLanguage] = useState([]);
    const [getskill,setGetSkill] = useState([]);
    const [getExpertiesData,setGetExperties] = useState([]);
    
    const data = [
        {key:'1', value:'Mobiles', disabled:true},
        {key:'2', value:'Appliances'},
        {key:'3', value:'Cameras'},
        {key:'4', value:'Computers', disabled:true},
        {key:'5', value:'Vegetables'},
        {key:'6', value:'Diary Products'},
        {key:'7', value:'Drinks'},
    ]
  
    useEffect(() => {
      props.navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
    useEffect(() => {
      getlanguage();
      getSkill();
      getExperties();
    },[]);
  
    const getlanguage = () => {
      axios({
        method:'get',
        url:api_url + get_language,
      }).then(res => {
        
        let newArray = res.data.data.map((item) => {
          return {key: item.id, value: item.name}
        })
        //Set Data Variable
        
        setGetLanguage(newArray)
      }).catch(err => {
        console.log(err);
      })
    }
  
    const getSkill = () => {
      axios({
        method:'get',
        url:api_url + get_skill,
      }).then(res => {
        
        let newArray = res.data.data.map((item) => {
          return {key: item.id, value: item.name}
        })
        //Set Data Variable
        
        setGetSkill(newArray)
      }).catch(err => {
        console.log(err);
      })
    }
  
    const getExperties = () => {
      axios({
        method:'get',
        url:api_url + get_Experties_data,
      }).then(res => {
        
        let newArray = res.data.data.map((item) => {
          return {key: item.id, value: item.name}
        })
        //Set Data Variable
        
        setGetExperties(newArray)
      }).catch(err => {
        console.log(err);
      })
    }
  
    const emain_validation = () => {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === false) {
        return true;
      } else {
        return false;
      }
    };
  
    const date_handle = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDateShow(false);
      setDate(currentDate);
    };
  
    const validation = () => {
      console.log('ddd');
      if(name.length == 0) {
        Alert.alert('Please enter Your name');
      } else if (email.length == 0) {
        Alert.alert('Please enter your email');
        return false;
      } else if (emain_validation()) {
        Alert.alert('Please enter correct email address.');
        return false;
      } else if (mobileNumber.length != 10) {
        Alert.alert('Please enter your Mobile NUmber.');
      } else if (city.length == 0) {
        Alert.alert('Please enter your Current Location.');
      } else if (language.length == 0) {
        Alert.alert('Please enter your Language.');
      } else if (experties.length == 0) {
        Alert.alert('Please enter your experties.');
      } else if (skills.length == 0) {
        Alert.alert('Please enter your skills.');
      } else if (experience.length == 0) {
        Alert.alert('Please enter your experience.');
      } else if (!isChecked) {
        Alert.alert('Please checked.');
        return false;
      } else {
        return true;
      }
    };
  
    const register = async() => {
      if(validation()) {
        console.log(name);
        setIsLoading(true);
        await axios({
          method:'post',
          url: 'https://grahagyana.com/user/register_astro.php',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: {
            name:name,
            email: email,
            phone:mobileNumber,
            city:city,
            state:state,
            country:country,
            pincode:pincode,
            date:date,
            gender:male ? 'Male':'Female',
            language:language,
            expertise:experties,
            skill:skills,
            experience:experience,
            youtube:video,
          },
        }).then(res =>
          {
            setIsLoading(false);
            console.log(res.data);
            if(res.data.status == 1)
            {
             
              Alert.alert('Message', res.data.Response, [
                {
                  text: 'OK',
                  onPress: () => {
                    props.navigation.goBack();
                  },
                },
              ]);
             
            }
            else
            {
              Alert.alert('Message',res.data.Response);
            }
          }).catch(err =>{
            setIsLoading(false);
            console.log(err);
          })
      
        }
     
    }
  
  
    return (
      <View style={{flex: 1, backgroundColor: colors.black_color1}}>
        <MyStatusBar
          backgroundColor={colors.background_theme2}
          barStyle={'light-content'}
        />
         <MyLoader isVisible={isLoading} />
         <View style={{alignSelf:'center',width:'100%',flexDirection:'row',justifyContent:'space-around',margin:20}}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}
          style={{flex:0,position:'absolute',left:15}}>
         <AntDesign
              name="arrowleft"
              color={colors.black_color}
              size={getFontSize(2)}
            />
             </TouchableOpacity>
        <Text
          style={{
            fontSize: getFontSize(2),
            textAlign: 'center',
            fontFamily: fonts.semi_bold,
            color: colors.black_color8,
          }}>
          {t('register_astro')}
        </Text>
       
         </View>
         
        <View
          style={{
            flex: 0,
            width: '92%',
            alignSelf: 'center',
            height: height * 0.84,
            backgroundColor: colors.background_theme1,
            borderRadius: 10,
            shadowColor: colors.black_color4,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            elevation:4
          }}>
             <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'android' ? 64 : 0}
      >
          <ScrollView>
            <View
              style={{
                flex: 0,
                width: '90%',
                marginVertical: 20,
                alignSelf: 'center',
              }}>
              <Text
                style={{
                  fontSize: getFontSize(1.4),
                  textAlign: 'center',
                  color: colors.background_theme2,
                  fontFamily: fonts.medium,
                  marginBottom: 20,
                }}>
                {t('Narf')}
              </Text>
              <TextInput
                placeholder={t('full_name')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setName}
              />
              <TextInput
                placeholder={t('email_address')}
                placeholderTextColor={colors.black_color5}
                keyboardType="email-address"
                style={styles.textInput}
                onChangeText={setEmail}
              />
              <TextInput
                placeholder={t('wp_mobile')}
                placeholderTextColor={colors.black_color5}
                keyboardType="number-pad"
                style={styles.textInput}
                onChangeText={setMobileNumber}
                maxLength={10}
              />
              <TextInput
                placeholder={t('city')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setCtiy}
              />
              <TextInput
                placeholder={t('state')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setState}
              />
              <TextInput
                placeholder={t('country')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setCountry}
              />
              <TextInput
                placeholder={t('pincode')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setPincode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                  onPress={() => setDateShow(true)}
                  style={[styles.inputContainer]}>
                  
                  <Text
                    style={{
                      flex: 0,
                      marginLeft: 5,
                      color: 'grey',
                      fontWeight: 'normal',
                      paddingTop:5,
                      paddingBottom:5
                    }}>
                    {date == null
                      ? t('selectdob')
                      : moment(date).format('Do MMM YYYY')}
                  </Text>
                </TouchableOpacity>
                {dateShow && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={date == null ? new Date() : date}
                    maximumDate={new Date()}
                    mode={'date'}
                    is24Hour={true}
                    display='spinner'
                    minimumDate={new Date(1900, 1, 1)}
                    onChange={date_handle}
                  />
                )}
  
              <MultipleSelectList 
                  setSelected={(val) => setSelected(val)} 
                  data={getLanguage} 
                  save="value"
                  onSelect={() => setLanguage(selected)} 
                  label="Language"
                  placeholder={t('select')}
                  closeicon=""
                  inputStyles={{fontSize:14,color:'grey',padding:8}}
                  boxStyles={{borderRadius:30,borderColor:'grey',alignItems:'center'}}
                  dropdownStyles={{borderRadius:20,marginBottom:10}}
              />
  
              <MultipleSelectList 
                  setSelected={(val) => setSelected1(val)} 
                  data={getskill} 
                  save="value"
                  onSelect={() => setSkills(selected1)} 
                  label="Skill"
                  placeholder={t('select')}
                  inputStyles={{fontSize:14,color:'grey',padding:8}}
                  boxStyles={{borderRadius:30,borderColor:'grey',alignItems:'center'}}
                  dropdownStyles={{borderRadius:20,marginBottom:10}}
              />
              
              <MultipleSelectList 
                  setSelected={(val) => setSelected2(val)} 
                  data={getExpertiesData} 
                  save="value"
                  onSelect={() => setExperties(selected2)} 
                  label="Experties"
                  placeholder={t('select')}
                  inputStyles={{fontSize:14,color:'grey',padding:8}}
                  boxStyles={{borderRadius:30,borderColor:'grey',alignItems:'center'}}
                  dropdownStyles={{borderRadius:20,marginBottom:10}}
                  disabledTextStyles={{}}
              />
              <TextInput
                placeholder={t('experience')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setExperience}
                keyboardType="number-pad"
                maxLength={2}
              />
              <TextInput
                placeholder={t('youtube_link')}
                placeholderTextColor={colors.black_color5}
                style={styles.textInput}
                onChangeText={setVideo}
                
              />
             <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 2,
                    paddingHorizontal: 2,
                    marginTop: 20,
                  }}>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <BouncyCheckbox
                      size={20}
                      fillColor={colors.background_theme2}
                      unfillColor="#FFFFFF"
                      isChecked={male}
                      disableBuiltInState
                      text={t('male')}
                      textStyle={styles.checkBoxText}
                      onPress={() => {
                        setMale(true);
                        setFemale(false);
                      }}
                    />
                  </View>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <BouncyCheckbox
                      size={20}
                      fillColor={colors.background_theme2}
                      unfillColor="#FFFFFF"
                      isChecked={female}
                      disableBuiltInState
                      text={t('female')}
                      textStyle={styles.checkBoxText}
                      onPress={() => {
                        setMale(false);
                        setFemale(true);
                      }}
                    />
                  </View>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                <BouncyCheckbox
                size={20}
                fillColor={colors.background_theme4}
                onPress={() => setIsChecked(!isChecked)}
                innerIconStyle={{
                  borderRadius: 5,
                  backgroundColor: isChecked
                    ? colors.background_theme4
                    : colors.background_theme1,
                }}
              />
              <Text style={{flex:1}}>{t('by_signing_you')}{' '}
                <Text
                  style={{ fontSize: 14, color: 'red', paddingTop: 10, }}
                  onPress={() => Linking.openURL('https://grahagyana.com/Terms-Conditions-astrology.html')}>
                  {t('t_and_c')}
                </Text>
                </Text>
                </View>
              <TouchableOpacity
              onPress={() => {register();
              }}
                style={{
                  flex: 0,
                  width: '100%',
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 10,
                  borderRadius: 5,
                  shadowColor: colors.black_color3,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  marginVertical: 15,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.background_theme1,
                    fontFamily: fonts.semi_bold,
                    textAlign: 'center',
                  }}>
                  {t('submit_request')}
                </Text>
              </TouchableOpacity>
              <View style={{flexDirection:'row'}}>
              
              <Text style={{color:'black',fontSize:12}}>
              Note:- We give you outstanding gains as compare to other platforms.
              {'\n'}हम आपको अन्य प्लेटफार्मों की तुलना में उत्कृष्ट लाभ देते हैं
              </Text>
              </View>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  };
  
  export default AstrologerSignUpUser;
  
  const styles = StyleSheet.create({
    textInput: {
      width: '100%',
      padding: 15,
      borderWidth: 1,
      borderRadius: 1000,
      borderColor: colors.black_color5,
      fontFamily: fonts.medium,
      marginBottom: 15,
      fontSize:16
    },
    inputContainer: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 100,
      borderColor: colors.black_color6,
      padding: 15,
      marginBottom: 15,
      borderWidth:1,
      borderColor: colors.black_color5,
      fontSize:16
    },
    checkBoxText: {
      fontSize: 14,
      color: colors.black_color8,
      fontFamily: fonts.medium,
      textDecorationLine: 'none',
    },
  });
  