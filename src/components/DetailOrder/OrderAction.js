import {TextSemiBold, TextSmallEleven} from 'common/Text/TextFont';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import strings from 'localization/Localization';

const OrderAction = ({
  detailOrder,
  onPressCancel,
  statusRefund,
  onPressOpenReorder,
  // onPressPayment,
}) => {

  return (
    <View style={styles.wrapperConfirm}>
      <TextSmallEleven style={styles.note}>
        {strings.detailOrderScreen.reorderWarning}
      </TextSmallEleven>
      <View style={styles.buttonSection}>
        {detailOrder.is_cancel === 0 &&
          statusRefund !== 'SUCCESS' &&
          ((detailOrder.pos_trans_type === 45 && detailOrder.is_paid === 0) || detailOrder.pos_trans_type !== 45) &&
          detailOrder.is_check === 0 && (
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={onPressCancel}>
              <TextSemiBold style={styles.textCancel}>
                {strings.detailOrderScreen.cancel}
              </TextSemiBold>
            </TouchableOpacity>
          )}
        <TouchableOpacity
          style={styles.buttonRevert}
          onPress={onPressOpenReorder}>
          <TextSemiBold style={styles.textRevert}>
            {strings.detailOrderScreen.reorder}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderAction;
