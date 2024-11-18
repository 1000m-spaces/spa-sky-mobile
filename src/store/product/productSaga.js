import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put} from 'redux-saga/effects';
import ProductController from './productController';
import {asyncStorage} from 'store/index';

function* getProductExpired({payload}) {
  try {
    const result = yield call(ProductController.getProductExpired, payload.id);
    if (result.status) {
      yield put({
        type: NEOCAFE.GET_PRODUCT_EXPIRED_SUCCESS,
        payload: {
          listProductExpired: result.data,
        },
      });
    }
  } catch (e) {
    yield put({
      type: NEOCAFE.GET_PRODUCT_EXPIRED_ERROR,
      payload: {
        errorMsg: e,
      },
    });
  }
}
function* setCurrentProduct({payload}) {
  try {
    if (payload && payload.product) {
      yield put({
        type: NEOCAFE.SET_CURRENT_PRODUCT_SUCCESS,
        payload: {
          product: payload.product,
        },
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_CURRENT_PRODUCT_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function getFirstExtraType1(listExtra, type) {
  const tempExtraItem = listExtra.find(item => item.group_type === 1);
  return type === 1 && tempExtraItem ? [tempExtraItem] : [tempExtraItem.id];
}

function* getProductAllByShops({payload}) {
  try {
    const result = yield call(ProductController.getProductMenu, payload);
    console.log('result saga get all product:', result);
    result?.products.map((product, index) => {
      product.option_item =
        product.options === false ? {id: -1} : product.options[0][0];
      product.extra_items =
        product.extras !== false && product.extras.length > 0
          ? getFirstExtraType1(product.extras[0], 1)
          : [];
      product.quantity = 0;
      product.extraIds =
        product.extras !== false && product.extras.length > 0
          ? getFirstExtraType1(product.extras[0], 2)
          : [];
      product.isExpired = false;
    });
    const recommendation = yield asyncStorage.getListRecommned();
    if (result.status === 200 && result.success) {
      yield put({
        type: NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_SUCCESS,
        payload: {
          listProductAllByShop: result?.products,
          listCategory: result?.categories,
          recommendation,
        },
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* getTopPurchasedProductSaga({payload}) {
  if (!payload) {
    return;
  }
  try {
    const result = yield call(ProductController.getTopPurchased, payload);
    if (result && result?.success === true && result?.data) {
      yield put({
        type: NEOCAFE.GET_TOP_PURCHASED_PRODUCT_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_TOP_PURCHASED_PRODUCT_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_TOP_PURCHASED_PRODUCT_ERROR,
    });
  }
}
async function setRecommendLocal(result) {
  await asyncStorage.setListRecommned({
    list1: result?.data?.arr1 || [],
    list2: result?.data?.arr2 || [],
    created_at: new Date().toString(),
    index_recommend: 1,
  });
  return {
    list1: result?.data?.arr1 || [],
    list2: result?.data?.arr2 || [],
    created_at: new Date().toString(),
    index_recommend: 1,
  };
}
function* getRecommendedProductSaga({payload}) {
  if (!payload) {
    return 0;
  }
  try {
    const result = yield call(
      ProductController.getRecommendedProducts,
      payload,
    );
    if (result && result.success && result?.data?.reload) {
      const data = yield setRecommendLocal(result);
      yield put({
        type: NEOCAFE.GET_RECOMMENDED_PRODUCT_SUCCESS,
        payload: data,
      });
    } else {
      // console.log('errrrorrrr GET_RECOMMENDED_errrrr::', result);
      yield put({
        type: NEOCAFE.GET_RECOMMENDED_PRODUCT_ERROR,
        payload: 'errrrrrr',
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_RECOMMENDED_PRODUCT_ERROR,
      payload: error,
    });
  }
}

export default function* watcherSaga() {
  yield takeLatest(NEOCAFE.GET_PRODUCT_EXPIRED_REQUEST, getProductExpired);
  // yield takeLatest(NEOCAFE.GET_PRODUCT_MENU_REQUEST, getProductMenu);
  yield takeLatest(NEOCAFE.SET_CURRENT_PRODUCT_REQUEST, setCurrentProduct);
  yield takeLatest(
    NEOCAFE.GET_RECOMMENDED_PRODUCT_REQUEST,
    getRecommendedProductSaga,
  );
  yield takeLatest(
    NEOCAFE.GET_TOP_PURCHASED_PRODUCT_REQUEST,
    getTopPurchasedProductSaga,
  );
  yield takeLatest(
    NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_REQUEST,
    getProductAllByShops,
  );
}
