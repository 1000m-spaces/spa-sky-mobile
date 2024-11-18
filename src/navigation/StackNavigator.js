import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  NAVIGATION_LOGIN,
  NAVIGATION_MAIN,
  NAVIGATION_PRODUCT_DETAIL,
  NAVIGATION_ACCESS_LOCATION,
  NAVIGATION_SPLASH,
  NAVIGATION_VERIFY_CODE,
  NAVIGATION_CART_DETAIL,
  NAVIGATION_CASH_IN_ONLINE,
  NAVIGATION_CASH_IN,
  NAVIGATION_STATUS_CASH_IN,
  NAVIGATION_AFFILIATE,
  NAVIGATION_ORDER_RESULT,
  NAVIGATION_WEB_PAYMENT,
  NAVIGATION_MY_VOUCHER,
  NAVIGATION_DELIVERY_ADDRESS,
  NAVIGATION_SHOP,
  NAVIGATION_PRODUCT_STORY,
} from './routes';
import * as Screens from 'components';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName={NAVIGATION_SPLASH}>
      <Stack.Screen name={NAVIGATION_MAIN} component={Screens.Main} />
      <Stack.Screen name={NAVIGATION_SHOP} component={Screens.Shop} />
      <Stack.Screen name={NAVIGATION_SPLASH} component={Screens.Splash} />
      <Stack.Screen name={NAVIGATION_LOGIN} component={Screens.Login} />
      <Stack.Screen name={NAVIGATION_AFFILIATE} component={Screens.Affiliate} />
      <Stack.Screen
        name={NAVIGATION_ACCESS_LOCATION}
        component={Screens.AccessLocation}
      />
      <Stack.Screen name={NAVIGATION_CASH_IN} component={Screens.CashIn} />
      <Stack.Screen
        name={NAVIGATION_STATUS_CASH_IN}
        component={Screens.StatusCashIn}
        path={'statusCashIn'}
      />
      <Stack.Screen
        name={NAVIGATION_VERIFY_CODE}
        component={Screens.VerifyCode}
      />
      <Stack.Screen
        name={NAVIGATION_PRODUCT_DETAIL}
        component={Screens.ProductDetail}
      />
      <Stack.Screen
        name={NAVIGATION_MY_VOUCHER}
        component={Screens.MyVoucher}
      />
      <Stack.Screen
        name={NAVIGATION_CART_DETAIL}
        component={Screens.CartDetail}
      />
      <Stack.Screen
        name={NAVIGATION_DELIVERY_ADDRESS}
        component={Screens.DeliveryAddress}
      />
      <Stack.Screen
        name={NAVIGATION_WEB_PAYMENT}
        component={Screens.WebviewPayment}
      />
      <Stack.Screen
        name={NAVIGATION_PRODUCT_STORY}
        component={Screens.ProductStory}
      />
      <Stack.Screen
        name={NAVIGATION_ORDER_RESULT}
        component={Screens.OrderStatusResult}
        path={'orderStatusResult'}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;
