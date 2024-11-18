import {combineReducers} from 'redux';
import authReducer from './auth/authReducer';
import productReducer from './product/productReducer';
import shopReducer from './shop/shopReducer';
import userReducer from './user/userReducer';
import categoryReducer from './category/categoryReducer';
import locationReducer from './location/locationReducer';
import orderReducer from './order/orderReducer';
import shipmentReducer from './shipment/shipmentReducer';
import cashinReducer from './cashin/cashinReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  product: productReducer,
  shop: shopReducer,
  user: userReducer,
  category: categoryReducer,
  location: locationReducer,
  order: orderReducer,
  shipment: shipmentReducer,
  cashin: cashinReducer,
});
export default rootReducer;
