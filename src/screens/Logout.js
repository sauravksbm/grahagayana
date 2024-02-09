import {View, Text, StyleSheet, Platform} from 'react-native';
import React, {useEffect,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ProviderActions from '../redux/actions/ProviderActions'
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
const Logout = props => {
  console.log('data=========',props?.route?.params?.data);
    const { data } = props?.route?.params || {};
    const parsedData = data ? JSON.parse(data) : {};
    const [email,setEmail] =  useState(parsedData.email || '');
    const [password,setPassword] = useState(parsedData.password || '');
    const [rememberMe,setRemember] = useState(parsedData.rememberMe || '');

  console.log('123 ---',email,password,rememberMe);
  useEffect(() => {
    async function Clear() {
      await AsyncStorage.clear();
      props.dispatch(ProviderActions.setCleanStore());
    }
    Clear();
    rememberUser();
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'login',
          },
        ],
      }),
    );
    // props.navigation.navigate('Login', { logoutFlag: 1 })
  }, [props.navigation]);

  const rememberUser = async () => {
    try {
      const credentials = JSON.stringify({ email, password, rememberMe });
      console.log(credentials);
      await AsyncStorage.setItem('astrologerCredentials', credentials);
      console.log('Credentials saved successfully');
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: '#000'}}>Please wait...</Text>
    </View>
  );
};

const mapDispatchToProps = dispatch => ({dispatch});
export default connect(null, mapDispatchToProps)(Logout);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
