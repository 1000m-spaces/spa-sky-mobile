import HttpClient from 'http/HttpClient';
import {UrlApi} from 'http/UrlApi';

class LocationController {
  getAddressAutoComplete = async (query, keyApi) => {
    try {
      const result = await HttpClient.get(
        'https://rsapi.goong.io/Place/AutoComplete',
        {
          params: {
            input: query,
            api_key: keyApi,
          },
        },
      );
      console.log('result getAddressAutoComplete:', result);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getDetailPlaceSelect = async (placeId, keyApi) => {
    try {
      const result = await HttpClient.get(
        'https://rsapi.goong.io/Place/Detail',
        {
          params: {
            place_id: placeId,
            api_key: keyApi,
          },
        },
      );
      console.log('result getAddressAutoComplete:', result);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  getDirectionLocation = async (
    locationOrigin,
    locationDestination,
    apiKey,
    vehicle,
  ) => {
    try {
      const result = await HttpClient.get('https://rsapi.goong.io/Direction', {
        params: {
          origin: locationOrigin,
          destination: locationDestination,
          vehicle: vehicle,
          api_key: apiKey,
        },
      });
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  listDeliveryAddress = async params => {
    try {
      const {data} = await HttpClient.get(UrlApi.deliveryAddress, {params});
      console.log('LIST DELI DATA:::', data);
      return {success: true, data: data ? data : []};
    } catch (error) {
      const {reponse} = error;
      console.log('LIST DELIVERY ADDRESS ERROR:::', reponse.data);
      return {success: false, data: error.toString()};
    }
  };
  createDeliveryAddress = async body => {
    try {
      const {data} = await HttpClient.post(UrlApi.deliveryAddress, body);
      console.log('CREATE DELI DATA:::', data);
      if (data) {
        return {success: true, data: data};
      }
    } catch (error) {
      console.log('CREATE DELIVERY ADDRESS ERROR:::', error);
      return {success: false, data: error.toString()};
    }
  };
  updateDeliveryAddress = async payload => {
    console.log('body:::', payload);
    try {
      const data = await HttpClient.put(
        UrlApi.deliveryAddress + `/${payload.id}`,
        payload,
      );
      console.log('SET DEFAULT SUCCESS:::', data);
      return {success: true};
    } catch (error) {
      console.log('SET DEFAULT ERROR::::', error);
      return {success: false};
    }
  };

  removeDelivery = async payload => {
    const {user_id, id} = payload;
    try {
      const {data} = await HttpClient.delete(
        `${UrlApi.deliveryAddress}/${user_id}/${id}`,
      );
      console.log('remove succ::', data);
      return {success: true};
    } catch (error) {
      console.log('remove err::', error);
      return {success: false};
    }
  };
}

export default new LocationController();
