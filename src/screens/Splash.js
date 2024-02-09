import {View, Text, Dimensions, Image, ImageBackground,Alert,BackHandler } from 'react-native';
import React, {useEffect} from 'react';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ProviderActions from '../redux/actions/ProviderActions';
import * as CustomerActions from '../redux/actions/CustomerActions';
import database from '@react-native-firebase/database';
import {connect} from 'react-redux';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  api2_get_profile,
  api_url,
  astrologer_dashboard,
  call_app_id,
  call_app_sign,
  getFontSize,
} from '../config/Constants';
import ZegoUIKitPrebuiltCallService, {
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import messaging from '@react-native-firebase/messaging';
import NotificationHandle from '../components/NotificationHandle';
import {useState} from 'react';
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
import { color } from 'react-native-reanimated';

const {width, height} = Dimensions.get('screen');

const Splash = ({props,route,data,navigation,data1}) => {

  console.log('splash',data);

  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    navigate();
    // setTimeout(() => {
    //   navigate();
    // },1000);
  }, []);

  

  const get_is_request_active = async () => {
    try {
      const value = await AsyncStorage.getItem('request');
      return value;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const go_provider_chat_pickup = async message => {
    await AsyncStorage.setItem('request', '1').then(res => {
      navigation.replace('providerChatPickup', {message: message});
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
      let message = remoteMessage.data;
      if (message?.type == 'Request') {
        get_is_request_active().then(value => {
          if (value == '0') {
            go_provider_chat_pickup(message);
          }
        });
      }
    });
    return () => {
      unsubscribe;
    };
  }, []);

  const navigate = async () => {
    let providerData = await AsyncStorage.getItem('ProviderData');
    let customerData = await AsyncStorage.getItem('customerData');
    let data = JSON.parse(providerData);
    let custData = JSON.parse(customerData);
    console.log("custData==>",custData);

    if (custData) {
      console.log("custDatacustDatacustData")
      get_customer_firebase_id(custData.id);
    } else if (data) {
      console.log("datadatadata")
      provider_dashboard(data.id);
      console.log("provider_dashboard")
    } else {
      console.log("elsoo")
      got_to_login();
    }
  };

  const get_customer_firebase_id = id => {
    console.log("custDatacustDatacustData",id)
    database()
    .ref(`UserId/${id}`)
    .on('value', snapchat => {
      dispatch(CustomerActions.setFirebaseId(snapchat?.val()));
      customer_profile(id);
    }, error => {
      console.error("Error fetching data from Firebase:", error);
      got_to_login();
      // Handle the error here, such as displaying an error message or taking appropriate action
    });
  
  };

  const get_provider_firebase_id = id => {
    database()
      .ref(`AstroId/${id}`)
      .on('value', snapchat => {
        // console.log(snapchat.val())
        dispatch(ProviderActions.setFirebaseId(snapchat?.val()));
        provider_home();
      });
  };

  const customer_profile = async id => {
    console.log('adfs');
    let fcm = await messaging().getToken();
    let data = new FormData();
    data.append('user_id', id);
    await axios({
      method: 'post',
      url: api_url + api2_get_profile,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then(res => {
        if(res.data.user_details[0].device_token == fcm)
        {
          dispatch(
            CustomerActions.setCustomerData(res.data.user_details[0]),
          );
          dispatch(
            CustomerActions.setWallet(res.data.user_details[0]?.wallet),
          );
          
          customer_home();
        }
        else
        {
          got_to_login();
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const provider_dashboard = async id => {
    console.log("provider_dashboard")
  
    await axios({
      method: 'post',
      url: api_url + astrologer_dashboard,
      data: {
        astro_id: id,
      },
    })
      .then(res => {
        if(res.data.data2.activate == 1)
        {
          dispatch(ProviderActions.setDashboard(res.data));
          dispatch(ProviderActions.setProviderData(res.data.data2));
          get_provider_firebase_id(id);
        }
        else
        {
          Alert.alert(
            'Message',
            'Your account is blocked. Please contact Astrokunj admin team',
            [
              {
                text: 'Ok',
                onPress: () => {
                  // Perform any necessary cleanup or additional actions before exiting the app
                  // Note: Exiting the app directly might not be possible in all environments
                  // You may need to use platform-specific methods or navigate to the app's home screen.
                  // For example, in a React Native environment, you can use 'BackHandler.exitApp()'
                  // Adjust this according to your specific app framework.
                  BackHandler.exitApp(); // You should define the exitApp function based on your platform or framework
                },
              },
            ],
            { cancelable: false }
          );
        }
        
      })
      .catch(err => {
        console.error("Error in provider_dashboard:", err);
      got_to_login();
        // Handle the error here, such as displaying an error message or taking appropriate action
      });
  };
  

  const provider_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'providerHome', params: { data } }],
      }),
    );
  };

  const customer_home = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home', params: { data }}],
      }),
    );
  };

  const got_to_login = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'login'}],
      }),
    );
  };

  //notifee notifications
  const channels = [
    {
      name: 'High Importance',
      id: 'high',
      importance: AndroidImportance.HIGH,
      // sound: 'hollow',
    },
    {
      name: '🐴 Sound',
      id: 'custom_sound',
      importance: AndroidImportance.HIGH,
      sound: 'horse.mp3',
    },
    {
      name: 'Default Importance',
      id: 'default',
      importance: AndroidImportance.DEFAULT,
    },
    {
      name: 'Low Importance',
      id: 'low',
      importance: AndroidImportance.LOW,
    },
    {
      name: 'Min Importance',
      id: 'min',
      importance: AndroidImportance.MIN,
    },
  ];
  
  const colors = {
    custom_sound: '#f449ee',
    high: '#f44336',
    default: '#2196f3',
    low: '#ffb300',
    min: '#9e9e9e',
  };

  const onNotifeeMessageReceived = async (message) => {
    console.log('message received',message);
    if(message?.data?.type == 'chat_Request')
    {
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

     

    }
    else
    {
      const channelId = await Notifee.createChannel({
        id: message.data.redirect_app,
        name: 'Default Channel',
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
    }
    
  };
 

  async function onMessage(message) {
    console.log('message====',message);
    onNotifeeMessageReceived(message);
    let notification = message.data;
    if (notification?.type == 'chat_Request') {
      navigation.navigate('providerChatPickup',{message:message.data});
    } else if(message.data.type == 'Deduct') {

      navigation.replace('callInvoice', {
         call:message.data 
    });
  } else if(message.data.type == 'Call_kundali') {
    navigation.navigate('providerKundli',{data:message.data})
} else {
      
      console.log('No notification redirect type');
    }
  }
  
  async function onBackgroundMessage(message) {
    onNotifeeMessageReceived(message);
    console.log('onBackgroundMessage New FCM Message1', message);
    if(message.data.type == 'Deduct') {

      navigation.replace('callInvoice', {
         call:message.data 
    });
    } 
    

  }

  Notifee.onForegroundEvent(event => {
    console.log('onForegroundEvent',event);
    logEvent('Foreground', event);
  });

  Notifee.onForegroundEvent(({ type, detail }) => {
    // console.log('fff',type, detail);

    const { notification } = detail;
    console.log('notif===',notification);
    console.log('details=111====',notification?.android.channelId);
    const id = notification?.android.channelId;
    console.log('id',id);

    setTimeout(async () => {
      try {
        await Notifee.cancelNotification(notification?.id);
      } catch (error) {
        console.error('Error in setTimeout callback:', error);
      }
    }, 30000);


    if(type == 1)
    {
      switch (id) {
        case 'notifications':
          // Navigate to the second screen
          console.log('adsf');
          navigation.navigate('notifications');
          break;
        default:
          // Handle other actions if needed
          break;
      }
    }
    
  });

  Notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('onBackgroundEvent',type,detail);
    logEvent('Background', { type, detail });
  
    const { notification } = detail;
    console.log('not',notification);
    console.log('detai',notification.android.channelId);
    const id = notification.android.channelId;
    console.log('data',notification.data);
    console.log('notification Id',notification?.id);

    setTimeout(async () => {
      try {
        await Notifee.cancelNotification(notification?.id);
      } catch (error) {
        console.error('Error in setTimeout callback:', error);
      }
    }, 3000);

    // Check if the user pressed a cancel action
    if(type == 1)
    {
      switch (id) {
        case 'notifications':
          // Navigate to the second screen
          await Notifee.cancelNotification(notification?.id || 'N/A');
          navigation.navigate('notifications');
          break;
        case 'kundali':
          navigation.navigate('providerKundli',{data:notification.data});
          break;
        case 'Chat_request':
          console.log('resdfsa');
          navigation.navigate('providerChatPickup',{data:notification.data});
          break;
        default:
          // Handle other actions if needed
          break;
      }
    }
    
  });

  function logEvent(state, event) {
    console.log('ddd');
    const { type, detail } = event;
  
    let eventTypeString;
  
    switch (type) {
      case EventType.UNKNOWN:
        eventTypeString = 'UNKNOWN';
        console.log('Notification Id', detail.notification?.id);
        break;
      case EventType.DISMISSED:
        eventTypeString = 'DISMISSED';
        console.log('Notification Id', detail.notification?.id);
        break;
      case EventType.PRESS:
        eventTypeString = 'PRESS';
        console.log('Action ID', detail.pressAction?.id || 'N/A');
        console.warn(`Received a ${eventTypeString} ${state} event in JS mode.`, event);
        break;
      case EventType.ACTION_PRESS:
        eventTypeString = 'ACTION_PRESS';
        console.log('Action ID', detail.pressAction?.id || 'N/A');
        break;
      case EventType.DELIVERED:
        eventTypeString = 'DELIVERED';
        break;
      case EventType.APP_BLOCKED:
        eventTypeString = 'APP_BLOCKED';
        console.log('Blocked', detail.blocked);
        break;
      case EventType.CHANNEL_BLOCKED:
        eventTypeString = 'CHANNEL_BLOCKED';
        console.log('Channel', detail.channel);
        break;
      case EventType.CHANNEL_GROUP_BLOCKED:
        eventTypeString = 'CHANNEL_GROUP_BLOCKED';
        console.log('Channel Group', detail.channelGroup);
        break;
      case EventType.TRIGGER_NOTIFICATION_CREATED:
        eventTypeString = 'TRIGGER_NOTIFICATION_CREATED';
        console.log('Trigger Notification');
        break;
      default:
        eventTypeString = 'UNHANDLED_NATIVE_EVENT';
    }
  
    console.warn(`Received a ${eventTypeString} ${state} event in JS mode.`, event);
    console.warn(JSON.stringify(event));
  }
  
  messaging().setBackgroundMessageHandler(onBackgroundMessage);

  async function init() {
    messaging().onMessage(onMessage);
    await Promise.all(channels.map($ => Notifee.createChannel($)));
    await Notifee.setNotificationCategories([
      {
        id: 'actions',
        actions: [
          {
            id: 'like',
            title: 'Like Post',
          },
          {
            id: 'dislike',
            title: 'Dislike Post',
          },
        ],
      },
      {
        id: 'stop',
        actions: [
          {
            id: 'stop',
            title: 'Dismiss',
          },
        ],
      },
      {
        id: 'dismiss',
        actions: [
          {
            id: 'dismiss',
            title: 'Dismiss',
          },
        ],
      },
      {
        id: 'communications',
        actions: [
          {
            id: 'communication',
            title: 'test',
            input: true,
          },
        ],
      },
    ]);
  }

  useEffect(() => {
    init().catch(e => console.log(e));
  },[]);

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/images/splash2.png')}
        style={{
          width: width,
          height: height,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        resizeMode="cover">
        {/* <Image source={require("../assets/images/logo.png")}  */}
        {/* style={{width:150,height:150}} /> */}
        {/* <Text style={{fontSize:getFontSize(3),color:'white',textAlign:'center',marginTop:40}}>Welcome To</Text>
        <Text style={{fontSize:getFontSize(5),color:'#90e0ef'}}>Graha Gyana</Text> */}
      </ImageBackground>
      {modalVisible && (
        <NotificationHandle
          message={message}
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  requestData: state.provider.requestData,
  providerData: state.provider.providerData,
});
const mapDispatchToProps = dispatch => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(Splash);
