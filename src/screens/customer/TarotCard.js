import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import MyHeader from '../../components/MyHeader';
import {colors, fonts} from '../../config/Constants';
import {Image} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const {width, height} = Dimensions.get('screen');

const TarotCard = props => {
  useEffect(() => {
    props.navigation.setOptions({
      header: () => (
        <MyHeader
          title="Tarot Card"
          navigation={props.navigation}
          statusBar={{
            backgroundColor: colors.background_theme2,
            barStyle: 'light-content',
          }}
        />
      ),
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '92%',
            marginVertical: 20,
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={()=>props.navigation.navigate('oneCardReading', {title: 'One Card Reading', total_card: 1})} style={styles.containerBox}>
            <Image
              source={require('../../assets/images/card_back.jpeg')}
              style={styles.containerImage}
            />
            <Text style={styles.containerText}>One Card Reading</Text>
            <AntDesign name="right" color={colors.black_color} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>props.navigation.navigate('oneCardReading', {title: 'Three Card Reading', total_card: 3})} style={styles.containerBox}>
            <Image
              source={require('../../assets/images/card_back.jpeg')}
              style={styles.containerImage}
            />
            <Text style={styles.containerText}>Three Card Reading</Text>
            <AntDesign name="right" color={colors.black_color} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>props.navigation.navigate('oneCardReading', {title: 'Love Tarot Reading', total_card: 3})} style={styles.containerBox}>
            <Image
              source={require('../../assets/images/card_back.jpeg')}
              style={styles.containerImage}
            />
            <Text style={styles.containerText}>Love Tarot Reading</Text>
            <AntDesign name="right" color={colors.black_color} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>props.navigation.navigate('oneCardReading', {title: 'Wellness Tarot Reading', total_card: 3})} style={styles.containerBox}>
            <Image
              source={require('../../assets/images/card_back.jpeg')}
              style={styles.containerImage}
            />
            <Text style={styles.containerText}>Wellness Tarot Reading</Text>
            <AntDesign name="right" color={colors.black_color} size={25} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>props.navigation.navigate('oneCardReading', {title: ' State of Mind Tarot Reading', total_card: 3})} style={styles.containerBox}>
            <Image
              source={require('../../assets/images/card_back.jpeg')}
              style={styles.containerImage}
            />
            <Text style={styles.containerText}>
              State of Mind Tarot Reading
            </Text>
            <AntDesign name="right" color={colors.black_color} size={25} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default TarotCard;

const styles = StyleSheet.create({
  containerBox: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: colors.background_theme1,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: colors.black_color2,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  containerImage: {
    width: width * 0.11,
    height: width * 0.21,
    resizeMode: 'cover',
  },
  containerText: {
    flex: 0.9,
    fontSize: 18,
    color: colors.black_color,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
