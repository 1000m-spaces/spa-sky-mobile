import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {styles} from './OrderStatusResult';
import * as Progress from 'react-native-progress';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import {formatMoney} from 'assets/constans';
import Colors from 'theme/Colors';
import StatusPayment from './StatusPayment';
import strings from 'localization/Localization';
import Status from 'common/Status/Status';
const PAYMENT_TYPE = {
  46: 'Zalopay',
  52: 'Apple Pay',
  45: 'MoMo',
  54: 'VietQR',
  55: 'Thẻ tín dụng',
  53: 'Thẻ ATM',
};
const HOTILINE = '0358525558';
const SuccessPayment = ({
  onlineOrder,
  currentShop,
  onCancelOrder,
  onReOrder,
  delivery,
  statusRefund,
  onRePayment,
  orderCreatedInfo,
  queryZalopay,
}) => {
  // 0 - waiting    1 - success     2 - failed    3 - cancel order successfully
  const [statusPayment, setStatusPayment] = useState(0);
  useEffect(() => {
    if (!onlineOrder) {
      return;
    }
    if (statusRefund === Status.SUCCESS) {
      setStatusPayment(3);
      return;
    }
    if (parseInt(onlineOrder.is_paid, 10) === 1) {
      setStatusPayment(1);
      return;
    } else if (
      parseInt(onlineOrder.is_paid, 10) === 0 ||
      !onlineOrder.is_paid
    ) {
      if (queryZalopay && queryZalopay?.return_code === 2) {
        setStatusPayment(2);
      } else {
        statusPayment !== 0 && setStatusPayment(0);
      }
    }
  }, [onlineOrder, statusRefund, queryZalopay]);
  return (
    <View style={{flex: 1}}>
      {onlineOrder ? (
        <View style={styles.wrapperCard}>
          <StatusPayment statusPayment={statusPayment} />
          <View style={{marginTop: 15}}>
            <View style={styles.rowLine}>
              <TextNormal style={{color: Colors.secondary}}>
                {'Cửa hàng'}
              </TextNormal>
              <TextNormalSemiBold>{currentShop?.restname}</TextNormalSemiBold>
            </View>
            <View style={styles.rowLine}>
              <TextNormal style={{color: Colors.secondary}}>
                {'PTTT'}
              </TextNormal>
              <TextNormalSemiBold>
                {PAYMENT_TYPE[onlineOrder.pos_trans_type]}
              </TextNormalSemiBold>
            </View>
            <View style={styles.rowLine}>
              <TextNormal style={{color: Colors.secondary}}>
                {'Tổng tiền'}
              </TextNormal>
              <TextNormalSemiBold>
                {formatMoney(onlineOrder ? onlineOrder?.price_paid + 'đ' : '')}
              </TextNormalSemiBold>
            </View>
            <View style={styles.rowLine}>
              <TextNormal style={{color: Colors.secondary}}>
                {'Mã đơn hàng'}
              </TextNormal>
              <TextNormalSemiBold>
                {onlineOrder && onlineOrder?.id
                  ? `#${onlineOrder?.id}`
                  : `#${orderCreatedInfo?.order_id}`}
              </TextNormalSemiBold>
            </View>
            <View style={styles.rowLine}>
              <TextNormal style={{color: Colors.secondary}}>
                {'Thời gian'}
              </TextNormal>
              <TextNormalSemiBold>
                {onlineOrder
                  ? onlineOrder?.time_create
                  : new Date().toLocaleString('en-GB')}
              </TextNormalSemiBold>
            </View>
            {delivery && (
              <View style={styles.rowLine}>
                <TextNormal style={{color: Colors.secondary}}>
                  {'Nguời nhận'}
                </TextNormal>
                <TextNormalSemiBold>{delivery.deliver_name}</TextNormalSemiBold>
              </View>
            )}
            {delivery && (
              <View>
                <TextNormal
                  style={{color: Colors.secondary, marginVertical: 5}}>
                  {'Địa chỉ nhận'}
                </TextNormal>
                <TextNormalSemiBold>
                  {onlineOrder?.shipping_address || ''}
                </TextNormalSemiBold>
              </View>
            )}
            {onlineOrder &&
              parseInt(onlineOrder?.is_paid, 10) === 1 &&
              !delivery && (
                <TextSmallTwelve style={styles.waiting}>
                  {'*Đang chờ nhân viên tại quầy xác nhận đơn hàng'}
                </TextSmallTwelve>
              )}
            {delivery && onlineOrder && (
              <TextSmallTwelve style={styles.waiting}>
                {
                  '* Nếu Quý khách cần bất cứ sự hỗ trợ nào, xin vui lòng liên hệ hotline '
                }
                <TextSmallTwelve
                  onPress={() => Linking.openURL(`tel:${HOTILINE}`)}
                  style={{
                    color: '#00A2F3',
                    fontStyle: 'italic',
                    textDecorationLine: 'underline',
                  }}>
                  {`${HOTILINE}`}
                </TextSmallTwelve>
              </TextSmallTwelve>
            )}
          </View>
        </View>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Progress.CircleSnail
            thickness={5}
            size={50}
            hidesWhenStopped={true}
            indeterminate={true}
            spinDuration={3000}
            color={Colors.green}
          />
          <TextNormalSemiBold style={{paddingVertical: 20}}>
            {'Đang xử lý...'}
          </TextNormalSemiBold>
          <TextSmallMedium style={styles.errorMomoText}>
            {'Vui lòng liên hệ nhân viên tại quán để nhận được sự trợ giúp'}
          </TextSmallMedium>
        </View>
      )}

      <View style={styles.wrapperAction}>
        {queryZalopay && queryZalopay.return_code === 2 ? (
          <TouchableOpacity
            onPress={onReOrder}
            style={styles.completePaymentBtn}>
            <TextSemiBold style={{color: Colors.whiteColor}}>
              {strings.detailOrderScreen.reorder}
            </TextSemiBold>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onRePayment}
            style={styles.completePaymentBtn}>
            <TextSemiBold style={{color: Colors.whiteColor}}>
              {statusPayment === 0 && 'Tiếp tục thanh toán'}
              {statusPayment === 1 && 'Tiếp tục mua hàng'}
            </TextSemiBold>
          </TouchableOpacity>
        )}
        {statusPayment !== 1 && (
          <TouchableOpacity
            onPress={onCancelOrder}
            style={[
              styles.completePaymentBtn,
              {backgroundColor: 'transparent', paddingVertical: 8},
            ]}>
            <TextSemiBold style={{color: Colors.hot}}>
              {strings.detailOrderScreen.cancel}
            </TextSemiBold>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default SuccessPayment;
