import {View, Text, StatusBar, Platform} from 'react-native';
import React from 'react';
import {
  SafeAreaView,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const MyStatusBar = props => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 0,
        height: 0,
        backgroundColor: props?.backgroundColor,
      }}>
      <StatusBar
        translucent
        backgroundColor={props?.backgroundColor}
        barStyle={props?.barStyle}
      />
    </View>
  );
};
export default MyStatusBar;
