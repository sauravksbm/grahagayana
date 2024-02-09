import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image
} from 'react-native';
import React from 'react';
import {colors, fonts,getFontSize} from '../../../config/Constants';
import {useState} from 'react';
import MyLoader from '../../../components/MyLoader';
import SvgSimmer from '../../../components/SvgSimmer';
import { SvgUri,SvgCssUri } from 'react-native-svg/css';
import Svg, { SvgXml } from 'react-native-svg';



const {width, height} = Dimensions.get('screen');

const ChartComponent = ({svg,png, title, planetData}) => {
  const [planet] = useState(planetData.planets_assoc);
  const [nakshatra] = useState(planetData.planets_details);
  const [isPlanet, setIsPlanet] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  
  const onError = () => {
    setIsLoading(false);
  };
  const onLoad = () => {
    console.log('Svg loaded!');
    setIsLoading(false);
  };
  return (
    <View style={{flex: 1,backgroundColor:colors.white_color}}>
      
        <View style={{flex:1, justifyContent: 'center',
    alignItems: 'center',alignSelf:'center'}}>
   {/* <SvgXml xml={png} width="350" height="350" /> */}
   <Image
        source={{uri: png}}
        style={styles.image}
      />
        {/* {isLoading && <SvgSimmer isLoading={false} />}
            <SvgCssUri
              onError={onError}
              uri={png}
              width={getFontSize(40)}
              height={getFontSize(45)}
              onLoad={onLoad}
            /> */}
       </View>
   
    </View>
  );
};

export default ChartComponent;

const styles = StyleSheet.create({
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain', // Adjust the resizeMode as needed
  },
 
  
});
