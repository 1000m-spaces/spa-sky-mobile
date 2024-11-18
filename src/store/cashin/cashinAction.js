import {NEOCAFE} from 'store/actionsTypes';

export const createCashInMomo = payload => ({
  type: NEOCAFE.CASH_IN_MOMO_REQUEST,
  payload,
});
export const resetCreateCashinMomo = () => ({
  type: NEOCAFE.CASH_IN_MOMO_RESET,
});
export const getUrlPayment = payload => ({
  type: NEOCAFE.GET_URL_MOMOPAY_PAYMENT_REQUEST,
  payload,
});
export const resetMomoPayment = () => ({
  type: NEOCAFE.GET_URL_MOMOPAY_PAYMENT_RESET,
});
export const getQrCodeAction = payload => ({
  type: NEOCAFE.GET_QRCODE_REQUEST,
  payload,
});
export const resetQrCode = () => ({
  type: NEOCAFE.GET_QRCODE_RESET,
});
