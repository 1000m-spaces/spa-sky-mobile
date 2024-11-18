import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';

const CustomCheckbox = ({value, setValue, isDisabled = false}) => {
  // const [value, setValue] = useState(false);
  return (
    <TouchableOpacity
      disabled={isDisabled}
      onPress={setValue}
      style={[styles.container, value && styles.activeContainer]}>
      <View style={[styles.wrapper, value && {borderWidth: 0}]} />
    </TouchableOpacity>
  );
};

export default CustomCheckbox;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E3E3E3',
    width: 60,
    padding: 3,
    borderRadius: 20,
    alignItems: 'flex-start',
  },
  activeContainer: {
    backgroundColor: Colors.green,
    width: 60,
    padding: 3,
    borderRadius: 20,
    alignItems: 'flex-end',
  },
  wrapper: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 28,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderStyle: 'solid',
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
