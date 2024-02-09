import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  api2_customer_date_profile,
  api2_get_countries,
  api2_get_state,
  api_url,
  colors,
  customer_date_images_upload,
  customer_date_profile,
  fonts,
  get_city,
  get_customer_date_images,
  get_customer_date_profile,
  get_profile,
} from '../../config/Constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyHeader from '../../components/MyHeader';
import {useCallback} from 'react';
import {success_toast, warnign_toast} from '../../components/MyToastMessage';
import {connect} from 'react-redux';
import MyLoader from '../../components/MyLoader';
import moment from 'moment/moment';
import Modal from 'react-native-modal';
import MyStatusBar from '../../components/MyStatusbar';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {actions} from '../../config/data';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

const {width, height} = Dimensions.get('screen');

const AstroDateRegister = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [dateShow, setDateShow] = useState(false);
  const [timeShow, setTimeShow] = useState(false);
  const [time, setTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState('');

  const [imageData, setImageData] = useState([
    {id: '1', img: null, base64: null},
    {id: '2', img: null, base64: null},
    {id: '3', img: null, base64: null},
    {id: '4', img: null, base64: null},
    {id: '5', img: null, base64: null},
  ]);

  const [imageItem, setImageItem] = useState(null);

  const [marriedStatusOpen, setMarriedStatusOpen] = useState(false);
  const [marriedValue, setMarriedValue] = useState(null);
  const [marriedItems, setMarriedItems] = useState([
    {label: 'Single', value: 'Single'},
    {label: 'Married', value: 'Married'},
    {label: 'Divorced', value: 'Divorced'},
    {label: 'Separated', value: 'Separated'},
    {label: 'Widowed', value: 'Widowed'},
    {label: 'Domestic Partnership', value: 'Domestic Partnership'},
    {label: 'Civil Union', value: 'Civil Union'},
    {label: 'Annulled', value: 'Annulled'},
    {label: 'Other', value: 'Other'},
  ]);
  const [genderOpen, setGenderOpen] = useState(false);
  const [genderValue, setGenderValue] = useState(null);
  const [genderData, setGenderData] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);
  const [faithOpen, setFaithOpen] = useState(false);
  const [faithValue, setFaithValue] = useState(null);
  const [faithData, setFaithData] = useState([
    {label: 'Hindu', value: 'Hindu'},
    {label: 'Christian - Catholoc', value: 'Christian - Catholoc'},
    {label: 'Christian - Protestant', value: 'Christian - Protestant'},
    {label: 'Christian - Orthodox', value: 'Christian - Orthodox'},
    {label: 'Muslim - Sunni', value: 'Muslim - Sunni'},
    {label: 'Muslim - Shia', value: 'Muslim - Shia'},
    {label: 'Jewish', value: 'Jewish'},
    {label: 'Buddhisht', value: 'Buddhisht'},
    {label: 'Sikh', value: 'Sikh'},
    {label: 'Brahmin', value: 'Brahmin'},
    {label: 'Jain', value: 'Jain'},
    {label: 'Zoroastrian', value: 'Zoroastrian'},
    {label: 'Taoist', value: 'Taoist'},
    {label: 'Shinto', value: 'Shinto'},
    {label: 'Other', value: 'Other'},
  ]);

  const [motherTongueOpen, setMotherTongueOpen] = useState(false);
  const [motherTongueValue, setMotherTongueValue] = useState(null);
  const [motherTongueData, setMotherTongueData] = useState([
    {label: 'English', value: 'English'},
    {label: 'Hindi', value: 'Hindi'},
    {label: 'Assamese', value: 'Assamese'},
    {label: 'Bengali', value: 'Bengali'},
    {label: 'Bodo', value: 'Bodo'},
    {label: 'Dogri', value: 'Dogri'},
    {label: 'Gujarati', value: 'Gujarati'},
    {label: 'Kannada', value: 'Kannada'},
    {label: 'Kashmiri', value: 'Kashmiri'},
    {label: 'Konkani', value: 'Konkani'},
    {label: 'Maithli', value: 'Maithli'},
    {label: 'Malayalam', value: 'Malayalam'},
    {label: 'Manipuri', value: 'Manipuri'},
    {label: 'Marathi', value: 'Marathi'},
    {label: 'Nepali', value: 'Nepali'},
    {label: 'Odia (Oriya)', value: 'Odia (Oriya)'},
    {label: 'Punjabi', value: 'Punjabi'},
    {label: 'Sanskrit', value: 'Sanskrit'},
    {label: 'Santali', value: 'Santali'},
    {label: 'Sindh', value: 'Sindh'},
    {label: 'Tamil', value: 'Tamil'},
    {label: 'Telgu', value: 'Telgu'},
    {label: 'Urdu', value: 'Urdu'},
    {label: 'Spanish', value: 'Spanish'},
    {label: 'Mandarin', value: 'Mandarin'},
    {label: 'Arabic', value: 'Arabic'},
    {label: 'Portuguese', value: 'Portuguese'},
    {label: 'Russian', value: 'Russian'},
    {label: 'Japanese', value: 'Japanese'},
    {label: 'French', value: 'French'},
    {label: 'German', value: 'German'},
    {label: 'Italian', value: 'Italian'},
    {label: 'Korean', value: 'Korean'},
    {label: 'Dutch', value: 'Dutch'},
    {label: 'Swedish', value: 'Swedish'},
    {label: 'Norwegian', value: 'Norwegian'},
    {label: 'Finnish', value: 'Finnish'},
    {label: 'Turkish', value: 'Turkish'},
    {label: 'Greek', value: 'Greek'},
    {label: 'Polish', value: 'Polish'},
    {label: 'Vietnamese', value: 'Vietnamese'},
    {label: 'Other', value: 'Other'},
  ]);

  const [hobbyOpen, setHobbyOpen] = useState(false);
  const [hobbyValue, setHobbyValue] = useState(null);
  const [hobbyData, setHobbyData] = useState([
    {label: 'Photography', value: 'Photography'},
    {label: 'Cooking', value: 'Cooking'},
    {label: 'Reading', value: 'Reading'},
    {label: 'Painting', value: 'Painting'},
    {label: 'Gardening', value: 'Gardening'},
    {
      label: 'Playing a musical instrument',
      value: 'Playing a musical instrument',
    },
    {label: 'Writing', value: 'Writing'},
    {label: 'Hiking', value: 'Hiking'},
    {label: 'Dancing', value: 'Dancing'},
    {label: 'Fitness and exercise', value: 'Fitness and exercise'},
    {label: 'Traveling', value: 'Traveling'},
    {label: 'Bird watching', value: 'Bird watching'},
    {label: 'Knitting', value: 'Knitting'},
    {label: 'Fishing', value: 'Fishing'},
    {label: 'Yoga', value: 'Yoga'},
    {
      label: 'Palying sports (e.g., basketball, soccer...',
      value: 'Palying sports (e.g., basketball, soccer',
    },
    {label: 'DIY crafts', value: 'DIY crafts'},
    {label: 'Cycling', value: 'Cycling'},
    {
      label: 'Collecting (e.g., stamps, coins, comics)',
      value: 'Collecting (e.g., stamps, coins, comics)',
    },
    {label: 'Camping', value: 'Camping'},
    {label: 'Playing board games', value: 'Playing board games'},
    {label: 'Meditation', value: 'Meditation'},
    {label: 'Sculpting', value: 'Sculpting'},
    {label: 'Volunteer work', value: 'Volunteer work'},
    {label: 'Watching movies', value: 'Watching movies'},
    {label: 'Baking', value: 'Baking'},
    {label: 'Calligraphy', value: 'Calligraphy'},
    {label: 'Woodworking', value: 'Woodworking'},
    {label: 'Playing video games', value: 'Playing video games'},
    {label: 'Pottery', value: 'Pottery'},
    {label: 'Chess', value: 'Chess'},
    {label: 'Home brewing', value: 'Home brewing'},
    {label: 'Film-making', value: 'Film-making'},
    {label: 'Interior design', value: 'Interior design'},
    {label: 'Sewing', value: 'Sewing'},
    {label: 'Stand-up comedy', value: 'Stand-up comedy'},
    {label: 'Photography editing', value: 'Photography editing'},
    {label: 'Surfing', value: 'Surfing'},
    {label: 'Geocaching', value: 'Geocaching'},
    {label: 'Archery', value: 'Archery'},
    {label: 'Sailing', value: 'Sailing'},
    {label: 'Coin collecting', value: 'Coin collecting'},
    {label: 'Astrology', value: 'Astrology'},
    {label: 'Wine tasting', value: 'Wine tasting'},
    {label: 'Martial arts', value: 'Martial arts'},
    {label: 'Rock climbing', value: 'Rock climbing'},
    {label: 'Collecting antiques', value: 'Collecting antiques'},
    {label: 'Auto racing', value: 'Auto racing'},
    {label: 'Wine tasting', value: 'Wine tasting'},
    {label: 'Martial arts', value: 'Martial arts'},
    {label: 'Rock climbing', value: 'Rock climbing'},
    {label: 'Collecting antiques', value: 'Collecting antiques'},
    {label: 'Glassblowing', value: 'Glassblowing'},
    {label: 'Skydiving', value: 'Skydiving'},
  ]);

  const [studyOpen, setStudyOpen] = useState(false);
  const [studyValue, setStudyValue] = useState(null);
  const [studyData, setStudyData] = useState([
    {label: 'Agriculture', value: 'Agriculture'},
    {label: 'Business', value: 'Business'},
    {label: 'Science', value: 'Science'},
    {label: 'Management', value: 'Management'},
    {label: 'Arabic', value: 'Arabic'},
    {label: 'Fashion', value: 'Fashion'},
    {label: 'Other', value: 'Other'},
  ]);

  const [qualificationOpen, setQualificationOpen] = useState(false);
  const [qualificationValue, setQualificationValue] = useState(null);
  const [qualificationData, setQualificationData] = useState([
    {label: 'High School', value: 'High School'},
    {label: 'Some College', value: 'Some College'},
    {label: "Bachelor's Degree", value: "Bachelor's Degree"},
    {label: 'Advanced Degree', value: 'Advanced Degree'},
  ]);

  const [workExperienceOpen, setWorkExperienceOpen] = useState(false);
  const [workExperienceValue, setWorkExperienceValue] = useState(null);
  const [workExperienceData, setWorkExperienceData] = useState([
    {label: '0', value: '0'},
    {label: '1', value: '1'},
    {label: '2', value: '2'},
    {label: '3', value: '3'},
    {label: '4', value: '4'},
    {label: '5', value: '5'},
    {label: '6', value: '6'},
    {label: '7', value: '7'},
    {label: '8', value: '8'},
    {label: '9', value: '9'},
    {label: '10+', value: '10+'},
  ]);

  const [industryOpen, setIndustryOpen] = useState(false);
  const [industryValue, setIndustryValue] = useState(null);
  const [industryData, setIndustryData] = useState([
    {label: 'Technology', value: 'Technology'},
    {label: 'Healthcare', value: 'Healthcare'},
    {label: 'Finance', value: 'Finance'},
    {label: 'Education', value: 'Education'},
    {label: 'Marketing', value: 'Marketing'},
    {label: 'Retail', value: 'Retail'},
    {label: 'Manufacturing', value: 'Manufacturing'},
    {label: 'Transportaion', value: 'Transportaion'},
    {label: 'Energy', value: 'Energy'},
    {label: 'Entertainment', value: 'Entertainment'},
    {label: 'Other', value: 'Other'},
  ]);

  const [smokeOpen, setSmokeOpen] = useState(false);
  const [smokeValue, setSmokeValue] = useState(null);
  const [smokeData, setSmokeData] = useState([
    {label: 'Non - smoker', value: 'Non - smoker'},
    {label: 'Occasional smoker', value: 'Occasional smoker'},
    {label: 'Regual smoker', value: 'Regual smoker'},
    {label: 'Trying to quit', value: 'Trying to quit'},
  ]);

  const [drinkOpen, setDrinkOpen] = useState(false);
  const [drinkValue, setDrinkValue] = useState(null);
  const [drinkData, setDrinkeData] = useState([
    {label: 'Never', value: 'Never'},
    {label: 'Socially', value: 'Socially'},
    {label: 'Regularly', value: 'Regularly'},
    {label: 'Trying to quit', value: 'Trying to quit'},
  ]);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [stateItem, setStateItem] = useState(null);

  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [cityItem, setCityItem] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Profile Update"
          socialIcons={false}
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
    get_state();
    if (typeof props.route.params?.flag != 'undefined') {
      get_astrodate_profile();
      get_astrodate_images();
    }
    return () => {
      setModalVisible(false);
    };
  }, []);

  const get_astrodate_profile = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_customer_date_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          let profile = res.data.profile;
          setMarriedValue(profile.status);
          setGenderValue(profile.gender);
          setFaithValue(profile.faith);
          setMotherTongueValue(profile.mother_tounge);
          setHobbyValue(profile.hobby);
          setStudyValue(profile.study);
          setQualificationValue(profile.qualification);
          setIndustryValue(profile.industry);
          setWorkExperienceValue(profile.year_of_experience);
          setSmokeValue(profile.smoke);
          setDrinkValue(profile.drink);
          setStateValue(profile.state_id);
          setDate(new Date(profile.dob));
          setTime(new Date(profile.dob + 'T' + profile.tob));
          setDescription(profile.short_bio);
          setStateItem({id: profile.state_id});
          setCityValue(profile.city);
          setCityItem({name: profile.city});
          get_city_data(profile.state_id);
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const update_profile = async () => {
    setIsLoading(true);
    if (validation()) {
      await axios({
        method: 'post',
        url: api_url + customer_date_profile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.customerData.id,
          status: marriedValue,
          gender: genderValue,
          faith: faithValue,
          mother_tounge: motherTongueValue,
          hobby: hobbyValue,
          study: studyValue,
          qualification: qualificationValue,
          industry: industryValue,
          year_of_experience: workExperienceValue,
          smoke: smokeValue,
          drink: drinkValue,
          dob: date,
          tob: time,
          latitude: '28.4354546',
          longitude: '26.45565445',
          short_bio: description,
          state: stateValue,
          state_id: stateItem?.id,
          city: cityItem?.name,
        },
      })
        .then(res => {
          setIsLoading(false);
          setModalVisible(true);
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const get_state = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + api2_get_state,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        phonecode: '91',
      },
    })
      .then(res => {
        setIsLoading(false);
        setStateData(res.data.countries);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_city_data = async id => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_city,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        state_id: id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setCityData(res.data.cities);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const validation = () => {
    if (marriedValue == null) {
      warnign_toast('Please select your marital status.');
      return false;
    } else if (genderValue == null) {
      warnign_toast('Plase select your gender.');
      return false;
    } else if (faithValue == null) {
      warnign_toast('Plase select your faith.');
      return false;
    } else if (motherTongueValue == null) {
      warnign_toast('Plase select your mother tongue.');
      return false;
    } else if (hobbyValue == null) {
      warnign_toast('Plase select your hobby.');
      return false;
    } else if (studyValue == null) {
      warnign_toast('Plase select your study type.');
      return false;
    } else if (qualificationValue == null) {
      warnign_toast('Plase select your qualification.');
      return false;
    } else if (industryValue == null) {
      warnign_toast('Plase select your industry.');
      return false;
    } else if (workExperienceValue == null) {
      warnign_toast('Plase select your experience level.');
      return false;
    } else if (smokeValue == null) {
      warnign_toast('Plase select your smoke conditions.');
      return false;
    } else if (drinkValue == null) {
      warnign_toast('Plase select your drink conditions.');
      return false;
    } else if (stateValue == null) {
      warnign_toast('Plase select your state.');
      return false;
    } else if (cityValue == null) {
      warnign_toast('Plase select your city.');
      return false;
    } else if (description.length == 0) {
      warnign_toast('Plase enter your short bio.');
      return false;
    } else {
      return true;
    }
  };

  const astrodate_register = async () => {
    if (validation()) {
      setIsLoading(true);
      await axios({
        method: 'post',
        url: api_url + api2_customer_date_profile,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: {
          user_id: props.customerData.id,
          status: marriedValue,
          gender: genderValue,
          faith: faithValue,
          mother_tounge: motherTongueValue,
          hobby: hobbyValue,
          study: studyValue,
          qualification: qualificationValue,
          industry: industryValue,
          year_of_experience: workExperienceValue,
          smoke: smokeValue,
          drink: drinkValue,
          dob: date,
          tob: time,
          latitude: '28.4354546',
          longitude: '26.45565445',
          short_bio: description,
          state: stateValue,
          state_id: stateItem?.id,
          city: cityItem?.name,
        },
      })
        .then(res => {
          setIsLoading(false);
          if (res.data.status) {
            success_toast('Your astro profile updated succefully.');
            props.navigation.goBack();
          }
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };

  const date_handle = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDateShow(false);
    setDate(currentDate);
  };

  const time_handle = (event, selectedTime) => {
    setTime(selectedTime);
    setTimeShow(false);
  };

  const onMarriedOpen = useCallback(() => {
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  }, []);

  const onGenderOpne = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onFaithOpne = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onMotherTongueOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onHobbyOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onStudyOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onQualificationOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setIndustryOpen(open);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onIndustryOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onExperienceOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onSmokeOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onDrinkOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onStateOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setCityOpen(false);
  });

  const onCityOpen = useCallback(() => {
    setMarriedStatusOpen(false);
    setOpen(false);
    setGenderOpen(false);
    setFaithOpen(false);
    setMotherTongueOpen(false);
    setHobbyOpen(false);
    setStudyOpen(false);
    setQualificationOpen(false);
    setIndustryOpen(false);
    setWorkExperienceOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
  });

  const get_astrodate_images = async () => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_customer_date_images,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        if (res.data.status) {
          let length = res.data.images.length;
          let arr_data = res.data.images;
          let arr = imageData;
          for (let i = 0; i < length; i++) {
            arr[parseInt(arr_data[i].position) - 1] = {
              id: arr_data[i].position,
              img: arr_data[i].image,
              base64: null,
            };
          }
        }
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const get_profile_pick = useCallback((type, options, imageItem) => {
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
          let my_obj = {
            ...imageItem,
            img: res.assets[0].uri,
            base64: res.assets[0].base64,
          };
          let arr = imageData;
          arr[parseInt(imageItem?.id) - 1] = my_obj;
          setImageData(arr);
          setImageItem(null);
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
          let my_obj = {
            ...imageItem,
            img: res.assets[0].uri,
            base64: res.assets[0].base64,
          };
          let arr = imageData;
          arr[parseInt(imageItem?.id) - 1] = my_obj;
          setImageData(arr);
          setImageItem(null);
        }
      });
    }
  }, []);

  const image_validation = () => {
    let arr = imageData.filter(item => item.img != null);
    if (arr.length == 0) {
      warnign_toast('Please select at lease one image.');
      return false;
    } else {
      return true;
    }
  };

  const upload_images = async () => {
    if (image_validation()) {
      for (let i = 0; i < 5; i++) {
        if (imageData[i].base64 != null) {
          console.log('sfdfs');
          setIsLoading(true);
          await RNFetchBlob.fetch(
            'POST',
            api_url + customer_date_images_upload,
            {
              'Content-Type': 'multipart/form-data',
            },
            [
              {name: 'user_id', data: props.customerData.id.toString()},
              {name: 'position', data: imageData[i]?.id},
              {
                name: 'image',
                data: imageData[i].base64.toString(),
              },
            ],
          )
            .then(res => {
              setIsLoading(false);
              let data = JSON.parse(res.data);
              if (data.status) {
                setModalVisible(false);
                success_toast(data.msg);
                get_astrodate_images();
              } else {
                setModalVisible(false);
                warnign_toast('Failed! Please try again.');
              }
            })
            .catch(err => {
              setIsLoading(false);
              console.log(err);
            });
        }
      }
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyLoader isVisible={isLoading} />
      <ScrollView>
        <View
          style={{
            flex: 0,
            width: '100%',
            backgroundColor: colors.white_color,
            padding: 10,
          }}>
          <View style={{zIndex: 13}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Status
            </Text>
            <DropDownPicker
              open={marriedStatusOpen}
              onOpen={onMarriedOpen}
              placeholder="Status"
              listMode="SCROLLVIEW"
              value={marriedValue}
              items={marriedItems}
              setOpen={setMarriedStatusOpen}
              setValue={setMarriedValue}
              setItems={setMarriedItems}
              style={{marginBottom: 20}}
              dropDownDirection="AUTO"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 12}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Gender
            </Text>
            <DropDownPicker
              open={genderOpen}
              onOpen={onGenderOpne}
              placeholder="Gender"
              listMode="SCROLLVIEW"
              value={genderValue}
              items={genderData}
              setOpen={setGenderOpen}
              setValue={setGenderValue}
              setItems={setGenderData}
              style={{marginBottom: 20}}
              dropDownDirection="AUTO"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 11}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Faith
            </Text>
            <DropDownPicker
              open={faithOpen}
              onOpen={onFaithOpne}
              placeholder="Faith"
              listMode="SCROLLVIEW"
              value={faithValue}
              items={faithData}
              setOpen={setFaithOpen}
              setValue={setFaithValue}
              setItems={setFaithData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 10}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Mother Tongue
            </Text>
            <DropDownPicker
              open={motherTongueOpen}
              onOpen={onMotherTongueOpen}
              placeholder="Mother Tongue"
              listMode="SCROLLVIEW"
              value={motherTongueValue}
              items={motherTongueData}
              setOpen={setMotherTongueOpen}
              setValue={setMotherTongueValue}
              setItems={setMotherTongueData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 9}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Hobby
            </Text>
            <DropDownPicker
              open={hobbyOpen}
              onOpen={onHobbyOpen}
              placeholder="Hobby"
              listMode="SCROLLVIEW"
              value={hobbyValue}
              items={hobbyData}
              setOpen={setHobbyOpen}
              setValue={setHobbyValue}
              setItems={setHobbyData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 8}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Study
            </Text>
            <DropDownPicker
              open={studyOpen}
              onOpen={onStudyOpen}
              placeholder="Study"
              listMode="SCROLLVIEW"
              value={studyValue}
              items={studyData}
              setOpen={setStudyOpen}
              setValue={setStudyValue}
              setItems={setStudyData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 7}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Qualification
            </Text>
            <DropDownPicker
              open={qualificationOpen}
              onOpen={onQualificationOpen}
              placeholder="Qualification"
              listMode="SCROLLVIEW"
              value={qualificationValue}
              items={qualificationData}
              setOpen={setQualificationOpen}
              setValue={setQualificationValue}
              setItems={setQualificationData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={{
                backgroundColor: colors.background_theme1,
                shadowColor: colors.black_color7,
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 5,
                marginBottom: 10,
              }}
            />
          </View>
          <View style={{zIndex: 6}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Industury
            </Text>
            <DropDownPicker
              open={industryOpen}
              onOpen={onIndustryOpen}
              placeholder="Industry"
              listMode="SCROLLVIEW"
              value={industryValue}
              items={industryData}
              setOpen={setIndustryOpen}
              setValue={setIndustryValue}
              setItems={setIndustryData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={styles.dropDownContainerStyle}
            />
          </View>
          <View style={{zIndex: 5}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Experience
            </Text>
            <DropDownPicker
              open={workExperienceOpen}
              onOpen={onExperienceOpen}
              placeholder="Year of Experience"
              listMode="SCROLLVIEW"
              value={workExperienceValue}
              items={workExperienceData}
              setOpen={setWorkExperienceOpen}
              setValue={setWorkExperienceValue}
              setItems={setWorkExperienceData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={styles.dropDownContainerStyle}
            />
          </View>
          <View style={{zIndex: 4}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Smoke
            </Text>
            <DropDownPicker
              open={smokeOpen}
              onOpen={onSmokeOpen}
              placeholder="Smoke"
              listMode="SCROLLVIEW"
              value={smokeValue}
              items={smokeData}
              setOpen={setSmokeOpen}
              setValue={setSmokeValue}
              setItems={setSmokeData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={styles.dropDownContainerStyle}
            />
          </View>
          <View style={{zIndex: 3}}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Drink
            </Text>
            <DropDownPicker
              open={drinkOpen}
              onOpen={onDrinkOpen}
              placeholder="Drink"
              listMode="SCROLLVIEW"
              value={drinkValue}
              items={drinkData}
              setOpen={setDrinkOpen}
              setValue={setDrinkValue}
              setItems={setDrinkeData}
              style={{marginBottom: 20}}
              dropDownDirection="BOTTOM"
              bottomOffset={100}
              dropDownContainerStyle={styles.dropDownContainerStyle}
            />
          </View>
          {stateData && (
            <View style={{zIndex: 2}}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                  marginBottom: 8,
                }}>
                State
              </Text>
              <DropDownPicker
                schema={{
                  label: 'name', // required
                  value: 'id', // required
                  icon: 'icon',
                  parent: 'parent',
                  selectable: 'selectable',
                  disabled: 'disabled',
                  testID: 'testID',
                  containerStyle: 'containerStyle',
                  labelStyle: 'labelStyle',
                }}
                open={stateOpen}
                onOpen={onStateOpen}
                placeholder="State"
                listMode="SCROLLVIEW"
                value={stateValue}
                items={stateData}
                setOpen={setStateOpen}
                setValue={setStateValue}
                setItems={setStateData}
                onSelectItem={item => {
                  setStateItem(item);
                  get_city_data(item.id);
                }}
                style={{marginBottom: 20}}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
            </View>
          )}

          {cityData && (
            <View style={{zIndex: 1}}>
              <Text
                style={{
                  fontSize: 14,
                  color: colors.black_color7,
                  fontFamily: fonts.medium,
                  marginBottom: 8,
                }}>
                City
              </Text>
              <DropDownPicker
                schema={{
                  label: 'name', // required
                  value: 'name', // required
                  icon: 'icon',
                  parent: 'parent',
                  selectable: 'selectable',
                  disabled: 'disabled',
                  testID: 'testID',
                  containerStyle: 'containerStyle',
                  labelStyle: 'labelStyle',
                }}
                open={cityOpen}
                onOpen={onCityOpen}
                placeholder="City"
                listMode="SCROLLVIEW"
                value={cityValue}
                items={cityData}
                setOpen={setCityOpen}
                setValue={setCityValue}
                setItems={setCityData}
                onSelectItem={item => setCityItem(item)}
                style={{marginBottom: 20}}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
              />
            </View>
          )}

          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => setDateShow(true)}
              style={styles.dateTimeContainer}>
              <MaterialCommunityIcons
                name="calendar-month-outline"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  flex: 0,
                  marginLeft: 5,
                  color: colors.black_color9,
                  fontWeight: 'normal',
                }}>
                {date == null
                  ? ' Select TOB'
                  : moment(date).format('Do MMM YYYY')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTimeShow(true)}
              style={styles.dateTimeContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                color={colors.black_color8}
                size={25}
              />
              <Text
                style={{
                  flex: 0,
                  marginLeft: 5,
                  color: colors.black_color9,
                  fontWeight: 'normal',
                }}>
                {time == null
                  ? ' Select TOB'
                  : moment(time).format('hh:mm:ss A')}
              </Text>
            </TouchableOpacity>
          </View>

          {dateShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date == null ? new Date() : date}
              mode={'date'}
              is24Hour={true}
              onChange={date_handle}
            />
          )}
          {timeShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={time == null ? new Date() : time}
              mode={'time'}
              is24Hour={true}
              onChange={time_handle}
            />
          )}
          <KeyboardAvoidingView
            behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
            <Text
              style={{
                fontSize: 14,
                color: colors.black_color7,
                fontFamily: fonts.medium,
                marginBottom: 8,
              }}>
              Short Bio
            </Text>

            <TextInput
              value={description}
              placeholder="Enter Short Bio..."
              placeholderTextColor={colors.black_color5}
              onChangeText={setDescription}
              keyboardType="default"
              multiline
              style={{
                flex: 0,
                marginLeft: 5,
                color: colors.black_color9,
                fontWeight: 'normal',
                height: height * 0.2,
                borderWidth: 1,
                borderRadius: 10,
                padding: 5,
                borderColor: colors.black_color,
              }}
            />
            <View
              style={{
                flex: 0,
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2,
                paddingHorizontal: 2,
                marginTop: 30,
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (typeof props.route.params?.flag != 'undefined') {
                    // update_profile();
                    setModalVisible(true);
                  } else {
                    astrodate_register();
                  }
                }}
                style={{
                  flex: 0,
                  width: width * 0.7,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderRadius: width * 0.05,
                  backgroundColor: colors.background_theme2,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: colors.white_color,
                    fontWeight: 'normal',
                  }}>
                  Update
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        style={{padding: 0, margin: 0}}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.black_color1,
          }}>
          <MyStatusBar
            backgroundColor={colors.background_theme2}
            barStyle="light-content"
          />
          <View
            style={{
              flex: 0,
              width: '93%',
              paddingVertical: 20,
              alignSelf: 'center',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.goBack();
                  }}>
                  <AntDesign
                    name="left"
                    color={colors.black_color9}
                    size={22}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 0.99,
                    fontSize: 16,
                    color: colors.black_color8,
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                  }}>
                  Image Gallery
                </Text>
              </View>
              <View
                style={{
                  flex: 0,
                  width: '90%',
                  alignSelf: 'center',
                  backgroundColor: colors.background_theme1,
                  marginTop: 20,
                  borderRadius: 10,
                  shadowColor: colors.black_color3,
                  shadowOffset: {width: 0, height: 1},
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  marginBottom: 20,
                }}>
                <View
                  style={{
                    flex: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}>
                  {imageData.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setImageItem(item), setImageModalVisible(true);
                      }}
                      key={index}
                      style={{
                        width: width * 0.3,
                        height: width * 0.33,
                        margin: width * 0.055,
                        borderWidth: 6,
                        borderStyle: 'dashed',
                        borderRadius: 10,
                        borderColor: colors.background_theme3,
                        padding: 15,
                      }}>
                      <Image
                        source={
                          item.img == null
                            ? require('../../assets/images/upload_image.jpeg')
                            : {uri: item.img}
                        }
                        style={{
                          width: '100%',
                          height: '100%',
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{width: '90%', alignSelf: 'center'}}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.background_theme2,
                      fontFamily: fonts.medium,
                    }}>
                    (*Please Upload minimum 1 image or maximum 5 image)
                  </Text>
                  <TouchableOpacity
                    onPress={upload_images}
                    style={{
                      flex: 0,
                      width: width * 0.7,
                      alignSelf: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                      borderRadius: width * 0.05,
                      backgroundColor: colors.background_theme2,
                      marginVertical: 20,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: colors.white_color,
                        fontWeight: 'normal',
                      }}>
                      Upload
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
        <Modal
          isVisible={imageModalVisible}
          useNativeDriver={true}
          style={{padding: 0, margin: 0}}
          hideModalContentWhileAnimating={true}
          onBackdropPress={() => setImageModalVisible(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPressOut={() => setImageModalVisible(false)}
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
              <View
                style={{flex: 0, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => setImageModalVisible(false)}
                  style={{padding: 5}}>
                  <AntDesign
                    name="left"
                    size={22}
                    color={colors.black_color9}
                  />
                </TouchableOpacity>
                <Text
                  style={{
                    flex: 0.95,
                    fontSize: 20,
                    color: colors.black_color9,
                    fontFamily: fonts.bold,
                    textAlign: 'center',
                  }}>
                  Upload Image
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
                    size={80}
                  />
                </View>
                <View
                  style={{marginTop: 50, width: '90%', alignSelf: 'center'}}>
                  {actions.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        get_profile_pick(item.type, item.options, imageItem)
                      }
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
                          size={30}
                        />
                      </View>
                      <View style={{flex: 0.8}}>
                        <Text
                          style={{
                            fontSize: 18,
                            color: colors.background_theme1,
                            fontFamily: fonts.semi_bold,
                          }}>
                          {item.title == 'Camera'
                            ? 'Take Photo'
                            : 'Upload Photo'}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: colors.background_theme1,
                            fontFamily: fonts.medium,
                          }}>
                          Size: 2.5
                        </Text>
                      </View>
                      <AntDesign
                        name="right"
                        color={colors.background_theme1}
                        size={20}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
});

export default connect(mapStateToProps, null)(AstroDateRegister);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '40%',
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: colors.background_theme2,
  },
  buttonText: {
    fontSize: 14,
    color: colors.background_theme1,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 10,
    marginBottom: 20,
  },
  dateTimeContainer: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.black_color6,
    padding: 10,
    marginBottom: 20,
  },
  checkBoxText: {
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textDecorationLine: 'none',
  },
  dropDownContainerStyle: {
    backgroundColor: colors.background_theme1,
    shadowColor: colors.black_color7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 10,
  },
});
