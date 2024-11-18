import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put} from 'redux-saga/effects';
import CashinController from './cashinController';

function* createCashInMomo({payload}) {
  try {
    const result = yield call(CashinController.createCashin, payload);
    console.log('result saga:::', result);
    if (result.status === true && result.data !== null) {
      yield put({
        type: NEOCAFE.CASH_IN_MOMO_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.CASH_IN_MOMO_ERROR,
        payload: result?.data?.error,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.CASH_IN_MOMO_ERROR,
    });
  }
}
function* getUrlPayment({payload}) {
  console.log('COME TO SAGA GET URL', payload);
  try {
    const result = yield call(CashinController.getRedirectUrlMomo, payload);
    console.log('RESUlT SAGA:::', result);
    if (result.success === true && result.data !== null) {
      yield put({
        type: NEOCAFE.GET_URL_MOMOPAY_PAYMENT_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_URL_MOMOPAY_PAYMENT_ERROR,
        payload: result.error,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_URL_MOMOPAY_PAYMENT_ERROR,
    });
  }
}
function* getQrCodeSaga({payload}) {
  try {
    const result = yield call(CashinController.getQrCode, payload);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.GET_QRCODE_SUCCESS,
        payload: result?.data,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_QRCODE_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_QRCODE_ERROR,
    });
  }
}

export default function* watcherSaga() {
  yield takeLatest(NEOCAFE.CASH_IN_MOMO_REQUEST, createCashInMomo);
  yield takeLatest(NEOCAFE.GET_URL_MOMOPAY_PAYMENT_REQUEST, getUrlPayment);
  yield takeLatest(NEOCAFE.GET_QRCODE_REQUEST, getQrCodeSaga);
}
