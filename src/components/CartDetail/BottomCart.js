import {formatMoney} from 'assets/constans';
import {TextSemiBold, TextSmallTwelve} from 'common/Text/TextFont';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Colors from 'theme/Colors';
import Icons from 'common/Icons/Icons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const BottomCart = ({
  handleCreateOrder,
  didClickOrder,
  showVoucher,
  voucher,
  myVouchers,
  totalPayment,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapperAction, {height: 100 + insets.bottom}]}>
      <View style={styles.wrapperTab}>
        <TouchableOpacity onPress={showVoucher} style={styles.tabOption}>
          {voucher && (
            <Icons
              type={'FontAwesome'}
              name={'check-circle'}
              size={20}
              color={'green'}
            />
          )}
          <TextSmallTwelve
            numberOfLines={1}
            style={{
              fontWeight: 'bold',
              paddingLeft: voucher ? 4 : 0,
            }}>
            {voucher ? `${voucher?.name}` : 'Ưu đãi'}
          </TextSmallTwelve>
          {myVouchers?.valid && myVouchers?.valid.length > 0 && !voucher && (
            <View style={styles.labelVoucher}>
              <TextSmallTwelve style={{color: Colors.whiteColor}}>
                {myVouchers.valid.length}
              </TextSmallTwelve>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        disabled={didClickOrder}
        onPress={handleCreateOrder}
        style={[styles.saveOrderBtn]}>
        <TextSemiBold style={{color: Colors.whiteColor, marginTop: 12}}>
          {`Đặt hàng - ${formatMoney(totalPayment)}đ`}
        </TextSemiBold>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(BottomCart);
