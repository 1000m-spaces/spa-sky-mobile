import {TextNormalSemiBold} from 'common/Text/TextFont';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from './DeliveryAddress';

const EmptyPage = ({onCreateAddress, children}) => {
  return (
    <View style={styles.wrapperEmptyPage}>
      <View style={styles.emptyImage}>{children}</View>
      <TextNormalSemiBold style={{fontSize: 16}}>
        {'Bạn chưa có địa chỉ nhận hàng'}
      </TextNormalSemiBold>
      <TouchableOpacity
        onPress={onCreateAddress}
        style={styles.createAddressBtn}>
        <TextNormalSemiBold style={styles.textBtn}>
          {'Thêm địa chỉ mới'}
        </TextNormalSemiBold>
      </TouchableOpacity>
    </View>
  );
};

export default memo(EmptyPage);
