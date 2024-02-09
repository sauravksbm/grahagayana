import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import the hook
import { colors } from '../config/Constants';

const MyToolTipAlert = props => {
  const insets = useSafeAreaInsets(); // Get safe area insets

  return (
    <Tooltip
      isVisible={props.visible}
      content={
        <View style={{ alignItems: 'center', position: 'relative' }}>
          <Text style={{ color: 'black', fontSize: 16 }}>{props.text}</Text>
        </View>
      }
      placement={props.placement}
      overlayColor="transparent"
      skipAndroidStatusBar={false}
      onClose={() => props.setToolTipVisible(false)}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => props.setToolTipVisible(true)}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <Ionicons name='alert-circle' color={colors.red_color1} size={20} {...props.iconProps} />
      </TouchableOpacity>
    </Tooltip>
  );
};

export default MyToolTipAlert;
