import {NEOCAFE} from 'store/actionsTypes';

export const getListShop = data => ({
  type: NEOCAFE.GET_LIST_SHOP_REQUEST,
  payload: {
    custid: data.custid,
    lat: data.lat,
    long: data.long,
  },
});
export const resetGetListShop = payload => ({
  type: NEOCAFE.GET_LIST_SHOP_RESET,
  payload,
});

export const getListShopShowMoney = data => ({
  type: NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_REQUEST,
  payload: {
    custid: data.custid,
    lat: data.lat,
    long: data.long,
  },
});
export const resetListShopMoney = () => ({
  type: NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_RESET,
});

export const setCurrentShop = store => ({
  type: NEOCAFE.SET_CURRENT_SHOP_REQUEST,
  payload: store,
});
export const addVoucher = payload => ({
  type: NEOCAFE.ADD_VOUCHER_REQUEST,
  payload,
});
export const resetVoucher = () => ({
  type: NEOCAFE.ADD_VOUCHER_RESET,
});

export const updateMessage = payload => ({
  type: NEOCAFE.UPDATE_MESSAGE_REQUEST,
  payload,
});
export const getMessage = payload => ({
  type: NEOCAFE.GET_MESSAGE_REQUEST,
  payload,
});
export const clickNotification = (click, idMessageNoti) => ({
  type: 'CLICK_NOTIFICATION',
  payload: {
    click,
    idMessageNoti,
  },
});
export const getHistoryCashin = payload => ({
  type: NEOCAFE.GET_HISTORY_CASHIN_REQUEST,
  payload,
});
export const resetHistoryCashin = () => ({
  type: NEOCAFE.GET_HISTORY_CASHIN_RESET,
});
export const applyAffiliate = payload => ({
  type: NEOCAFE.APPLY_AFFILIATE_REQUEST,
  payload,
});
export const resetAffiliate = () => ({
  type: NEOCAFE.APPLY_AFFILIATE_RESET,
});
export const applyAffiliateV2 = payload => ({
  type: NEOCAFE.APPLY_AFFILIATEV2_REQUEST,
  payload,
});
export const resetAffiliateV2 = () => ({
  type: NEOCAFE.APPLY_AFFILIATEV2_RESET,
});
export const clickLinkAffiliate = payload => ({
  type: 'CLINK_LINK_AFFILIATE',
  payload,
});

export const checkAffiliate = payload => ({
  type: NEOCAFE.CHECK_AFFILIATE_REQUEST,
  userId: payload,
});

export const getListVoucherAction = payload => ({
  type: NEOCAFE.GET_LIST_VOUCHER_REQUEST,
  payload,
});

export const resetGetVouchers = () => ({
  type: NEOCAFE.GET_LIST_VOUCHER_RESET,
});

export const createReviewAction = payload => ({
  type: NEOCAFE.CREATE_REVIEW_REQUEST,
  payload,
});
export const resetReviewAction = () => ({
  type: NEOCAFE.CREATE_REVIEW_RESET,
});
export const checkShopLocation = payload => ({
  type: NEOCAFE.CHECK_SHOP_LOCATION_REQUEST,
  payload,
});
export const checkPopupShopLocation = payload => ({
  type: 'CHECK_POPUP_SHOP_LOCATION',
  payload,
});
export const resetCheckShopLocation = () => ({
  type: NEOCAFE.CHECK_SHOP_LOCATION_RESET,
});

export const getCampaignsReferrer = payload => ({
  type: NEOCAFE.GET_CAMPAIGNS_REFERRER_REQUEST,
  payload,
});

export const getCampaignsPresentee = payload => ({
  type: NEOCAFE.GET_CAMPAIGNS_PRESENTEE_REQUEST,
  payload,
});
export const applyVoucherAction = payload => ({
  type: NEOCAFE.APPLY_VOUCHER_REQUEST,
  payload,
});
export const resetAppliedVoucher = () => ({
  type: NEOCAFE.APPLY_VOUCHER_RESET,
});
