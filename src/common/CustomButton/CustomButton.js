import {widthDevice} from 'assets/constans';
import {TextSemiBold} from 'common/Text/TextFont';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';

const CustomButton = ({
  onPress,
  label,
  styledButton,
  isDisabled,
  styled,
  labelStyled,
}) => {
  // const [value, setValue] = useState(false);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={
        styledButton
          ? [styledButton, isDisabled && {backgroundColor: '#B8B8B8'}]
          : [
              styles.buttonContinue,
              styled,
              isDisabled && {backgroundColor: '#B8B8B8'},
            ]
      }>
      <TextSemiBold
        style={[
          styles.textContinueButton,
          labelStyled,
          isDisabled && {color: '#858585'},
        ]}>
        {label}
      </TextSemiBold>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  buttonContinue: {
    width: widthDevice - 40,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
  textContinueButton: {
    color: Colors.whiteColor,
    fontWeight: 'bold',
    fontSize: 17,
  },
});
