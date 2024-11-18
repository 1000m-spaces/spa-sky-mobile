import React, {useEffect, useState} from 'react';
import styles from './styles';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import Status from 'common/Status/Status';
import strings from 'localization/Localization';
import Images from 'common/Images/Images';
import {payment_success} from 'assets/constans';
import Colors from 'theme/Colors';
import Svg from 'common/Svg/Svg';

const CancelOrder = ({
  statusCancel,
  detailOrder,
  setModalCancel,
  handleConfirmCancel,
}) => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (statusCancel === Status.LOADING) {
      setLoading(true);
    } else {
      let timeout = setTimeout(() => {
        clearTimeout(timeout);
        timeout = 0;
        setLoading(false);
      });
    }
  }, [statusCancel]);
  const onConfirmCancel = () => {
    setLoading(true);
    handleConfirmCancel();
  };
  return (
    <View style={styles.containerCancelModal}>
      <View style={styles.headerCancelModal}>
        <TextSemiBold>{`${strings.common.order}  #${detailOrder.id}`}</TextSemiBold>
      </View>
      {!loading ? (
        <View>
          {statusCancel === Status.DEFAULT && (
            <View style={styles.contentCancel}>
              <TextNormal>
                {strings.detailOrderScreen.cancelOrderConfirm}
              </TextNormal>
            </View>
          )}
          {statusCancel === Status.SUCCESS && (
            <View style={styles.contentCancel}>
              <Images
                resizeMode="contain"
                style={styles.imageStyleMessage}
                source={payment_success}
              />
              <TextNormalSemiBold style={styles.textCancelSuccess}>
                {strings.detailOrderScreen.cancelOrderSuccess}
              </TextNormalSemiBold>
            </View>
          )}
          {statusCancel === Status.ERROR && (
            <View style={styles.contentCancel}>
              <Svg name={'payment_error'} size={50} />
              <TextNormalSemiBold style={styles.textCancelError}>
                {strings.detailOrderScreen.cancelOrderError}
              </TextNormalSemiBold>
            </View>
          )}
          {statusCancel === Status.DEFAULT && (
            <View style={styles.actionCancel}>
              <TouchableOpacity
                onPress={() => setModalCancel(false)}
                style={styles.buttonCancelModal}>
                <TextNormalSemiBold>{strings.common.back}</TextNormalSemiBold>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onConfirmCancel}
                style={styles.buttonConfirmCancelModal}>
                <TextNormalSemiBold style={{color: Colors.whiteColor}}>
                  {strings.common.confirm}
                </TextNormalSemiBold>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View
          style={{
            paddingVertical: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator color={Colors.buttonTextColor} size="large" />
          <TextNormal style={{marginTop: 10}}>
            {'Hệ thống đang xử lý...'}
          </TextNormal>
        </View>
      )}
    </View>
  );
};

export default CancelOrder;
