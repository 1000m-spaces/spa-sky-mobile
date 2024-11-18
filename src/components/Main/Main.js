/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as Screens from 'components';
import {
  NAVIGATION_ACCOUNT,
  NAVIGATION_ACCOUNT_INFO,
  NAVIGATION_ACCOUNT_ORDER_HISTORY,
  NAVIGATION_DETAIL_ORDER,
  NAVIGATION_HOME,
  NAVIGATION_E_VOUCHER,
  NAVIGATION_SUBCRIBE_FREESHIP,
  NAVIGATION_MENU,
  NAVIGATION_FREE_SHIP,
  NAVIGATION_MY_VOUCHER,
  NAVIGATION_SUBCRIBE_FREESHIP_GOOGLE_MAP,
  NAVIGATION_SUBCRIPTION_SHIPMENT,
  NAVIGATION_DETAIL_TRANSACTION,
} from 'navigation/routes';
import {Platform, View} from 'react-native';
import Colors from 'theme/Colors';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Svg from 'common/Svg/Svg';
import {TextSmallEleven} from 'common/Text/TextFont';
import {widthDevice} from 'assets/constans';
import strings from 'localization/Localization';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const StackAccount = () => {
  return (
    <Stack.Navigator
      screenOptions={{header: () => null}}
      initialRouteName={NAVIGATION_ACCOUNT}>
      <Stack.Screen name={NAVIGATION_ACCOUNT} component={Screens.Account} />
      <Stack.Screen
        name={NAVIGATION_ACCOUNT_INFO}
        component={Screens.AccountInfo}
      />
      {/* <Stack.Screen name={NAVIGATION_CASH_IN} component={Screens.CashIn} /> */}
      <Stack.Screen
        name={NAVIGATION_ACCOUNT_ORDER_HISTORY}
        component={Screens && Screens.HistoryOrder ? Screens.HistoryOrder : ''}
      />
      <Stack.Screen
        name={NAVIGATION_DETAIL_ORDER}
        component={Screens && Screens.DetailOrder ? Screens.DetailOrder : ''}
      />
      <Stack.Screen
        name={NAVIGATION_E_VOUCHER}
        component={Screens && Screens.ListVoucher ? Screens.ListVoucher : ''}
      />
      <Stack.Screen
        name={NAVIGATION_FREE_SHIP}
        component={Screens && Screens.FreeShip ? Screens.FreeShip : ''}
      />
      <Stack.Screen
        name={NAVIGATION_SUBCRIBE_FREESHIP}
        component={
          Screens && Screens.SubcribeFreeship ? Screens.SubcribeFreeship : ''
        }
      />
      <Stack.Screen
        name={NAVIGATION_SUBCRIPTION_SHIPMENT}
        component={
          Screens && Screens.SubcriptionShipment
            ? Screens.SubcriptionShipment
            : ''
        }
      />
      <Stack.Screen
        name={NAVIGATION_SUBCRIBE_FREESHIP_GOOGLE_MAP}
        component={
          Screens && Screens.SubcribeFreeshipGoogleMap
            ? Screens.SubcribeFreeshipGoogleMap
            : ''
        }
      />
      <Stack.Screen
        name={NAVIGATION_DETAIL_TRANSACTION}
        component={
          Screens && Screens.DetailTransaction ? Screens.DetailTransaction : ''
        }
      />
    </Stack.Navigator>
  );
};

// icon_giohang1
const Main = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName={NAVIGATION_HOME}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({color, size, focused}) => {
          const icons = {
            [NAVIGATION_HOME]: 'icon_svg_home',
            [NAVIGATION_MENU]: 'icon_svg_menu',
            [NAVIGATION_MY_VOUCHER]: 'icon_gift',
            [NAVIGATION_ACCOUNT]: 'icon_svg_account',
          };
          const title = router => {
            switch (router) {
              case NAVIGATION_HOME:
                return strings.common.home;
              case NAVIGATION_MENU:
                return 'Menu';
              case NAVIGATION_MY_VOUCHER:
                return strings.common.gift;
              case NAVIGATION_ACCOUNT:
                return strings.common.user;
              default:
            }
          };
          return (
            <View
              style={{
                alignItems: 'center',
                width: widthDevice / 5,
              }}>
              <Svg
                name={icons[route.name]}
                size={35}
                color={focused ? Colors.buttonTextColor : Colors.textGrayColor}
                style={{marginTop: 10}}
              />
              <TextSmallEleven
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  fontSize: 11,
                  fontWeight:
                    Platform.OS === 'ios'
                      ? focused
                        ? 'bold'
                        : 'normal'
                      : 'normal',
                  fontFamily: focused
                    ? 'SVN-Poppins-SemiBold'
                    : 'SVN-Poppins-Regular',
                  marginBottom: insets.bottom > 0 ? 0 : 13,
                  color: focused
                    ? Colors.buttonTextColor
                    : Colors.textGrayColor,
                }}>
                {title(route.name)}
              </TextSmallEleven>
            </View>
          );
        },
        tabBarActiveTintColor: Colors.buttonTextColor,
        tabBarInactiveTintColor: Colors.textGrayColor,
        headerShown: false,
        tabBarStyle: {height: 75 + insets.bottom / 2},
      })}>
      <Tab.Screen
        name={NAVIGATION_HOME}
        component={Screens.Home}
        options={{title: () => null}}
      />
      <Tab.Screen
        name={NAVIGATION_MENU}
        component={Screens.Menu}
        options={{title: () => null}}
      />
      <Tab.Screen
        name={NAVIGATION_MY_VOUCHER}
        component={Screens.MyVoucher}
        options={{title: () => null}}
      />
      <Tab.Screen
        name={NAVIGATION_ACCOUNT}
        component={StackAccount}
        options={{title: () => null}}
      />
    </Tab.Navigator>
  );
};

export default Main;
