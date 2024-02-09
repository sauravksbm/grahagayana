import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import { colors, fonts } from '../config/Constants';

const TypingAnimation = ({text}) => {
  const [textToShow, setTextToShow] = useState('');
  const isFocused = useIsFocused();
  const navigation = useNavigation()

  useEffect(() => {
    const interval = setInterval(() => {
      const currentLength = textToShow.length;
      const nextChar = text.substring(currentLength, currentLength + 1);

      if (currentLength === text.length) {
        clearInterval(interval);
      } else {
        setTextToShow(textToShow + nextChar);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [textToShow, navigation]);

  return (
    <View>
      <Text style={{fontSize: 16, color: colors.black_color, fontFamily: fonts.medium}}>{textToShow}</Text>
    </View>
  );
};

export default TypingAnimation;
