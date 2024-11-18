import React from 'react';
import {styles} from './MyVoucher';
import Svg from 'common/Svg/Svg';
import {View} from 'react-native';
import {TextSmallMedium} from 'common/Text/TextFont';

const EmptyVoucher = () => {
  return (
    <View style={styles.wrapperEmpty}>
      <Svg name={'icon_empty'} size={150} />
      <TextSmallMedium style={styles.textEmpty}>
        {
          'Hiện tại bạn chưa có voucher nào.\nTiếp tục trải nghiệm để săn ngay những voucher hot bạn nhé'
        }
      </TextSmallMedium>
    </View>
  );
};

export default EmptyVoucher;
