/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import React,{useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/NavigationService';
import {Provider} from 'react-redux';
import {name as appName} from './app.json';
import {store} from './src/redux/store/store'
import messaging from '@react-native-firebase/messaging';
import Notifee, {
  EventType,
} from '@notifee/react-native';


 
 

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  onNotifeeMessageReceived(remoteMessage);

 
 
});



const onNotifeeMessageReceived = async (message) => {
  const channelId = await Notifee.createChannel({
    id: message.data.redirect_app,
    name: 'Default Channel',
    sound:"incoming",
    vibration: true,
    vibrationPattern: [300, 500],
  });

  Notifee.displayNotification({
    title: message.data.title,
    body: message.data.body,
    data:message.data,
    android: {
      channelId: channelId,
      pressAction: {
        id: 'default',
      },
    },
  });
};


Notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('onBackgroundEvent=========', type, detail);

  const { notification } = detail;
  console.log('notif===',notification);
  console.log('details=====',notification?.android.channelId);
  console.log('id=====',notification?.data.kundali_id)

  console.log('dafdfs',notification?.id);
  setTimeout(async () => {
    await Notifee.cancelNotification(notification?.id);
  }, 30000);

  // Check if the user pressed a custom action
  if (type === 1 && notification ) {
    const id = notification?.android.channelId;
    const { data } = notification;
    console.log('id',id,data);
    // Navigate based on the action id
    switch (id) {
      case 'kundali':
        // Navigate to the Kundli screen
        if(data.kundali_id != null)
        {
          console.log('Navigate to the default screen');
          AppRegistry.registerComponent(appName, () => () => 
          <Provider store={store}>
            <App route={'splash'} data={{ data: data }}/>
          </Provider>
          );
        }
        break;
      case 'notifications':
        console.log('notifications....');
        // Navigate to the Notifications screen
        AppRegistry.registerComponent(appName, () => () => 
        <Provider store={store}>
          <App route={'splash'} data={{ data: data }}/>
        </Provider>
        );
        break;
        case 'Chat_request':
          // Navigate to the second screen
          
          AppRegistry.registerComponent(appName, () => () => 
          <Provider store={store}>
            <App route={'splash'} data={{ data: data }}/>
          </Provider>
          );
          break;
      default:
        // Handle other actions if needed
        break;
    }

    // Remove the notification
    await Notifee.cancelNotification(notification?.id || 'N/A');
    console.warn('Notification Cancelled', id);
  }
});

Notifee.onForegroundEvent(({ type, detail }) => {
  console.log('fff',type, detail);
  if(type != 4)
  {
    const { notification } = detail;
  const { data } = notification;
  console.log('notif===',notification);
  console.log('details=111====',notification?.android.channelId);
  const id = notification?.android.channelId;
  console.log('id',id);
  if(type == 1)
  {
    switch (id) {
      case 'kundali':
        // Navigate to the Kundli screen
        if(data.kundali_id != null)
        {
          console.log('Navigate to the default screen');
          AppRegistry.registerComponent(appName, () => () => 
          <Provider store={store}>
            <App route={'splash'} data={{ data: data }}/>
          </Provider>
          );
        }
        break;
      case 'notifications':
        // Navigate to the second screen
        console.log('adsf');
        AppRegistry.registerComponent(appName, () => () => 
        <Provider store={store}>
          <App route={'splash'} data={{ data: data }}/>
        </Provider>
        );
        break;
        case 'Chat_request':
          // Navigate to the second screen
          
          AppRegistry.registerComponent(appName, () => () => 
          <Provider store={store}>
            <App route={'splash'} data={{ data: data }}/>
          </Provider>
          );
          break;
      default:
        // Handle other actions if needed
        break;
    }
  }
  }
  
  
});



const RNRedux = () => {
  return (
    <Provider store={store}>
        <App route={'default'} data={{ data: 1 }}/>
    </Provider>
  );
};



AppRegistry.registerComponent(appName, () => RNRedux);
