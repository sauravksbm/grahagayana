import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {connect} from 'react-redux';
import {CommonActions} from '@react-navigation/native';
import MyStatusBar from '../../components/MyStatusbar';
import {colors} from '../../config/Constants';

const Call = props => {
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const home = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'home'}],
      }),
    );
  };
  return (
    <View style={styles.container}>
      <MyStatusBar
        backgroundColor={colors.background_theme2}
        barStyle="light-content"
      />
      <ZegoUIKitPrebuiltCall
        appID={1649944423}
        appSign={
          '50b5c028f7a594e4b6eab83bd81067ade2380e64837a0a48546f0d9a9c185072'
        }
        userID={props.customerData.id} // userID can be something like a phone number or the user id on your own user system.
        userName={'Ranjeet'}
        callID={'sdfksdfjhs'} // callID can be any unique string.
        config={{
          // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
          ...ONE_ON_ONE_VOICE_CALL_CONFIG,
          onOnlySelfInRoom: () => home(),
          onHangUp: () => home(),
        }}
      />
    </View>
  );
};
const mapStateToProps = state => ({
  customerData: state.customer.customerData,
  firebaseId: state.customer.firebaseId,
});

export default connect(mapStateToProps, null)(Call);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
