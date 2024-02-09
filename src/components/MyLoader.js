import {View, Text, Modal, ActivityIndicator} from 'react-native';
import React from 'react';
import { colors } from '../config/Constants';

const MyLoader = props => {
  return (
    <Modal visible={props.isVisible} transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background_theme2 + '20',
        }}>
        <ActivityIndicator size="large" color={colors.background_theme2} />
      </View>
    </Modal>
  );
};

export default MyLoader;
