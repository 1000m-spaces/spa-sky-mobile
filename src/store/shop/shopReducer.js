import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';
const initializeState = {
  // List Shop
  listShop: [],
  statusGetListShop: Status.DEFAULT,
  //List Shop Show Money
  listShopShowMoney: [],
  statusGetListShopShowMoney: Status.DEFAULT,
  // LIST SHOP CHECK CHANGE LOCATION
  listShopCheck: [],
  statusCheckShop: {
    changedLocation: false,
    newShop: {restid: -1},
    status: Status.DEFAULT,
  },
  isCheckPopupShopLocation: false,
  // Current Shop
  currentShop: {},
  statusSetCurrentShop: Status.DEFAULT,

  // Voucher
  statusAddVoucher: Status.DEFAULT,
  messageAddingVoucher: '',
  listVoucher: {valid: [], invalid: [], total: 0, gift_baskets: []},
  statusGetVouchers: Status.DEFAULT,
  appliedVoucher: {},
  statusApplyVoucher: Status.DEFAULT,
  appliedError: '',

  // Affiliate
  statusApplyingAffiliate: Status.DEFAULT,
  messageApplyingAffiliate: '',
  errorApplyingAffiliate: '',
  clickLinkAffi: false,

  //Check Affiliate
  statusCheckAffiliate: Status.DEFAULT,
  messageCheckAffiliate: '',
  errorCheckAffiliate: '',

  // Message
  listMessage: [],
  stateGetMessage: Status.DEFAULT,
  statusUpdateMessage: Status.DEFAULT,
  clickNotification: false,
  idMessageNoti: '',

  // History cash-in
  historyCashIn: [],
  statusGetHistoryCashIn: Status.DEFAULT,

  // REVIEW--COMMENT
  statusCreateReview: Status.DEFAULT,
  messageCreateReview: '',

  //Campaign
  campaignReferrer: [],
  statusGetCampaignReferrer: Status.DEFAULT,
  campaignPresentee: [],
  statusGetCampaignPresentee: Status.DEFAULT,
};
export default (state = initializeState, {type, payload}) => {
  switch (type) {
    case NEOCAFE.CHECK_SHOP_LOCATION_REQUEST:
      return {
        ...state,
        statusCheckShop: {
          ...state.statusCheckShop,
          status: Status.LOADING,
        },
      };
    case NEOCAFE.CHECK_SHOP_LOCATION_SUCCESS:
      let result = JSON.parse(JSON.stringify(state.statusCheckShop));
      if (payload && payload.length > 0) {
        const tempShop = payload[0];
        if (tempShop?.restid !== state.currentShop.restid) {
          result = {
            status: Status.SUCCESS,
            newShop: tempShop,
            changedLocation: true,
          };
        }
      }
      return {
        ...state,
        statusCheckShop: result,
        listShopCheck: [],
      };
    case NEOCAFE.CHECK_SHOP_LOCATION_ERROR:
      return {
        ...state,
        listShopCheck: [],
        statusCheckShop: {
          ...state.statusCheckShop,
          status: Status.ERROR,
        },
      };
    case NEOCAFE.CHECK_SHOP_LOCATION_RESET:
      return {
        ...state,
        listShopCheck: [],
        statusCheckShop: {
          changedLocation: false,
          newShop: {restid: -1},
          status: Status.DEFAULT,
        },
      };
    case 'CHECK_POPUP_SHOP_LOCATION':
      return {
        ...state,
        isCheckPopupShopLocation: payload,
      };
    case NEOCAFE.GET_LIST_SHOP_REQUEST:
      return {
        ...state,
        statusGetListShop: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_SHOP_SUCCESS:
      return {
        ...state,
        listShop: payload,
        currentShop: payload[0],
        statusGetListShop: Status.SUCCESS,
      };
    case NEOCAFE.GET_LIST_SHOP_ERROR:
      return {
        ...state,
        statusGetListShop: Status.ERROR,
      };
    case NEOCAFE.GET_LIST_SHOP_RESET:
      let logout = false;
      if (payload) {
        logout = payload.isLogout;
      }
      if (logout === true) {
        return {
          ...initializeState,
        };
      } else {
        return {
          ...state,
          statusGetListShop: Status.DEFAULT,
        };
      }
    //LIST SHOP SHOW MONEY
    case NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_REQUEST:
      return {
        ...state,
        statusGetListShopShowMoney: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_SUCCESS:
      return {
        ...state,
        listShopShowMoney: payload,
        statusGetListShopShowMoney: Status.SUCCESS,
      };
    case NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_ERROR:
      return {
        ...state,
        statusGetListShopShowMoney: Status.ERROR,
      };
    case NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_RESET:
      return {
        ...state,
        statusGetListShopShowMoney: Status.DEFAULT,
      };
    // SET CURRENT SHOP
    case NEOCAFE.SET_CURRENT_SHOP_REQUEST:
      return {
        ...state,
        statusSetCurrentShop: Status.LOADING,
      };
    case NEOCAFE.SET_CURRENT_SHOP_SUCCESS:
      return {
        ...state,
        currentShop: payload,
        statusSetCurrentShop: Status.SUCCESS,
      };
    case NEOCAFE.SET_CURRENT_SHOP_ERROR:
      return {
        ...state,
        statusSetCurrentShop: Status.ERROR,
      };
    case NEOCAFE.SET_CURRENT_SHOP_RESET:
      return {
        ...state,
        statusSetCurrentShop: Status.DEFAULT,
      };
    // GET LIST VOUCHER
    case NEOCAFE.GET_LIST_VOUCHER_REQUEST:
      return {
        ...state,
        statusGetVouchers: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_VOUCHER_SUCCESS:
      const r = {
        invalid: payload.invalid ? payload.invalid : [],
        valid: payload.valid ? payload.valid : [],
        total: payload.total ? payload.total : 0,
        gift_baskets:
          payload.gift_baskets.length > 0
            ? payload.gift_baskets
            : state.listVoucher.gift_baskets,
      };
      return {
        ...state,
        statusGetVouchers: Status.SUCCESS,
        listVoucher: r,
      };
    case NEOCAFE.GET_LIST_VOUCHER_ERROR:
      return {
        ...state,
        statusGetVouchers: Status.ERROR,
        // listVoucher: {invalid: [], valid: [], total: 0},
      };
    case NEOCAFE.GET_LIST_VOUCHER_RESET:
      return {
        ...state,
        statusGetVouchers: Status.DEFAULT,
        // listVoucher: {invalid: [], valid: [], total: 0},
      };
    // ADD VOUCHER
    case NEOCAFE.ADD_VOUCHER_REQUEST:
      return {
        ...state,
        statusAddVoucher: Status.LOADING,
      };
    case NEOCAFE.ADD_VOUCHER_SUCCESS:
      // console.log('REDUCER SUCCESS VOUCHER PAYLOAD:::', payload);
      return {
        ...state,
        statusAddVoucher: Status.SUCCESS,
        messageAddingVoucher: payload,
      };
    case NEOCAFE.ADD_VOUCHER_ERROR:
      // console.log('REDUCER ERRROR VOUCHER PAYLOAD:::', payload);
      return {
        ...state,
        statusAddVoucher: Status.ERROR,
        messageAddingVoucher: payload,
      };
    case NEOCAFE.ADD_VOUCHER_RESET:
      return {
        ...state,
        messageAddingVoucher: '',
        statusAddVoucher: Status.DEFAULT,
      };
    // MESSAGE
    case NEOCAFE.GET_MESSAGE_REQUEST:
      return {
        ...state,
        stateGetMessage: Status.LOADING,
      };
    case NEOCAFE.GET_MESSAGE_SUCCESS:
      return {
        ...state,
        listMessage: payload,
        stateGetMessage: Status.SUCCESS,
      };
    case NEOCAFE.GET_MESSAGE_ERROR:
      return {
        ...state,
        stateGetMessage: Status.ERROR,
      };
    case NEOCAFE.UPDATE_MESSAGE_REQUEST:
      return {
        ...state,
        statusUpdateMessage: Status.LOADING,
      };
    case NEOCAFE.UPDATE_MESSAGE_SUCCESS:
      return {
        ...state,
        statusUpdateMessage: Status.SUCCESS,
      };
    case NEOCAFE.UPDATE_MESSAGE_ERROR:
      return {
        ...state,
        statusUpdateMessage: Status.ERROR,
      };
    case 'CLICK_NOTIFICATION':
      return {
        ...state,
        clickNotification: payload.click,
        idMessageNoti: payload.idMessageNoti,
      };
    // HISTORY CASHIN
    case NEOCAFE.GET_HISTORY_CASHIN_REQUEST:
      return {
        ...state,
        statusGetHistoryCashIn: Status.LOADING,
      };
    case NEOCAFE.GET_HISTORY_CASHIN_SUCCESS:
      return {
        ...state,
        historyCashIn: payload,
        statusGetHistoryCashIn: Status.SUCCESS,
      };
    case NEOCAFE.GET_HISTORY_CASHIN_ERROR:
      return {
        ...state,
        statusGetHistoryCashIn: Status.ERROR,
      };
    case NEOCAFE.GET_HISTORY_CASHIN_RESET:
      return {
        ...state,
        statusGetHistoryCashIn: Status.DEFAULT,
        historyCashIn: [],
      };
    // APPLY_AFFILIATE
    case NEOCAFE.APPLY_AFFILIATEV2_REQUEST:
      return {
        ...state,
        statusApplyingAffiliate: Status.LOADING,
      };
    case NEOCAFE.APPLY_AFFILIATEV2_SUCCESS:
      return {
        ...state,
        statusApplyingAffiliate: Status.SUCCESS,
        messageApplyingAffiliate: payload,
        errorApplyingAffiliate: '',
      };
    case NEOCAFE.APPLY_AFFILIATEV2_ERROR:
      return {
        ...state,
        statusApplyingAffiliate: Status.ERROR,
        errorApplyingAffiliate: payload,
      };
    case NEOCAFE.APPLY_AFFILIATEV2_RESET:
      return {
        ...state,
        statusApplyingAffiliate: Status.DEFAULT,
        messageApplyingAffiliate: '',
        errorApplyingAffiliate: '',
        clickLinkAffi: false,
      };
    case 'CLINK_LINK_AFFILIATE':
      return {
        ...state,
        clickLinkAffi: payload,
      };
    //CHECK AFFILIATE
    case NEOCAFE.CHECK_AFFILIATE_SUCCESS:
      return {
        ...state,
        messageCheckAffiliate: payload,
        errorCheckAffiliate: '',
      };
    case NEOCAFE.CHECK_AFFILIATE_ERROR:
      return {
        ...state,
        errorCheckAffiliate: payload,
      };
    // CREATE A REVIEW-COMMENT
    case NEOCAFE.CREATE_REVIEW_REQUEST:
      return {
        ...state,
        statusCreateReview: Status.LOADING,
      };
    case NEOCAFE.CREATE_REVIEW_SUCCESS:
      return {
        ...state,
        messageCreateReview: payload,
        statusCreateReview: Status.SUCCESS,
      };
    case NEOCAFE.CREATE_REVIEW_ERROR:
      return {
        ...state,
        statusCreateReview: Status.ERROR,
        messageCreateReview: payload,
      };
    case NEOCAFE.CREATE_REVIEW_RESET:
      return {
        ...state,
        statusCreateReview: Status.DEFAULT,
        messageCreateReview: '',
      };
    case NEOCAFE.GET_CAMPAIGNS_REFERRER_SUCCESS:
      return {
        ...state,
        campaignReferrer: payload,
        statusGetCampaignReferrer: Status.SUCCESS,
      };
    case NEOCAFE.GET_CAMPAIGNS_REFERRER_ERROR:
      return {
        ...state,
        campaignReferrer: [],
        statusGetCampaignReferrer: Status.ERROR,
      };
    case NEOCAFE.GET_CAMPAIGNS_PRESENTEE_SUCCESS:
      return {
        ...state,
        campaignPresentee: payload,
        statusGetCampaignPresentee: Status.SUCCESS,
      };
    case NEOCAFE.GET_CAMPAIGNS_PRESENTEE_ERROR:
      return {
        ...state,
        campaignPresentee: [],
        statusGetCampaignPresentee: Status.ERROR,
      };
    // APPLY VOUCHER
    case NEOCAFE.APPLY_VOUCHER_REQUEST:
      return {
        ...state,
        statusApplyVoucher: Status.LOADING,
      };
    case NEOCAFE.APPLY_VOUCHER_SUCCESS:
      return {
        ...state,
        appliedVoucher: payload,
        statusApplyVoucher: Status.SUCCESS,
      };
    case NEOCAFE.APPLY_VOUCHER_ERROR:
      return {
        ...state,
        statusApplyVoucher: Status.ERROR,
        appliedVoucher: null,
        appliedError: payload,
      };
    case NEOCAFE.APPLY_VOUCHER_RESET:
      return {
        ...state,
        statusApplyVoucher: Status.DEFAULT,
        appliedVoucher: null,
        appliedError: '',
      };
    default:
      return state;
  }
};
