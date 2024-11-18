// export {Splash} from './Splash/Splash'; cách này xuất ra named export Splash trực tiếp
// từ file Splash.js nằm trong thư mục Splash
// thì bạn có thể import Splash từ đường dẫn import Splash from 'components/Splash';
// mà không cần phải chỉ định đường dẫn đầy đủ tới Splash component

import Splash from './Splash/Splash'; //xuất ra named export Splash từ module hiện tại
import Menu from './Menu/Menu';
import Account from './Account/Account';
import Main from './Main/Main';
import Home from './Home/Home';
import Shop from './Shop/Shop';
import Login from './Login/Login';
import AccountInfo from './AccountInfo/AccountInfo';
import ProductDetail from './ProductDetail/ProductDetail';
import DetailOrder from './DetailOrder/DetailOrder';
import ListVoucher from './ListVoucher/ListVoucher';
import HistoryOrder from './HistoryOrder/HistoryOrder';
import CashIn from './CashIn/CashIn';
import VerifyCode from './VerifyCode/VerifyCode';
import FreeShip from './FreeShip/FreeShip';
import SubcribeFreeship from './FreeShip/SubcribeFreeship';
import SubcribeFreeshipGoogleMap from './FreeShip/SubcribeFreeshipGoogleMap';
import AccessLocation from './AccessLocation/AccessLocation';
import CartDetail from './CartDetail/CartDetail';
// import MyFavorite from './MyFavorite/MyFavorite';
import SubcriptionShipment from './FreeShip/SubcriptionShipment';
import MyVoucher from './MyVoucher/MyVoucher';
import Review from './Review/Review';
import StatusCashIn from './StatusCashIn/StatusCashIn';
import OrderStatusResult from './OrderStatusResult/OrderStatusResult';
import Affiliate from './Affiliate/Affiliate';
import DeliveryAddress from './DeliveryAddress/DeliveryAddress';
import WebviewPayment from './WebviewPayment/WebviewPayment';
import ProductStory from './ProductStory/ProductStory';
export {
  Splash,
  Menu,
  MyVoucher,
  Account,
  OrderStatusResult,
  WebviewPayment,
  Main,
  Home,
  ProductStory,
  Shop,
  Login,
  DeliveryAddress,
  AccountInfo,
  DetailOrder,
  ListVoucher,
  ProductDetail,
  CartDetail,
  HistoryOrder,
  CashIn,
  VerifyCode,
  AccessLocation,
  SubcribeFreeship,
  SubcribeFreeshipGoogleMap,
  FreeShip,
  Review,
  SubcriptionShipment,
  StatusCashIn,
  Affiliate,
};
