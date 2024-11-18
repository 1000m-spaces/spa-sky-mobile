import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put} from 'redux-saga/effects';
import ShipmentController from './shipmentController';

function* getShipmentPackagesAllShop({payload}) {
  try {
    const result = yield call(ShipmentController.getShipPackages, payload);
    console.log('RESULT SAGA GET SHIPMENT PACKAGES', result);
    if (result?.success === true) {
      yield put({
        type: NEOCAFE.GET_SHIPMENT_PACKAGE_SUCCESS,
        payload: result?.packages,
      });
    } else {
      yield put({
        type: NEOCAFE.GET_SHIPMENT_PACKAGE_ERROR,
        payload: result?.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_SHIPMENT_PACKAGE_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}
// function* setSelectedPackage({payload}) {
//   try {
//     yield put({
//       type: NEOCAFE.SET_SHIPMENT_PACKAGE_SUCCESS,
//       payload,
//     });
//   } catch (error) {
//     yield put({
//       type: NEOCAFE.SET_SHIPMENT_PACKAGE_ERROR,
//       payload: {
//         errorMsg: error,
//       },
//     });
//   }
// }
function* subcribePackage({payload}) {
  try {
    const result = yield call(ShipmentController.subcribePackage, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_SUCCESS,
        payload: result.message,
      });
    } else {
      yield put({
        type: NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_ERROR,
        payload: result?.message || '',
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_ERROR,
      payload:
        error?.message ||
        'Đăng kí gói không thành công. Vui lòng liên hệ nhân việc để được hỗ trợ',
    });
  }
}

function* getMyPackages({payload}) {
  try {
    const result = yield call(ShipmentController.getMyPackages, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.GET_MY_SHIPMENT_PACKAGE_SUCCESS,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_MY_SHIPMENT_PACKAGE_ERROR,
    });
  }
}

function* paymentPackages({payload}) {
  try {
    const result = yield call(ShipmentController.paymentPackage, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.PAYMENT_PACKAGE_SUCCESS,
        payload: result.message,
      });
    } else {
      yield put({
        type: NEOCAFE.PAYMENT_PACKAGE_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.PAYMENT_PACKAGE_ERROR,
      payload: 'Đăng kí không thành công',
    });
  }
}
// function* getShowingPackages({payload}) {
//   try {
//     const result = yield call(ShipmentController.getShowingPackage, payload);
//     if (result.success) {
//       yield put({
//         type: NEOCAFE.GET_SHOWING_PACKAGE_SUCCESS,
//         payload: result.packages,
//       });
//     } else {
//       yield put({
//         type: NEOCAFE.GET_SHOWING_PACKAGE_ERROR,
//         payload: result.message,
//       });
//     }
//   } catch (error) {
//     yield put({
//       type: NEOCAFE.GET_SHOWING_PACKAGE_ERROR,
//       payload: 'Call api không thành công',
//     });
//   }
// }
function* unrenewPackageSaga({payload}) {
  try {
    const result = yield call(ShipmentController.unrenewPackage, payload);
    if (result.success === true) {
      yield put({
        type: NEOCAFE.UNRENEW_PACKAGE_SUCCESS,
      });
    } else {
      yield put({
        type: NEOCAFE.UNRENEW_PACKAGE_ERROR,
        payload: result.errorMessage,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.UNRENEW_PACKAGE_ERROR,
      payload: error.message,
    });
  }
}
function* storeShipmentAddressSaga({payload}) {
  try {
    const result = yield call(ShipmentController.storeShipmentAddress, payload);
    if (result.success) {
      yield put({
        type: NEOCAFE.STORE_SHIPMENT_ADDRESS_SUCCESS,
      });
    } else {
      yield put({
        type: NEOCAFE.STORE_SHIPMENT_ADDRESS_ERROR,
        payload: result.message,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.STORE_SHIPMENT_ADDRESS_ERROR,
      payload: error.message,
    });
  }
}
export default function* watcherSaga() {
  yield takeLatest(
    NEOCAFE.GET_SHIPMENT_PACKAGE_REQUEST,
    getShipmentPackagesAllShop,
  );
  yield takeLatest(
    NEOCAFE.STORE_SHIPMENT_ADDRESS_REQUEST,
    storeShipmentAddressSaga,
  );
  // yield takeLatest(NEOCAFE.GET_SHOWING_PACKAGE_REQUEST, getShowingPackages);
  yield takeLatest(NEOCAFE.PAYMENT_PACKAGE_REQUEST, paymentPackages);
  yield takeLatest(NEOCAFE.GET_MY_SHIPMENT_PACKAGE_REQUEST, getMyPackages);
  yield takeLatest(NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_REQUEST, subcribePackage);
  yield takeLatest(NEOCAFE.UNRENEW_PACKAGE_REQUEST, unrenewPackageSaga);
}
