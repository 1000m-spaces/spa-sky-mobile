import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Keyboard,
  Platform,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetScrollView,
  BottomSheetFooter,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import {
  getCurrentShop,
  getCurrentOrder,
  getStatusCreateOrder,
  getListVoucher,
  getAppliedItem,
  statusApplyVoucher,
  getMessageCreateOrder,
  getInfoOrder,
  statusMomoSelector,
  // statusQrcodeSelector,
  getSelectedDelivery,
  getStatusListVoucher,
  statusZaloSelector,
} from 'store/selectors';
import {asyncStorage} from 'store/index';
import {
  applyVoucherAction,
  createOrder,
  getListVoucherAction,
  getOrderInfoReset,
  // getQrCodeAction,
  getUrlPayment,
  resetAppliedVoucher,
  resetGetVouchers,
  screenCurrent,
  setCurrentOrder,
  zaloPaymentAction,
} from 'store/actions';
import {
  NAVIGATION_ORDER_RESULT,
  NAVIGATION_CART_DETAIL,
} from 'navigation/routes';
import Loading from 'common/Loading/Loading';
import Status from 'common/Status/Status';
import strings from 'localization/Localization';
import BottomCart from './BottomCart';
import Colors from 'theme/Colors';
import PaymentGateway from './PaymentGateway';
import NoteOrder from './NoteOrder';
import StoreSection from './StoreSection';
import ProductList, {FEE_SHIP} from './ProductList';
import NoteInput from './NoteInput';
import VoucherList from './VoucherList';
// import PaymentSelector from './PaymentSelector';
import {useFocusEffect} from '@react-navigation/native';
import {PARTNER_ID} from 'assets/config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import HeaderCart from './HeaderCart';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
export const MOMO_PAYMENT = 2; // 45
const ZALO_PAYMENT = 3; // 44
const BOTTOM_HEIGHT = 150;
const ZALO_GATEWAY = {
  1: 50, // QR CODE
  3: 38, // ZALO_WALLET
  4: 51, // APPLE_PAYMENT
  5: 36, // VISA_CARD
  6: 39, // ATM
};
const PAYMENT_TYPE = {
  3: 46,
  4: 52,
  2: 45,
  1: 54,
  5: 55,
  6: 53,
};

