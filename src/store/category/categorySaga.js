import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put} from 'redux-saga/effects';
import CategoryController from './categoryController';

function* getListCategory({payload}) {
  try {
    const result = yield call(CategoryController.getListCategory, payload);
    if (result.status === 200 && result.success) {
      yield put({
        type: NEOCAFE.GET_LIST_CATEGORY_SUCCESS,
        payload: {
          listCategory: result.data,
        },
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_LIST_CATEGORY_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}
function* setCurrentCategory({payload}) {
  try {
    yield put({
      type: NEOCAFE.SET_CURRENT_CATEGORY_SUCCESS,
      payload: {
        currentCategory: payload.category,
      },
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_CURRENT_CATEGORY_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* getListBanner({payload}) {
  // console.log('BANNER SAGA:::: ', payload);
  try {
    const result = yield call(CategoryController.getListBanner, payload);
    yield put({
      type: NEOCAFE.GET_LIST_BANNER_SUCCESS,
      payload: {
        listBanner: result.data,
      },
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_LIST_BANNER_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

export default function* watcherSaga() {
  yield takeLatest(NEOCAFE.GET_LIST_CATEGORY_REQUEST, getListCategory);
  yield takeLatest(NEOCAFE.SET_CURRENT_CATEGORY_REQUEST, setCurrentCategory);
  yield takeLatest(NEOCAFE.GET_LIST_BANNER_REQUEST, getListBanner);
}
