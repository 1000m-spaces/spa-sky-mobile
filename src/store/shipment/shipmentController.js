import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class ShipmentController {
  getShipPackages = async query => {
    try {
      const data = await HttpClient.post(UrlApi.getPackagesByShop, query);
      console.log('CONTROLLER GET SHIPEMTN PACKAGES:::', data);
      if (data) {
        return {
          success: true,
          packages: data.data.packages || [],
        };
      }
      // else {
      //   return {
      //     success: false,
      //     errors: data.response.data?.errors[0].message || 'ERROR',
      //   };
      // }
    } catch (error) {
      console.log(error);
      const {response} = error;
      return {
        success: false,
        message:
          response.data?.errors[0].message || 'Oops! Something went wrong',
      };
    }
  };
  subcribePackage = async payload => {
    try {
      const {data} = await HttpClient.post(UrlApi.subcribePackage, payload);
      return data.status === true
        ? {
            success: true,
            message: data?.error || 'Đăng kí thành công',
          }
        : {
            success: false,
            message: data?.error || '',
          };
    } catch (error) {
      const {response} = error;
      return {success: false, message: response.data?.errors[0].message};
    }
  };
  getMyPackages = async payload => {
    try {
      const {data} = await HttpClient.get(UrlApi.getMyPackage, {
        params: payload,
      });
      return {success: true, data};
    } catch (error) {
      return {success: false, message: error.response.data.message};
    }
  };
  paymentPackage = async payload => {
    try {
      const {data} = await HttpClient.post(UrlApi.paymentPackage, payload);
      console.log('PAYMENT PACKAGE', data);
      if (parseInt(data.status, 10) === 1) {
        return {success: true, message: data.message};
      } else {
        return {success: false, message: data.message};
      }
    } catch (error) {
      return {success: false, message: error.response.data.message};
    }
  };
  getShowingPackage = async payload => {
    try {
      const {data} = await HttpClient.get(UrlApi.showingPackage, {
        params: payload,
      });
      if (data && data.packages) {
        return {
          success: true,
          packages: data.packages,
        };
      } else {
        return {success: false};
      }
    } catch (error) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
  };
  unrenewPackage = async payload => {
    try {
      const {data} = await HttpClient.put(
        `${UrlApi.unrenewPackage}/${payload.id}?updatedBy=${payload.updatedBy}&userId=${payload.userId}`,
      );
      return {success: true};
    } catch (error) {
      console.log('UNRENEW API RESULT EERROROR::::', error);
      return {
        success: false,
        errorMessage: error.response.data.errors[0].message,
      };
    }
  };
  storeShipmentAddress = async payload => {
    try {
      const {data} = await HttpClient.post(
        UrlApi.storeShipmentAddress,
        payload,
      );
      return {success: data.status};
    } catch (error) {
      console.log('STORE ADDRESS ERROR:::', error);
      return {success: false};
    }
  };
}

export default new ShipmentController();
