import {PARTNER_ID} from 'assets/config';
import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class ShopController {
  getListShop = async ({custid, lat, long}) => {
    try {
      const query = {
        custid,
        lat,
        long,
        partnerid: PARTNER_ID,
      };
      const {data} = await HttpClient.post(UrlApi.getListShop, query);
      // console.log('TEST GET LIST SHOP:::', data);
      if (data && data?.status === false) {
        return {
          success: false,
          status: 'ERROR',
          data: data.error,
        };
      }
      return {
        success: true,
        status: 'SUCCESS',
        data: data,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        status: 'ERROR',
        data: error.message,
      };
    }
  };
  addVoucher = async ({cust_id, session_key, gift_code, partner_id}) => {
    try {
      const query = {
        cust_id,
        session_key,
        gift_code,
        partner_id,
      };
      const {data} = await HttpClient.post(UrlApi.addVoucher, query);
      if (data.status === true) {
        return {success: true, message: data.message};
      } else {
        return {
          success: false,
          message: data.message,
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
      };
    }
  };
  getVouchers = async body => {
    // console.log('get voucher body::', body);
    try {
      const {data} = await HttpClient.post(UrlApi.getVoucherAPI, body);
      console.log('getVouchers CONTROLLLLLLL:', data);
      return {
        success: true,
        vouchers: data
          ? data?.accumulation
            ? {
                valid: data?.accumulation.valid || [],
                invalid: data?.accumulation.invalid || [],
                total: data?.total || 0,
                gift_baskets: [],
              }
            : {
                gift_baskets: data?.gift_baskets || [],
                valid: [],
                invalid: [],
                total: 0,
              }
          : {valid: [], invalid: [], total: 0, gift_baskets: []},
      };
    } catch ({response}) {
      const {data} = response;
      console.log('GET VOUCHER ERROR:::: ', data);
      return {success: false};
    }
  };
  getMessage = async ({
    custid,
    partnerid,
    sesskey,
    typemsg = 0,
    typeget = 'ALL',
  }) => {
    const query = {
      custid,
      partnerid,
      sesskey,
      typemsg,
      typeget,
    };
    try {
      const {data} = await HttpClient.post(UrlApi.getMessage, query);
      if (data.status === true) {
        return {success: true, data: data.data};
      } else {
        return {
          success: false,
          // message: data.message,
          data: data.data,
        };
      }
    } catch (error) {
      console.log(error);
      return {success: false};
    }
  };
  readMessage = async ({
    is_delete,
    msg_status,
    cust_id,
    session_key,
    msg_id,
  }) => {
    const query = {
      cust_id,
      session_key,
      msg_id,
      is_delete,
      msg_status,
    };
    const {data} = await HttpClient.post(UrlApi.updateMessage, query);
    return {success: data ? true : false};
  };
  getHistoryCashin = async query => {
    const {useID, PARTNER_ID, sessionkey} = query;
    const {data} = await HttpClient.get(
      UrlApi.getHistoryCashin + `/${useID}/${PARTNER_ID}/${sessionkey}`,
    );
    if (data && data.length >= 0) {
      return {success: true, data: data};
    }
  };
  applyAffiliate = async params => {
    try {
      const {code, userId, userPhone} = params;
      const data = await HttpClient.post(
        UrlApi.applyAffiliate +
          `?code=${code}&userId=${userId}&userPhone=${userPhone}`,
      );
      console.log('data from controller::: ', data);
      return {success: true, message: ''};
    } catch (error) {
      console.log('ERRORRRR::', error, error.response.data.errors);
      const {message} = error.response.data.errors[0];
      return {success: false, message: message};
    }
  };
  applyAffiliateV2 = async params => {
    try {
      const {code, userId, userPhone} = params;
      const data = await HttpClient.post(
        UrlApi.applyAffiliateV2 +
          `?code=${code}&userId=${userId}&userPhone=${userPhone}`,
      );
      console.log('data from controller::: ', data);
      return {success: true, message: ''};
    } catch (error) {
      console.log('ERRORRRR::', error, error.response.data.errors);
      const {message} = error.response.data.errors[0];
      return {success: false, message: message};
    }
  };
  checkAffiliateControll = async userId => {
    try {
      const data = await HttpClient.get(UrlApi.checkAffiliate, {
        params: {
          uid: userId,
        },
      });
      console.log('data from controller checkAffiliateControll: ', data);
      return {success: true, data: data.data};
    } catch (error) {
      // console.log(error);
      const {message} = error.response.data.errors[0];
      return {success: false, data: message};
    }
  };
  createReview = async params => {
    try {
      const {data} = await HttpClient.post(UrlApi.createReviewApi, params);
      // console.log('data from controller::: ', data);
      if (data && data?.message && data?.message === 'Comment is created') {
        return {success: true, message: 'Đánh giá đuợc gửi lên thành công'};
      } else {
        return {
          success: false,
          message: 'Đánh giá đuợc gửi lên thất bại. Vui lòng thử lại sau',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: 'Đánh giá đuợc gửi lên thất bại. Vui lòng thử lại sau',
      };
    }
  };

  getCampaignsController = async params => {
    try {
      const {brandId, branchId, merchantId, type, status} = params;
      const data = await HttpClient.get(UrlApi.getCampaigns, {
        params: {
          brandId,
          branchId,
          merchantId,
          type,
          status,
          fromAt: '2023-01-01T15:02:02Z',
          toAt: '2100-01-02T15:02:02Z',
        },
      });
      console.log('data from controller::: ', data);
      if (data?.data?.items) {
        return {success: true, data: data.data.items};
      }
    } catch (error) {
      console.log('ERRORRRR::', error, error.response.data.errors);
      const {message} = error.response?.data?.errors[0];
      return {success: false, message: message};
    }
  };
  applyVoucher = async body => {
    try {
      const {data} = await HttpClient.post(
        `${UrlApi.applyVoucherApi}/${body.code}`,
        body,
      );
      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.log('APPPLY VOUCHER::: ERPPRRLLL:::', error.response.data);
      const {response} = error;
      return {
        success: false,
        data: response.data.message,
      };
    }
  };
}

export default new ShopController();
