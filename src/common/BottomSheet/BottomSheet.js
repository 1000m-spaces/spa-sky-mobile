import React, {useCallback, useImperativeHandle} from 'react';
import {StyleSheet, View} from 'react-native';
import {heightDevice, widthDevice} from 'assets/constans';
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

// const MAX_TRANSLATE_Y = -heightDevice + 50;
const MAX_TRANSLATE_Y = -heightDevice / 2;

const BottomSheet = React.forwardRef((props, ref) => {
  const {startPoint} = props;
  const translateY = useSharedValue(0);
  const active = useSharedValue(true);

  const scrollTo = useCallback(destination => {
    'worklet';
    active.value = destination !== 0;
    translateY.value = withSpring(destination, {damping: 50});
  }, []);

  const isActive = useCallback(() => {
    return active.value;
  }, []);

  useImperativeHandle(ref, () => ({scrollTo, isActive}), [scrollTo, isActive]);

  const context = useSharedValue({y: 0});
  const gestures = Gesture.Pan()
    .onStart(() => {
      context.value = {y: translateY.value};
    })
    .onUpdate(event => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      console.log('PROPS:::', startPoint, translateY.value);
      if (parseInt(translateY.value, 10) > -heightDevice / 2 - 50) {
        scrollTo(-heightDevice / 2 - 50);
      } else if (parseInt(translateY.value, 10) < -(heightDevice * 0.75)) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  // React.useEffect(() => {
  //   scrollTo(-heightDevice / 3);
  // }, []);

  return (
    // <GestureHandlerRootView>
    <GestureDetector gesture={gestures}>
      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <View style={styles.line} />
        {props.children}
      </Animated.View>
    </GestureDetector>
    // </GestureHandlerRootView>
  );
});
export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    height: heightDevice,
    width: widthDevice,
    backgroundColor: 'white',
    position: 'absolute',
    top: heightDevice,
    borderRadius: 25,
  },
  line: {
    width: 75,
    height: 6,
    backgroundColor: 'gray',
    alignSelf: 'center',
    marginVertical: 15,
  },
});
