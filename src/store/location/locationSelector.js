export const getCurrentLocation = state => state.location.currentLocation;
export const getStatusSetLocation = state => state.location.statusSetLocation;
export const isDataAutoComplete = state => state.location.dataAutoComplete;
export const isDataCurrentPlaceSelected = state =>
  state.location.dataCurrentPlaceSelected;
export const isDetailDirectionLocation = state =>
  state.location.detailDirectionLocation;
export const createDeliverySelector = state => state.location.statusCreateDeliAddress;
export const deliveryAddressSelector = state => state.location.deliveryAddress;
export const statusListDelivery = state => state.location.statusListDelivery;
export const defaultDeliSelector = state => state.location.defaultDelivery;
export const statusUpdateDeliAddress = state => state.location.statusUpdateDelivery;
export const statusRemoveDeliSelector = state => state.location.statusRemoveDelivery;
export const getSelectedDelivery = state => state.location.selectedDelivery;
