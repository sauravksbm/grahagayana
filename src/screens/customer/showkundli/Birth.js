import {View, Text} from 'react-native';
import React from 'react';
import ChartComponent from './ChartComponent';
import {useState} from 'react';
import {useEffect} from 'react';
import axios from 'axios';
import {api2_get_chart, api_url,get_chart_xml} from '../../../config/Constants';
import MyLoader from '../../../components/MyLoader';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
const Birth = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const {t} = useTranslation();
  
  // useFocusEffect(
  //   React.useCallback(() => {
  //     test();
  //   }, [])
  // );

  useEffect(() => {
    test();
  },[]);

  const test = async() => {
    setIsLoading(true);
    await axios({
      method: 'post',
      url: api_url + get_chart_xml,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: {
        kundli_id: props.route.params.data.kundali_id,
        chartid:'D1',
        lang:t("lang")
      },
    }).then((res)=>
    {
      // console.log('rest1',res.data);
      setChartData(res.data.png);
      setIsLoading(false);
    }).catch(err=>{
      setIsLoading(false);
      console.log('dsafasd===',err)
    });
  }

  return (
    <View style={{flex: 1,height:100}}>
      <MyLoader isVisible={isLoading} />
      <ChartComponent title='Birth' png={chartData} planetData={props.route.params.planetData} />
    </View>
  );
};

export default Birth