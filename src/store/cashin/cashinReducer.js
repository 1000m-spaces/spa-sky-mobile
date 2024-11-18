import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';

const initialState = {
  // CASH IN ORDER
  cashinOrder: {id: -1},
  statusCreateMomo: Status.DEFAULT,
  errorCreateMomo: '',

  // REDIRECT URL PAYMENT
  momoPayment: null,
  statusMomoPayment: Status.DEFAULT,
  errorGetUrlPayment: '',

  // VNPAY QR CODE
  qrcodePayment: {},
  statusQrcodePayment: Status.DEFAULT,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    // ------------  CASH IN MOMO -----------------------
    case NEOCAFE.CASH_IN_MOMO_REQUEST:
      return {
        ...state,
        statusCreateMomo: Status.LOADING,
      };
    case NEOCAFE.CASH_IN_MOMO_SUCCESS:
      return {
        ...state,
        cashinOrder: payload,
        statusCreateMomo: Status.SUCCESS,
      };
    case NEOCAFE.CASH_IN_MOMO_ERROR:
      return {
        ...state,
        cashinOrder: {id: -1},
        statusCreateMomo: Status.ERROR,
        errorCreateMomo: payload,
      };
    case NEOCAFE.CASH_IN_MOMO_RESET:
      return {
        ...state,
        cashinOrder: {id: -1},
        statusCreateMomo: Status.DEFAULT,
        errorCreateMomo: '',
      };
    // ---------------------- GET MOMO URL -------------------------
    case NEOCAFE.GET_URL_MOMOPAY_PAYMENT_REQUEST:
      return {
        ...state,
        statusMomoPayment: Status.LOADING,
      };
    case NEOCAFE.GET_URL_MOMOPAY_PAYMENT_SUCCESS:
      return {
        ...state,
        momoPayment: payload,
        statusMomoPayment: Status.SUCCESS,
      };
    case NEOCAFE.GET_URL_MOMOPAY_PAYMENT_ERROR:
      return {
        ...state,
        momoPayment: null,
        statusMomoPayment: Status.ERROR,
        errorGetUrlPayment: payload,
      };
    case NEOCAFE.GET_URL_MOMOPAY_PAYMENT_RESET:
      return {
        ...state,
        momoPayment: null,
        statusMomoPayment: Status.DEFAULT,
        errorGetUrlPayment: '',
      };
    // -------------------------- GET VNPAY CODE ------------------------
    case NEOCAFE.GET_QRCODE_REQUEST:
      return {
        ...state,
        statusQrcodePayment: Status.LOADING,
      };
    case NEOCAFE.GET_QRCODE_SUCCESS:
      return {
        ...state,
        qrcodePayment: payload,
        statusQrcodePayment: Status.SUCCESS,
      };
    case NEOCAFE.GET_QRCODE_ERROR:
      return {
        ...state,
        qrcodePayment: null,
        statusQrcodePayment: Status.ERROR,
      };
    case NEOCAFE.GET_QRCODE_RESET:
      return {
        ...state,
        qrcodePayment: null,
        statusQrcodePayment: Status.DEFAULT,
      };
    default:
      return state;
  }
};
