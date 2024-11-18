import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put, select} from 'redux-saga/effects';
import OrderController from './orderController';
import {getListShopShowMoney, resetOrder} from 'store/actions';
import {getCurrentLocation, isListProductExpired} from 'store/selectors';
import {asyncStorage} from 'store/index';

function* getListHistoryOrder({payload}) {
  if (!payload) {
    return;
  }
  try {
    const result = yield call(OrderController.getListHistoryOrder, payload);
    if (result.status === 200 && !result?.data?.error) {
      yield put({
        type: NEOCAFE.GET_LIST_HISTORY_ORDER_SUCCESS,
        payload: {
          listHistoryOrder: result.data || [],
        },
      });
    } else {
      yield put({
        type: NEOCAFE.GET_LIST_HISTORY_ORDER_ERROR,
        payload: {
          errorMsg: result?.data?.error,
        },
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_LIST_HISTORY_ORDER_ERROR,
      payload: {
        errorMsg: 'Xảy ra lỗi trong quá trình lấy lịch sử đơn hàng',
      },
    });
  }
}
function* setDetailOrder({payload}) {
  if (!payload) {
    return;
  }
  try {
    yield put({
      type: NEOCAFE.SET_DETAIL_ORDER_SUCCESS,
      payload: {
        detailHistoryOrder: payload,
      },
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_DETAIL_ORDER_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* setCurrentOrder({payload}) {
  if (!payload) {
    return;
  }
  try {
    yield put({
      type: NEOCAFE.SET_CURRENT_ORDER_SUCCESS,
      payload: {
        currentOrder: payload,
      },
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_CURRENT_ORDER_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}
export async function setExtraForProduct(orderProducts, storageProducts) {
  const mapStorageProducts =
    storageProducts && storageProducts.length > 0
      ? new Map(
          storageProducts.map(item => {
            return [item.product_id, item];
          }),
        )
      : new Map();
  if (orderProducts && orderProducts.length > 0) {
    orderProducts.map(product => {
      if (product && product?.extras && product.extras.length > 0) {
        const tempExtra = Array.from(product.extras, (item, i) => item.id);
        mapStorageProducts.set(product.pid, {
          product_id: product.pid,
          extra_ids: tempExtra,
        });
      }
    });
  }
  const tempResult = Array.from(mapStorageProducts.values());
  await asyncStorage.setExtraProducts(tempResult);
}

export function* createNewOrder({payload}) {
  if (!payload) {
    return;
  }
  try {
    const result = yield call(OrderController.createNewOrder, payload);
    console.log('result saga:::', result);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.CREATE_ORDER_SUCCESS,
        payload: result.data,
      });
      // SET RECOMMENDED EXTRA FOR PRODUCT
      const extraProducts = yield asyncStorage.getExtraProducts();
      const {products} = payload;
      setExtraForProduct(products, extraProducts);
      //Call list shop show money
      const currentLocation = yield select(state => getCurrentLocation(state));
      const currentUser = yield asyncStorage.getUser();
      const bodyListShop = {
        lat: currentLocation?.latitude,
        long: currentLocation?.longitude,
        custid: currentUser?.custid,
      };
      yield put(getListShopShowMoney(bodyListShop));
      //Reset order
      // yield put(resetOrder());
    } else if (result?.data?.error && result?.data?.error.includes('session')) {
      yield put({
        type: NEOCAFE.CREATE_ORDER_ERROR,
        payload: {
          errorMsg: result?.data?.error,
        },
      });
    } else {
      yield put({
        type: NEOCAFE.CREATE_ORDER_ERROR,
        payload: {
          errorMsg: result.message,
          listExpired:
            result.listExpired > 0
              ? result.listExpired
              : result.data.product_expired || [],
        },
      });
    }
  } catch (error) {
    console.log('error catch::', error);
    yield put({
      type: NEOCAFE.CREATE_ORDER_ERROR,
      payload: {
        errorMsg: 'Đặt hàng thất bại. Vui lòng thử lại !',
      },
    });
  }
}
function* addProduct({payload}) {
  if (!payload) {
    return;
  }
  try {
    yield put({
      type: NEOCAFE.ADD_PRODUCT_SUCCESS,
      payload,
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.ADD_PRODUCT_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* revertOrder({payload}) {
  const expiredProducts = yield select(state => isListProductExpired(state));
  try {
    yield put({
      type: NEOCAFE.REVERT_ORDER_SUCCESS,
      payload: {
        listProConvert: payload.listProConvert,
        listMapAllPro: payload.listMapAllPro,
        addCart: payload.addCart,
        expiredProducts,
      },
    });
  } catch (error) {}
}
function* cancelOrder({payload}) {
  try {
    const result = yield call(OrderController.cancelOrder, payload);
    console.log('RESULT CANCEL ORDER SAGA:::: ', result);
    yield put({
      type: NEOCAFE.CANCEL_ORDER_SUCCESS,
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.CANCEL_ORDER_ERROR,
    });
  }
}

function* getOrderInfoRequestt({idOrder}) {
  try {
    const result = yield call(OrderController.getOrderInfo, idOrder);
    if (result.success) {
      console.log('getOrderInfo success:', result);
      yield put({
        type: NEOCAFE.GET_ORDER_INFO_SUCCESS,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_ORDER_INFO_ERROR,
    });
  }
}

function* refundPaymentOnline({payload}) {
  try {
    const result = yield call(OrderController.refundPayment, payload);
    if (result?.success) {
      yield put({
        type: NEOCAFE.REFUND_PAYMENT_ONLINE_SUCCESS,
        payload: result?.data,
      });
    } else {
      yield put({
        type: NEOCAFE.REFUND_PAYMENT_ONLINE_ERROR,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.REFUND_PAYMENT_ONLINE_ERROR,
      payload: error.toString(),
    });
  }
}

function* zaloPaymentSaga({payload}) {
  try {
    const result = yield call(OrderController.zaloPayment, payload);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.ZALO_PAYMENT_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.ZALO_PAYMENT_ERROR,
        payload: result.error,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.ZALO_PAYMENT_ERROR,
      payload: error.toString(),
    });
  }
}
function* queryZalopaySaga({payload}) {
  console.log('query zalo payload::', payload);
  try {
    const result = yield call(OrderController.queryZalopay, payload);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.QUERY_ZALOPAY_SUCCESS,
        payload: result.data || {},
      });
    } else {
      yield put({
        type: NEOCAFE.QUERY_ZALOPAY_ERROR,
        payload: result.message || '',
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.QUERY_ZALOPAY_ERROR,
      payload: error.toString(),
    });
  }
}


export default function* orderSaga() {
  yield takeLatest(NEOCAFE.GET_LIST_HISTORY_ORDER_REQUEST, getListHistoryOrder);
  yield takeLatest(NEOCAFE.SET_DETAIL_ORDER_REQUEST, setDetailOrder);
  yield takeLatest(NEOCAFE.SET_CURRENT_ORDER_REQUEST, setCurrentOrder);
  yield takeLatest(NEOCAFE.CREATE_ORDER_REQUEST, createNewOrder);
  yield takeLatest(NEOCAFE.ADD_PRODUCT_REQUEST, addProduct);
  yield takeLatest(NEOCAFE.REVERT_ORDER_REQUEST, revertOrder);
  yield takeLatest(NEOCAFE.QUERY_ZALOPAY_REQUEST, queryZalopaySaga);
  yield takeLatest(NEOCAFE.ZALO_PAYMENT_REQUEST, zaloPaymentSaga);
  yield takeLatest(NEOCAFE.CANCEL_ORDER_REQUEST, cancelOrder);
  yield takeLatest(NEOCAFE.REFUND_PAYMENT_ONLINE_REQUEST, refundPaymentOnline);
  yield takeLatest(NEOCAFE.GET_ORDER_INFO_REQUEST, getOrderInfoRequestt);
}
