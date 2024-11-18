import {BASE_PATH_CAFE, BASE_PATH_MENU, PAYMENT_PATH} from 'assets/config';

export const UrlApi = {
  // -------------------PAY MOMO -----------------------
  getUrlPaymentMomo: PAYMENT_PATH + 'momo',
  getQrCode: PAYMENT_PATH + 'vnpay/qrcode',
  getOrderInfo: BASE_PATH_MENU + '/getOrderInfo',
  // ------------------ ZALO -------------------------
  zaloPayment: PAYMENT_PATH + 'zlp',
  queryZalopay: PAYMENT_PATH + 'zlp/query',

  // ------------------ PRODUCT ------------------------
  getFavoriteProducts: BASE_PATH_MENU + 'getMyMenuCustomer',
  // addFavoriteProduct: BASE_PATH_MENU + 'createMyMenuCustomer',
  reomveFavoriteProduct: BASE_PATH_MENU + 'cancelMyMenuCustomer',
  getProductMenu: BASE_PATH_MENU + 'getMenuShop',
  getProductExpired: BASE_PATH_MENU + 'getProductExpired',
  getTopPurchasedApi: BASE_PATH_CAFE + 'reports/top-purchased-products',
  getRecommendedProductsUrl:
    BASE_PATH_CAFE + 'recommendations/products/sorting',
  // ------------------ VOUCHER --------------------------
  addVoucher: BASE_PATH_MENU + 'addvoucher',
  getVoucherAPI: BASE_PATH_CAFE + 'marketings-v2/voucher/user',
  applyVoucherApi: BASE_PATH_CAFE + 'marketings-v2/voucher/code',

  // ------------------- REVIEW-COMMENT------------------
  createReviewApi: BASE_PATH_CAFE + 'comments',
  // ------------------- AFFILIATE ------------------
  applyAffiliate: BASE_PATH_CAFE + 'affiliates/referrals/apply',
  applyAffiliateV2: BASE_PATH_CAFE + 'affiliates-v2/referrals/apply',
  checkAffiliate: BASE_PATH_CAFE + 'affiliates-v2/referrals/check',
  //--------------------CAMPAIGN------------------------
  getCampaigns: BASE_PATH_CAFE + '/marketings-v2/campaigns',

  // ------------------ MESSAGE -----------------------
  getMessage: BASE_PATH_MENU + 'get_all_message',
  updateMessage: BASE_PATH_MENU + 'updateMessage',

  // ---------------------- ORDER ------------------------------
  createOrder: BASE_PATH_MENU + 'order',
  createOrderPos: BASE_PATH_MENU + 'orderInternal',
  cancelOrder: BASE_PATH_MENU + 'cancelOrderOnline',
  getListHistoryOrder: BASE_PATH_MENU + 'getOrderDetail',
  refundPaymentApi: BASE_PATH_MENU + 'RefundTransMomo',
  refundZaloPayment: BASE_PATH_MENU + 'RefundTransZlp',

  // --------------------- SHOP --------------------------------
  getListShop: BASE_PATH_MENU + 'getListShopByLocation1',
  getHistoryCashin: BASE_PATH_MENU + 'getTransactionsAddPoint',
  // ----------------------- DELIVERY ADDRESS -----------------------
  deliveryAddress: BASE_PATH_CAFE + 'addresses/delivery',
  setDefaultAddress: BASE_PATH_CAFE + 'addresses/delivery/switch',

  // ---------------------- USER -AUTH  ---------------------------
  getUserInfo: BASE_PATH_MENU + 'userinfo',
  getVersion: BASE_PATH_CAFE + 'version',
  sendPhone: BASE_PATH_MENU + 'phone',
  confirmPhone: BASE_PATH_MENU + 'phone',
  loginPhone: BASE_PATH_MENU + 'customerloginphone',
  deleteAccount: BASE_PATH_MENU + 'deleteAccount',
  confirmOtpDelete: BASE_PATH_MENU + 'confirmPhone',
  updateUserInfo: BASE_PATH_MENU + 'updateCustomerInfo',
  listUserAffiliates: BASE_PATH_CAFE + 'affiliates-v2/referred/referrer',
  updateLanguageUrl: BASE_PATH_MENU + 'updatelanguages',

  // ----------------------- CATEGORY ------------------------------
  getListCategory: BASE_PATH_MENU + 'getListCategoryShop',

  // ------------------------ BANNER -------------------------------
  getListBanner: BASE_PATH_CAFE + 'ads-banners/query-v2',

  // ----------------------- SHIPMENT -----------------------------
  getPackagesByShop: BASE_PATH_MENU + 'subscriptions/packages',
  subcribePackage: BASE_PATH_MENU + 'subscriptions/users/register',
  getMyPackage: BASE_PATH_CAFE + 'subscriptions/users/shipping-packages',
  paymentPackage: BASE_PATH_MENU + 'orderSubscription',
  showingPackage: BASE_PATH_CAFE + 'subscriptions/packages/all',
  unrenewPackage: BASE_PATH_CAFE + 'subscriptions/users/unrenew',
  storeShipmentAddress: BASE_PATH_MENU + 'addAddressWhenSubscriptionFalse',
};
