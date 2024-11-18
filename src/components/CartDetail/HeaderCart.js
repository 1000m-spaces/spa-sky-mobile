import React from 'react';
import styles from './styles';
import {NAVIGATION_MENU} from 'navigation/routes';
import {TextSemiBold} from 'common/Text/TextFont';
import Icons from 'common/Icons/Icons';
import {View, TouchableOpacity} from 'react-native';

const HeaderCart = ({navigation}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => {
          navigation && navigation.navigate(NAVIGATION_MENU);
        }}
        style={styles.backIcon}>
        <Icons type={'Ionicons'} name={'arrow-back'} size={20} color={'gray'} />
      </TouchableOpacity>
      <TextSemiBold>{'Xác nhận đơn hàng'}</TextSemiBold>
    </View>
  );
};

export default HeaderCart;