const CartDetail = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const currentUser = useRef(null);
  const bottomSheetRef = useRef(null);

  const [noteOrder, setNoteOrder] = useState('');
  // 1-STORE :: 2-NOTE  :: 4-VOUCHER :: 5-PAYMENT
  const [bottomSheetType, setBottomSheetType] = useState(0);
  const [didClickOrder, setDidClickOrder] = useState(false);
  const [payment, setPayment] = useState({
    init: 0,
    fee: 0,
    total: 0,
    prod: 0,
  });
  const [modalWarning, setModalWarning] = useState(0);
  const currentCode = useRef(null);
  const [paymentType, setPaymentType] = useState(ZALO_PAYMENT);

  // ------------------------------------ GLOCAL STATE --------------------------------
  const dispatch = useDispatch();
  const currentShop = useSelector(state => getCurrentShop(state));
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const myVouchers = useSelector(state => getListVoucher(state));
  const statusMyVouchers = useSelector(state => getStatusListVoucher(state));
  const selectedDelivery = useSelector(state => getSelectedDelivery(state));

  const appliedVoucher = useSelector(state => getAppliedItem(state));
  const statusAppliedVoucher = useSelector(state => statusApplyVoucher(state));
  const statusCreateOrder = useSelector(state => getStatusCreateOrder(state));
  const orderCreatedInfo = useSelector(state => getMessageCreateOrder(state));
  const onlineOrder = useSelector(state => getInfoOrder(state));
  const statusMomoPayment = useSelector(state => statusMomoSelector(state));
  // const statusVnpay = useSelector(state => statusQrcodeSelector(state));
  const statusZaloPayment = useSelector(state => statusZaloSelector(state));
  useEffect(() => {
    const setupPaymentType = async () => {
      try {
        const type = await asyncStorage.getPaymentGateway();
        type && setPaymentType(parseInt(type, 10));
      } catch (error) {
        console.log('error setup payment:::', error);
      }
    };
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(screenCurrent(NAVIGATION_CART_DETAIL));
      setupPaymentType();
    });
    return unsubscribe;
  }, []);

  // ------------------------ HANDLE CREATE ORDER (BEFORE ORDER) -----------------------
  const setupProductForOrder = listProduct => {
    let tempList = [];
    listProduct.map(prod => {
      const extras = prod?.extra_items
        ? Array.from(prod?.extra_items || [], val => ({
            id: val.id,
            quantity: 1,
            name: val.name_vn ? val.name_vn : val.name_eng,
            isExtra: 1,
            price: val.price,
          }))
        : [];
      tempList.push({
        pid: prod.prodid || prod?.product_id,
        quantity: prod.quantity,
        amount: currentOrder.voucher ? prod.amount : 0,
        price:
          currentOrder.voucher &&
          currentOrder.voucher.voucher_discount_type === 1
            ? prod?.initial_paid_price
            : prod?.prodprice,
        paid_price:
          currentOrder.voucher &&
          currentOrder.voucher.voucher_discount_type === 1
            ? prod?.paid_price
            : prod?.order_price,
        name: prod?.product_name || prod.prodname,
        extras: extras || [],
        note: prod.note || '',
        opt_id1: prod?.option_item?.id || -1,
      });
    });
    return tempList;
  };
  // CHECK VALID BEFORE CREATE ORDER
  const checkValidOrder = () => {
    if (currentOrder?.products.length <= 0 || currentUser.current === null) {
      return false;
    }
    if (
      currentOrder.takeaway &&
      currentOrder.valid_delivery === false &&
      selectedDelivery
    ) {
      setModalWarning(1);
      return false;
    }
    if (currentOrder?.takeaway && !selectedDelivery) {
      setModalWarning(2);
      return false;
    }
    return true;
  };
  //  CREATE ORDER ACTION
  const handleCreateOrder = () => {
    const validOrder = checkValidOrder();
    if (!validOrder) {
      return;
    }
    if (modalWarning !== 3 && selectedDelivery && currentOrder?.takeaway) {
      setModalWarning(3);
      return;
    }

    onlineOrder && dispatch(getOrderInfoReset());
    const products = setupProductForOrder(
      currentOrder.voucher
        ? currentOrder.applied_products
        : currentOrder?.products,
    );
    const tempOrder = {
      products,
      total_paid: payment.total,
      restaurant: currentShop.restid,
      is_delivery: currentOrder?.takeaway,
      table_order: '',
      takeaway_time: '',
      shipping_address:
        currentOrder?.takeaway === true ? selectedDelivery.address : '',
      customer: currentUser.current?.custid,
      sesskey: currentUser.current?.session_key,
      transType: `${PAYMENT_TYPE[paymentType]}`,
      chanel_type_id: '1',
      note_order:
        noteOrder && noteOrder.length > 0
          ? noteOrder.replace(
              /[^a-zA-Z0-9\sáàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ]/gi,
              '',
            )
          : '',
    };
    if (currentOrder.voucher) {
      tempOrder.voucher = {
        voucher_discount_type: currentOrder.voucher?.voucher_discount_type,
        voucher_id: currentOrder.voucher.id,
        voucher_info_id: currentOrder.voucher.voucher_info_id,
        campaign_id: currentOrder.voucher.campaign_id,
        user_id: currentUser.current.custid,
        checksum: currentOrder.voucher?.checksum,
        promotional_products: currentOrder.voucher?.all_items || [],
      };
    }
    if (currentOrder?.takeaway) {
      const list = [...selectedDelivery.address.split(',')];
      const detail =
        list.filter((_, idx) => idx < list.length - 4).join(',') || '';
      const general = list.filter((_, idx) => idx !== 0).join(',');
      tempOrder.deliver_info = {
        deliver_longitude: `${selectedDelivery.lng}`,
        deliver_latitude: `${selectedDelivery.lat}`,
        deliver_country: 'VN',
        deliver_detail_address: detail,
        deliver_name: selectedDelivery.to_my_location
          ? currentUser.current.custname
          : selectedDelivery.recipient_name,
        deliver_phone: selectedDelivery.to_my_location
          ? currentUser.current.custphone
          : selectedDelivery.recipient_phone,
        deliver_address: general,
      };
    }
    console.log('CREATE ORDER WITH DATA::::', tempOrder, payment);
    dispatch(createOrder(tempOrder));
  };

  const checkPayment = list => {
    if (!currentOrder || !currentOrder.products) {
      return;
    }
    let totalProd = 0,
      tempTotal = 0,
      tempInit = 0,
      fee = 0;
    list.map(product => {
      totalProd += product.quantity;
      let tempExtra = 0;
      if (product?.extra_items && product?.extra_items.length > 0) {
        product?.extra_items.map(extra => {
          tempExtra = tempExtra + extra?.price;
        });
      }
      tempTotal += (product?.order_price + tempExtra) * product?.quantity;
    });
    tempInit = tempTotal;
    if (currentOrder.takeaway) {
      fee = FEE_SHIP;
      tempTotal += fee;
    }
    setPayment({
      init: currentOrder.voucher
        ? currentOrder.voucher.initial_total_amount
        : tempInit,
      fee: fee,
      total: currentOrder.voucher
        ? currentOrder.voucher.total_amount + fee
        : tempTotal,
      prod: totalProd,
    });
  };

  // ------------------- AFTER CREATE ORDER -> GET PAYMENT LINK ------------------
  useEffect(() => {
    const setDefaultPayment = async () => {
      await asyncStorage.setPaymentGateway(paymentType);
    };
    if (statusCreateOrder === Status.LOADING) {
      setModalWarning(0);
      setDidClickOrder(true);
    }
    if (statusCreateOrder === Status.SUCCESS && didClickOrder === true) {
      setDefaultPayment();
      paymentType === MOMO_PAYMENT && getMomoURL();
      paymentType !== MOMO_PAYMENT && getZaloPayment();
    }
    if (statusCreateOrder === Status.ERROR) {
      resetInfo();
      // navigation && navigation.navigate(NAVIGATION_MENU);
    }
  }, [statusCreateOrder]);
  // -------------------------------- ZALO PAYMENT ------------------
  const getZaloPayment = () => {
    if (!orderCreatedInfo) {
      setDidClickOrder(false);
      return;
    }
    const query = {
      amount: payment.total,
      branch_id: parseFloat(currentShop.restid) || 0,
      branch_name: currentShop?.restname || '',
      brand_id: parseFloat(PARTNER_ID),
      channel: ZALO_GATEWAY[paymentType],
      currency: 'VNĐ',
      merchant_id: parseFloat(currentShop.shopownerid) || 0,
      order_id: `${orderCreatedInfo.order_id}`,
      phone: currentUser.current.custphone,
      redirect_url: 'tea://app/orderStatusResult',
      user_id: currentUser.current.custid,
      voucher_code: currentOrder.voucher ? currentOrder.voucher.name : '',
    };
    dispatch(zaloPaymentAction(query));
  };

  // GET MOMO PAYMENT INFO
  const getMomoURL = () => {
    if (!orderCreatedInfo) {
      setDidClickOrder(false);
      return;
    }
    const query = {
      app_id: 1,
      user_id: parseInt(currentUser.current?.custid, 10) || 0,
      merchant_id: parseFloat(currentShop.shopownerid) || 0,
      branch_id: parseFloat(currentShop.restid) || 0,
      amount: payment.total,
      branch_name: currentShop?.restname || '',
      order_id: parseInt(orderCreatedInfo.order_id, 10),
      return_url: 'tea://app/orderStatusResult',
      order_type: 'other',
      order_info: `${orderCreatedInfo.order_id}`,
      storeId: currentShop.momo_store_id,
    };
    dispatch(getUrlPayment(query));
  };
  // GET LINK PAYMENT SUCCESS
  useEffect(() => {
    let timeout;
    if (
      statusMomoPayment === Status.SUCCESS ||
      statusZaloPayment === Status.SUCCESS
    ) {
      resetInfo();
      timeout = setTimeout(() => {
        navigation.navigate(NAVIGATION_ORDER_RESULT, {
          zalo_pay: statusZaloPayment === Status.SUCCESS,
          zalo_type: paymentType,
        });
      }, 100);
    }
    return () => clearTimeout(timeout);
  }, [statusMomoPayment, statusZaloPayment]);

  // INITIALIZE USER INFORMATION
  const setupUserVoucher = async () => {
    const user = await asyncStorage.getUser();
    currentUser.current = user ? user : null;
    user &&
      currentOrder &&
      dispatch(
        getListVoucherAction({
          user_id: user.custid,
          used_for: 1,
          status: 'assigned',
          delivery: false,
          items: currentOrder.products
            ? Array.from(currentOrder.products || [], a => ({
                amount: a.order_price * a.quantity,
                extra_items: a.extra_items,
                option_item: a.option_item,
                paid_price: a.order_price,
                price_discount: 0,
                product_id: a.prodid,
                product_name: a.prodname,
                quantity: a.quantity,
              }))
            : [],
          amount: 100000,
          quantity_items: 1000,
          merchant_id: parseFloat(currentShop.shopownerid),
          branch_id: parseFloat(currentShop.restid),
          brand_id: parseFloat(PARTNER_ID),
          unexpired: false,
        }),
      );
  };
  // ----------------- ONMOUNT - UNMOUNT ----------------------------------
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        dispatch(getOrderInfoReset());
        // console.log('online order:::', onlineOrder);
      }, 200);
      setupUserVoucher();
      return () => {
        // RESET BEFORE LEAVING SCREEN
        dispatch(
          setCurrentOrder({
            ...currentOrder,
            voucher: null,
            applied_products: [],
          }),
        );
        dispatch(resetAppliedVoucher());
        dispatch(resetGetVouchers());
        setBottomSheetType(null);
        dispatch(screenCurrent(''));
      };
    }, []),
  );
  // --------------------------  APPLY VOUCHER HANDLER -------------------
  useLayoutEffect(() => {
    if (statusMyVouchers === Status.SUCCESS) {
      initVoucherForOrder();
    }
  }, [myVouchers]);
  const initVoucherForOrder = () => {
    if (myVouchers && myVouchers.valid && myVouchers.valid.length === 0) {
      return;
    }
    if (currentUser.current && currentOrder) {
      let temp =
        myVouchers.valid && myVouchers.valid.length > 0
          ? [...myVouchers.valid].shift()
          : -1;
      temp !== -1 && applyVoucher(temp);
    }
  };
  const setupAppliedProduct = useCallback(() => {
    const items = [];
    let tempPayment = 0;
    currentOrder.products.map(i => {
      let extraPrice = 0;
      i.extra_items.map(e => {
        extraPrice += e.price;
      });
      tempPayment += (i.order_price + extraPrice) * i.quantity;
      items.push({
        amount: (i.order_price + extraPrice) * i.quantity,
        paid_price: i.order_price,
        price_discount: 0,
        product_id: i.prodid,
        extra_items: i.extra_items || [],
        option_item: i.option_item || {},
        product_name: i.prodname,
        quantity: i.quantity,
      });
    });
    return [items, tempPayment];
  }, [currentOrder]);

  const applyVoucher = useCallback(
    voucherSelected => {
      const {code} = voucherSelected?.voucher_info_codes
        ? voucherSelected?.voucher_info_codes[0]
        : -1;
      currentCode.current = {
        ...voucherSelected?.voucher_info_codes[0],
        name: voucherSelected.voucher.generic_code,
        id: voucherSelected.voucher.id,
        campaign_id: voucherSelected.voucher.campaign.id,
      };
      const [items, price_total] = setupAppliedProduct();
      dispatch(
        applyVoucherAction({
          code: code,
          customer_id: currentUser.current ? currentUser.current.custid : '',
          items: items || [],
          partner_id: parseFloat(PARTNER_ID),
          price_total: price_total,
          rest_id: parseFloat(currentShop.restid),
          shopowner_id: parseFloat(currentShop.shopownerid),
          topup_num: 0,
          used_for: 1,
        }),
      );
      closeBottomSheet();
    },
    [myVouchers],
  );
  useLayoutEffect(() => {
    if (statusAppliedVoucher === Status.SUCCESS) {
      onAppliedVoucherSuccess();
    }
    if (statusAppliedVoucher === Status.ERROR) {
      onAppliedVoucherError();
    }
  }, [statusAppliedVoucher]);
  const onAppliedVoucherSuccess = () => {
    const {voucher_discount} = appliedVoucher
      ? appliedVoucher?.campaign_applied_info
      : null;
    if (!voucher_discount) {
      dispatch(resetAppliedVoucher());
      dispatch(
        setCurrentOrder({...currentOrder, voucher: null, applied_products: []}),
      );
      return;
    }
    const tempMap = new Map(
      currentOrder.products.map(i => {
        return [`${i?.prodid}`, i];
      }),
    );
    const newItems =
      voucher_discount && voucher_discount.voucher_discount_type === 1
        ? voucher_discount?.all_items.map(p => {
            if (tempMap.has(`${p?.product_id}`)) {
              const prod = tempMap.get(`${p?.product_id}`);
              return {
                ...p,
                prodimg: prod !== -1 ? prod.prodimg : '',
                quantity: p.quantity,
              };
            }
          })
        : currentOrder.products;
    dispatch(
      setCurrentOrder({
        ...currentOrder,
        applied_products: newItems,
        voucher: {
          ...voucher_discount,
          ...currentCode.current,
        },
      }),
    );
    dispatch(resetAppliedVoucher());
    currentOrder.current = null;
  };
  const onAppliedVoucherError = useCallback(() => {
    currentOrder.current = null;
    dispatch(resetAppliedVoucher());
    dispatch(
      setCurrentOrder({...currentOrder, voucher: null, applied_products: []}),
    );
  });

  const resetInfo = useCallback(() => {
    setDidClickOrder(false);
    dispatch(resetAppliedVoucher());
  }, []);
  useEffect(() => {
    if (currentOrder) {
      checkPayment(currentOrder?.products);
    }
  }, [currentOrder]);
  const handleResetApplied = () => {
    dispatch(
      setCurrentOrder({
        ...currentOrder,
        applied_products: [],
        voucher: null,
      }),
    );
    currentCode.current = null;
    dispatch(resetAppliedVoucher());
    closeBottomSheet();
  };
  const handleModalWarning = () => {
    if (modalWarning <= 2) {
      setModalWarning(0);
    }
    if (modalWarning === 3) {
      handleCreateOrder();
    }
  };

  // ------------------- HANDLE BOTTOM SHEET ------------------------
  const refNoteOrder = useRef(null);
  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={[styles.saveModalBtn, {marginBottom: insets.bottom}]}>
          <TextNormalSemiBold style={{color: Colors.whiteColor}}>
            {strings.common.confirm || 'Xác nhận'}
          </TextNormalSemiBold>
        </TouchableOpacity>
      </BottomSheetFooter>
    ),
    [],
  );
  const closeBottomSheet = useCallback(() => {
    Keyboard.dismiss();
    setTimeout(() => {
      setBottomSheetType(0);
    }, 250);
  }, [bottomSheetType]);

  // const handleSelectGateway = useCallback(id => setPaymentType(id), []);
  useEffect(() => {
    if (bottomSheetType <= 0 && bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
    if (bottomSheetType > 0 && bottomSheetRef.current) {
      bottomSheetRef.current.present();
    }
  }, [bottomSheetType]);
  const renderBackdrop = React.useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.7}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior={'close'}
      />
    ),
    [],
  );
  const onShowVoucher = useCallback(() => setBottomSheetType(4), []);
  const onShowNote = useCallback(() => setBottomSheetType(2), []);
  // const onShowPaymentSelector = useCallback(() => setBottomSheetType(5), []);
  const handlePullDown = useCallback(
    val => val === -1 && setBottomSheetType(0),
    [],
  );
  const selectPaymentType = id => {
    setPaymentType(id);
  };
  // ----------------------------------------------------------
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <HeaderCart {...{navigation}} />
      </SafeAreaView>
      <View style={styles.wrapperScrollView}>
        <ScrollView>
          {currentShop && (
            <StoreSection {...{currentOrder, currentShop, navigation}} />
          )}
          {currentOrder && <ProductList {...{currentOrder, payment}} />}

          {/* PAYMENT */}
          <PaymentGateway
            {...{navigation, paymentType}}
            onPress={selectPaymentType}
          />
          {/* NOTE */}
          <NoteOrder noteOrder={noteOrder} onPressNote={onShowNote} />
          <View style={{height: BOTTOM_HEIGHT}} />
        </ScrollView>
        {/* ORDER BUTTON */}
        {currentOrder && payment && (
          <BottomCart
            {...{
              didClickOrder,
              myVouchers,
              currentOrder,
            }}
            voucher={currentOrder.voucher}
            totalPayment={payment.total}
            handleCreateOrder={handleCreateOrder}
            showVoucher={onShowVoucher}
          />
        )}

        {bottomSheetType > 0 && (
          <BottomSheetModal
            handleIndicatorStyle={{display: 'none'}}
            ref={bottomSheetRef}
            footerComponent={renderFooter}
            enablePanDownToClose={false}
            onChange={handlePullDown}
            keyboardBlurBehavior={'restore'}
            keyboardBehavior={'interactive'}
            android_keyboardInputMode="adjustResize"
            backdropComponent={renderBackdrop}
            snapPoints={bottomSheetType !== 4 ? ['65%'] : ['90%']}>
            <BottomSheetScrollView style={styles.wrapperBottomSheet}>
              {bottomSheetType === 2 && (
                <NoteInput {...{noteOrder}} closeBottomSheet={closeBottomSheet}>
                  {Platform.OS === 'ios' ? (
                    <BottomSheetTextInput
                      placeholder={'Vui lòng điền nội dung ghi chú'}
                      numberOfLines={3}
                      maxLength={200}
                      ref={refNoteOrder}
                      style={styles.inputArea}
                      textAlignVertical={'top'}
                      onLayout={() =>
                        setTimeout(() => {
                          refNoteOrder.current && refNoteOrder.current.focus();
                        }, 500)
                      }
                      value={noteOrder}
                      onChangeText={setNoteOrder}
                      placeholderTextColor={'gray'}
                    />
                  ) : (
                    <BottomSheetTextInput
                      placeholder={'Vui lòng điền nội dung ghi chú'}
                      numberOfLines={3}
                      maxLength={200}
                      ref={refNoteOrder}
                      style={styles.inputArea}
                      textAlignVertical={'top'}
                      onLayout={() =>
                        setTimeout(() => {
                          refNoteOrder.current && refNoteOrder.current.focus();
                        }, 500)
                      }
                      onChangeText={setNoteOrder}
                      placeholderTextColor={'gray'}
                    />
                  )}
                </NoteInput>
              )}
              {bottomSheetType === 4 && (
                <VoucherList
                  myVouchers={myVouchers}
                  voucher={currentOrder.voucher}
                  paymentType={paymentType}
                  statusAppliedVoucher={statusAppliedVoucher}
                  removeAppliedVoucher={handleResetApplied}
                  closeBottomSheet={closeBottomSheet}
                  applyVoucher={applyVoucher}
                />
              )}
            </BottomSheetScrollView>
          </BottomSheetModal>
        )}
        <Loading
          isHidden={statusCreateOrder === Status.LOADING || didClickOrder}
        />
        <ConfirmationModal
          isOpen={modalWarning > 0}
          isConfriming={modalWarning <= 2}
          textConfrimBtn={modalWarning !== 3 ? 'Đồng ý' : 'Xác nhận'}
          onCancel={() => setModalWarning(0)}
          onConfirm={() => handleModalWarning()}
          textContent={
            modalWarning === 1
              ? 'Địa chỉ nằm ngoài phạm vi giao hàng. Quý khách vui lòng chọn địa chỉ khác hoặc tạo mới để đặt hàng'
              : modalWarning === 2
              ? 'Vui lòng chọn địa chỉ giao hàng truớc khi đặt hàng'
              : `Quý khách đang đặt hàng giao đến địa chỉ ${
                  selectedDelivery?.address || ''
                }`
          }
          title={strings.common.notification}
        />
      </View>
    </View>
  );
};

export default CartDetail;
