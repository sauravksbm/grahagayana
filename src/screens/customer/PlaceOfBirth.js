import {View, Text, StyleSheet, Dimensions} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, google_map_key} from '../../config/Constants';

const {width, height} = Dimensions.get('screen');

const PlaceOfBirth = props => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Place of Birth"
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

  const handle_selected = (address, lat, lon)=>{
    props.route.params.set_place_of_birth(address)
    props.route.params.set_lat_long({lat: lat, lon: lon})
    props.navigation.goBack()
  }

  return (
    <View style={{flex: 1}}>
      <GooglePlacesAutocomplete
        placeholder="Birth Place"
        fetchDetails={true}
        // onPress={handle_selected}
        onPress={(data, details) => {
          handle_selected(data.description, details.geometry?.location?.lat, details.geometry?.location?.lng)
        }}
        query={{
          key: google_map_key,
          language: 'en',
        }}
        currentLocation={true}
        numberOfLines={3}
        isRowScrollable={false}
        currentLocationLabel="Current location"
        enablePoweredByContainer={false}
        styles={{
          textInputContainer: {
            flexDirection: 'row',
          },
          textInput: {
            color:'black',
            height: 44,
            borderRadius: 5,
            paddingVertical: 5,
            paddingHorizontal: 10,
            fontSize: 15,
            flex: 1,
            borderWidth:1,
            borderColor:'black',
            margin:10,
            placeholderTextColor:"black" 
          },
          poweredContainer: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            borderBottomRightRadius: 5,
            borderBottomLeftRadius: 5,
            borderColor: '#c8c7cc',
            borderTopWidth: 0.5,
          },
          powered: {},
          listView: {
            
          },
          row: {  
            padding: 13,
            height: 44,
            flexDirection: 'row',
          },
          separator: {
            height: 0.5,
            backgroundColor: '#c8c7cc',
          },
          description: {color:'black'},
          loader: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            height: 20,
            
          },

        }}
      />
    </View>
  );
};

export default PlaceOfBirth;


