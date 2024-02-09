import React, {useEffect, useRef} from 'react';
import {Animated, View, StyleSheet, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {colors} from '../config/Constants';

const RainingFlowers = () => {
  const flowers = useRef([]);
  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const createFlowerAnimation = () => {
      return {
        animation: new Animated.Value(-100),
        isActive: true,
      };
    };

    flowers.current = Array(120)
      .fill()
      .map(() => createFlowerAnimation());

    flowers.current.forEach((flower, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(flower.animation, {
            toValue: screenHeight,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(flower.animation, {
            toValue: -100,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start(({finished}) => {
        if (finished) {
          flower.isActive = false;
        }
      });
    });

    return () => {
      flowers.current.forEach(flower => flower.animation.stopAnimation());
    };
  }, []);

  const activeFlowers = flowers.current.filter(flower => flower.isActive);

  return (
    <View style={styles.container}>
      {activeFlowers.map((flower, index) => {
        const column = index % 8;
        const positionLeft = (screenWidth / 7) * column;
        return (
          <Animated.View
            key={index}
            style={[
              styles.flower,
              {transform: [{translateY: flower.animation}]},
              {left: positionLeft},
            ]}>
            <Ionicons name="rose" size={30} color={colors.pink_color1} />
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  flower: {
    position: 'absolute',
  },
});

export default RainingFlowers;
