import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';
const initializeState = {
  currentLocation: {
    latitude: 0,
    longitude: 0,
  },
  statusSetLocation: Status.DEFAULT,
  dataAutoComplete: '',
  dataCurrentPlaceSelected: '',
  detailDirectionLocation: {},

  selectedDelivery: null,
  statusSelectedDelivery: Status.DEFAULT,

  statusCreateDeliAddress: Status.DEFAULT,
  deliveryAddress: [],
  defaultDelivery: null,
  statusListDelivery: Status.DEFAULT,
  statusUpdateDelivery: Status.DEFAULT,
  statusRemoveDelivery: Status.DEFAULT,
};
export default (state = initializeState, {type, payload}) => {
  switch (type) {
    // ----------- SELECT DELIVERY ADDRESS ---------------------
    case NEOCAFE.SELECTED_DELIVERY_REQUEST:
      return {
        ...state,
        statusSelectedDelivery: Status.LOADING,
      };

    case NEOCAFE.SELECTED_DELIVERY_SUCCESS:
      return {
        ...state,
        statusSelectedDelivery: Status.SUCCESS,
        selectedDelivery: payload,
        defaultDelivery: state.defaultDelivery
          ? state.defaultDelivery
          : payload,
      };
    case NEOCAFE.SELECTED_DELIVERY_ERROR:
      return {
        ...state,
        statusSelectedDelivery: Status.ERROR,
      };
    case NEOCAFE.SELECTED_DELIVERY_RESET:
      return {
        ...state,
        statusSelectedDelivery: Status.DEFAULT,
      };
    // ----------- REMOVE DELIVERY SECTION ---------------------
    case NEOCAFE.REMOVE_DELIVERY_REQUEST:
      return {
        ...state,
        statusRemoveDelivery: Status.LOADING,
      };

    case NEOCAFE.REMOVE_DELIVERY_SUCCESS:
      return {
        ...state,
        statusRemoveDelivery: Status.SUCCESS,
      };
    case NEOCAFE.REMOVE_DELIVERY_ERROR:
      return {
        ...state,
        statusRemoveDelivery: Status.ERROR,
      };
    case NEOCAFE.REMOVE_DELIVERY_RESET:
      return {
        ...state,
        statusRemoveDelivery: Status.DEFAULT,
      };
    // ----------- SET DEFAULT DELIVERY SECTION ---------------------
    case NEOCAFE.UPDATE_DELIVERY_ADDRESS_REQUEST:
      return {
        ...state,
        statusUpdateDelivery: Status.LOADING,
      };

    case NEOCAFE.UPDATE_DELIVERY_ADDRESS_SUCCESS:
      return {
        ...state,
        statusUpdateDelivery: Status.SUCCESS,
      };
    case NEOCAFE.UPDATE_DELIVERY_ADDRESS_ERROR:
      return {
        ...state,
        statusUpdateDelivery: Status.ERROR,
      };
    case NEOCAFE.UPDATE_DELIVERY_ADDRESS_RESET:
      return {
        ...state,
        statusUpdateDelivery: Status.DEFAULT,
      };
    // ----------- CREATE DELIVERY SECTION ---------------------
    case NEOCAFE.CREATE_DELIVERY_ADDRESS_REQUEST:
      return {
        ...state,
        statusCreateDeliAddress: Status.LOADING,
      };

    case NEOCAFE.CREATE_DELIVERY_ADDRESS_SUCCESS:
      return {
        ...state,
        statusCreateDeliAddress: Status.SUCCESS,
      };
    case NEOCAFE.CREATE_DELIVERY_ADDRESS_ERROR:
      return {
        ...state,
        statusCreateDeliAddress: Status.ERROR,
      };
    case NEOCAFE.CREATE_DELIVERY_ADDRESS_RESET:
      return {
        ...state,
        statusCreateDeliAddress: Status.DEFAULT,
      };
    //  ----------------- LIST DELIVERY ADDRESS ------------------
    case NEOCAFE.LIST_DELIVERY_ADDRESS_REQUEST:
      return {
        ...state,
        statusListDelivery: Status.LOADING,
      };

    case NEOCAFE.LIST_DELIVERY_ADDRESS_SUCCESS:
      return {
        ...state,
        deliveryAddress: payload || [],
        statusListDelivery: Status.SUCCESS,
      };
    case NEOCAFE.LIST_DELIVERY_ADDRESS_ERROR:
      return {
        ...state,
        statusListDelivery: Status.ERROR,
      };
    case NEOCAFE.LIST_DELIVERY_ADDRESS_RESET:
      return {
        ...state,
        statusListDelivery: Status.DEFAULT,
      };

    case NEOCAFE.SET_LOCATION_REQUEST:
      return {
        ...state,
        statusSetLocation: Status.LOADING,
      };

    case NEOCAFE.SET_LOCATION_SUCCESS:
      return {
        ...state,
        currentLocation: payload.currentLocation,
        statusSetLocation: Status.SUCCESS,
      };
    case NEOCAFE.SET_LOCATION_ERROR:
      return {
        ...state,
        statusSetLocation: Status.ERROR,
      };
    case NEOCAFE.SET_LOCATION_RESET:
      console.log('payload reset location:::', payload);
      const {isLogout} = payload;
      return {
        ...state,
        statusSetLocation: Status.DEFAULT,
        currentLocation:
          isLogout === true
            ? {
                latitude: 0,
                longitude: 0,
              }
            : {...state.currentLocation},
      };
    case NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_SUCCESS:
      return {
        ...state,
        dataAutoComplete: payload.data,
      };
    case NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_RESET:
      return {
        ...state,
        dataAutoComplete: '',
        dataCurrentPlaceSelected: '',
        detailDirectionLocation: {},
      };
    case NEOCAFE.GET_DETAIL_PLACE_SELECT_SUCCESS:
      return {
        ...state,
        dataCurrentPlaceSelected: payload.data,
      };
    case NEOCAFE.GET_DIRECTION_LOCATION_SUCCESS:
      return {
        ...state,
        detailDirectionLocation: payload.detailDirectionLocation,
      };
    default:
      return state;
  }
};
