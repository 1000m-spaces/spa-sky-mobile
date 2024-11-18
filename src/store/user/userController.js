import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class UserController {
  deleteAccount = async (custId, sessionKey, phone) => {
    try {
      const query = {
        custid: custId,
        session_key: sessionKey,
        phone: phone,
      };
      const result = await HttpClient.post(UrlApi.deleteAccount, query);
      console.log('DELETE CONTROLLER:', result);
      return {
        success: true,
        status: 200,
        data: result.data,
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error,
      };
    }
  };
  confirmDeleteAccount = async query => {
    try {
      const {data} = await HttpClient.put(UrlApi.confirmOtpDelete, query);
      console.log('CONFIRM DELETE ACCOUNT CONTROLLER::::', data);
      return data.status === false
        ? {errorMessage: data?.error, success: false}
        : {
            success: true,
          };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        errorMessage: error,
      };
    }
  };
  updateUserInfo = async userInfo => {
    const query = {
      ...userInfo,
      cust_city: '',
      cust_cmnd: '',
      cust_ngaycap: '',
      cust_noicap: '',
    };
    try {
      const {data} = await HttpClient.post(UrlApi.updateUserInfo, query);
      console.log(data);
      if (data.status === false) {
        return {success: false, message: data.error};
      }
      return {success: true, user: data};
    } catch (error) {
      return {success: false, errorMessage: error};
    }
  };
  updateLanguage = async query => {
    console.log('QUERY UPDATE LANGUAGE:::', query);
    try {
      const data = await HttpClient.post(UrlApi.updateLanguageUrl, query);
      console.log('DATA FROM UPADTING LANGUAGE:::', data);
      return {
        success: data?.data.status ? true : false,
        message: data?.data.status ? '' : '',
      };
    } catch (error) {
      console.log('UPDATE LANGUAGE ERROR:::', error);
      return {success: false, message: error.message};
    }
  };

  getListUserAffiliates = async uid => {
    const query = {
      uid: 108688,
      from: '2023-01-01T15:02:02Z',
      to: '2100-01-02T15:02:02Z',
    };
    try {
      const data = await HttpClient.get(UrlApi.listUserAffiliates, {
        params: query,
      });
      console.log('getListUserAffiliates::', data);
      if (!data.data.Reffereds) {
        return {success: false, message: data.data.error};
      }
      return {success: true, list: data.data.Reffereds};
    } catch (error) {
      return {success: false, errorMessage: error};
    }
  };
}

export default new UserController();
