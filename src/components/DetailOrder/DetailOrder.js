import {React, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  // Linking,
  // Platform,
} from 'react-native';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import Titles from 'common/Titles/Titles';
import {
  NAVIGATION_ACCOUNT,
  NAVIGATION_ACCOUNT_ORDER_HISTORY,
  NAVIGATION_DETAIL_ORDER,
  NAVIGATION_MENU,
  // NAVIGATION_ORDER_RESULT,
} from 'navigation/routes';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCurrentOrder,
  getDetailOrder,
  getErrorRevertOrder,
  getStatusRevertOrder,
  statusCancelOrder,
  isMapListProductAllByShop,
  getCurrentShop,
  statusRefundSelector,
  messageRefundSelector,
} from 'store/selectors';
import styles from './styles';
import {
  revertOrder,
  revertOrderReset,
  refundPaymentOnline,
  resetRefund,
} from 'store/actions';
import MyModal from 'common/MyModal/MyModal';
import Status from 'common/Status/Status';
import {CommonActions, StackActions} from '@react-navigation/native';
import {asyncStorage} from 'store/index';
import Colors from 'theme/Colors';
import Loading from 'common/Loading/Loading';
import strings from 'localization/Localization';
import InforSection from './InforSection';
import ListItem from './ListItem';
import OrderAction from './OrderAction';
import CancelOrder from './CancelOrder';

