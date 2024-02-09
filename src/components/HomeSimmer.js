import {View, Text, Animated, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('screen');
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const HomeSimmer = props => {
  const avatarRef = React.createRef();
  const firstLineRef = React.createRef();
  const secondLineRef = React.createRef();
//   const thirdLineRef = React.createRef();
//   const fourthLineRef = React.createRef();
//   const fifthLineRef = React.createRef();
  React.useEffect(() => {
    const facebookAnimated = Animated.stagger(400, [
      avatarRef.current.getAnimated(),
      Animated.parallel([
        firstLineRef.current.getAnimated(),
        secondLineRef.current.getAnimated(),
        // thirdLineRef.current.getAnimated(),
        // fourthLineRef.current.getAnimated(),
        // fifthLineRef.current.getAnimated(),
      ]),
    ]);
    Animated.loop(facebookAnimated).start();
  }, []);
  return (
    <ScrollView
    horizontal
    nestedScrollEnabled
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15
    }}>
      <ShimmerPlaceholder
        visible={props.isLoading}
        ref={avatarRef}
        stopAutoRun
        style={{
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      />
      <ShimmerPlaceholder
        ref={firstLineRef}
        visible={props.isLoading}
        stopAutoRun
        style={{
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      />

      <ShimmerPlaceholder
        ref={secondLineRef}
        visible={props.isLoading}
        stopAutoRun
        style={{
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      />
    </ScrollView>
  );
};

export default HomeSimmer;
