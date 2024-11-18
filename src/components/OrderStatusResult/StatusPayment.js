import React from 'react';
import {styles} from './OrderStatusResult';
import {View} from 'react-native';
import Svg from 'common/Svg/Svg';
import * as Progress from 'react-native-progress';
import Colors from 'theme/Colors';
import {TextSemiBold} from 'common/Text/TextFont';
const WaitingStatus = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <Progress.CircleSnail
        thickness={5}
        size={50}
        hidesWhenStopped={true}
        indeterminate={true}
        spinDuration={3000}
        color={Colors.green}
      />
      <TextSemiBold style={[styles.statusText]}>
        Giao dịch chờ thanh toán
      </TextSemiBold>
    </View>
  );
};
const SuccessStatus = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <Svg name={'icon_success'} size={50} />
      <TextSemiBold style={[styles.statusText]}>
        Thanh toán thành công
      </TextSemiBold>
    </View>
  );
};
const CanceledOrder = () => {
  return (
    <View style={{alignItems: 'center'}}>
      {/* <Svg name={'icon_success'} size={50} /> */}
      <TextSemiBold style={[styles.statusText]}>
        Hủy đơn hàng thành công
      </TextSemiBold>
    </View>
  );
};
const FailedStatus = () => {
  return (
    <View style={{alignItems: 'center'}}>
      <Svg name={'icon_error_momo'} size={50} color={Colors.hot} />
      <TextSemiBold style={[styles.statusText, {color: Colors.hot}]}>
        Thanh toán thất bại
      </TextSemiBold>
    </View>
  );
};
const StatusPayment = ({statusPayment}) => {
  return (
    <View style={styles.statusSection}>
      {statusPayment === 1 && <SuccessStatus />}
      {statusPayment === 0 && <WaitingStatus />}
      {statusPayment === 3 && <CanceledOrder />}
      {statusPayment === 2 && <FailedStatus />}
    </View>
  );
};

export default StatusPayment;
