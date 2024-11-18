import {React, useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Pressable,
  BackHandler,
  Linking,
  Platform,
} from 'react-native';
import Titles from 'common/Titles/Titles';
import {
  TextMoneyBold,
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallEleven,
  TextSmallMedium,
} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {formatMoney, heightDevice, logo, widthDevice} from 'assets/constans';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCurrentShop,
  getErrorCreateMomo,
  getErrorGetUrlPayment,
  getOrderCashin,
  getStatusCreateCashinOrder,
  // getStatusVnpayUrl,
  isGetVnpayUrl,
  isListMoneyOnline,
  isListShopShowMoney,
} from 'store/selectors';
import Icons from 'common/Icons/Icons';
import {
  NAVIGATION_ACCOUNT,
  NAVIGATION_SHOP,
  NAVIGATION_STATUS_CASH_IN,
} from 'navigation/routes';
import Svg from 'common/Svg/Svg';
import MyModal from 'common/MyModal/MyModal';
import {
  createCashInMomo,
  getOrderInfoRequest,
  getUrlPayment,
  resetCreateCashinMomo,
  resetGetUrlPayment,
} from 'store/actions';
import {asyncStorage} from 'store/index';
import Status from 'common/Status/Status';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import Loading from 'common/Loading/Loading';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import ShopItem from 'common/ShopItem/ShopItem';
import styles from './styles';
const CashIn = ({navigation}) => {
  const dispatch = useDispatch();
  const currentUser = useRef(null);
  const currentShop = useSelector(state => getCurrentShop(state));
  const [moneyShow, setMoneyShow] = useState(0);
  const [showListMoney, setShowListMoney] = useState(false);
  const [showPaymentGetway, setShowGetway] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Bạn cần nạp tối thiểu là 100.000 point',
  );
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalShop, setModalShop] = useState(false);
  const [shopSelect, setShopSelect] = useState({});
  const [disablePay, setDisablePay] = useState(false);

  //Pay Momo
  const [indexMoney, setIndexMoney] = useState(null);
  const [itemSelected, setItemSelected] = useState({prodid: -1});
  const listMoneyOnline = useSelector(state => isListMoneyOnline(state));
  const statusCreateCashinOrder = useSelector(state =>
    getStatusCreateCashinOrder(state),
  );
  // const isStatusVnpayUrl = useSelector(state => getStatusVnpayUrl(state));
  const cashinOrder = useSelector(state => getOrderCashin(state)) || {
    order_id: -1,
  };
  const infoUrlPay = useSelector(state => isGetVnpayUrl(state));
  const errorGetUrlPayment = useSelector(state => getErrorGetUrlPayment(state));
  const errorCreateMomo = useSelector(state => getErrorCreateMomo(state));
  const listShops = useSelector(state => isListShopShowMoney(state));
  const selectMoney = (inde, ite) => {
    setIndexMoney(inde);
    // setItemSelect(ite);
  };

  useEffect(() => {
    if (listMoneyOnline && listMoneyOnline.length > 0) {
      handleSelectMoney(listMoneyOnline[2]?.prodprice);
      setItemSelected(listMoneyOnline[2]);
    }
  }, []);

  const handleCashin = () => {
    // console.log('item selected:::', itemSelected);
    // navigation.navigate(NAVIGATION_STATUS_CASH_IN, {
    //   urlCallbackDeeplinkMomo: null,
    // });
    // setModalConfirm(false);
    setTimeout(() => {
      setConfirm(false);
    }, 4000);
    setDisablePay(true);
    // const tempOrder = {
    //   products: [
    //     {
    //       pid: itemSelected?.prodid,
    //       quantity: 1,
    //       price: itemSelected?.order_price || itemSelected?.prodprice,
    //       opt_id1: -1,
    //       opt_id2: 0,
    //       opt_id3: 0,
    //     },
    //   ],
    //   restaurant: currentShop.restid,
    //   takeaway_time: '',
    //   table_order: '',
    //   customer: currentUser.current?.custid,
    //   sesskey: currentUser.current?.session_key,
    //   shockprice: 0,
    //   note_order: '',
    //   register_id: 0,
    //   shipping_address: '',
    // };
    const tempOrder = {
      subPrice: itemSelected?.order_price || itemSelected?.prodprice,
      svFee: '0',
      svFee_amount: 0,
      shopTableid: '0',
      orderNote: '',
      products: [
        {
          amount: itemSelected?.order_price || itemSelected?.prodprice,
          extras: [],
          name: 'Nạp app',
          note: '',
          opt1: null,
          opt2: null,
          opt3: null,
          option: [],
          prodid: itemSelected?.prodid,
          prodprice: itemSelected?.order_price || itemSelected?.prodprice,
          rate_discount: 0,
          typeOrder: 'Nạp momo',
        },
      ],
      cust_id: currentUser.current?.custid,
      shopTableName: 'Nap tien',
      transType: 45,
      chanel_type_id: '1',
      phuthu: 0,
      total_amount: 0,
      fix_discount: 0,
      perDiscount: 0,
      session: currentUser.current?.session_key,
      shopid: shopSelect?.restid,
      userid: '0',
      roleid: '4',
    };
    dispatch(createCashInMomo(tempOrder));
  };

  useEffect(() => {
    initUser();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', e => {
      console.log('BackPress', e);
      // navigation.pop();
      // do something here
      return true;
    });
    return () => {
      backHandler.remove();
      dispatch(resetCreateCashinMomo());
    };
  }, []);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };

  ////////////////////////////////////////////////////////////////////////
  const handleSelectMoney = money => {
    setMoneyShow(money);
    setShowListMoney(false);
  };
  const handleShowGetway = () => {
    setShowListMoney(false);
    setShowGetway(true);
  };
  const DropDownMoney = useCallback(() => {
    return (
      <View style={styles.containerDropDownHeader}>
        <View style={{}}>
          <FlatList
            data={listMoneyOnline}
            keyExtractor={item => `${item}`}
            showsVerticalScrollIndicator={true}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    handleSelectMoney(item?.prodprice);
                    setItemSelected(item);
                  }}
                  style={styles.wrapperItemDropdown}>
                  <TextNormalSemiBold>
                    {formatMoney(item?.prodprice) + ' point'}
                  </TextNormalSemiBold>
                  {item?.prodprice === moneyShow && (
                    <Icons
                      type={'Feather'}
                      name={'check'}
                      color={Colors.buttonTextColor}
                      size={20}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    );
  });

  useEffect(() => {
    if (statusCreateCashinOrder === Status.SUCCESS) {
      const query = {
        app_id: 1,
        user_id: parseInt(currentUser.current?.custid, 10) || 0,
        merchant_id: parseInt(shopSelect.shopownerid, 10) || 0,
        branch_id: parseInt(shopSelect.restid, 10) || 0,
        amount: itemSelected?.order_price || itemSelected?.prodprice,
        branch_name: shopSelect?.restname || '',
        order_id: cashinOrder.order_id,
        return_url: 'neocafe://app/statusCashIn',
        order_type: 'other',
        order_info: `${cashinOrder.order_id}`,
        storeId: shopSelect.momo_store_id,
      };
      console.log('QUERY GET URL VNPAY:::', query);
      dispatch(getUrlPayment(query));
    }
    setDisablePay(false);
  }, [statusCreateCashinOrder]);

  const openDeeplinkMomo = async deplink => {
    try {
      console.log('OPEENN URRRLL:', deplink);
      const isInstalled = await Linking.openURL(deplink);
      console.log('isInstalled:::', isInstalled);
      Linking.openURL(deplink);
    } catch (error) {
      console.log('Error:', error);
      const storeUrl =
        Platform.OS === 'android'
          ? 'https://play.google.com/store/apps/details?id=com.mservice.momotransfer'
          : 'https://apps.apple.com/us/app/momo-chuy%E1%BB%83n-ti%E1%BB%81n-thanh-to%C3%A1n/id918751511';
      Linking.openURL(storeUrl);
    }
  };
  console.log('infoUrlPay:', infoUrlPay);
  useEffect(() => {
    if (infoUrlPay?.deep_link) {
      // console.log('BIENBBBBBBB:', cashinOrder.order_id);
      // setInterval(() => {
      //   dispatch(getOrderInfoRequest(cashinOrder?.order_id));
      // }, 15000);
      dispatch(resetGetUrlPayment());
      // Linking.openURL(infoUrlPay?.deep_link);
      openDeeplinkMomo(infoUrlPay?.deep_link);
    }
  }, [infoUrlPay]);

  const handleDeepLink = event => {
    // Kiểm tra nếu event.url không rỗng (null)
    if (event.url && event.url.includes('tea://app/orderStatusResult')) {
      navigation.navigate(NAVIGATION_STATUS_CASH_IN, {
        urlCallbackDeeplinkMomo: event.url,
      });
      // Thực hiện các hành động cần thiết với URL deep link
      // Ví dụ: điều hướng đến màn hình tương ứng với URL deep link
    }
  };

  useEffect(() => {
    // Đăng ký sự kiện khi ứng dụng được khởi chạy
    Linking.addEventListener('url', handleDeepLink);
  }, []);

  const handleConfirmMessage = () => {
    dispatch(resetCreateCashinMomo());
    dispatch(resetGetUrlPayment());
  };

  const renderShopItem = ({item, index}) => {
    return (
      <ShopItem
        data={item}
        onPress={() => {
          setModalShop(false);
          setShopSelect(item, index);
        }}
        index={item?.restid}
        isModal={false}
        indexSelect={shopSelect?.restid}
        hiddenMap={false}
      />
    );
  };

  useEffect(() => {
    setShopSelect(currentShop);
  }, [currentShop]);

  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={strings.accountScreen.cashin}
        iconBack={true}
        onPressBack={() => {
          if (confirm) {
            setConfirm(false);
          } else {
            navigation.navigate(NAVIGATION_ACCOUNT);
          }
        }}
      />
      {!confirm ? (
        <View style={styles.containerContent}>
          {/* STORE CASH IN */}
          <TouchableOpacity
            style={styles.wrapperStore}
            onPress={() => setModalShop(true)}>
            <View style={styles.wrapperTitleStore}>
              <TextNormalSemiBold>
                {strings.cashInScreen.loadToStore}
              </TextNormalSemiBold>
            </View>
            <View style={styles.wrapperStoreInfo}>
              <Images
                resizeMode={'contain'}
                source={logo}
                style={styles.imageLogo}
              />
              <View style={{width: '80%'}}>
                <View style={styles.wrapeprNameStore}>
                  <TextSemiBold style={styles.nameStore}>
                    {shopSelect.restname}
                  </TextSemiBold>
                </View>
                <View style={styles.wrapperAddress}>
                  <TextNormal numberOfLines={1} style={styles.addressText}>
                    {shopSelect.restaddr}
                  </TextNormal>
                </View>
              </View>
              <Icons
                color={'black'}
                type={'AntDesign'}
                name={'right'}
                size={20}
              />
            </View>
          </TouchableOpacity>
          {/* CASH IN MONEY */}
          <View style={styles.wrapperStore}>
            <View style={styles.wrapperTitleStore}>
              <TextNormalSemiBold>
                {strings.cashInScreen.pointNumber}
              </TextNormalSemiBold>
            </View>
            <View
              style={[
                styles.wrapperInputMoney,
                showListMoney && {height: 6 * 48},
              ]}>
              <TouchableOpacity
                onPress={() => setShowListMoney(prev => (prev = !prev))}
                style={[styles.styleTextInput]}>
                <TextNormal
                  style={{
                    color:
                      moneyShow > 0
                        ? Colors.buttonTextColor
                        : Colors.textGrayColor,
                    fontWeight: moneyShow > 0 ? 'bold' : '600',
                    fontSize: moneyShow > 0 ? 15 : 13,
                  }}>
                  {moneyShow
                    ? formatMoney(moneyShow) + ' point'
                    : strings.cashInScreen.selectPoint}
                </TextNormal>
                <Icons
                  type={'Feather'}
                  name={showListMoney ? 'chevron-up' : 'chevron-down'}
                  size={25}
                  color={Colors.buttonTextColor}
                />
              </TouchableOpacity>
              {/* {showListMoney && <DropDownMoney />} */}
              <TextNormal style={styles.warningMessage}>
                {errorMessage}
              </TextNormal>
            </View>
            <View style={styles.contentInfo}>
              <View style={styles.viewDot} />
              <View style={styles.viewDotR} />
            </View>
            <View style={styles.dottedLineContainer}>
              <View style={styles.dottedLineDot} />
            </View>
          </View>
          {!showListMoney && (
            <View style={styles.wrapperTotalMoney}>
              <TextNormalSemiBold>
                {strings.cashInScreen.paymentAmount}
              </TextNormalSemiBold>
              <TextMoneyBold style={{color: Colors.buttonTextColor}}>
                {formatMoney(moneyShow) + ' đ'}
              </TextMoneyBold>
            </View>
          )}
          <TouchableOpacity
            style={styles.wrapperPayment}
            onPress={handleShowGetway}>
            <TextNormalSemiBold>
              {strings.cashInScreen.paymentMethods}
            </TextNormalSemiBold>
            <View style={styles.wrapperIconPayment}>
              <Svg name={'icon_momo'} size={32} color={Colors.textGrayColor} />
              <TextNormal style={{marginLeft: 5}}>{'Momo'}</TextNormal>
            </View>
            <Icons
              color={'black'}
              type={'AntDesign'}
              name={'right'}
              size={20}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.containerContent}>
          {/* STORE CASH IN */}
          <TouchableOpacity style={styles.wrapperStore} onPress={() => {}}>
            <View style={styles.wrapperTitleStore}>
              <TextNormalSemiBold>
                {strings.cashInScreen.storeConfirmation}
              </TextNormalSemiBold>
            </View>
            <View style={styles.wrapperStoreInfo}>
              <Images
                resizeMode={'contain'}
                source={logo}
                style={styles.imageLogo}
              />
              <View style={{width: '85%'}}>
                <View style={styles.wrapeprNameStore}>
                  <TextSemiBold style={styles.nameStore}>
                    {shopSelect.restname}
                  </TextSemiBold>
                </View>
                <View style={styles.wrapperAddress}>
                  <TextNormal style={styles.addressText}>
                    {shopSelect.restaddr}
                  </TextNormal>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {/* CASH IN MONEY */}
          <View style={styles.wrapperStore}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 23,
              }}>
              <TextNormal>
                {strings.cashInScreen.loadInto} E-Voucher 1
              </TextNormal>
              <TextNormalSemiBold>
                {formatMoney(moneyShow) + ' p'}
              </TextNormalSemiBold>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 23,
                marginBottom: 40,
              }}>
              <TextNormal>{strings.cashInScreen.paymentMethods}</TextNormal>
              <TextNormalSemiBold>Momo</TextNormalSemiBold>
            </View>
            <View style={styles.contentInfo}>
              <View style={styles.viewDot} />
              <View style={styles.viewDotR} />
            </View>
            <View style={styles.dottedLineContainer}>
              <View style={styles.dottedLineDot} />
            </View>
          </View>
          <View />
          {!showListMoney && (
            <View style={styles.wrapperTotalMoney}>
              <TextNormalSemiBold>
                {strings.cashInScreen.paymentAmount}
              </TextNormalSemiBold>
              <TextMoneyBold style={{color: Colors.buttonTextColor}}>
                {formatMoney(moneyShow) + ' đ'}
              </TextMoneyBold>
            </View>
          )}
        </View>
      )}
      <View
        style={{
          paddingHorizontal: 40,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TextSmallEleven style={{textAlign: 'center'}}>
          Bằng việc thanh toán, Quý khách đã đồng ý với{' '}
          <TextSmallEleven
            onPress={() => Linking.openURL('http://neocafe.tech/policy')}
            style={{color: '#00A2F3'}}>
            Điều khoản về sử dụng
          </TextSmallEleven>{' '}
          E-Voucher tại Trà 1000M
        </TextSmallEleven>
      </View>
      {!confirm ? (
        <TouchableOpacity
          // onPress={() => navigation.navigate(NAVIGATION_STATUS_CASH_IN)}
          onPress={() => setConfirm(true)}
          // onPress={() => Linking.openURL('neocafe://login')}
          disabled={moneyShow === 0}
          style={[styles.orderButton, {opacity: moneyShow === 0 ? 0.6 : 1}]}>
          <TextSemiBold style={{color: Colors.whiteColor}}>
            {strings.accountScreen.orderNow} {formatMoney(moneyShow)}đ
          </TextSemiBold>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          // onPress={() => navigation.navigate(NAVIGATION_STATUS_CASH_IN)}
          onPress={() => handleCashin()}
          // onPress={() => Linking.openURL('neocafe://login')}
          disabled={disablePay}
          style={[
            styles.orderButton,
            {
              flexDirection: 'row',
              justifyContent: 'center',
              opacity: disablePay ? 0.6 : 1,
            },
          ]}>
          <View style={{padding: 1, backgroundColor: 'white', borderRadius: 2}}>
            <Svg name={'icon_momo'} size={25} color={Colors.textGrayColor} />
          </View>
          <TextSemiBold style={{color: Colors.whiteColor, marginLeft: 8}}>
            {strings.cashInScreen.confirmationAndPayment}
          </TextSemiBold>
        </TouchableOpacity>
      )}
      <MyModal
        visible={showPaymentGetway}
        onPressOutSide={() => setShowGetway(false)}>
        <View style={styles.modalView}>
          <TextNormalSemiBold style={{alignSelf: 'center'}}>
            {strings.cashInScreen.paymentMethods}
          </TextNormalSemiBold>
          <TouchableOpacity
            // onPress={() => handleSeclectLanguage('en')}
            style={[styles.wrapperGetway]}>
            <TextNormalSemiBold style={{color: Colors.redColor}}>
              {'Momo'}
            </TextNormalSemiBold>
            <Icons
              type={'Feather'}
              name={'check'}
              color={Colors.buttonTextColor}
              size={23}
            />
          </TouchableOpacity>
        </View>
      </MyModal>
      <MyModal
        visible={showListMoney}
        onPressOutSide={() => setShowListMoney(false)}>
        <View style={styles.modalView}>
          {showListMoney && <DropDownMoney />}
        </View>
      </MyModal>
      {/* <ConfirmationModal
        isOpen={modalConfirm}
        onCancel={() => setModalConfirm(false)}
        onConfirm={handleCashin}
        textContent={`Xin vui lòng xác nhận bạn muốn nạp tiền tại ${shopSelect.restname}`}
      /> */}
      <Loading isHidden={isStatusVnpayUrl === Status.LOADING} />
      <ModalStatusOrder
        status={statusCreateCashinOrder}
        showModal={statusCreateCashinOrder === Status.ERROR}
        errorException={errorCreateMomo || errorGetUrlPayment}
        messageSuccess={''}
        messageError={'Xảy ra lỗi'}
        handleConfirmMessage={handleConfirmMessage}
        navigation={navigation}
      />
      <MyModal visible={modalShop} onPressOutSide={() => setModalShop(false)}>
        <View
          style={{
            height: heightDevice * 0.6,
            backgroundColor: 'white',
            marginHorizontal: 15,
            borderRadius: 10,
          }}>
          <View style={{height: heightDevice * 0.6}}>
            <View
              style={{
                width: '100%',
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors.button2Color,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}>
              <TextNormalSemiBold style={{color: 'white', fontSize: 16}}>
                {strings.common.selectStore}
              </TextNormalSemiBold>
            </View>
            <FlatList
              data={listShops}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => `${item?.restid}`}
              keyboardShouldPersistTaps="handled"
              renderItem={renderShopItem}
            />
          </View>
        </View>
      </MyModal>
    </SafeAreaView>
  );
};

export default CashIn;
