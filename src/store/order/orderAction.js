import {NEOCAFE} from 'store/actionsTypes';

export const getListHistoryOrder = data => ({
  type: NEOCAFE.GET_LIST_HISTORY_ORDER_REQUEST,
  payload: data,
});
export const getListHistoryOrderReset = () => ({
  type: NEOCAFE.GET_LIST_HISTORY_ORDER_RESET,
});

export const setDetailOrder = data => ({
  type: NEOCAFE.SET_DETAIL_ORDER_REQUEST,
  payload: data,
});
export const setCurrentOrder = data => ({
  type: NEOCAFE.SET_CURRENT_ORDER_REQUEST,
  payload: data,
});
export const createOrder = data => ({
  type: NEOCAFE.CREATE_ORDER_REQUEST,
  payload: data,
});
export const resetOrder = () => ({
  type: NEOCAFE.CREATE_ORDER_RESET,
  payload: {},
});
export const resetErrorOrder = () => ({
  type: 'RESET_ERROR_ORDER',
});

export const addProductToOrder = product => ({
  type: NEOCAFE.ADD_PRODUCT_REQUEST,
  payload: product,
});

export const revertOrder = (listProConvert, listMapAllPro, addCart) => ({
  type: NEOCAFE.REVERT_ORDER_REQUEST,
  payload: {
    listProConvert,
    listMapAllPro,
    addCart,
  },
});
export const revertOrderReset = () => ({
  type: NEOCAFE.REVERT_ORDER_RESET,
});

export const resetStatusAddingProduct = () => ({
  type: NEOCAFE.ADD_PRODUCT_RESET,
});
export const cancelOrderRequest = payload => ({
  type: NEOCAFE.CANCEL_ORDER_REQUEST,
  payload,
});
export const resetCancalOrderStatus = () => ({
  type: NEOCAFE.CANCEL_ORDER_RESET,
});

export const getOrderInfoRequest = idOrder => ({
  type: NEOCAFE.GET_ORDER_INFO_REQUEST,
  idOrder,
});
export const getOrderInfoReset = () => ({
  type: NEOCAFE.GET_ORDER_INFO_RESET,
});

export const refundPaymentOnline = payload => ({
  type: NEOCAFE.REFUND_PAYMENT_ONLINE_REQUEST,
  payload,
});
export const resetRefund = () => ({
  type: NEOCAFE.REFUND_PAYMENT_ONLINE_RESET,
});
export const zaloPaymentAction = payload => ({
  type: NEOCAFE.ZALO_PAYMENT_REQUEST,
  payload,
});
export const resetZaloPayment = () => ({
  type: NEOCAFE.ZALO_PAYMENT_RESET,
});
export const queryZalopayAction = payload => ({
  type: NEOCAFE.QUERY_ZALOPAY_REQUEST,
  payload,
});
export const resetQueryZalo = () => ({
  type: NEOCAFE.QUERY_ZALOPAY_RESET,
});
