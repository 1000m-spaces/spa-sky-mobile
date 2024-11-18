import {UrlApi} from 'http/UrlApi';
import HttpClient from 'http/HttpClient';

class OrderController {
  getListHistoryOrder = async ({userid, partnerid, session}) => {
    const result = await HttpClient.get(
      `${UrlApi.getListHistoryOrder}/${userid}/${partnerid}/${session}`,
    );
    return {
      status: result.status,
      data: result.data,
    };
  };
  createNewOrder = async order => {
    try {
      // console.log('JSON.stringify(order):::::', JSON.stringify(order));
      const {data} = await HttpClient.post(
        UrlApi.createOrder,
        JSON.stringify(order),
      );
      // console.log('CONTROLLER CREATE ORDER:::: ', data);
      return {
        success: data.status === false || data.status === 0 ? false : true,
        data:
          data.status === false || data.status === 0
            ? data.error
              ? {error: data.error}
              : {}
            : data,
        message: data.message || data.error,
        listExpired: data?.product_expired || [],
      };
    } catch (error) {
      return {status: -1, data: {}, message: error.message || ''};
    }
  };
  cancelOrder = async ({session_key, cust_id, order_id}) => {
    try {
      const result = await HttpClient.post(UrlApi.cancelOrder, {
        session_key,
        cust_id,
        order_id,
      });
      console.log('CANNNNEELLL ORDERRR:', result);
      return result.data;
    } catch (error) {
      //console.log("error whilte submit order in controller", error);
    }
  };

  getOrderInfo = async idOrder => {
    try {
      const {data} = await HttpClient.get(
        UrlApi.getOrderInfo + '/' + `${idOrder}`,
      );
      return data.status === false
        ? {
            success: false,
          }
        : {success: true, data};
    } catch (error) {}
  };
  refundPayment = async query => {
    const {pos_trans_type} = query;
    delete query.pos_trans_type;
    const link =
      pos_trans_type && pos_trans_type === 45
        ? UrlApi.refundPaymentApi
        : UrlApi.refundZaloPayment;
    try {
      const {data} = await HttpClient.post(link, query);
      console.log('refund payment controller:::, ', data);
      return data?.status
        ? {success: data?.status, data}
        : {success: true, data};
    } catch (error) {
      console.log(error);
      return {success: false, data: error};
    }
  };
  zaloPayment = async body => {
    try {
      const {data} = await HttpClient.post(UrlApi.zaloPayment, body);
      console.log('zalo payment data:::', data);
      return {success: true, data};
    } catch (error) {
      // console.log('ZALO ERRORLL', error);
      return {
        success: false,
        error: error.toString(),
      };
    }
  };
  queryZalopay = async body => {
    try {
      const {data} = await HttpClient.post(UrlApi.queryZalopay, body);
      console.log('QUERY DATA:::', data);
      return data
        ? {
            success: true,
            data: data,
          }
        : {
            success: false,
            message: data,
          };
    } catch (error) {
      console.log('QUERY ERROR ZALOPAY:::', error);
      const {response} = error.data;
      return {
        success: false,
        message: response.message || 'ERROR',
      };
    }
  };
}

export default new OrderController();
