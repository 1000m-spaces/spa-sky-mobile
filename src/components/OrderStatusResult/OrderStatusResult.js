import {heightDevice, widthDevice} from 'assets/constans';
import Status from 'common/Status/Status';
import Titles from 'common/Titles/Titles';
import {
  NAVIGATION_MENU,
  NAVIGATION_ORDER_RESULT,
  NAVIGATION_WEB_PAYMENT,
} from 'navigation/routes';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  NativeModules,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getOrderInfoRequest,
  getOrderInfoReset,
  resetAppliedVoucher,
  resetMomoPayment,
  resetOrder,
  screenCurrent,
  resetZaloPayment,
  queryZalopayAction,
  selectDeliveryAction,
  refundPaymentOnline,
  resetRefund,
  resetQueryZalo,
} from 'store/actions';
import {BottomSheetModal, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {
  getCurrentShop,
  getInfoOrder,
  getMessageCreateOrder,
  // getStatusCreateOrder,
  // getStatusInfoOrder,
  statusMomoSelector,
  momoPaymentSelector,
  statusZaloSelector,
  zaloPaymentSelector,
  queryZaloSelector,
  // statusQueryZaloSelector,
  statusRefundSelector,
} from 'store/selectors';
import Colors from 'theme/Colors';
import SuccessPayment from './SuccessPayment';
import {useIsFocused} from '@react-navigation/native';
import OrderSuccessMessage from './OrderSuccessMessage';
import {PARTNER_ID} from 'assets/config';
import {asyncStorage} from 'store/index';
import MyModal from 'common/MyModal/MyModal';
import CancelOrder from 'components/DetailOrder/CancelOrder';
import strings from 'localization/Localization';
import {TextNormalSemiBold} from 'common/Text/TextFont';

export const LINK_CH_PLAY =
  'https://play.google.com/store/apps/details?id=com.mservice.momotransfer';
export const LINK_APP_STORE =
  'https://apps.apple.com/us/app/momo-chuy%E1%BB%83n-ti%E1%BB%81n-thanh-to%C3%A1n/id918751511';

var interV = null;
const OrderStatusResult = ({navigation, route}) => {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const [paySuccess, setPaySuccess] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const currentShop = useSelector(state => getCurrentShop(state));
  // const statusCreateOrder = useSelector(state => getStatusCreateOrder(state));
  const orderCreatedInfo = useSelector(state => getMessageCreateOrder(state));
  const statusMomoPayment = useSelector(state => statusMomoSelector(state));
  const onlineOrder = useSelector(state => getInfoOrder(state));
  // const statusInfoOrder = useSelector(state => getStatusInfoOrder(state));
  const momoPayment = useSelector(state => momoPaymentSelector(state));
  const statusRefund = useSelector(state => statusRefundSelector(state));
  const zaloPayment = useSelector(state => zaloPaymentSelector(state));
  const statusZaloPayment = useSelector(state => statusZaloSelector(state));
  const queryZalopay = useSelector(state => queryZaloSelector(state));
  // const statusQueryZalo = useSelector(state => statusQueryZaloSelector(state));
  const isFocused = useIsFocused();
  const [modalCancel, setModalCancel] = useState(false);
  const currentUser = useRef(null);
  const {zalo_pay, zalo_type} = route && route?.params ? route.params : false;

  useEffect(() => {
    if (Platform.OS === 'ios') {
      if (parseInt(onlineOrder?.is_paid, 10) === 1) {
        clearInterval(interV);
      }
      const setupUser = async () => {
        const user = await asyncStorage.getUser();
        currentUser.current = user ? user : null;
      };
      setupUser();
      interV = setInterval(() => {
        if (isFocused) {
          dispatch(screenCurrent(NAVIGATION_ORDER_RESULT));
          dispatch(getOrderInfoRequest(orderCreatedInfo?.order_id));
        }
      }, 5000);
    }
  }, []);

  useEffect(() => {
    setupInfo();
    setTimeout(() => {
      queryZaloInfo();
    }, 200);
  }, [isFocused]);
  const setupInfo = () => {
    const setupUser = async () => {
      const user = await asyncStorage.getUser();
      currentUser.current = user ? user : null;
    };
    if (isFocused) {
      setupUser();
      dispatch(screenCurrent(NAVIGATION_ORDER_RESULT));
      dispatch(getOrderInfoRequest(orderCreatedInfo?.order_id));
    } else {
      setPaySuccess(false);
      navigation.setParams(null);
    }
  };
  const queryZaloInfo = () => {
    if (paySuccess || parseInt(onlineOrder?.is_paid, 10) === 1) {
      return;
    }
    if (isFocused && zaloPayment) {
      dispatch(
        queryZalopayAction({
          brand_id: parseFloat(PARTNER_ID),
          merchant_id: parseFloat(currentShop.shopownerid) || 0,
          branch_id: parseFloat(currentShop.restid) || 0,
          app_user: currentUser.current?.custid,
          category: 'ZALOPAY',
          tx_id: zaloPayment.app_trans_id,
        }),
      );
    }
  };
  useEffect(() => {
    if (
      momoPayment &&
      momoPayment?.deep_link &&
      statusMomoPayment === Status.SUCCESS
    ) {
      openDeeplinkMomo();
    }
  }, [statusMomoPayment, momoPayment]);

  const openDeeplinkMomo = async () => {
    try {
      await Linking.openURL(momoPayment?.deep_link);
    } catch (error) {
      const storeUrl =
        Platform.OS === 'android' ? LINK_CH_PLAY : LINK_APP_STORE;
      Linking.openURL(storeUrl);
    } finally {
      dispatch(resetMomoPayment());
      Linking.addEventListener('url', handleDeepLink);
    }
  };
  const handleDeepLink = event => {
    if (event.url && event.url.includes('spa://app/orderStatusResult')) {
      if (event.url && !paySuccess) {
        const pram = urlParamsToObject(event.url);
        dispatch(getOrderInfoRequest(pram?.orderId));
      }
    }
  };
  useEffect(() => {
    if (zaloPayment && statusZaloPayment === Status.SUCCESS) {
      openZaloPay();
    }
  }, [zaloPayment, statusZaloPayment]);
  const openZaloPay = async () => {
    if (!zaloPayment || !zalo_pay || !zalo_type) {
      return;
    }
    try {
      setTimeout(() => {
        zalo_type !== 3 && navigation.navigate(NAVIGATION_WEB_PAYMENT);
        if (zalo_type === 3) {
          var payZP = NativeModules.PayZaloBridge;
          payZP.payOrder(zaloPayment.zp_trans_token);
        }
      }, 1200);
    } catch (error) {
      console.log('error:::', error);
    } finally {
      Linking.addEventListener('url', handleDeepLink);
    }
  };
  //---------------------DECODE DATA DEEPLINK------------------------
  const urlParamsToObject = url => {
    if (url && url.length > 0) {
      const params = url.split('?')[1].split('&');
      const r = {};
      params.forEach(param => {
        const [key, value] = param.split('=');
        r[key] = decodeURIComponent(value);
      });
      return r;
    } else {
      return '';
    }
  };
  useEffect(() => {
    if (!delivery && onlineOrder && onlineOrder?.metadata) {
      const meta = JSON.parse(onlineOrder.metadata);
      !delivery && setDelivery(meta);
    }
    let timeout = 0;
    if (
      count >= 150 ||
      paySuccess ||
      statusRefund === Status.SUCCESS ||
      (queryZalopay && queryZalopay.return_code === 2)
    ) {
      return;
    }
    if (onlineOrder && parseInt(onlineOrder?.is_paid, 10) === 1) {
      setPaySuccess(true);
      clearTimeout(timeout);
    } else {
      timeout = setTimeout(() => {
        isFocused && dispatch(getOrderInfoRequest(orderCreatedInfo?.order_id));
        queryZaloInfo();
        setCount(prev => (prev += 1));
      }, 6000);
    }
  }, [onlineOrder]);
  useEffect(() => {
    let t;
    if (paySuccess === true && isFocused && !onlineOrder.shipping_address) {
      t = setTimeout(() => {
        setOpenBottom(1);
      }, 1000);
    }
    return () => clearTimeout(t);
  }, [paySuccess]);

  const onContinuePayment = () => {
    zalo_type !== 3 && navigation.navigate(NAVIGATION_WEB_PAYMENT);
    if (zalo_type === 3) {
      var payZP = NativeModules.PayZaloBridge;
      payZP.payOrder(zaloPayment.zp_trans_token);
    }
  };

  const onResetOrder = () => {
    dispatch(resetQueryZalo());
    dispatch(selectDeliveryAction(null));
    dispatch(resetAppliedVoucher());
    zaloPayment && dispatch(resetZaloPayment());
    paySuccess && setPaySuccess(false);
    momoPayment && dispatch(resetMomoPayment());
    setTimeout(() => {
      dispatch(getOrderInfoReset());
      dispatch(resetOrder());
      navigation && navigation.navigate(NAVIGATION_MENU);
    }, 100);
  };
  const onReOrder = () => {
    clearInterval(interV);
    dispatch(getOrderInfoReset());
    dispatch(resetAppliedVoucher());
    zaloPayment && dispatch(resetZaloPayment());
    paySuccess && setPaySuccess(false);
    momoPayment && dispatch(resetMomoPayment());
    setTimeout(() => {
      navigation && navigation.navigate(NAVIGATION_MENU);
    }, 200);
  };
  const sheetRef = useRef(null);
  const [openBottom, setOpenBottom] = useState(0);
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );
  useEffect(() => {
    setTimeout(() => {
      openBottom === 0 && sheetRef.current?.dismiss();
    }, 200);
    openBottom > 0 && sheetRef.current?.present();
  }, [openBottom]);

  const cancelOrder = () => {
    const refund = {
      app_id: 1,
      branch_id: parseFloat(currentShop?.restid),
      amount: onlineOrder?.price_paid,
      merchant_id: currentShop.shopownerid,
      order_id: onlineOrder?.id,
      customer: currentUser.current?.custid,
      sesskey: currentUser.current?.session_key,
      trans_id: onlineOrder?.txn_id,
      lang: 'vi',
      description: '',
      pos_trans_type: onlineOrder?.pos_trans_type,
    };
    dispatch(refundPaymentOnline(refund));
  };
  const onCloseModal = () => {
    setModalCancel(false);
    if (statusRefund === Status.SUCCESS) {
      dispatch(resetRefund());
      onResetOrder();
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Titles title={'Kết quả giao dịch'} iconBack={false} />

      <SuccessPayment
        {...{
          delivery,
          onlineOrder,
          currentShop,
          statusRefund,
          orderCreatedInfo,
          queryZalopay,
        }}
        onCancelOrder={() => setModalCancel(true)}
        onReOrder={onReOrder}
        onRePayment={() => {
          if (paySuccess || parseInt(onlineOrder?.is_paid, 10) === 1) {
            onResetOrder();
          } else {
            onContinuePayment();
          }
        }}
      />
      {openBottom > 0 && (
        <BottomSheetModal
          enablePanDownToClose={false}
          enableOverDrag={false}
          overDragResistanceFactor={0}
          enableHandlePanningGesture={false}
          handleIndicatorStyle={{display: 'none'}}
          backdropComponent={renderBackdrop}
          onChange={v => v === -1 && setOpenBottom(0)}
          ref={sheetRef}
          snapPoints={['80%']}>
          <OrderSuccessMessage
            onClose={() => {
              clearInterval(interV);
              setOpenBottom(0);
            }}
          />
        </BottomSheetModal>
      )}
      <MyModal visible={modalCancel} onPressOutSide={onCloseModal}>
        <View style={styles.wrapperModal}>
          <CancelOrder
            detailOrder={onlineOrder}
            statusCancel={statusRefund}
            setModalCancel={val => setModalCancel(val)}
            handleConfirmCancel={cancelOrder}
          />
          {statusRefund === Status.SUCCESS && (
            <TouchableOpacity
              onPress={onCloseModal}
              style={styles.buttonCancelModal}>
              <TextNormalSemiBold style={styles.textBack}>
                {strings.common.back}
              </TextNormalSemiBold>
            </TouchableOpacity>
          )}
        </View>
      </MyModal>
    </SafeAreaView>
  );
};

export default OrderStatusResult;

export const styles = StyleSheet.create({
  wrapperModal: {
    width: widthDevice - 20,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  textBack: {color: Colors.primary, fontWeight: 'bold'},
  buttonCancelModal: {
    width: 120,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    alignSelf: 'center',
    paddingVertical: 6,
    marginBottom: 20,
    borderWidth: 2,
  },
  rePaymentBtn: {
    backgroundColor: Colors.whiteColor,
    width: widthDevice - 40,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 10,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  wrapperAction: {
    position: 'absolute',
    bottom: 0,
    width: widthDevice,
    justifyContent: 'center',
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
    minHeight: 90,
    // backgroundColor: Colors.whiteColor,
  },
  errorMomoText: {
    paddingBottom: 5,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderStyle: 'dashed',
    marginTop: 10,
    paddingTop: 10,
  },
  waiting: {
    color: Colors.warning,
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  completePaymentBtn: {
    backgroundColor: Colors.buttonTextColor,
    width: widthDevice - 40,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 10,
  },
  wrapperCard: {
    marginVertical: 20,
    marginHorizontal: 15,
    padding: 15,
    backgroundColor: Colors.whiteColor,
    width: widthDevice - 30,
    minHeight: 0.32 * heightDevice,
    alignSelf: 'center',
    borderRadius: 8,
  },
  statusText: {
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: 'condensedBold',
    textAlign: 'center',
  },
  statusSection: {
    paddingVertical: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  rowLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
});
