import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class CashinController {
  createCashin = async query => {
    try {
      const {data} = await HttpClient.post(
        UrlApi.createOrderPos,
        JSON.stringify(query),
      );
      console.log('DATA CREATE ORDER MoMo:::', data);
      return {
        status: data && data.status === 1 ? true : false,
        data: data || null,
      };
    } catch (error) {
      console.log(error);
      return {status: false, data: null};
    }
  };
  getRedirectUrlMomo = async query => {
    console.log('GET URL MOMO::::query:::', query);
    const {data} = await HttpClient.post(UrlApi.getUrlPaymentMomo, query);
    console.log('GET URL MOMO::::DATA:::', data);
    return {
      success: data ? true : false,
      data: data ? data : null,
    };
  };
  getQrCode = async payload => {
    try {
      const {data} = await HttpClient.post(UrlApi.getQrCode, payload);
      console.log('GET VNPAY QRCODE :::', data);
      return {
        success: true,
        data: data || {},
      };
    } catch (error) {
      console.log('GET VNPAY QRCODE FAILED:::', error);
      return {success: false};
    }
  };
}

export default new CashinController();
