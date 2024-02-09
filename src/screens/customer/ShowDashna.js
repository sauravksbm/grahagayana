import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useEffect } from 'react';
import { colors, fonts } from '../../config/Constants';
import { useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { api_url, get_sub_vdasha, get_sub_sub_vdasha, get_sub_sub_sub_vdasha, get_sub_sub_sub_sub_vdasha,getFontSize } from '../../config/Constants';
import MyLoader from '../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

const ShowDashna = props => {
  const { t } = useTranslation();
  const [planet] = useState(props.dashna.planets);
  const [planet_h] = useState(props.dashna?.planets_h)
  const [planet1, setPlanet1] = useState(null);
  const [planet1_h, setPlanet1_h] = useState(null);
  const [planet2, setPlanet2] = useState(null);
  const [planet2_h, setPlanet2_h] = useState(null);
  const [planet3, setPlanet3] = useState(null);
  const [planet3_h, setPlanet3_h] = useState(null);
  const [planet4, setPlanet4] = useState(null);
  const [planet4_h, setPlanet4_h] = useState(null);
  const [maha, setMaha] = useState(true);
  const [antar, setAntar] = useState(false);
  const [Pratyantar, setPratyantar] = useState(false);
  const [sub3, setSub3] = useState(false);
  const [sub4, setSub4] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [item1, setItem] = useState(null);
  console.log('dds', props.data.kundali_id);
  useEffect(() => {
    props.navigation.setOptions({
      tabBarLabel: 'MOON SIGN',
    });
  }, []);


  // console.log('ssaa',props.dashna);


  const handle = async (item) => {

    setIsLoading(true);
    console.log('ddddss', item);
    setItem(item);
    await axios({
      method: 'post',
      url: api_url + get_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        kundli_id: props.data.kundali_id,
        sub_id: item,
        lang: t("lang")
      },
    }).then((res) => {
      console.log('dsfa111==1', res.data);
      if (res.data != null) {
        setPlanet1(res.data.planets);
        setPlanet1_h(res.data.planets_h);
        setIsLoading(false);
        setMaha(false);
        setAntar(true);
      }

    }).catch(err => {
      setIsLoading(false);
      console.log('aaa', err)
    });

  }

  const handle1 = async (item, item2) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        kundli_id: props.data.kundali_id,
        sub_id: item,
        sub_sub: item2,
        lang: t("lang")
      },
    }).then((res) => {
      console.log('dsfa dashba c', res.data);
      if (res.data != null) {
        setPlanet2(res.data.planets);
        setPlanet2_h(res.data.planets_h);
        setIsLoading(false);
        setAntar(false);
        setPratyantar(true);
      }

    }).catch(err => {
      setIsLoading(false);
      console.log('aaa', err)
    });

  }

  const handle2 = async (item, item2, item3) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_sub_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        kundli_id: props.data.kundali_id,
        sub_id: item,
        sub2: item2,
        sub3: item3,
        lang: t("lang")
      },
    }).then((res) => {
      console.log('dsfa dashba c111', res.data);
      if (res.data.planets.status == false) {
        setIsLoading(false);
        Alert.alert('Message', "Your subscribed plan is not authorized to access this API. Kindly visit your dashboard.");
        return false;
      }
      else if (res.data != null) {
        setPlanet3(res.data.planets);
        setPlanet3_h(res.data.planets_h);
        setIsLoading(false);
        setPratyantar(false);
        setSub3(true);
      }


    }).catch(err => {
      setIsLoading(false);
      console.log('aaa', err)
    });

  }

  const handle3 = async (item, item2, item3, item4) => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_sub_sub_sub_sub_vdasha,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: {
        kundli_id: props.data.kundali_id,
        sub_id: item,
        sub2: item2,
        sub3: item3,
        sub4: item4,
        lang: t("lang")
      },
    }).then((res) => {
      console.log('dsfa dashba c', res.data);
      if (res.data != null) {
        setPlanet4(res.data.planets);
        setPlanet4_h(res.data.planets_h);
        setIsLoading(false);
        setSub3(false);
        setSub4(true);
      }

    }).catch(err => {
      setIsLoading(false);
      console.log('aaa', err)
    });

  }

  const back = () => {
    setMaha(true);
    setAntar(false);
  }

  const back1 = () => {
    setAntar(true);
    setPratyantar(false);
  }

  const back2 = () => {
    setPratyantar(true);
    setSub3(false);
  }

  const back4 = () => {
    setSub3(true);
    setSub4(false);
  }


  return (
    <View style={{ flex: 1, backgroundColor: colors.black_color1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <MyLoader isVisible={isLoading} />
        {props.dashna.planets.status != false ? (
          <View
            style={{
              flex: 0,
              width: '95%',
              alignSelf: 'center',
              backgroundColor: colors.background_theme1,
              marginVertical: 10,
              borderRadius: 15,
              shadowColor: colors.black_color5,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
            }}>

            {maha ? (
              <>
                <View style={{ padding: 20, alignItems: 'flex-start', backgroundColor: colors.background_theme2 }}>
                  <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>{t("maha_dasha")}</Text>
                </View>

                {t("lang") === 'en' ? (
                  planet_h.map((item, index) => (

                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle(planet[index].planet)}>
                      <Text style={styles.itemText}>{item.planet.slice(0, 2)}</Text>

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>

                  ))
                ) : (
                  planet_h.map((item, index) => (

                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle(planet[index].planet)}>
                      <Text style={styles.itemText}>{item.planet}</Text>

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>

                  ))
                )}



              </>) : antar ? (<>
                <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#3a86ff' }}>
                  <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>{t("antar_dasha")}</Text>
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => back()}>
                    <Ionicons name="arrow-back" color={colors.white_color} size={20} />
                    <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>Back</Text>
                  </TouchableOpacity>
                </View>

                {t("lang") === 'en' ? ([...planet1_h].map((item, index) => (
                  <View style={{ justifyContent: 'space-between' }}>
                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle1(planet1[0].planet, planet1[index].planet)}>

                      {planet[index] && (
                        <Text style={styles.itemText}>{`${planet1_h[0].planet.slice(0, 2)}`}/{item.planet.slice(0, 2)}</Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>

                  </View>
                ))) : ([...planet1_h].map((item, index) => (
                  <View style={{ justifyContent: 'space-between' }}>
                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle1(planet1[0].planet, planet1[index].planet)}>

                      {planet[index] && (
                        <Text style={styles.itemText}>{`${planet1_h[0].planet}`}/{item.planet}</Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>

                  </View>
                )))}


              </>) : Pratyantar ? (<>
                <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#ffbe0b' }}>
                  <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>{t("p_dasha")}</Text>
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => back1()}>
                    <Ionicons name="arrow-back" color={colors.white_color} size={20} />
                    <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>Back</Text>
                  </TouchableOpacity>
                </View>
                {t("lang") === 'en' ? (
                  [...planet2_h].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle2(planet1[0].planet, planet2[0].planet, planet2[index].planet)}>
                      {planet[index] && planet1[index] && (
                        <Text style={styles.itemText}>
                          {`${planet1_h[0].planet.slice(0, 2)}`}/{`${planet2_h[0].planet.slice(0, 2)}`}/{item.planet.slice(0, 2)}
                        </Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  [...planet2_h].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle2(planet1[0].planet, planet2[0].planet, planet2[index].planet)}>
                      {planet[index] && planet1[index] && (
                        <Text style={styles.itemText}>
                          {`${planet1_h[0].planet}`}/{`${planet2_h[0].planet}`}/{item.planet}
                        </Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>
                  ))
                )}


                <View style={{ alignItems: 'center' }}>

                </View>
              </>) : sub3 ? (<>
                <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#43aa8b' }}>
                  <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>{t("s_dasha")}</Text>
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => back2()}>
                    <Ionicons name="arrow-back" color={colors.white_color} size={20} />
                    <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>Back</Text>
                  </TouchableOpacity>
                </View>

                {t("lang") === 'en' ? (
                  planet3_h.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle3(planet1[0].planet, planet2[0].planet, planet3[0].planet, planet3[index].planet)}>
                      {planet_h[index] && planet_h[index] && planet2_h[index] && (
                        <Text style={styles.itemText}>
                          {`${planet1_h[0].planet.slice(0, 2)}`}/{`${planet2_h[0].planet.slice(0, 2)}`}/{`${planet3_h[0].planet.slice(0, 2)}`}/{item.planet.slice(0, 2)}/
                        </Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>
                  ))
                ) : (planet3_h.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => handle3(planet1[0].planet, planet2[0].planet, planet3[0].planet, planet3[index].planet)}>
                    {planet_h[index] && planet_h[index] && planet2_h[index] && (
                      <Text style={styles.itemText}>
                        {`${planet1_h[0].planet}`}/{`${planet2_h[0].planet}`}/{`${planet3_h[0].planet}`}/{item.planet}/
                      </Text>
                    )}

                    <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                  </TouchableOpacity>
                )))}



              </>) : sub4 ? (<>
                <View style={{ padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f94144', }}>
                  <Text style={{ color: 'white', fontSize: getFontSize(1.8), fontWeight: 'bold' }}>{t("par_dasha")}</Text>
                  <TouchableOpacity style={{ padding: 10, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }} onPress={() => back4()}>
                    <Ionicons name="arrow-back" color={colors.white_color} size={20} />
                    <Text style={{ color: 'white', fontSize: getFontSize(1.4), fontWeight: 'bold' }}>Back</Text>
                  </TouchableOpacity>
                </View>

                {t("lang") === 'en' ? (
                  planet4_h.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer} activeOpacity={1}>
                      {planet_h[index] && planet1_h[index] && (
                        <Text style={styles.itemText}>
                          {`${planet1_h[0].planet.slice(0, 2)}`}/{`${planet2_h[0].planet.slice(0, 2)}`}/{`${planet3_h[0].planet.slice(0, 2)}`}/{`${planet4_h[0].planet.slice(0, 2)}`}/{item.planet.slice(0, 2)}
                        </Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>
                  ))

                ) : (
                  planet4_h.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.itemContainer} activeOpacity={1}>
                      {planet_h[index] && planet1_h[index] && (
                        <Text style={styles.itemText}>
                          {`${planet1_h[0].planet}`}/{`${planet2_h[0].planet}`}/{`${planet3_h[0].planet}`}/{`${planet4_h[0].planet}`}/{item.planet}
                        </Text>
                      )}

                      <Text style={styles.itemText1}>{`${moment(item.end, 'DD-MM-YYYY HH:mm').format('DD-MM-YYYY HH:mm')}`}</Text>
                    </TouchableOpacity>
                  ))

                )}


              </>) : null}
          </View>
        ) : (null)}

      </ScrollView>
    </View>
  );
};

export default ShowDashna;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'gray',
    backgroundColor: '#fcefb4',
    paddingTop: 20
  },
  itemText: {
    flex: 0.5,
    fontSize: getFontSize(1.6),
    color: 'red',
    fontFamily: fonts.medium,
    textAlign: 'left',
    fontWeight: '800',

  },
  itemText1: {
    flex: 0.5,
    fontSize: getFontSize(1.6),
    color: 'red',
    fontFamily: fonts.medium,
    fontWeight: '800',
    textAlign: 'right'
  },
});
