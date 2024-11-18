export const getListHistoryOrders = state => state.order.listHistoryOrder;
export const getStatusListHistoryOrder = state =>
  state.order.statusGetListHistoryOrder;
export const getInfoOrder = state => state.order.infoOrder;
export const getStatusInfoOrder = state => state.order.statusGetInfoOrder;
export const getDetailOrder = state => state.order.selectedHistoryOrder;
export const getCurrentOrder = state => state.order.currentOrder;
export const getStatusCreateOrder = state => state.order.statusCreateOrder;
export const getMessageCreateOrder = state => state.order.messageCreateOrder;
export const getStatusRevertOrder = state => state.order.statusRevertOrder;
export const getErrorRevertOrder = state => state.order.errorRevertOrder;
export const statusSetCurrentOrder = state => state.order.statusSetCurrentOrder;
export const statusAddingProduct = state => state.order.statusAddProductToOrder;
export const statusCancelOrder = state => state.order.statusCancelOrder;
export const isErrorGetListHistoryOrder = state =>
  state.order.errorGetListHistoryOrder;
export const statusRefundSelector = state => state.order.statusRefundPayment;
export const messageRefundSelector = state => state.order.messageRefundPayment;
export const zaloPaymentSelector = state => state.order.zaloPayment;
export const statusZaloSelector = state => state.order.statusZaloPayment;
export const statusQueryZaloSelector = state => state.order.statusQueryZalo;
export const queryZaloSelector = state => state.order.queryZalopay;
