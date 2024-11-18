export const getStatusCreateCashinOrder = state =>
  state.cashin.statusCreateMomo;
export const getOrderCashin = state => state.cashin.cashinOrder;
export const getErrorCreateMomo = state => state.cashin.errorCreateMomo;
export const momoPaymentSelector = state => state.cashin.momoPayment;
export const statusMomoSelector = state => state.cashin.statusMomoPayment;
export const getErrorGetUrlPayment = state => state.cashin.errorGetUrlPayment;
export const qrcodePaymentSelector = state => state.cashin.qrcodePayment;
export const statusQrcodeSelector = state => state.cashin.statusQrcodePayment;
