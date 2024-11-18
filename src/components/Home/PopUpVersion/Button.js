import { TextNormal } from 'common/Text/TextFont';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Colors from 'theme/Colors';

const Button = ({
  text,
  onPressEvent,
  styleView,
  styleButton,
  styleText,
  disabled = false,
}) => {
  return (
    <View style={[styles.container, styleView]}>
      <TouchableOpacity
        style={[styles.btn_container, styleButton]}
        onPress={onPressEvent}
        disabled={disabled}>
        <TextNormal style={[styles.text, styleText]}>{text}</TextNormal>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn_container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 25,
    backgroundColor: Colors.buttonTextColor,
    borderRadius: 5,
  },
  container: {
    paddingHorizontal: 25,
  },
  loading: { position: 'absolute', left: 20 },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Button;
