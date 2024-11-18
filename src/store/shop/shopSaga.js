import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put, select} from 'redux-saga/effects';
import ShopController from './shopController';
import {asyncStorage} from 'store/index';
import {checkAffiliate} from './shopAction';
import {PARTNER_ID} from 'assets/config';

export function* getListShop({payload}) {
  try {
    const result = yield call(ShopController.getListShop, payload);
    // console.log('result list shop: ', result.data.data);
    if (result.status === 'SUCCESS' && result.success === true) {
      const listFilter = [];
      if (result.data && result.data.length > 0) {
        result?.data.map(a => {
          //Test xong phải trả lại như cũ
          // if (a.partnerid === '100' && a.restid !== '218') {
          if (a.partnerid == PARTNER_ID) {
            listFilter.push(a);
          }
        });
      }
      yield put({
        type: NEOCAFE.GET_LIST_SHOP_SUCCESS,
        payload: listFilter,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_LIST_SHOP_ERROR,
        payload: {
          errorMsg: 'Lỗi trong quá trình lấy thông tin cửa hàng',
        },
      });
    }
  } catch (e) {
    yield put({
      type: NEOCAFE.GET_LIST_SHOP_ERROR,
      payload: {
        errorMsg: e,
      },
    });
  }
}

function* getListShopShowMoney({payload}) {
  try {
    const result = yield call(ShopController.getListShop, payload);
    // console.log('result list shop: ', result.data.data);
    if (result.status === 'SUCCESS' && result.success === true) {
      const listFilter = [];
      if (result.data && result.data.length > 0) {
        result?.data.map(a => {
          if (a.partnerid == PARTNER_ID) {
            listFilter.push(a);
          }
        });
      }
      yield put({
        type: NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_SUCCESS,
        payload: listFilter,
      });
    }
    if (result.status === 'ERROR' && result.success === false) {
      yield put({
        type: NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_ERROR,
    });
  }
}

function* setCurrentShop({payload}) {
  try {
    if (payload) {
      yield put({
        type: NEOCAFE.SET_CURRENT_SHOP_SUCCESS,
        payload: payload,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_CURRENT_SHOP_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* addVoucher({payload}) {
  try {
    const result = yield call(ShopController.addVoucher, payload);
    console.log('result saga voucher:', result);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.ADD_VOUCHER_SUCCESS,
        payload: result.message,
      });
    } else {
      yield put({
        type: NEOCAFE.ADD_VOUCHER_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.ADD_VOUCHER_ERROR,
      payload: error,
    });
  }
}

function* getMessage({payload}) {
  try {
    const result = yield call(ShopController.getMessage, payload);
    // console.log('result get Message: ', result);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.GET_MESSAGE_SUCCESS,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_MESSAGE_ERROR,
      payload: error.message,
    });
  }
}

function* updateMessage({payload}) {
  try {
    const result = yield call(ShopController.readMessage, payload);
    if (result.success) {
      yield put({
        type: NEOCAFE.UPDATE_MESSAGE_SUCCESS,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.UPDATE_MESSAGE_ERROR,
    });
  }
}
function* getHistoryCashinSaga({payload}) {
  try {
    const result = yield call(ShopController.getHistoryCashin, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.GET_HISTORY_CASHIN_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_HISTORY_CASHIN_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_HISTORY_CASHIN_ERROR,
    });
  }
}
function* applyAffiliateSaga({payload}) {
  console.log('applyAffiliateSaga payload: ', payload);
  const currentUser = yield asyncStorage.getUser();
  try {
    const result = yield call(ShopController.applyAffiliate, payload);
    console.log('applyAffiliateSaga result: ', result, result.message);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.APPLY_AFFILIATE_SUCCESS,
        payload: result.message,
      });
      yield put(checkAffiliate(currentUser?.custid));
    } else {
      yield put({
        type: NEOCAFE.APPLY_AFFILIATE_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.APPLY_AFFILIATE_ERROR,
      payload: error.message,
    });
  }
}
function* applyAffiliateSagaV2({payload}) {
  console.log('applyAffiliateSaga payload: ', payload);
  const currentUser = yield asyncStorage.getUser();
  try {
    const result = yield call(ShopController.applyAffiliateV2, payload);
    console.log('applyAffiliateSaga result: ', result, result.message);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.APPLY_AFFILIATEV2_SUCCESS,
        payload: result.message,
      });
      yield put(checkAffiliate(currentUser?.custid));
    } else {
      yield put({
        type: NEOCAFE.APPLY_AFFILIATEV2_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.APPLY_AFFILIATEV2_ERROR,
      payload: error.message,
    });
  }
}
function* checkAffiliateSaga({userId}) {
  // console.log('checkAffiliateSaga userId: ', userId);
  try {
    const result = yield call(ShopController.checkAffiliateControll, userId);
    // console.log('checkAffiliateSaga result: ', result, result.data);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.CHECK_AFFILIATE_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.CHECK_AFFILIATE_ERROR,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.CHECK_AFFILIATE_ERROR,
      payload: error.message,
    });
  }
}
function* listVoucherSaga({payload}) {
  if (!payload) {
    console.log('payload saga get list voucher error');
    return;
  }
  try {
    const result = yield call(ShopController.getVouchers, payload);
    if (result.success === true) {
      console.log('result:::saga:::', result);
      yield put({
        type: NEOCAFE.GET_LIST_VOUCHER_SUCCESS,
        payload: result.vouchers,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_LIST_VOUCHER_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_LIST_VOUCHER_ERROR,
    });
  }
}
function* createReviewSaga({payload}) {
  if (!payload) {
    return;
  }
  try {
    const result = yield call(ShopController.createReview, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.CREATE_REVIEW_SUCCESS,
        payload: result.message,
      });
    } else {
      yield put({
        type: NEOCAFE.CREATE_REVIEW_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.CREATE_REVIEW_ERROR,
      payload: error.message,
    });
  }
}
function* checkShopLocationSaga({payload}) {
  try {
    const result = yield call(ShopController.getListShop, payload);
    // console.log('result list shop: ', result.data.data);
    if (result.status === 'SUCCESS' && result.success === true) {
      const listFilter = [];
      if (result.data && result.data.length > 0) {
        result?.data.map(a => {
          if (a.partnerid == PARTNER_ID) {
            listFilter.push(a);
          }
        });
      }
      yield put({
        type: NEOCAFE.CHECK_SHOP_LOCATION_SUCCESS,
        payload: listFilter,
      });
    }
    if (result.status === 'ERROR' && result.success === false) {
      yield put({
        type: NEOCAFE.CHECK_SHOP_LOCATION_ERROR,
      });
    }
  } catch (e) {
    yield put({
      type: NEOCAFE.CHECK_SHOP_LOCATION_ERROR,
    });
  }
}
function* applyVoucherSaga({payload}) {
  try {
    const result = yield call(ShopController.applyVoucher, payload);
    if (result.success) {
      yield put({
        type: NEOCAFE.APPLY_VOUCHER_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.APPLY_VOUCHER_ERROR,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.APPLY_VOUCHER_ERROR,
      payload: error,
    });
  }
}

function* getCampaignReferrerSaga({payload}) {
  try {
    const result = yield call(ShopController.getCampaignsController, payload);
    console.log('getCampaignReferrerSaga result: ', result, result.message);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.GET_CAMPAIGNS_REFERRER_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_CAMPAIGNS_REFERRER_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_CAMPAIGNS_REFERRER_ERROR,
      payload: error.message,
    });
  }
}

