const REQUEST = 'REQUEST';
const RESET = 'RESET';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const suffixTypes = [REQUEST, RESET, SUCCESS, ERROR];

function createRequestTypes(prefix = '', bases, suffixes = suffixTypes) {
  const req = {};
  bases.forEach(base => {
    suffixes.forEach(suffix => {
      req[`${base}_${suffix}`] = `${prefix}_${base}_${suffix}`;
    });
  });
  return req;
}

// Events related to Neocafe REST API
export const NEOCAFE = createRequestTypes(
  'NEOCAFE',
  [
    //auth
    'CHECK_AUTHENTICATION',
    'SEND_PHONE',
    'CONFIRM_OTP',
    'LOGIN_PHONE',
    'LOGOUT',
    'GET_VERSION',
    //product
    'GET_PRODUCT_EXPIRED',
    'GET_FAVORITE_PRODUCT',
    'ADD_FAVORITE',
    'REMOVE_FAVORITE',
    'GET_PRODUCT_MENU',
    'GET_PRODUCT_ALL_BY_SHOP',
    'SET_CURRENT_PRODUCT',
    'GET_TOP_PURCHASED_PRODUCT',
    'GET_RECOMMENDED_PRODUCT',
    //user
    'GET_DELETE_ACCOUNT',
    'CONFIRM_DELETE_OTP',
    'UPDATE_USER_INFO',
    'SET_LANGUAGE',
    'GET_LIST_USER_AFFILIATE',
    // shop
    'GET_LIST_SHOP',
    'GET_LIST_SHOP_SHOW_MONEY',
    'SET_CURRENT_SHOP',
    'CHECK_SHOP_LOCATION',
    // history cash-in
    'GET_HISTORY_CASHIN',
    // voucher
    'ADD_VOUCHER',
    'GET_LIST_VOUCHER',
    'APPLY_VOUCHER',
    // messsage
    'GET_MESSAGE',
    'UPDATE_MESSAGE',
    // REVIEW-COMMENT
    'CREATE_REVIEW',
    // affiliate
    'APPLY_AFFILIATE',
    'CHECK_AFFILIATE',
    'APPLY_AFFILIATEV2',
    'GET_CAMPAIGNS',
    'GET_CAMPAIGNS_REFERRER',
    'GET_CAMPAIGNS_PRESENTEE',
    // LOGIN-LOGOUT
    // CATEGORY
    'GET_LIST_CATEGORY',
    'SET_CURRENT_CATEGORY',
    'GET_LIST_BANNER',
    // LOCATION
    'SET_LOCATION',
    'GET_ADDRESS_AUTO_COMPLETE',
    'GET_DETAIL_PLACE_SELECT',
    'GET_DIRECTION_LOCATION',
    // ORDER
    'GET_LIST_HISTORY_ORDER',
    'SET_DETAIL_ORDER',
    'SET_CURRENT_ORDER',
    'CREATE_ORDER',
    'ADD_PRODUCT',
    'REMOVE_PRODUCT',
    'REVERT_ORDER',
    'CANCEL_ORDER',
    'GET_ORDER_INFO',
    'ZALO_PAYMENT',
    'REFUND_PAYMENT_ONLINE',
    'QUERY_ZALOPAY',
    // SHIPMENT
    'GET_SHIPMENT_PACKAGE',
    'CREATE_DELIVERY_ADDRESS',
    'LIST_DELIVERY_ADDRESS',
    'REMOVE_DELIVERY',
    'UPDATE_DELIVERY_ADDRESS',
    'SELECTED_DELIVERY',
    // 'GET_SHOWING_PACKAGE',
    'SUBCRIBE_SHIPMENT_PACKAGE',
    'GET_MY_SHIPMENT_PACKAGE',
    'PAYMENT_PACKAGE',
    'UNRENEW_PACKAGE',
    'STORE_SHIPMENT_ADDRESS',
    //PAY MOMO
    'CASH_IN_MOMO',
    'GET_URL_MOMOPAY_PAYMENT',
    'GET_QRCODE',
  ],
  suffixTypes,
);