const DetailOrder = ({navigation}) => {
  const dispatch = useDispatch();
  const currentUser = useRef({});
  const detailOrder = useSelector(state => getDetailOrder(state));
  const mapListProductAllByShop = useSelector(state =>
    isMapListProductAllByShop(state),
  );
  const [statusOfOrder, setStatusOfOrder] = useState('');
  const errorRevertOrder = useSelector(state => getErrorRevertOrder(state));
  const statusRevertOrder = useSelector(state => getStatusRevertOrder(state));
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const statusCancel = useSelector(state => statusCancelOrder(state));
  const [openModalReorder, setOpenModalReorder] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [products, setProducts] = useState([]);
  const currentShop = useSelector(state => getCurrentShop(state));
  const statusRefund = useSelector(state => statusRefundSelector(state));
  const messageRefund = useSelector(state => messageRefundSelector(state));
  //onPress agree revert order
  useEffect(() => {
    initUser();
    return () => {
      setModalCancel(false);
      dispatch(resetRefund());
      setOpenModalReorder(false);
    };
  }, []);
  const onPressAgree = () => {
    setOpenModalReorder(false);
    //Add product exist in shop to cart
    dispatch(revertOrder(detailOrder?.products, mapListProductAllByShop, true));
  };
  //onPress disagree revert order
  const onPressDisagree = () => {
    setOpenModalReorder(false);
    dispatch(revertOrderReset());
  };
  //
  const onPressOpenReorder = () => {
    dispatch(
      //Check the menu in the shop exist product
      revertOrder(detailOrder?.products, mapListProductAllByShop, false),
    );
  };
  const onPressCancel = () => {
    setModalCancel(true);
  };
  useEffect(() => {
    if (statusRevertOrder === Status.SUCCESS) {
      navigation.navigate(NAVIGATION_MENU);
      //remove DetailOrder from stack navigation
      navigation.dispatch(state => {
        const routes = state.routes.filter(
          r =>
            r.name !== NAVIGATION_DETAIL_ORDER &&
            r.name !== NAVIGATION_ACCOUNT_ORDER_HISTORY,
        );
        return CommonActions.reset({
          ...state,
          routes,
          index: routes.length - 1,
        });
      });
      //Reset error, status action RevertOrder
      dispatch(revertOrderReset());
    }
    if (errorRevertOrder && statusRevertOrder === Status.ERROR) {
      setOpenModalReorder(true);
    }
  }, [statusRevertOrder, errorRevertOrder]);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };
  useEffect(() => {
    console.log('detail order:::: ', detailOrder);
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch(resetRefund());
      navigation.dispatch(StackActions.replace(NAVIGATION_ACCOUNT));
    });
    return unsubscribe;
  }, [navigation]);
  const handleConfirmCancel = () => {
    if (detailOrder.is_cancel === 0) {
      const refund = {
        app_id: 1,
        branch_id: parseFloat(currentShop?.restid),
        amount: detailOrder?.paid_price,
        merchant_id: currentShop.shopownerid,
        order_id: detailOrder?.id,
        customer: currentUser.current?.custid,
        sesskey: currentUser.current?.session_key,
        trans_id: detailOrder?.txn_id,
        lang: 'vi',
        description: '',
        pos_trans_type: detailOrder?.pos_trans_type,
      };
      console.log('refund payload:::', refund);
      dispatch(refundPaymentOnline(refund));
    }
  };
  const handleExtraProduct = () => {
    // const mapConvert = new Map();
    const currentProductOrder = JSON.parse(
      JSON.stringify(detailOrder?.products),
    );
    const mainProduct = currentProductOrder.filter(
      prod => prod.parent_prod_id === null,
    );

    const extraList = currentProductOrder.filter(
      prod => prod.parent_prod_id !== null,
    );
    mainProduct.map((proConvert, index) => {
      proConvert.extra_items = [];
      const checkExtraSelected = extraList.findIndex(
        item => item.parent_prod_id === proConvert.id,
      );
      if (checkExtraSelected !== -1) {
        proConvert.extra_items = Array.from(extraList, item => {
          if (item?.parent_prod_id === proConvert?.id) {
            return {
              id: item?.prod_id,
              name: item?.prodname,
              price: item?.oldprice,
            };
          }
        }).filter(item => item);
      }
    });
    setProducts([...mainProduct]);
  };
  useEffect(() => {
    handleExtraProduct();
    handleStatusOrder();
  }, [detailOrder]);

  const handleStatusOrder = () => {
    if (detailOrder.is_complete === 1) {
      setStatusOfOrder(strings.common.completed);
    } else if (detailOrder.is_cancel === 1) {
      setStatusOfOrder(strings.common.canceled);
    } else if (detailOrder.is_served === 1) {
      setStatusOfOrder(strings.common.serving);
    } else if (detailOrder.is_check === 1) {
      setStatusOfOrder(strings.common.confirmed);
    } else if (detailOrder.is_paid === 0) {
      setStatusOfOrder(strings.common.notPaid);
    } else if (detailOrder.is_paid === 2) {
      setStatusOfOrder(strings.common.paid_failed);
    } else {
      setStatusOfOrder(strings.common.pending);
    }
  };
  // useEffect(() => {
  //   if (statusCancel === Status.SUCCESS && detailOrder?.pos_trans_type !== 45) {
  //     onUnmount();
  //   }
  // }, [statusCancel]);
  // const onPressPayment = async () => {
  //   const momo = await asyncStorage.getMomoPayment();
  //   if (momo && momo.order_id === detailOrder?.id) {
  //     navigation.navigate(NAVIGATION_ORDER_RESULT, {
  //       online: true,
  //       deep_link: momo.link,
  //       order_id: detailOrder.id,
  //     });
  //   }
  // };

  useEffect(() => {
    if (statusRefund === Status.SUCCESS) {
      setStatusOfOrder(strings.common.canceled);
    }
  }, [statusRefund]);
  return (
    <SafeAreaView style={styles.container}>
      <Titles
        iconBack={true}
        title={strings.detailOrderScreen.orderDetails}
        onPressBack={() => {
          dispatch(resetRefund());
          navigation.navigate(NAVIGATION_ACCOUNT_ORDER_HISTORY);
        }}
      />
      <InforSection detailOrder={detailOrder} statusOfOrder={statusOfOrder} />
      <ListItem detailOrder={detailOrder} products={products} />
      <OrderAction
        detailOrder={detailOrder}
        navigation={navigation}
        statusRefund={statusRefund}
        onPressCancel={onPressCancel}
        // onPressPayment={onPressPayment}
        onPressOpenReorder={onPressOpenReorder}
      />
      <MyModal visible={openModalReorder} onPressOutSide={() => {}}>
        <TouchableOpacity style={styles.containerModalReorder}>
          <View>
            <TextSemiBold style={styles.textRevertErrorTittle}>
              {strings.getLanguage() === 'vi'
                ? errorRevertOrder
                : 'Product: ' + errorRevertOrder}
            </TextSemiBold>
            <TextNormal style={styles.contentPopup}>
              {strings.detailOrderScreen.reorderFailed + ' '}
              {currentOrder?.products.length > 0 ? (
                <TextNormal>
                  {strings.detailOrderScreen.questionReorder}
                </TextNormal>
              ) : null}
            </TextNormal>
            {currentOrder?.products.length > 0 ? (
              <View style={styles.wrapperButtonSectionConfirm}>
                <TouchableOpacity
                  style={styles.buttonConfirmBack}
                  onPress={onPressAgree}>
                  <TextNormalSemiBold style={{color: Colors.buttonTextColor}}>
                    {strings.common.yes}
                  </TextNormalSemiBold>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonConfirm}
                  onPress={onPressDisagree}>
                  <TextNormalSemiBold style={{color: Colors.whiteColor}}>
                    {strings.common.no}
                  </TextNormalSemiBold>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  style={styles.buttonConfirmBack}
                  onPress={onPressDisagree}>
                  <TextNormalSemiBold style={{color: Colors.buttonTextColor}}>
                    {strings.common.back}
                  </TextNormalSemiBold>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </MyModal>
      {/* // ------------ MODAL CANCEL ORDER --------------- */}
      <MyModal
        visible={modalCancel}
        onPressOutSide={() => setModalCancel(false)}>
        <CancelOrder
          detailOrder={detailOrder}
          statusCancel={statusRefund}
          setModalCancel={val => setModalCancel(val)}
          handleConfirmCancel={handleConfirmCancel}
        />
      </MyModal>
      <Loading isHidden={statusCancel === Status.LOADING} />
    </SafeAreaView>
  );
};

export default DetailOrder;
