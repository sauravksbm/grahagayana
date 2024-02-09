import {View, Text, Modal, TouchableWithoutFeedback} from 'react-native';
import React from 'react';

const Welcome = props => {
  return (
    <Modal
      visible={props.visible}
      onRequestClose={() => props.setWelcomeVisible(false)}>
      <TouchableWithoutFeedback
        onPress={() =>
          props.setWelcomeVisible(false)
        }>
            <View style={{flex: 1}}>
                
            </View>
        </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Welcome;
