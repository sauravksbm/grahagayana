import React,{useRef,useState,useEffect} from 'react';
import { View, StyleSheet,BackHandler } from 'react-native';
import WebView from 'react-native-webview';
import {api_astrolist1, api_url, colors, fonts,api2_get_profile} from '../../config/Constants';
import axios from 'axios';
import MyLoader from '../../components/MyLoader';
import { connect } from 'react-redux';
import * as UserActions from '../../redux/actions/CustomerActions';
import {CommonActions} from '@react-navigation/native';

const PhonepeView = (props) => {
    const { url } = props.route.params;
    console.log('url',url);
   
    const [isLoading, setIsLoading] = useState(false);
    const webViewRef = useRef(null);

    useEffect(() => {
        const handleBackButton = () => {
          gohome();
        };
    
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
      
        return () => {
          backHandler.remove();
        };
      }, []);

    const handleMessage = (event) => {
        const message = event.nativeEvent.data;
        console.log(message);

        // Check the message from the WebView
        // if (message === 'goBack') {
        //     // Go back in the WebView history
        //     if (webViewRef.current) {
        //         webViewRef.current.goBack();
        //     }
        // }
        if(message === 'navigateToWallet') {
            gohome();
            
        } else if(message === 'navigateToHome') {
          go_home();
        }
    };

    const go_home = () => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'home',
              state: {
                routes: [
                  {name: 'home2', params: {flag: props.route.params?.flag}},
                ],
              },
            },
          ],
        }),
      );
    };

    const gohome = async() => {
        setIsLoading(true);
        let data = new FormData();
        data.append('user_id', props.customerData.id);
        await axios({
          method: 'post',
          url: api_url + api2_get_profile,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          data: data,
        })
          .then(res => {
            setIsLoading(false);
            props.dispatch(UserActions.setWallet(res.data.user_details[0]?.wallet));
            props.navigation.navigate('wallet');
          })
          .catch(err => {
            setIsLoading(false);
            console.log(err);
          });

    }

    

    

    return (
        <View style={styles.container}>
        <MyLoader isVisible={isLoading} />
            <WebView
                ref={webViewRef}
                source={{ uri: url }}
                onMessage={handleMessage}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

const mapStateToProps = state => ({
    customerData: state.customer.customerData,
    wallet: state.customer.wallet,
  });
  
  const mapDispatchToProps = dispatch => ({ dispatch });
  
  export default connect(mapStateToProps, mapDispatchToProps)(PhonepeView);
