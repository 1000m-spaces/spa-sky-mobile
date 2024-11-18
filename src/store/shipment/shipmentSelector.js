// ------------- LIST PACKAGE AFTER SELECT ADDRESS -----------------
export const getPackagesWithAddress = state => state.shipment.listPackageWithAddress;
export const getStatusPackageWithAddress = state => state.shipment.statusGetPackagesWithAddress;
export const getMessagePackageWithAddress = state => state.shipment.messagePackageWithAddress;
// ============= RETURNED PACKAGE AFTER SELECT ADDRESS ----------------
// export const getBannersPackage = state => state.shipment.bannersPackage;
// // export const getStatusAvailablePackage = state => state.shipment.statusAvailablePackage;

// ============= LIST PACKAGE OF CURRENT USER =================
export const getMyPackages = state => state.shipment.myShipmentPackages;
export const getStatusMyPackages = state => state.shipment.statusMyShipmentPackages;
// =============== SUBCRIBED PACKAGES =================
export const getSubcribedPackage = state => state.shipment.packageSubcired;
export const getMessageSubcribe = state => state.shipment.messageSubcribePackage;
export const getStatusSubcribe = state => state.shipment.statusSubcribePackage;
// ================ PAYMENT PACKAGE ========================
export const getStatusPaymentPackage = state => state.shipment.statusPaymentPackage;
export const getMessagePaymentPackage = state => state.shipment.messagePaymentPackage;
// ============== LIST PACKAGE FOR SHOWING =================
export const getShowingPackages = state => state.shipment.showingPackageList;
export const getStatusShowingPackages = state => state.shipment.statusShowingPackageList;
export const getMessageShowingPackages = state => state.shipment.messageShowingPackageList;

// =============== UNRENEW PACKAGE =============================
export const getStatusUnrenew = state => state.shipment.statusUnrenewPackage;
export const getErrorUnrenew = state => state.shipment.errorMessageUnrenew;

// ============== STORE SHIPMENT ADDRESS =============================
export const getStatusStoringAddress = state => state.shipment.statusStoreAddress;
