/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import { GlobalContextProvider } from './src/config/context';
import React, {useRef, useState} from 'react';
import {StyleSheet, Alert, DeviceEventEmitter,Text,PermissionsAndroid, LogBox} from 'react-native';

import {
  CommonActions,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import StackNavigator from './src/navigations/StackNavigator';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import { PushNotificationManager } from 'react-native-notifications';
import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';
import {ZegoCallInvitationDialog} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {colors} from './src/config/Constants';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useTranslation } from 'react-i18next';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import Notifee, {
  AndroidChannel,
  AndroidImportance,
  Notification,
  EventType,
  Event,
  AuthorizationStatus,
  TimestampTrigger,
  RepeatFrequency,
} from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen'

const App = (route,data) => {

  const { i18n } = useTranslation();
  useEffect(() => {
    SplashScreen.hide();
  }, [])
  
  LogBox.ignoreLogs([ 'Warning: ...' ]);
  LogBox.ignoreAllLogs();

  useEffect(() => {
    // Load the saved language from AsyncStorage
    const loadLanguage = async () => {
      try {
        const selectedLanguage = await AsyncStorage.getItem(
          'selectedLanguage',
        );

        if (selectedLanguage) {
          // Set the loaded language as the initial language
          i18n.changeLanguage(selectedLanguage);
        }
      } catch (error) {
        console.error('Error loading language from AsyncStorage:', error);
      }
    };

    // Call the function to load the language
    loadLanguage();
  }, []);

  const get_token = async () => {
    let fcm = await messaging().getToken();
    console.log("fcm====>",fcm);
  };

  const [sendnotification,setnotification] = useState(null);

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // The below code gets never executed
      console.log('open',remoteMessage.data);
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      setnotification(remoteMessage?.data);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        // console.log('dasf',remoteMessage.data); // always prints null
        if (remoteMessage) {
          // Never reached
          // Alert.alert('here');
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
          setnotification(remoteMessage.data);
        }
      });

    return Notifee.onForegroundEvent(({ type, detail }) => {
      console.log('rest---',type);
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);

  
  
  const isVisible = false;

  const toastConfig = {
    success: props =>
      isVisible ? (
        <BaseToast
          text1NumberOfLines={1}
          text2NumberOfLines={2}
          style={{ borderLeftColor: colors.background_theme2 }}
          contentContainerStyle={{ paddingHorizontal: 15 }}
          text1Style={{
            fontSize: 14,
            fontWeight: '400',
          }}
          text2Style={{
            fontSize: 12,
          }}
        />
      ) : null,
    error: props => (
      <ErrorToast
        text1NumberOfLines={1}
        text2NumberOfLines={2}
        {...props}
        text1Style={{
          fontSize: 14,
        }}
        text2Style={{
          fontSize: 12,
        }}
      />
    ),
    tomatoToast: ({text1, props}) => (
      <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  };

  

    
  
  useEffect(() => {

    get_token();
  
    async function requestPermissions() {
      if (Platform.OS === 'android') {

        const permissions = [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          PermissionsAndroid.PERMISSIONS.CALL_PHONE,
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          
        ];
        // Calling the permission function
        const granted = await PermissionsAndroid.requestMultiple(permissions, {
          title: 'Example App Permissions',
          message: 'Example App needs access to certain features.',
        });
        
        if (
          granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.READ_CONTACTS] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.CALL_PHONE] ===
            PermissionsAndroid.RESULTS.GRANTED 
            &&
            granted[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS] ===
              PermissionsAndroid.RESULTS.GRANTED 
        ) {
          // Permission Granted
          console.log('permissions');
        } else {
          // Permission Denied
          console.log('CAMERA Permission Denied');
        }
      }
      
    }

    // requestPermissions();
  }, []);

 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}> 
        <GlobalContextProvider>
          <NavigationContainer>
            <StackNavigator data={route?.data?.data} data1={sendnotification?sendnotification:null}  />
          </NavigationContainer>
          <Toast config={toastConfig} />
        </GlobalContextProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </SafeAreaView>
    
    
  );
};
export default App

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
})
