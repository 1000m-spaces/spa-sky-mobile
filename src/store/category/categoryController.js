import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class CategoryController {
  getListCategory = async ({shopid, userid}) => {
    try {
      const body = {
        shopid,
        userid,
      };
      const result = await HttpClient.post(UrlApi.getListCategory, body);
      return {
        success: true,
        status: 200,
        data: result.data,
      };
    } catch (error) {
      console.error(error);
    }
  };
  getListBanner = async payload => {
    try {
      const {data} = await HttpClient.get(UrlApi.getListBanner, {
        params: payload,
      });
      return {
        success: true,
        status: 200,
        data: data || [],
      };
    } catch (error) {
      console.log(error);
    }
  };
}

export default new CategoryController();
