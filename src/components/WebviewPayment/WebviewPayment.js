import React, {useEffect, useState} from 'react';
import {BackHandler, SafeAreaView, View, Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  zaloPaymentSelector,
  // statusZaloSelector,
  getInfoOrder,
  getMessageCreateOrder,
} from 'store/selectors';
import {WebView} from 'react-native-webview';
import {useIsFocused} from '@react-navigation/native';
import {NAVIGATION_ORDER_RESULT} from 'navigation/routes';
import {getOrderInfoRequest} from 'store/actions';
import Colors from 'theme/Colors';
import Titles from 'common/Titles/Titles';
const WebviewPayment = ({navigation}) => {
  const dispatch = useDispatch();
  const onlineOrder = useSelector(state => getInfoOrder(state));
  const zaloPayment = useSelector(state => zaloPaymentSelector(state));
  const isFocused = useIsFocused();
  const orderCreatedInfo = useSelector(state => getMessageCreateOrder(state));
  const [count, setCount] = useState(0);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    if (isFocused) {
      orderCreatedInfo &&
        dispatch(getOrderInfoRequest(orderCreatedInfo?.order_id));
    }
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (isFocused && onlineOrder && parseInt(onlineOrder.is_paid, 10) === 1) {
      navigation.navigate(NAVIGATION_ORDER_RESULT, {result: true});
    } else if (
      isFocused &&
      onlineOrder &&
      parseInt(onlineOrder.is_paid, 10) === 0 &&
      orderCreatedInfo &&
      count <= 100
    ) {
      let timeout = setTimeout(() => {
        dispatch(getOrderInfoRequest(orderCreatedInfo?.order_id));
        setCount(prev => (prev += 1));
        clearTimeout(timeout);
        timeout = 0;
      }, 5 * 1000);
    }
  }, [onlineOrder]);
  useEffect(() => {
    if (count >= 99 && onlineOrder && parseInt(onlineOrder.is_paid, 10) === 0) {
      navigation.navigate(NAVIGATION_ORDER_RESULT, {time_out: true});
    }
  }, [count]);
  const onBack = () =>
    navigation.navigate(NAVIGATION_ORDER_RESULT, {zalo_back: true});

  const handleShouldStartLoadWithRequest = event => {
    // Kiểm tra nếu URL bắt đầu bằng scheme bạn muốn mở
    if (event.url.startsWith('https://qcgateway')) {
      Linking.openURL(event.url).catch(err =>
        console.error('Error opening URL: ', err),
      );
      return false; // Ngăn không cho WebView mở URL này
    }
    return true; // Cho phép WebView mở tất cả các URL khác
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
      <Titles
        title={'Thanh toán đơn hàng'}
        iconBack={true}
        onPressBack={onBack}
      />
      <View style={{height: 10}} />
      <WebView
        style={{flex: 1}}
        source={{uri: zaloPayment?.order_url || ''}}
        startInLoadingState={false}
        scalesPageToFit={true}
        onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  );
};

export default WebviewPayment;
