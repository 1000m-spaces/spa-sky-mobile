import {ActivityIndicator, StyleSheet, View} from 'react-native';
import React from 'react';
import {heightDevice, widthDevice} from 'assets/constans';
import Colors from 'theme/Colors';

const Loading = ({isHidden}) => {
  if (isHidden) {
    return (
      <View style={styles.container}>
        <ActivityIndicator
          size={'large'}
          style={styles.indicator}
          color={Colors.primary}
        />
      </View>
    );
  } else {
    return <></>;
  }
};

export default Loading;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: widthDevice,
    height: heightDevice,
    zIndex: 1000,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'gray',
    opacity: 0.8,
    alignItems: 'center',
  },
  indicator: {opacity: 1, zIndex: 1000},
});
