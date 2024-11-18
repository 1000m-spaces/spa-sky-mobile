import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icons from 'common/Icons/Icons';
import {
  TextMoneyBold,
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import {NAVIGATION_HOME, NAVIGATION_MENU} from 'navigation/routes';
import {asyncStorage} from 'store/index';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCurrentLocation,
  getInfoOrder,
  getOrderCashin,
  getStatusInfoOrder,
} from 'store/selectors';
import {
  getListShopShowMoney,
  getOrderInfoRequest,
  getOrderInfoReset,
} from 'store/actions';
import Loading from 'common/Loading/Loading';
import Svg from 'common/Svg/Svg';
import Colors from 'theme/Colors';
import {formatMoney} from 'assets/constans';

var timeInterval = null;
var timeOut = null;
const StatusCashIn = ({navigation, route}) => {
  const {urlCallbackDeeplinkMomo} = route?.params || '';
  const dispatch = useDispatch();
  const currentUser = useRef({custid: -1});
  const [userCurrent, setUserCurrent] = useState({custid: ''});
  const [loading, setLoading] = useState(true);
  const [paySuccess, setPaySuccess] = useState('');
  //------------------getlocation ----------------
  const [count, setCount] = useState(true);
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [infoOrder, setInfoOrder] = useState({});

  const currentLocation = useSelector(state => getCurrentLocation(state));
  const isInfoOrder = useSelector(state => getInfoOrder(state));
  const isGetStatusInfoOrder = useSelector(state => getStatusInfoOrder(state));
  const cashinOrder = useSelector(state => getOrderCashin(state)) || {
    order_id: -1,
  };

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation?.longitude && count) {
      setCount(false);
      setLat(currentLocation?.latitude);
      setLong(currentLocation?.longitude);
    }
  }, []);

  const initUser = async () => {
    const user = await asyncStorage.getUser();
    // user.acctbal = parseInt(user.acctbal, 10);
    // user.acctbal2 = parseInt(user.acctbal2, 10);
    if (user && user.custid) {
      currentUser.current = user || {custid: -1};
      setUserCurrent(user);
    }
  };

  const getInformationOrder = orderId => {
    if (urlCallbackDeeplinkMomo && orderId) {
      timeInterval = setInterval(() => {
        dispatch(getOrderInfoRequest(orderId));
      }, 6000);
      timeOut = setTimeout(() => {
        if (!paySuccess) {
          setPaySuccess(false);
        }
        dispatch(getOrderInfoReset());
        clearInterval(timeInterval);
        timeInterval = 0;
        setLoading(false);
      }, 80000);
      initUser();
    }
  };

  const onRefresh = () => {
    if (currentUser?.current && currentUser?.current?.custid) {
      const bodyListShop = {
        lat: lat,
        long: long,
        custid: currentUser.current?.custid,
      };
      dispatch(getListShopShowMoney(bodyListShop));
    }
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 1000);
  };

  useEffect(() => {
    if (isInfoOrder?.is_paid === 1) {
      setPaySuccess(true);
      dispatch(getOrderInfoReset());
      clearInterval(timeInterval);
      clearTimeout(timeOut);
      setInfoOrder(isInfoOrder);
      setLoading(false);
      onRefresh();
    }
  }, [isInfoOrder]);

  //---------------------DECODE DATA DEEPLINK------------------------
  const urlParamsToObject = url => {
    if (url) {
      const params = url.split('?')[1].split('&');
      const result = {};
      params.forEach(param => {
        const [key, value] = param.split('=');
        result[key] = decodeURIComponent(value);
      });
      return result;
    } else {
      return '';
    }
  };

  // useEffect(() => {
  //   var pram = urlParamsToObject(urlCallbackDeeplinkMomo);
  //   getInformationOrder(pram?.orderId);
  //   console.log('AAAAAAAAAAAAAAAAAAAAAA::', pram);
  // }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        var pram = urlParamsToObject(urlCallbackDeeplinkMomo);
        getInformationOrder(pram?.orderId);
      }, 50);
    });
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.containerMain}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => navigation.navigate(NAVIGATION_HOME)}
            style={styles.buttonBack}>
            <Icons type={'Feather'} name={'home'} size={23} color={'#3C3C3C'} />
          </TouchableOpacity>
          <View style={styles.viewTextTitle}>
            <TextSemiBold style={styles.textTitle}>
              {' '}
              {strings.cashInScreen.transactionResults}
            </TextSemiBold>
          </View>
        </View>
        <View style={{flex: 1}}>
          {paySuccess === true ? (
            <View style={styles.content}>
              <View style={styles.contentStatus}>
                <Svg name={'icon_success_momo'} size={48} color={'#688D86'} />
                <TextNormalSemiBold>
                  {strings.cashInScreen.successfulTransaction}
                </TextNormalSemiBold>
                <TextMoneyBold style={{color: Colors.buttonTextColor}}>
                  {formatMoney(
                    infoOrder?.price_total ? infoOrder?.price_total : 0,
                  )}
                  p
                </TextMoneyBold>
                <View style={styles.dottedLineContainer}>
                  <View style={styles.dottedLineDot} />
                </View>
              </View>
              <View style={styles.contentInfo}>
                <View style={styles.viewDot} />
                <View style={styles.viewDotR} />
              </View>
              <View style={{paddingHorizontal: 21}}>
                <View style={styles.viewVoucher}>
                  <TextNormal>E-voucher 1</TextNormal>
                  <TextNormalSemiBold>
                    {formatMoney(
                      infoOrder?.price_total ? infoOrder?.price_total : 0,
                    )}
                    p
                  </TextNormalSemiBold>
                </View>
                <View style={styles.viewInfo}>
                  <TextNormal>{strings.freeshipScreen.packageTime}</TextNormal>
                  <TextNormalSemiBold>
                    {infoOrder?.time_create}
                  </TextNormalSemiBold>
                </View>
                <View style={styles.viewInfo}>
                  <TextNormal>{strings.cashInScreen.tradingCode}</TextNormal>
                  <TextNormalSemiBold>{infoOrder?.id}</TextNormalSemiBold>
                </View>
              </View>
            </View>
          ) : paySuccess === false ? (
            <View style={styles.content}>
              <View style={styles.contentStatus}>
                <Svg name={'icon_error_momo'} size={48} color={'#F1DCB1'} />
                <TextNormalSemiBold>
                  {strings.cashInScreen.transactionInProgress}
                </TextNormalSemiBold>
                <View style={styles.dottedLineContainer}>
                  <View style={styles.dottedLineDot} />
                </View>
              </View>
              <View style={styles.contentInfo}>
                <View style={styles.viewDot} />
                <View style={styles.viewDotR} />
              </View>
              <View style={{paddingHorizontal: 21}}>
                <TextNormal style={{marginTop: 10}}>
                  {strings.cashInScreen.sorry}!{'\n'}
                </TextNormal>
                <TextNormal>
                  {strings.cashInScreen.processForOrder}{' '}
                  <TextNormal style={{fontWeight: 800, fontSize: 15}}>
                    {infoOrder?.id}
                  </TextNormal>{' '}
                  {strings.cashInScreen.please}
                </TextNormal>
              </View>
            </View>
          ) : null}
        </View>
        <TouchableOpacity
          // onPress={() => navigation.navigate(NAVIGATION_STATUS_CASH_IN)}
          onPress={() => {
            if (!loading) {
              navigation.navigate(NAVIGATION_MENU);
            }
          }}
          // onPress={() => Linking.openURL('neocafe://login')}
          style={[
            styles.continueOrderButton,
            {backgroundColor: !loading ? Colors.buttonTextColor : '#7A8D8A'},
          ]}>
          {loading ? (
            <TextSemiBold style={{color: Colors.whiteColor}}>
              {strings.cashInScreen.paymentInProgress}
            </TextSemiBold>
          ) : (
            <TextSemiBold style={{color: Colors.whiteColor}}>
              {strings.cashInScreen.continueShopping}
            </TextSemiBold>
          )}
        </TouchableOpacity>
        <Loading isHidden={loading} />
      </View>
    </SafeAreaView>
  );
};

export default StatusCashIn;
