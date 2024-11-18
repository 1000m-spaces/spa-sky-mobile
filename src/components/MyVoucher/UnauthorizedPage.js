import {heightDevice} from 'assets/constans';
import Svg from 'common/Svg/Svg';
import {TextNormal, TextSmallMedium} from 'common/Text/TextFont';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import Colors from 'theme/Colors';
import {CommonActions} from '@react-navigation/native';
import {NAVIGATION_LOGIN} from 'navigation/routes';
const UnauthorizedPage = ({navigation}) => {
  const goToLogin = () => {
    let time = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
      clearTimeout(time);
      time = 0;
    }, 200);
  };
  return (
    <View style={styled.container}>
      <Svg name={'not_login_voucher'} size={120} />
      <TextNormal style={styled.title}>
        {'Hãy đăng nhập để khám phá giỏ quà của bạn'}
      </TextNormal>
      <TouchableOpacity onPress={goToLogin} style={styled.loginBtn}>
        <TextSmallMedium style={{color: Colors.whiteColor}}>
          {'Đăng nhập'}
        </TextSmallMedium>
      </TouchableOpacity>
    </View>
  );
};

export default UnauthorizedPage;

const styled = StyleSheet.create({
  loginBtn: {
    height: 48,
    width: 166,
    borderRadius: 16,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    marginTop: 10,
  },
  title: {textAlign: 'center', paddingVertical: 10},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    height: heightDevice * 0.8,
  },
});
