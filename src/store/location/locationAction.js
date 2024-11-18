import {NEOCAFE} from 'store/actionsTypes';

export const setCurrentLocation = value => ({
  type: NEOCAFE.SET_LOCATION_REQUEST,
  payload: {
    currentLocation: value,
  },
});
export const resetCurrentLocation = payload => ({
  type: NEOCAFE.SET_LOCATION_RESET,
  payload,
});

export const getAddressAutoComplete = (query, keyApi) => ({
  type: NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_REQUEST,
  payload: {
    query,
    keyApi,
  },
});
export const resetDataAutoComplete = () => ({
  type: NEOCAFE.GET_ADDRESS_AUTO_COMPLETE_RESET,
});
export const getDetailPlaceSelect = (apiKey, placeId) => ({
  type: NEOCAFE.GET_DETAIL_PLACE_SELECT_REQUEST,
  payload: {
    apiKey,
    placeId,
  },
});
export const getDirectionLocation = ({
  locationOrigin,
  locationDestination,
  apiKey,
  vehicle,
}) => ({
  type: NEOCAFE.GET_DIRECTION_LOCATION_REQUEST,
  payload: {
    locationOrigin,
    locationDestination,
    apiKey,
    vehicle,
  },
});

export const createDeliAddress = payload => ({
  type: NEOCAFE.CREATE_DELIVERY_ADDRESS_REQUEST,
  payload,
});
export const resetCreateDelivery = () => ({
  type: NEOCAFE.CREATE_DELIVERY_ADDRESS_RESET,
});
export const listDeliAddres = payload => ({
  type: NEOCAFE.LIST_DELIVERY_ADDRESS_REQUEST,
  payload,
});
export const resetListDelivery = () => ({
  type: NEOCAFE.LIST_DELIVERY_ADDRESS_RESET,
});
export const updateDelivery = payload => ({
  type: NEOCAFE.UPDATE_DELIVERY_ADDRESS_REQUEST,
  payload,
});
export const resetUpdateDelivery = () => ({
  type: NEOCAFE.UPDATE_DELIVERY_ADDRESS_RESET,
});
export const removeDeliveryAddress = payload => ({
  type: NEOCAFE.REMOVE_DELIVERY_REQUEST,
  payload,
});
export const resetRemovingDelivery = () => ({
  type: NEOCAFE.REMOVE_DELIVERY_RESET,
});
export const selectDeliveryAction = payload => ({
  type: NEOCAFE.SELECTED_DELIVERY_REQUEST,
  payload,
});
export const resetSelectedDelivery = () => ({
  type: NEOCAFE.SELECTED_DELIVERY_RESET,
});
