import {View, Text, Animated, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('screen');
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const SvgSimmer = props => {
  const avatarRef = React.createRef();
  React.useEffect(() => {
    const facebookAnimated = Animated.stagger(1000, [
      avatarRef.current.getAnimated(),
    ]);
    Animated.loop(facebookAnimated).start();
  }, []);
  return (
    <ShimmerPlaceholder
        visible={props.isLoading}
        ref={avatarRef}
        stopAutoRun
        duration={2000}
        style={{
          width: width*0.9,
          height: width*0.9,
          borderRadius: 10,
          marginHorizontal: 10,
        }}
      />
  );
};

export default SvgSimmer;
