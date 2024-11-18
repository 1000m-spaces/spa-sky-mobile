import React, {memo, useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {TextNormalSemiBold, TextSmallMedium} from 'common/Text/TextFont';
import VoucherItem from './VoucherItem';
import Colors from 'theme/Colors';
import Icons from 'common/Icons/Icons';
import Svg from 'common/Svg/Svg';

const VoucherList = ({
  myVouchers,
  applyVoucher,
  voucher,
  closeBottomSheet,
  statusAppliedVoucher,
  removeAppliedVoucher,
}) => {
  const onApplyVoucher = useCallback(v => applyVoucher(v), []);
  return (
    <View style={{flex: 1, paddingBottom: 10}}>
      <View style={[styles.wrapperTitleModal]}>
        <TouchableOpacity
          disabled={!voucher}
          onPress={removeAppliedVoucher}
          style={[styles.removeAppliedBtn]}>
          <TextSmallMedium
            style={{
              color: voucher ? Colors.link : Colors.secondary,
            }}>
            {'Bỏ chọn'}
          </TextSmallMedium>
        </TouchableOpacity>
        <TextNormalSemiBold>{'Mã khuyến mãi'}</TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>
      {myVouchers &&
      (myVouchers.invalid.length > 0 || myVouchers.valid.length > 0) ? (
        <View>
          {[...myVouchers.valid, ...myVouchers.invalid].map((item, index) => {
            const {voucher_info_codes} = item;
            const tempCode =
              voucher_info_codes && voucher_info_codes.length > 0
                ? voucher_info_codes[0]
                : false;
            const valid = tempCode ? true : false;
            return (
              <VoucherItem
                key={index}
                {...{item, valid}}
                campaign={item.voucher.campaign}
                voucher={item.voucher}
                appliedVoucher={voucher}
                statusAppliedVoucher={statusAppliedVoucher}
                code={tempCode}
                handleApplyVoucher={onApplyVoucher}
              />
            );
          })}
        </View>
      ) : (
        <View style={styles.wrapperEmpty}>
          <Svg name={'icon_empty'} size={150} />
          <TextSmallMedium style={styles.textEmpty}>
            {'Danh sách mã khuyến mãi trống'}
          </TextSmallMedium>
        </View>
      )}
    </View>
  );
};

export default VoucherList;
