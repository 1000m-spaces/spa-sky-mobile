import React, {useState} from 'react';
import DatePicker from 'react-native-date-picker';
import MyModal from '../MyModal/MyModal';
import {TextNormal, TextSemiBold} from '../Text/TextFont';
import strings from 'localization/Localization';
import {StyleSheet, TouchableOpacity, Animated, View} from 'react-native';
import Colors from 'theme/Colors';
import {heightDevice, widthDevice} from 'assets/constans';
import Icons from '../Icons/Icons';
const GenderPicker = ({isOpen, title, onClose, onSelect}) => {
  const transition = new Animated.Value(heightDevice);
  React.useEffect(() => {
    animatedAction(transition);
  }, [isOpen]);
  const animatedAction = val => {
    Animated.timing(val, {
      duration: 700,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  const animatedOpacity = transition.interpolate({
    inputRange: [0, heightDevice / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  return (
    <MyModal visible={isOpen} onPressOutSide={() => {}}>
      <Animated.View
        style={[
          styles.containerModal,
          {transform: [{translateY: transition}], opacity: animatedOpacity},
        ]}>
        <TouchableOpacity style={{alignSelf: 'flex-end'}} onPress={onClose}>
          <Icons
            type={'AntDesign'}
            name={'closecircle'}
            color={Colors.blackColor}
            size={28}
          />
        </TouchableOpacity>
        <TextSemiBold style={styles.title}>
          {title || 'Chọn giới tính'}
        </TextSemiBold>
        <TouchableOpacity
          onPress={() => onSelect('Nam')}
          style={styles.genderText}>
          <TextNormal>{'Nam'}</TextNormal>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelect('Nữ')}
          style={styles.genderText}>
          <TextNormal>{'Nữ'}</TextNormal>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onSelect('Không tiết lộ')}
          style={styles.genderText}>
          <TextNormal>{'Không tiết lộ'}</TextNormal>
        </TouchableOpacity>
      </Animated.View>
    </MyModal>
  );
};

export default GenderPicker;

const styles = StyleSheet.create({
  genderText: {
    paddingVertical: 10,
    width: '100%',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {paddingBottom: 20},
  containerModal: {
    backgroundColor: 'whitesmoke',
    padding: 10,
    position: 'relative',
    top: heightDevice / 4,
    left: 0,
    zIndex: 100,
    width: widthDevice - 40,
    alignItems: 'center',
    borderRadius: 20,
  },
  buttonComplete: {
    marginTop: 20,
    marginBottom: 10,
    width: '50%',
    paddingVertical: 10,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.textGrayColor,
  },
});
