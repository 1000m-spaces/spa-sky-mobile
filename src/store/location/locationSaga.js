import {NEOCAFE} from 'store/actionsTypes';
import {takeLatest, call, put} from 'redux-saga/effects';
import locationController from './locationController';

function* setCurrentLocation({payload}) {
  try {
    if (payload && payload.currentLocation) {
      yield put({
        type: NEOCAFE.SET_LOCATION_SUCCESS,
        payload: {
          currentLocation: payload.currentLocation,
        },
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.SET_LOCATION_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* getAddressAuto({payload}) {
  try {
    const result = yield call(
      locationController.getAddressAutoComplete,
      payload.query,
      payload.keyApi,
    );
    yield put({
      type: NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_SUCCESS,
      payload: {data: result.data},
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* getDetailPlaceSelect({payload}) {
  try {
    const response = yield call(
      locationController.getDetailPlaceSelect,
      payload.placeId,
      payload.apiKey,
    );
    yield put({
      type: NEOCAFE.GET_DETAIL_PLACE_SELECT_SUCCESS,
      payload: {data: response.result},
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_DETAIL_PLACE_SELECT_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}

function* getDirectionLocation({payload}) {
  try {
    const result = yield call(
      locationController.getDirectionLocation,
      payload.locationOrigin,
      payload.locationDestination,
      payload.apiKey,
      payload.vehicle,
    );
    if (result?.data?.routes) {
      yield put({
        type: NEOCAFE.GET_DIRECTION_LOCATION_SUCCESS,
        payload: {detailDirectionLocation: result.data.routes[0]},
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.GET_DIRECTION_LOCATION_ERROR,
      payload: {
        errorMsg: error,
      },
    });
  }
}
function* createDeliAddress({payload}) {
  try {
    const result = yield call(
      locationController.createDeliveryAddress,
      payload,
    );
    if (result && result.success) {
      yield put({
        type: NEOCAFE.CREATE_DELIVERY_ADDRESS_SUCCESS,
        payload: result.data,
      });
    } else {
      yield put({
        type: NEOCAFE.CREATE_DELIVERY_ADDRESS_ERROR,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.CREATE_DELIVERY_ADDRESS_ERROR,
      payload: error,
    });
  }
}

function* listDeliAddress({payload}) {
  try {
    const result = yield call(locationController.listDeliveryAddress, payload);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.LIST_DELIVERY_ADDRESS_SUCCESS,
        payload: result.data || [],
      });
    } else {
      yield put({
        type: NEOCAFE.LIST_DELIVERY_ADDRESS_ERROR,
        payload: result.data,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.LIST_DELIVERY_ADDRESS_ERROR,
      payload: error,
    });
  }
}
function* updateDeliveryAddress({payload}) {
  try {
    const result = yield call(
      locationController.updateDeliveryAddress,
      payload,
    );
    if (result && result.success) {
      yield put({
        type: NEOCAFE.UPDATE_DELIVERY_ADDRESS_SUCCESS,
      });
    } else {
      yield put({
        type: NEOCAFE.UPDATE_DELIVERY_ADDRESS_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.UPDATE_DELIVERY_ADDRESS_ERROR,
    });
  }
}

function* removeDeliverySaga({payload}) {
  try {
    const result = yield call(locationController.removeDelivery, payload);
    if (result && result.success) {
      yield put({
        type: NEOCAFE.REMOVE_DELIVERY_SUCCESS,
      });
    } else {
      yield put({
        type: NEOCAFE.REMOVE_DELIVERY_ERROR,
      });
    }
  } catch (error) {
    yield put({
      type: NEOCAFE.REMOVE_DELIVERY_ERROR,
    });
  }
}
function* selectDelivery({payload}) {
  try {
    yield put({
      type: NEOCAFE.SELECTED_DELIVERY_SUCCESS,
      payload: payload,
    });
  } catch (error) {
    yield put({
      type: NEOCAFE.SELECTED_DELIVERY_ERROR,
      payload: error,
    });
  }
}

export default function* watcherSaga() {
  yield takeLatest(NEOCAFE.SET_LOCATION_REQUEST, setCurrentLocation);
  yield takeLatest(NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_REQUEST, getAddressAuto);
  yield takeLatest(
    NEOCAFE.GET_DETAIL_PLACE_SELECT_REQUEST,
    getDetailPlaceSelect,
  );
  yield takeLatest(
    NEOCAFE.GET_DIRECTION_LOCATION_REQUEST,
    getDirectionLocation,
  );
  yield takeLatest(NEOCAFE.CREATE_DELIVERY_ADDRESS_REQUEST, createDeliAddress);
  yield takeLatest(NEOCAFE.LIST_DELIVERY_ADDRESS_REQUEST, listDeliAddress);
  yield takeLatest(
    NEOCAFE.UPDATE_DELIVERY_ADDRESS_REQUEST,
    updateDeliveryAddress,
  );
  yield takeLatest(NEOCAFE.SELECTED_DELIVERY_REQUEST, selectDelivery);
  yield takeLatest(NEOCAFE.REMOVE_DELIVERY_REQUEST, removeDeliverySaga);
}
