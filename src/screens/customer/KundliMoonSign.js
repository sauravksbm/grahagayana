import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {colors, fonts} from '../../config/Constants';
import {useState} from 'react';

const KundliMoonSign = props => {
  const [planet] = useState(props.route.params.planetData.planets);
  console.log(planet);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'MOON SIGN',
    });
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: colors.black_color1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 0,
            width: '95%',
            alignSelf: 'center',
            backgroundColor: colors.background_theme1,
            marginVertical: 10,
            borderRadius: 15,
            shadowColor: colors.black_color5,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.3,
            shadowRadius: 5,
          }}>
          <View
            style={{
              ...styles.itmeContainer,
              backgroundColor: colors.background_theme2,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}>
            <Text style={{...styles.itemText, color: colors.background_theme1}}>
              Planet
            </Text>
            <Text style={{...styles.itemText, color: colors.background_theme1}}>
              Degree
            </Text>
          </View>
          {Object.keys(planet).map((item, index) => (
            <View key={index} style={styles.itmeContainer}>
              <Text style={styles.itemText}>{planet[item].name}</Text>
              <Text style={styles.itemText}>{`${Math.floor(((Math.floor(planet[item].fullDegree % 360) + 360) % 360) % 30)}° ${Math.floor((planet[item].normDegree % 1) * 60)}' ${Math.floor(((planet[item].speed % 1) * 60) % 1 * 60)}"`}
</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default KundliMoonSign;

const styles = StyleSheet.create({
  itmeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  itemText: {
    flex: 0.5,
    fontSize: 14,
    color: colors.black_color8,
    fontFamily: fonts.medium,
    textAlign: 'center',
  },
});
