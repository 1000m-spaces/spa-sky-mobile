import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';
const initializeState = {
  // LIST OF SHIPMENT PACKAGES FOR REGISTERED ADDRESS --- STATUS OF GETTING LIST
  listPackageWithAddress: [],
  messagePackageWithAddress: '',
  statusGetPackagesWithAddress: Status.DEFAULT,

  // // LIST OF SHIPMENT PACKAGES OF CURRENT USER --- STATUS OF GETTING
  // packagesOfUser: [],
  // statusGetPackagesUser: Status.DEFAULT,

  // SUBCRIBRE A SHIPMENT PACKAGE STATUS
  statusSubcribePackage: Status.DEFAULT,
  packageSubcired: {},
  messageSubcribePackage: '',

  // // LIST ALL SHIPMENT PACKAGES FOR SHOWING
  // showingPackageList: [],
  // statusShowingPackageList: Status.DEFAULT,
  // messageShowingPackageList: '',

  // LIST SHIPMENT PACKAGES OF CURRENT USER
  myShipmentPackages: [],
  statusMyShipmentPackages: Status.DEFAULT,

  // Status Payment package
  statusPaymentPackage: Status.DEFAULT,
  messagePaymentPackage: '',

  // Status unrenew package
  statusUnrenewPackage: Status.DEFAULT,
  errorMessageUnrenew: '',

  // Status storing shipment address
  statusStoreAddress: Status.DEFAULT,
};
export default (state = initializeState, {type, payload}) => {
  switch (type) {
    // GET LIST SHIPMENT PACKAGE FOR REGISTERED ADDRESS
    case NEOCAFE.GET_SHIPMENT_PACKAGE_REQUEST:
      return {
        ...state,
        statusGetPackagesWithAddress: Status.LOADING,
      };
    case NEOCAFE.GET_SHIPMENT_PACKAGE_SUCCESS:
      return {
        ...state,
        listPackageWithAddress: payload,
        statusGetPackagesWithAddress: Status.SUCCESS,
      };
    case NEOCAFE.GET_SHIPMENT_PACKAGE_ERROR:
      return {
        ...state,
        messageShipmentPackage: payload,
        statusGetPackagesWithAddress: Status.ERROR,
      };
    case NEOCAFE.GET_SHIPMENT_PACKAGE_RESET:
      return {
        ...state,
        messageShipmentPackage: '',
        listPackageWithAddress: [],
        statusGetPackagesWithAddress: Status.DEFAULT,
      };
    // // LIST ALL SHIPMENT PACKAGES FOR SHOWING
    // case NEOCAFE.GET_SHOWING_PACKAGE_REQUEST:
    //   return {
    //     ...state,
    //     statusShowingPackageList: Status.LOADING,
    //   };
    // case NEOCAFE.GET_SHOWING_PACKAGE_SUCCESS:
    //   return {
    //     ...state,
    //     showingPackageList: payload,
    //     statusShowingPackageList: Status.SUCCESS,
    //   };
    // case NEOCAFE.GET_SHOWING_PACKAGE_ERROR:
    //   return {
    //     ...state,
    //     messageShowingPackageList: payload,
    //     statusShowingPackageList: Status.ERROR,
    //   };
    // case NEOCAFE.GET_SHOWING_PACKAGE_RESET:
    //   return {
    //     ...state,
    //     showingPackageList: [],
    //     stateSetPackage: Status.DEFAULT,
    //   };
    // SUBCRIBE A SHIPMENT PACKAGE FOR USER
    case NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_REQUEST:
      return {
        ...state,
        statusSubcribePackage: Status.LOADING,
      };
    case NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_SUCCESS:
      return {
        ...state,
        statusSubcribePackage: Status.SUCCESS,
        messageSubcribePackage: payload,
      };
    case NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_ERROR:
      return {
        ...state,
        messageSubcribePackage: payload,
        statusSubcribePackage: Status.ERROR,
      };
    case NEOCAFE.SUBCRIBE_SHIPMENT_PACKAGE_RESET:
      return {
        ...state,
        messageSubcribePackage: '',
        packageSubcired: {},
        availablePackage: {},
        statusAvailablePackage: Status.DEFAULT,
        statusSubcribePackage: Status.DEFAULT,
      };
    // PAYMENT PACKAGE
    case NEOCAFE.PAYMENT_PACKAGE_REQUEST:
      return {
        ...state,
        statusPaymentPackage: Status.LOADING,
      };
    case NEOCAFE.PAYMENT_PACKAGE_SUCCESS:
      return {
        ...state,
        statusPaymentPackage: Status.SUCCESS,
        messagePaymentPackage: payload,
      };
    case NEOCAFE.PAYMENT_PACKAGE_ERROR:
      return {
        ...state,
        statusPaymentPackage: Status.ERROR,
        messagePaymentPackage: payload,
      };
    case NEOCAFE.PAYMENT_PACKAGE_RESET:
      return {
        ...state,
        statusPaymentPackage: Status.DEFAULT,
        messagePaymentPackage: '',
      };
    // GET LIST SHIPMENT PACKAGES OF CURRENT USER
    case NEOCAFE.GET_MY_SHIPMENT_PACKAGE_REQUEST:
      return {
        ...state,
        statusMyShipmentPackages: Status.LOADING,
      };
    case NEOCAFE.GET_MY_SHIPMENT_PACKAGE_SUCCESS:
      return {
        ...state,
        myShipmentPackages: payload,
        statusMyShipmentPackages: Status.SUCCESS,
      };
    case NEOCAFE.GET_MY_SHIPMENT_PACKAGE_ERROR:
      return {
        ...state,
        statusMyShipmentPackages: Status.ERROR,
      };
    case NEOCAFE.GET_MY_SHIPMENT_PACKAGE_RESET:
      return {
        ...state,
        statusMyShipmentPackages: Status.DEFAULT,
      };
    // UNRENEW_PACKAGE_REQUEST
    case NEOCAFE.UNRENEW_PACKAGE_REQUEST:
      return {
        ...state,
        statusUnrenewPackage: Status.LOADING,
      };
    case NEOCAFE.UNRENEW_PACKAGE_SUCCESS:
      return {
        ...state,
        statusUnrenewPackage: Status.SUCCESS,
      };
    case NEOCAFE.UNRENEW_PACKAGE_ERROR:
      return {
        ...state,
        statusUnrenewPackage: Status.ERROR,
        errorMessageUnrenew: payload,
      };
    case NEOCAFE.UNRENEW_PACKAGE_RESET:
      return {
        ...state,
        errorMessageUnrenew: '',
        statusUnrenewPackage: Status.DEFAULT,
      };
    // STORE SHIPMENT ADDREES
    case NEOCAFE.STORE_SHIPMENT_ADDREES_REQUEST:
      return {
        ...state,
        statusStoreAddress: Status.LOADING,
      };
    case NEOCAFE.STORE_SHIPMENT_ADDREES_SUCCESS:
      return {
        ...state,
        statusStoreAddress: Status.SUCCESS,
      };
    case NEOCAFE.STORE_SHIPMENT_ADDREES_ERROR:
      return {
        ...state,
        statusStoreAddress: Status.ERROR,
      };
    default:
      return state;
  }
};
