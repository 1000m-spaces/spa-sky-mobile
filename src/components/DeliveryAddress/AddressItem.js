import Icons from 'common/Icons/Icons';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import {styles} from './DeliveryAddress';
import Svg from 'common/Svg/Svg';
const AddressItem = ({item, onEdit, lastItem, onPress, valid}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      disabled={!valid}
      style={[styles.containerItemAddress]}>
      <Svg name={'address_item'} size={20} />
      <View style={styles.mainAddressSection}>
        <View
          style={[
            styles.wrapperContent,
            lastItem && {borderBottomWidth: 0},
            !valid && {opacity: 0.5},
          ]}>
          <View style={styles.wrapperPrimaryLine}>
            <TextNormalSemiBold>{item.recipient_name}</TextNormalSemiBold>
            <TextNormal style={styles.separatorLine}>|</TextNormal>
            <TextNormalSemiBold>{item.recipient_phone}</TextNormalSemiBold>
          </View>
          <TextSmallTwelve style={styles.addressItem}>
            {item.address}
          </TextSmallTwelve>
        </View>
        <TouchableOpacity onPress={() => onEdit(item)} style={styles.editBtn}>
          <Icons
            name={'edit'}
            type={'AntDesign'}
            size={15}
            color={Colors.hot}
          />
          <TextNormal style={styles.textEditAddress}>{'Sửa'}</TextNormal>
        </TouchableOpacity>

        {!valid && (
          <TextSmallMedium style={styles.invalidAddressText}>
            {'Địa chỉ nằm ngoài phạm vi giao hàng (3km)'}
          </TextSmallMedium>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(AddressItem);
