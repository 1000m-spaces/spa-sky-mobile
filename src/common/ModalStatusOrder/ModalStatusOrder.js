import MyModal from 'common/MyModal/MyModal';
import {TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from 'common/Images/Images';
import {TextSemiBold} from 'common/Text/TextFont';
import styles from './styles';
import {payment_error, payment_success} from 'assets/constans';
import Status from 'common/Status/Status';
import {useDispatch} from 'react-redux';
import {logout, resetErrorOrder, resetOrder} from 'store/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NAVIGATION_CASH_IN, NAVIGATION_LOGIN} from 'navigation/routes';
import {CommonActions} from '@react-navigation/native';
import strings from 'localization/Localization';

const ModalStatusOrder = ({
  status,
  messageSuccess,
  messageError,
  showModal,
  errorException = '',
  handleConfirmMessage,
  navigation,
}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);
  const checkSession = errorException
    ? errorException.toString().includes('session')
    : false;
  const onPressConfirmStatus = () => {
    if (checkSession) {
      dispatch(resetErrorOrder());
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
    } else {
      handleConfirmMessage();
    }
  };

  useEffect(() => {
    if (!visible) {
      onPressConfirmStatus();
    }
  }, [visible]);

  useEffect(() => {
    setVisible(true);
  });

  return (
    <MyModal visible={showModal && visible} onPressOutSide={() => {}}>
      <View style={styles.modalNoti}>
        {status === Status.SUCCESS ? (
          <Images
            resizeMode="contain"
            style={styles.imageStyle}
            source={payment_success}
          />
        ) : (
          <Images
            resizeMode="contain"
            style={styles.imageStyle}
            source={payment_error}
          />
        )}
        <TextSemiBold
          style={{
            fontSize: 15,
            marginHorizontal: 20,
            textAlign: 'center',
            paddingVertical: 20,
            color: status === Status.SUCCESS ? '#004D40' : 'red',
          }}>
          {status === Status.SUCCESS
            ? messageSuccess
            : checkSession
            ? 'Phiên làm việc đã hết, vui lòng đăng nhập lại'
            : errorException || messageError}
        </TextSemiBold>
        {errorException &&
        errorException.toString().includes('số dư không đủ') ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.buttonConfirmNewOrder, {width: 80}]}
              onPress={() => setVisible(false)}>
              <TextSemiBold style={{color: 'white'}}>OK</TextSemiBold>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.buttonConfirmNewOrder,
                {marginLeft: 20, width: 165},
              ]}
              onPress={() => {
                navigation.navigate(NAVIGATION_CASH_IN);
                setVisible(false);
              }}>
              <TextSemiBold style={{color: 'white'}}>
                {strings.accountScreen.cashin}
              </TextSemiBold>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.buttonConfirmNewOrder}
            onPress={() => setVisible(false)}>
            <TextSemiBold style={{color: 'white'}}>OK</TextSemiBold>
          </TouchableOpacity>
        )}
      </View>
    </MyModal>
  );
};

export default ModalStatusOrder;
