export const listShop = state => state.shop.listShop;
export const statusGetShops = state => state.shop.statusGetListShop;
export const getCurrentShop = state => state.shop.currentShop;
export const statusSetCurrentShop = state => state.shop.statusSetCurrentShop;
export const getStatusAddVoucher = state => state.shop.statusAddVoucher;
export const getMessageList = state => state.shop.listMessage;
export const statusUpdatingMessage = state => state.shop.statusUpdateMessage;
export const getClickNotification = state => state.shop.clickNotification;
export const getIdMessageNoti = state => state.shop.idMessageNoti;
export const isListShopShowMoney = state => state.shop.listShopShowMoney;
export const isStatusGetListShopShowMoney = state =>
  state.shop.statusGetListShopShowMoney;
export const getHistoryCashins = state => state.shop.historyCashIn;
export const getStatusCashin = state => state.shop.statusGetHistoryCashIn;
export const getMessageAddingVoucher = state => state.shop.messageAddingVoucher;
export const getStatusAffiliate = state => state.shop.statusApplyingAffiliate;
export const getMessageAffiliate = state => state.shop.messageApplyingAffiliate;
export const getErrorApplyingAffiliate = state =>
  state.shop.errorApplyingAffiliate;
export const getClickLinkAffi = state => state.shop.clickLinkAffi;
export const getMessageCheckAffiliate = state =>
  state.shop.messageCheckAffiliate;
export const getErrorCheckAffiliate = state => state.shop.errorCheckAffiliate;
export const getListVoucher = state => state.shop.listVoucher;
export const getStatusListVoucher = state => state.shop.statusGetVouchers;
export const getStatusCreateReview = state => state.shop.statusCreateReview;
export const getMessageCreateReview = state => state.shop.messageCreateReview;
export const getStatusCheckShop = state => state.shop.statusCheckShop;
export const getCheckPopupShopLocation = state =>
  state.shop.isCheckPopupShopLocation;
export const isCampaignReferrer = state => state.shop.campaignReferrer;
export const isStatusGetCampaignReferrer = state =>
  state.shop.statusGetCampaignReferrer;
export const isCampaignPresentee = state => state.shop.campaignPresentee;
export const isStatusGetCampaignPresentee = state =>
  state.shop.statusGetCampaignPresentee;
export const getAppliedItem = state => state.shop.appliedVoucher;
export const statusApplyVoucher = state => state.shop.statusApplyVoucher;
export const getAppliedVoucherError = state => state.shop.appliedError;
