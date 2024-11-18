import {NEOCAFE} from 'store/actionsTypes';

export const getPackageWithAddress = payload => ({
  type: NEOCAFE.GET_SHIPMENT_PACKAGE_REQUEST,
  payload,
});
export const resetPackageWithAddress = payload => ({
  type: NEOCAFE.GET_SHIPMENT_PACKAGE_RESET,
});
// export const resetGetPackage = () => ({
//   type: NEOCAFE.GET_SHIPMENT_PACKAGE_RESET,
// });
// export const setSelectedPackage = payload => ({
//   type: NEOCAFE.SET_SHIPMENT_PACKAGE_REQUEST,
//   payload,
// });
export const subcribePackage = payload => ({
  type: NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_REQUEST,
  payload,
});

export const getMyShipmentPackages = payload => ({
  type: NEOCAFE.GET_MY_SHIPMENT_PACKAGE_REQUEST,
  payload,
});

export const paymentPackage = payload => ({
  type: NEOCAFE.PAYMENT_PACKAGE_REQUEST,
  payload,
});
export const resetPaymentPackage = () => ({
  type: NEOCAFE.PAYMENT_PACKAGE_RESET,
});
export const resetSubcribePackage = () => ({
  type: NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_RESET,
});
// export const listShowingPackages = payload => ({
//   type: NEOCAFE.GET_SHOWING_PACKAGE_REQUEST,
//   payload,
// });
export const unrenewPackageAction = payload => ({
  type: NEOCAFE.UNRENEW_PACKAGE_REQUEST,
  payload,
});
export const resetUnrenewPackage = () => ({
  type: NEOCAFE.UNRENEW_PACKAGE_RESET,
});
export const storeShipmentAddress = payload => ({
  type: NEOCAFE.STORE_SHIPMENT_ADDRESS_REQUEST,
  payload,
});
export const resetStatusMyPackage = () => ({
  type: NEOCAFE.GET_MY_SHIPMENT_PACKAGE_RESET,
});
