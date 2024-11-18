import {PARTNER_ID} from 'assets/config';
import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';
// import moment from 'moment';

class ProductController {
  getProductExpired = async restId => {
    const result = await HttpClient.get(
      UrlApi.getProductExpired + '/' + `${restId}`,
      restId,
    );
    return result.data;
  };
  getProductMenu = async ({
    restid,
    custid,
    categoryid = 0,
    is_shipping_menu,
  }) => {
    try {
      const body = {
        categoryid,
        restid,
        custid,
        partnerid: PARTNER_ID,
        is_shipping_menu,
      };
      const {data} = await HttpClient.post(UrlApi.getProductMenu, body);
      // console.log('DATA PRODUCTS CONTROLLER:::', data);
      return {
        success: true,
        status: 200,
        products: data.data,
        categories: data.categorys,
      };
    } catch (error) {
      return {success: false, status: 400, products: [], categories: []};
    }
  };
  // getFavoriteProducts = async ({restid, cust_id, session_key}) => {
  //   const query = {
  //     restid,
  //     cust_id,
  //     session_key,
  //   };
  //   try {
  //     const {data} = await HttpClient.post(UrlApi.getFavoriteProducts, query);
  //     if (data.status === true) {
  //       return {
  //         success: true,
  //         data: data.data,
  //       };
  //     } else {
  //       return {
  //         success: false,
  //         data: [],
  //       };
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       success: false,
  //     };
  //   }
  // };
  // addFavorite = async ({rest_id, prod_id, stat = 1, cust_id, session_key}) => {
  //   const query = {
  //     rest_id,
  //     prod_id,
  //     session_key,
  //     cust_id,
  //     stat,
  //   };
  //   try {
  //     const {data} = await HttpClient.post(UrlApi.addFavoriteProduct, query);
  //     console.log('ADD Favorite PRODUCT::::', data);
  //     return data.status
  //       ? {success: true}
  //       : {success: false, error: data?.error ? data?.error : data?.message};
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       success: false,
  //     };
  //   }
  // };
  // removeFavorite = async ({rest_id, prod_id, stat, cust_id, session_key}) => {
  //   const query = {
  //     rest_id,
  //     prod_id,
  //     session_key,
  //     cust_id,
  //     stat,
  //   };
  //   try {
  //     const {data} = await HttpClient.post(UrlApi.reomveFavoriteProduct, query);
  //     console.log('REMOVE Favorite PRODUCT::::', data);
  //     return data.status ? {success: true} : {success: false};
  //   } catch (error) {
  //     console.log(error);
  //     return {
  //       success: false,
  //     };
  //   }
  // };
  getTopPurchased = async query => {
    try {
      // console.log('PARAAMMMMMMMMMM::::', query);
      // const {data} = await HttpClient.get(
      //   `https://api.neocafe.tech/v1/reports/top-purchased-products?userId=${query.userId}&fromAt=2021-01-01T00:00:00Z&toAt=2030-11-11T00:00:00Z`,
      // );
      const {data} = await HttpClient.get(UrlApi.getTopPurchasedApi, {
        params: query,
      });
      if (data) {
        console.log(data);
        return {success: true, data: data.top_product_ids};
      }
    } catch (error) {
      console.log(error);
      return {success: false};
    }
  };
  getRecommendedProducts = async query => {
    try {
      const {data} = await HttpClient.get(UrlApi.getRecommendedProductsUrl, {
        params: query,
      });
      console.log('getRecommendedProducts SUCCESS:::', data);
      return {success: true, data: data};
    } catch (error) {
      console.log('================ getRecommendedProducts ERORR:::', error);
      return {success: false};
    }
  };
}

export default new ProductController();
