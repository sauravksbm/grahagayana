import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useEffect} from 'react';
import {
  all_request,
  api2_get_state,
  api_url,
  colors,
  fonts,
  get_city,
  recommended_friends,
} from '../config/Constants';
import MyStatusBar from '../components/MyStatusbar';
import MyHeader from '../components/MyHeader';
import MyFriends from '../screens/customer/MyFriends';
import MyLikes from '../screens/customer/MyLikes';
import LikeByMe from '../screens/customer/LikeByMe';
import {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FriendsPassion from '../screens/customer/FriendsPassion';
import FriendsLocation from '../screens/customer/FriendsLocation';
import DropDownPicker from 'react-native-dropdown-picker';
import {connect} from 'react-redux';
import axios from 'axios';
import Modal from 'react-native-modal';
import {useCallback} from 'react';
import MyLoader from '../components/MyLoader';
import * as AstrologerActions from '../redux/actions/AstrologerActions';

const {width, height} = Dimensions.get('screen');

const Tab = createMaterialTopTabNavigator();

const ConnectWithFriends = props => {
  const [isStar, setIsStar] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedData, setRecommendedData] = useState(null);
  const [myData, setMyData] = useState(null);
  const [passionData, setPassionData] = useState(null);
  const [locationData, setLocationData] = useState(null);

  const [stateOpen, setStateOpen] = useState(false);
  const [stateValue, setStateValue] = useState(null);
  const [stateData, setStateData] = useState(null);
  const [stateItem, setStateItem] = useState(null);

  const [cityOpen, setCityOpen] = useState(false);
  const [cityValue, setCityValue] = useState(null);
  const [cityData, setCityData] = useState(null);
  const [cityItem, setCityItem] = useState(null);

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

  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <View>
          <MyStatusBar
            backgroundColor={colors.background_theme2}
            barStyle="light-content"
          />
          <View
            style={{
              flex: 0,
              width: '100%',
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              padding: 12,
              backgroundColor: colors.background_theme2,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => props.navigation.goBack()}
              style={{flex: 0.2}}>
              <Ionicons
                name="arrow-back"
                color={colors.background_theme1}
                size={25}
              />
            </TouchableOpacity>
            <Text
              style={{
                flex: 0,
                fontSize: 16,
                fontFamily: fonts.medium,
                color: colors.background_theme1,
              }}>
              Connect with Friends
            </Text>
            <View style={{flex: 1}}>
              {!isStar && (
                <TouchableOpacity
                  onPress={get_state}
                  style={{flex: 0, alignSelf: 'flex-end'}}>
                  <Ionicons
                    name="md-filter"
                    color={colors.background_theme1}
                    size={25}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ),
    });
  }, [isStar, props.passionData, props.locationData]);

  useEffect(() => {
    get_recommended_profile_data();
  }, []);

  const get_recommended_profile_data = async () => {
    setIsLoading(false);
    await axios({
      method: 'post',
      url: api_url + recommended_friends,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        user_id: props.customerData.id,
      },
    })
      .then(res => {
        setIsLoading(false);
        setRecommendedData(res.data.users);
        setMyData(res.data.user_details);
        setPassionData(res.data.users);
        setLocationData(res.data.users);
        props.dispatch(
          AstrologerActions.setRecommendedLocationList(res.data.users),
        );
        props.dispatch(
          AstrologerActions.setRecommendedPassionList(res.data.users),
        );
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
      });
  };

  const filter_data = () => {
    setIsLoading(true)
    if (hobbyValue != null) {
      searchFilterFunctionByHobby(hobbyValue);
      setIsLoading(false)
    } else if (stateValue != null) {
      setIsLoading(false)
      searchFilterFunctionByLocation(stateValue, cityValue);
    } else {
    }
    setModalVisible(false)
  };

  const searchFilterFunctionByHobby = text => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = recommendedData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // const itemData = item.hobby ? item.hobby : '-1';
        // const textData = text.toUpperCase();
        const itemData = item.hobby
          ? item.hobby.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      // console.log(newData);
      // setAstroListData(newData);
      props.dispatch(AstrologerActions.setRecommendedPassionList(newData));
      // setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      // setAstroListData(masterDataSource);
      props.dispatch(
        AstrologerActions.setRecommendedPassionList(recommendedData),
      );
      // setSearch(text);
    }
  };

  const searchFilterFunctionByLocation = (state, city) => {
    // Check if searched text is not blank
    if (state && city) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = recommendedData.filter(function (item) {
        // Applying filter for the inserted text in search bar
        // const itemData = item.hobby ? item.hobby : '-1';
        // const textData = text.toUpperCase();
        const itemData = item.state
          ? item.state.toUpperCase()
          : ''.toUpperCase();
        const textData = state.toUpperCase();

        const itemData1 = item.city
          ? item.state.toUpperCase()
          : ''.toUpperCase();
        const textData1 = city.toUpperCase();
        return (
          itemData.indexOf(textData) > -1 || itemData1.indexOf(textData1) > -1
        );
      });
      // console.log(newData);
      // setAstroListData(newData);
      props.dispatch(AstrologerActions.setRecommendedLocationList(newData));
      // setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      // setAstroListData(masterDataSource);
      props.dispatch(
        AstrologerActions.setRecommendedLocationList(recommendedData),
      );
      // setSearch(text);
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
        setModalVisible(true);
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

  const onSmokeOpen = useCallback(() => {
    setHobbyOpen(false);
    setIndustryOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onDrinkOpen = useCallback(() => {
    setHobbyOpen(false);
    setIndustryOpen(false);
    setSmokeOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onStateOpen = useCallback(() => {
    setHobbyOpen(false);
    setIndustryOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setCityOpen(false);
  });

  const onCityOpen = useCallback(() => {
    setHobbyOpen(false);
    setIndustryOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
  });

  const onHobbyOpen = useCallback(() => {
    setIndustryOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  const onIndustryOpen = useCallback(() => {
    setHobbyOpen(false);
    setSmokeOpen(false);
    setDrinkOpen(false);
    setStateOpen(false);
    setCityOpen(false);
  });

  return (
    <View style={{flex: 1, backgroundColor: colors.background_theme1}}>
      <MyLoader isVisible={isLoading} />
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginVertical: 15,
        }}>
        <TouchableOpacity
          onPress={() => setIsStar(true)}
          style={{
            width: width * 0.4,
            backgroundColor: isStar
              ? colors.background_theme2
              : colors.black_color5,
            paddingVertical: 10,
            borderRadius: 1000,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
              textAlign: 'center',
            }}>
            Star Button
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsStar(false)}
          style={{
            width: width * 0.5,
            backgroundColor: !isStar
              ? colors.background_theme2
              : colors.black_color5,
            paddingVertical: 10,
            borderRadius: 1000,
          }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.background_theme1,
              fontFamily: fonts.medium,
              textAlign: 'center',
            }}>
            Recommended Profile
          </Text>
        </TouchableOpacity>
      </View>
      {isStar ? (
        <Tab.Navigator
          screenOptions={{
            tabBarScrollEnabled: true,
            tabBarLabelStyle: {fontSize: 13, fontFamily: fonts.medium},
            tabBarGap: 0,
            tabBarStyle: {flex: 0},
            tabBarItemStyle: {flex: 0, paddingHorizontal: 0, margin: 0},
          }}>
          <Tab.Screen name="myFriends" component={MyFriends} />
          <Tab.Screen name="myLikes" component={MyLikes} />
          <Tab.Screen name="likeByMe" component={LikeByMe} />
        </Tab.Navigator>
      ) : (
        recommendedData && (
          <Tab.Navigator
            screenOptions={{
              tabBarScrollEnabled: false,
              tabBarLabelStyle: {fontSize: 13, fontFamily: fonts.medium},
              tabBarGap: 0,
              tabBarStyle: {flex: 0},
              tabBarItemStyle: {flex: 0, paddingHorizontal: 0, margin: 0},
            }}>
            <Tab.Screen
              name="friendsPassion"
              component={FriendsPassion}
              initialParams={{passionData: recommendedData}}
            />
            <Tab.Screen
              name="friendsLocation"
              component={FriendsLocation}
              initialParams={{locationData: recommendedData}}
            />
          </Tab.Navigator>
        )
      )}

      <Modal
        isVisible={modalVisible}
        useNativeDriver={true}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        style={{padding: 0, margin: 0}}
        hideModalContentWhileAnimating={true}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            width: '90%',
            // height: height * 0.85,
            alignSelf: 'center',
            paddingVertical: 10,
            backgroundColor: colors.background_theme1,
            borderRadius: 20,
            paddingHorizontal: 15,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: colors.black_color9,
              fontFamily: fonts.semi_bold,
              textAlign: 'center',
              marginBottom: 10,
            }}>
            Filter with
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {stateData && (
              <View style={{zIndex: 6}}>
                <Text style={styles.heading}>State</Text>
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
                  maxHeight={300}
                  style={styles.containerStyle}
                  dropDownDirection="BOTTOM"
                  bottomOffset={100}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  placeholderStyle={styles.placeholderStyle}
                />
              </View>
            )}

            {cityData && (
              <View style={{zIndex: 5}}>
                <Text style={styles.heading}>City</Text>
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
                  maxHeight={300}
                  style={styles.containerStyle}
                  dropDownDirection="BOTTOM"
                  bottomOffset={100}
                  dropDownContainerStyle={styles.dropDownContainerStyle}
                  placeholderStyle={styles.placeholderStyle}
                />
              </View>
            )}

            <View style={{zIndex: 4}}>
              <Text style={styles.heading}>Smoke</Text>
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
                maxHeight={300}
                style={styles.containerStyle}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>
            <View style={{zIndex: 3}}>
              <Text style={styles.heading}>Drink</Text>
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
                maxHeight={300}
                style={styles.containerStyle}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>

            <View style={{zIndex: 2}}>
              <Text style={styles.heading}>Industury</Text>
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
                maxHeight={300}
                style={styles.containerStyle}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>

            <View style={{zIndex: 1}}>
              <Text style={styles.heading}>Hobby</Text>
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
                maxHeight={300}
                style={styles.containerStyle}
                dropDownDirection="BOTTOM"
                bottomOffset={100}
                dropDownContainerStyle={styles.dropDownContainerStyle}
                placeholderStyle={styles.placeholderStyle}
              />
            </View>

            <View
              style={{
                flex: 0,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // marginBottom: 80,
                marginVertical: 30,
              }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  width: width * 0.4,
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 8,
                  borderRadius: 1000,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
              onPress={filter_data}
                style={{
                  width: width * 0.4,
                  backgroundColor: colors.background_theme2,
                  paddingVertical: 8,
                  borderRadius: 1000,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.background_theme1,
                    fontFamily: fonts.medium,
                  }}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  wallet: state.customer.wallet,
  passionData: state.astrologer.passionData,
  locationData: state.astrologer.locationData,
});

const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectWithFriends);

const styles = StyleSheet.create({
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
    borderWidth: 1,
    borderColor: colors.background_theme2,
  },
  heading: {
    fontSize: 12,
    color: colors.black_color7,
    fontFamily: fonts.medium,
    marginBottom: 5,
  },
  placeholderStyle: {
    fontSize: 13,
    color: colors.black_color7,
    fontFamily: fonts.medium,
  },
  containerStyle: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.background_theme2,
    paddingTop: 0,
    paddingBottom: 0,
  },
});
