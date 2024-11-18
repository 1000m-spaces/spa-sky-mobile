import {widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import {TextNormal} from 'common/Text/TextFont';
import {CommonActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import Svg from 'common/Svg/Svg';
import {useDispatch} from 'react-redux';
import {logout, resetCurrentLocation} from 'store/actions';
import {asyncStorage} from 'store/index';
import strings from 'localization/Localization';
const Feature = ({
  icon,
  name,
  navigation,
  link,
  onPress,
  group,
  showModalLogin,
  codeAffiliate,
}) => {
  const dispatch = useDispatch();
  const [isNotUser, setIsNotUser] = useState(false);
  useEffect(() => {
    checkAccessPermission();
  }, []);
  const checkAccessPermission = async () => {
    const theFirstLogin = await asyncStorage.getTheFirstLogin();
    if (theFirstLogin) {
      setIsNotUser(true);
    }
  };
  const handleNavigation = async () => {
    if (isNotUser && name !== strings.common.logout) {
      showModalLogin();
      return;
    }
    if (name === strings.common.logout) {
      dispatch(resetCurrentLocation({isLogout: true}));
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: link}],
        }),
      );
      return;
    }
    if (name === strings.accountScreen.giftCode) {
      // console.log('get to e voucher');
      onPress(1);
      return;
    }
    if (name === strings.accountScreen.referralCode) {
      onPress(2);
      return;
    }
    if (name === strings.accountScreen.language) {
      onPress(3);
      return;
    } else {
      navigation.navigate(link);
      return;
    }
  };
  return (
    <TouchableOpacity
      style={[styles.container, {marginTop: group.index === 1 ? 18 : 3}]}
      onPress={handleNavigation}>
      <View style={styles.content}>
        {/* <Images resizeMode={'contain'} source={icon} style={styles.image} /> */}
        <Svg name={icon} size={36} color={Colors.whiteColor} />
        {name === strings.common.logout && isNotUser ? (
          <TextNormal style={styles.textName}>
            {strings.common.login}
          </TextNormal>
        ) : name === strings.accountScreen.referralCode &&
          codeAffiliate?.ref_phone ? (
          <TextNormal style={styles.textName}>
            {name}:{'  '}
            {codeAffiliate?.ref_phone}
          </TextNormal>
        ) : (
          <TextNormal style={styles.textName}>{name}</TextNormal>
        )}
      </View>
      {codeAffiliate?.ref_phone && strings.accountScreen.referralCode ? null : (
        <Icons type={'AntDesign'} name={'right'} size={18} />
      )}
    </TouchableOpacity>
  );
};

export default Feature;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    width: widthDevice - 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 25,
    width: 25,
  },
  textName: {
    marginLeft: 20,
  },
});