function* getCampaignPresenteeSaga({payload}) {
  try {
    const result = yield call(ShopController.getCampaignsController, payload);
    console.log('getCampaignPresenteeSaga result: ', result, result.message);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.GET_CAMPAIGNS_PRESENTEE_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_CAMPAIGNS_PRESENTEE_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_CAMPAIGNS_PRESENTEE_ERROR,
      payload: error.message,
    });
  }
}

export default function* watcherSaga() {
  yield takeLatest(NEOCAFE.GET_LIST_SHOP_REQUEST, getListShop);
  yield takeLatest(
    NEOCAFE.GET_LIST_SHOP_SHOW_MONEY_REQUEST,
    getListShopShowMoney,
  );
  yield takeLatest(NEOCAFE.APPLY_VOUCHER_REQUEST, applyVoucherSaga);
  yield takeLatest(NEOCAFE.CREATE_REVIEW_REQUEST, createReviewSaga);
  yield takeLatest(NEOCAFE.GET_HISTORY_CASHIN_REQUEST, getHistoryCashinSaga);
  yield takeLatest(NEOCAFE.SET_CURRENT_SHOP_REQUEST, setCurrentShop);
  yield takeLatest(NEOCAFE.ADD_VOUCHER_REQUEST, addVoucher);
  yield takeLatest(NEOCAFE.GET_LIST_VOUCHER_REQUEST, listVoucherSaga);
  yield takeLatest(NEOCAFE.GET_MESSAGE_REQUEST, getMessage);
  yield takeLatest(NEOCAFE.APPLY_AFFILIATE_REQUEST, applyAffiliateSaga);
  yield takeLatest(NEOCAFE.APPLY_AFFILIATEV2_REQUEST, applyAffiliateSagaV2);
  yield takeLatest(NEOCAFE.CHECK_AFFILIATE_REQUEST, checkAffiliateSaga);
  yield takeLatest(NEOCAFE.UPDATE_MESSAGE_REQUEST, updateMessage);
  yield takeLatest(NEOCAFE.CHECK_SHOP_LOCATION_REQUEST, checkShopLocationSaga);
  yield takeLatest(
    NEOCAFE.GET_CAMPAIGNS_REFERRER_REQUEST,
    getCampaignReferrerSaga,
  );
  yield takeLatest(
    NEOCAFE.GET_CAMPAIGNS_PRESENTEE_REQUEST,
    getCampaignPresenteeSaga,
  );
}
