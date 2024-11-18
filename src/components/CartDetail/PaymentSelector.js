import Icons from 'common/Icons/Icons';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallMedium,
} from 'common/Text/TextFont';
import Svg from 'common/Svg/Svg';
import Colors from 'theme/Colors';
const items = [
  {id: 2, name: 'MoMo', icon: 'icon_momo'},
  {id: 1, name: 'Chuyển khoản qua mã QR', icon: 'qr_pay'},
  {id: 3, name: 'Apple pay', icon: 'apple_pay'},
];
const PaymentSelector = ({closeBottomSheet, selectedItem = 1, onPressItem}) => {
  return (
    <View style={{flex: 1}}>
      <View style={[styles.wrapperTitleModal]}>
        <TextNormalSemiBold>{'Phương thức thanh toán'}</TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>
      {items &&
        items.length > 0 &&
        items.map((i, index) => (
          <TouchableOpacity
            onPress={() => onPressItem(i.id)}
            key={i.id}
            disabled={index !== 0}
            style={[
              styles.wrapperGatewayItem,
              {flexDirection: 'row', justifyContent: 'space-between'},
            ]}>
            <View style={[styles.row]}>
              <Icons
                type={'FontAwesome'}
                name={selectedItem === i.id ? 'dot-circle-o' : 'circle-o'}
                size={15}
                color={selectedItem === i.id ? 'black' : 'gray'}
                style={{paddingRight: 10}}
              />
              <Svg name={i.icon} size={20} />
              <View style={{paddingHorizontal: 12}}>
                <TextNormal
                  style={{
                    fontSize: 13,
                    color: selectedItem === i.id ? 'black' : Colors.secondary,
                  }}>
                  {i.name}
                </TextNormal>
              </View>
              {index !== 0 && (
                <View style={styles.wrapperComming}>
                  <TextSmallMedium style={{color: '#F9A50B'}}>
                    {'Sắp ra mắt'}
                  </TextSmallMedium>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default memo(PaymentSelector);
