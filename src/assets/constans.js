import {Dimensions, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const heightDevice = Dimensions.get('window').height;
export const widthDevice = Dimensions.get('window').width;
export const versionSystem = DeviceInfo.getSystemVersion();
export const versionNameApp = DeviceInfo.getVersion();
export const deviceId = DeviceInfo.getUniqueId();
export const FROZEN_WARNING =
  'Tài khoản của quý khách đang tạm thời bị đóng băng do hết hạn sử dụng.Vui lòng nạp thêm để kích hoạt tài khoản hoặc liên hệ nhân viên để đuợc hỗ trợ';
export const isAndroid = Platform.OS === 'ios' ? false : true;
// export const KEY_ONE_SIGNAL = 'fd4523fb-4fe3-41f9-8846-7099b77b154f';
export const KEY_GOONG_API = 'VphPkfidhRekSJM2Ff9TPIZSFtwDtgIWoXJ0wHUN';
// export const GOOGLE_MAP_KEY = 'AIzaSyAAO8W-KytYgmE4BzIXP_dLGZ7ABdO2z54';
export const GOOGLE_MAP_KEY = 'AIzaSyDy_5NNS-DwcZkcIYMar-wcspaL9fWJbQ0';
export const MIDDLE_DOT = '\u25CF';
export const voucher_bg = require('assets/images/voucher_bg.png');
export const IMAGE_URL = 'https://helio.assets.ciaolink.net';
export const logo_splash_spa = require('./images/logo_splash_spa.jpg');

export const logo_noborder = require('assets/logo/logo_noborder.png');
export const image_error = require('assets/images/image_error.jpg');
export const bg_splash = require('assets/background/bg_splash.png');
// export const bg_qrpay = require('assets/background/bg_qrpay.png');
export const slogan = require('assets/logo/slogan.png');
export const icon_home = require('assets/icons/icon_home.png');
export const icon_menu = require('assets/icons/icon_menu.png');
export const icon_shop = require('assets/icons/icon_shop.png');
export const icon_account = require('assets/icons/icon_account.png');
export const product_image = require('assets/images/product_image.png');
export const icon_bell = require('assets/icons/icon_bell.png');
export const icon_vietnam = require('assets/icons/icon_vietnam.png');
export const icon_english = require('assets/icons/icon_english.png');
export const icon_location = require('assets/icons/icon_location.png');
export const icon_cart = require('assets/icons/icon_cart.png');
export const icon_clock = require('assets/icons/icon_clock.png');
// export const icon_favourite = require('assets/icons/icon_favourite.png');
export const icon_heart = require('assets/icons/icon_heart.png');
// export const icon_tea = require('assets/icons/icon_tea.png');
// export const icon_cafe = require('assets/icons/icon_cafe.png');
// export const icon_cafe_decaf = require('assets/icons/icon_cafe_decaf.png');
// export const icon_fruit = require('assets/icons/icon_fruit.png');

export const icon_translate = require('assets/icons/icon_translate.png');
export const icon_edit = require('assets/icons/icon_edit.png');
export const campaign_bg = require('assets/images/campaign_bg.png');
export const icon_camera = require('assets/icons/icon_camera.png');
export const icon_dieukhoan = require('assets/icons/icon_dieukhoan.png');
export const icon_support = require('assets/icons/icon_support.png');
export const icon_logout = require('assets/icons/icon_logout.png');
export const icon_history = require('assets/icons/icon_history.png');
export const icon_voucher = require('assets/icons/icon_voucher.png');
export const icon_gioithieu = require('assets/icons/icon_gioithieu.png');
export const icon_vantay = require('assets/icons/icon_vantay.png');
export const icon_gioitinh = require('assets/icons/icon_gioitinh.png');
export const icon_mail = require('assets/icons/icon_mail.png');
export const icon_acc = require('assets/icons/icon_acc.png');
export const icon_phone = require('assets/icons/icon_phone.png');
// export const icon_wallet = require('assets/icons/icon_wallet.png');
export const detail_product = require('assets/images/detail_product.png');
export const neocafe_logo = require('assets/images/neocafe-logo.png');
export const tra_logo = require('assets/images/tra_logo.jpg');
export const smart_phone = require('assets/icons/smart_phone.png');
export const dot_message = require('assets/icons/icon_dot.png');
export const background = require('assets/images/background.png');
export const icon_fire = require('assets/icons/icon_fire.png');
export const payment_success = require('assets/icons/payment_success.png');
export const payment_error = require('assets/icons/icon_error.png');
// export const banner1 = require('assets/banner/banner1.png');
// export const banner2 = require('assets/banner/banner2.png');
// export const banner3 = require('assets/banner/banner3.png');
// export const banner4 = require('assets/banner/banner4.png');
// export const banner5 = require('assets/banner/banner5.png');
// export const banner6 = require('assets/banner/banner6.png');
// export const banner7 = require('assets/banner/banner7.jpg');
// export const banner8 = require('assets/banner/banner8.jpg');
// export const banner10 = require('assets/banner/banner10.jpg');
// export const banner11 = require('assets/banner/banner11.jpg');
// export const banner12 = require('assets/banner/banner12.jpg');
// export const banner13 = require('assets/banner/banner13.jpg');
// export const banner14 = require('assets/banner/banner14.jpg');
// export const order_message_bg = require('assets/images/order_message_bg.png');
export const prime1 = require('assets/images/Goi2km.png');
export const testImage = require('assets/images/3.jpg');
export const prime2 = require('assets/images/Goi12km.png');
export const vqr = require('assets/images/vqr.png');
export const voucher = require('assets/images/voucher.png');
export const star = require('assets/images/star.png');
export const backGSplash = require('assets/background/BackGSplash.png');
export function formatMoney(x) {
  return x && x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export const GOOGLEMAP_URL =
  'https://maps.googleapis.com/maps/api/geocode/json?address=';

export const initOrder = {
  voucher: null,
  takeaway: true,
  valid_delivery: false,
  applied_products: [],
  products: [], // pid, quantity price opt_id1 opt_id2 opt_id3
};
