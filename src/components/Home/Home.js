import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {View, Platform, ScrollView, AppState, Linking} from 'react-native';
import styles from './styles';

import Swipers from 'common/Swipers/Swipers';
import Header from 'common/Header/Header';
import {
  NAVIGATION_LOGIN,
  NAVIGATION_SPLASH,
  NAVIGATION_CART_DETAIL,
  NAVIGATION_ORDER_RESULT,
  NAVIGATION_PRODUCT_STORY,
} from 'navigation/routes';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import {useSelector, useDispatch} from 'react-redux';
import {
  getCurrentShop,
  statusGetShops,
  listCateWithProduct,
  statusProductAllShop,
  getCurrentLocation,
  getMessageList,
  listBannerSelector,
  // isListShopShowMoney,
  getVersionNew,
  getForceUpdate,
  getUpdate,
  isUpdateInstalledCodePush,
  getStatusCheckShop,
  getStatusRecommendedProduct,
  getStatusAffiliate,
  getErrorApplyingAffiliate,
  // isListProductAllByShop,
  getStatusCreateOrder,
  getClickLinkAffi,
  getScreenCurrent,
  deliveryAddressSelector,
  getListVoucher,
  getCurrentOrder,
} from 'store/selectors';
import {
  setCurrentProduct,
  resetGetListShop,
  getListBanner,
  getProducAllByShop,
  getMessage,
  getListShop,
  getListShopShowMoney,
  logout,
  getUpdateInstalledCodePush,
  checkShopLocation,
  checkPopupShopLocation,
  // getListHistoryOrder,
  clickNotification,
  checkAffiliate,
  resetRecommendedProduct,
  applyAffiliateV2,
  resetAffiliateV2,
  clickLinkAffiliate,
  listDeliAddres,
  setCurrentOrder,
  getListVoucherAction,
  getVersionCodePush,
} from 'store/actions';
import Status from 'common/Status/Status';
import {asyncStorage} from 'store/index';

import {heightDevice} from 'assets/constans';

import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import {CommonActions} from '@react-navigation/native';
import strings from 'localization/Localization';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PopUpVersion from './PopUpVersion/PopUpVersion';
import packageJson from '../../../package.json';
import VersionCheck from 'react-native-version-check';

import CodePush, {UpdateState} from 'react-native-code-push';
import {CODE_PUSH_KEY, PARTNER_ID} from 'assets/config';
import {checkEnableLocation} from 'utils/LocationConfig';
import {OneSignal} from 'react-native-onesignal';
import ProductList from './ProductList';
import DeviceInfo from 'react-native-device-info';
import VoucherSection from './VoucherSection';

const Home = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [currentUser, setCurrentUser] = useState({custid: -1});
  const deliveryAddress = useSelector(state => deliveryAddressSelector(state));
  const listMessage = useSelector(state => getMessageList(state));
  const myVouchers = useSelector(state => getListVoucher(state));
  const [modalNotiLink, setModalNotiLink] = useState(false);
  const [count, setCount] = useState(0);
  // const appState = useRef(AppState.currentState);
  //---------------------CHECK VERSION --------------------------------

  const [isSkip, setSkip] = useState('');
  const [modalConfirm, setModalConfirm] = useState(false);
  const currentShop = useSelector(state => getCurrentShop(state));
  const listBanners = useSelector(state => listBannerSelector(state));
  const currentLocation = useSelector(state => getCurrentLocation(state));
  const statusGetListShop = useSelector(state => statusGetShops(state));
  // const listShopsShowMoney = useSelector(state => isListShopShowMoney(state));
  const statusAffiliate = useSelector(state => getStatusAffiliate(state));
  const errorApplyingAffiliate = useSelector(state =>
    getErrorApplyingAffiliate(state),
  );
  const isClickLinkAffi = useSelector(state => getClickLinkAffi(state));

  const updateInstalledCodePush = useSelector(state =>
    isUpdateInstalledCodePush(state),
  );
  const isScreenCurrent = useSelector(state => getScreenCurrent(state));
  const [modalConfirmUpdate, setModalConfirmUpdate] = useState(false);
  // const statusGetListProduct = useSelector(state =>
  //   getStatusListProduct(state),
  // );
  const [verStore, setVerStore] = useState('');
  const [skipStore, setSkipStore] = useState('true');
  const [updateStore, setUpdateStore] = useState(false);

  const versionNew = useSelector(state => getVersionNew(state));
  const forceUpdate = useSelector(state => getForceUpdate(state));
  const isUpdate = useSelector(state => getUpdate(state));
  const versionApp = DeviceInfo.getVersion();

  useEffect(() => {
    getVersionCodepush();
  }, [updateInstalledCodePush]);

  const getVersionCodepush = async () => {
    try {
      const update = await CodePush.getUpdateMetadata(UpdateState.RUNNING);
      console.log(' CodePush getUpdateMetadata:', update);
      if (update) {
        dispatch(getVersionCodePush(update.label));
      }
    } catch (e) {
      console.log('error getUpdateMetadata:', e);
    }
  };

  const getVersionStore = async () => {
    const verCH = await VersionCheck.getLatestVersion(); // version new store
    const update = await VersionCheck.needUpdate();
    const previousVersion = await asyncStorage.getVersionChplayPrevious(); // previous version
    if (update && update.isNeeded && previousVersion != verCH) {
      setVerStore(verCH);
      setSkipStore('false');
      setUpdateStore(true);
    }
  };

  useEffect(() => {
    getVersionStore();
  }, []);
  useEffect(() => {
    if (!deliveryAddress || deliveryAddress.length === 0) {
      dispatch(listDeliAddres({user_id: currentUser?.current?.custid}));
    }
  }, [deliveryAddress]);

  const onCancelUpdateStore = async val => {
    if (val === 'true') {
      const ver = await VersionCheck.getLatestVersion();
      dispatch(getUpdateInstalledCodePush(false));
      setSkipStore(true);
      await asyncStorage.setVersionChplayPrevious(ver);
    } else {
    }
  };

  const onCancelUpdate = async () => {
    dispatch(getUpdateInstalledCodePush(false));
    setModalConfirmUpdate(false);
  };

  const statusCreateOrder = useSelector(state => getStatusCreateOrder(state));
  const categoryProducts = useSelector(state => listCateWithProduct(state));

  const isStatusRecommendedProduct = useSelector(state =>
    getStatusRecommendedProduct(state),
  );
  const statusCheckShopLocation = useSelector(state =>
    getStatusCheckShop(state),
  );

  //----------------------Pay Momo-----------------------------------------------
  // const statusCreateCashinOrder = useSelector(state =>
  //   getStatusCreateCashinOrder(state),
  // );
  //----------------------CODE PUSH------------------------------------------------

  const handleConfirmUpdate = async () => {
    setModalConfirmUpdate(false);
    dispatch(getUpdateInstalledCodePush(false));
    let time = setTimeout(() => {
      clearTimeout(time);
      time = 0;
      CodePush.allowRestart();
    }, 400);
  };
  //Check codepush focus Home
  const checkUpdate = async () => {
    const deploymentKey = CODE_PUSH_KEY[Platform.OS];
    const remotePackage = await CodePush.checkForUpdate(deploymentKey);
    if (remotePackage != null && remotePackage?.isMandatory === true) {
      navigation.navigate(NAVIGATION_SPLASH);
    }
    CodePush.sync(
      {
        installMode: CodePush.InstallMode.IMMEDIATE,
        mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
        deploymentKey,
        // updateDialog: true-
      },
      status => {
        switch (status) {
          case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
            break;
          case CodePush.SyncStatus.INSTALLING_UPDATE:
            break;
          case CodePush.SyncStatus.UPDATE_INSTALLED:
            dispatch(getUpdateInstalledCodePush(true));
            break;
        }
      },
    );
  };

  useEffect(() => {
    if (
      updateInstalledCodePush == true &&
      isScreenCurrent != NAVIGATION_CART_DETAIL &&
      isScreenCurrent != NAVIGATION_ORDER_RESULT
    ) {
      setModalConfirmUpdate(true);
    }
  }, [updateInstalledCodePush, isScreenCurrent]);

  useEffect(() => {
    if (
      statusCheckShopLocation &&
      statusCheckShopLocation?.changedLocation === true &&
      // statusCreateCashinOrder !== Status.SUCCESS &&
      statusCreateOrder === Status.DEFAULT
    ) {
      return;
      // navigation.navigate(NAVIGATION_SHOP);
    }
  }, [statusCheckShopLocation]);
  //Check code push foreground and background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkUpdate();
      }
      appState.current = nextAppState;
      if (
        appState.current === 'active' &&
        currentUser.custid !== -1 &&
        // statusCreateCashinOrder !== Status.SUCCESS &&
        statusCreateOrder === Status.DEFAULT
      ) {
        checkEnableLocation(location => {
          if (location && location !== 'Denied') {
            checkChangeLocation(location);
          }
        });
      }
    });
    return () => {
      subscription?.remove();
    };
  }, []);
  const checkChangeLocation = location => {
    if (
      // statusCreateCashinOrder !== Status.DEFAULT ||
      statusCreateOrder !== Status.DEFAULT
    ) {
      return;
    }
    const query = {
      custid: currentUser?.custid,
      lat: location?.latitude,
      long: location?.longitude,
      partnerid: PARTNER_ID,
    };
    dispatch(checkShopLocation(query));
    dispatch(checkPopupShopLocation(true));
  };

  // HANDLE CALL API GET PRODUCT  BY CATEGORY ID
  const fetchProductAllShop = async isShip => {
    const theFirstLogin = await asyncStorage.getTheFirstLogin();
    var body = {
      categoryid: null,
      custid: theFirstLogin ? 0 : currentUser.custid,
      restid: currentShop.restid,
      is_shipping_menu: isShip ? 1 : 0,
    };
    dispatch(getProducAllByShop(body));
  };

  //------------------------ONESIGNAL----------------------------------------------------
  useEffect(() => {
    OneSignal.Notifications.addEventListener('click', event => {
      var idMessage = '';
      if (event?.notification?.additionalData?.default) {
        idMessage =
          JSON.parse(event?.notification?.additionalData?.default)?.msg_id ||
          '';
      }
      dispatch(clickNotification(true, idMessage));
    });
  }, []);

  useEffect(() => {
    if (count > 0) {
      sendOneSignal();
    }
  }, [count]);

  const sendOneSignal = async () => {
    const tempUser = await asyncStorage.getUser();
    if (tempUser == null || !tempUser.custid) {
      return;
    }
    console.log('USERRRR NOTIIII:', tempUser?.custid, typeof tempUser?.custid);
    OneSignal.login(tempUser?.custid);

    let dataOneSignal = {
      cid: tempUser?.custid,
      name: tempUser?.custname,
    };
    OneSignal.User.addTags(dataOneSignal);
  };
  const skipForceUpdate = async () => {
    const a = await asyncStorage.getSkipForceUpdate();
    setSkip(a);
  };
  const initVoucher = () => {
    const body = {
      user_id: `${currentUser.custid}`,
      used_for: 1,
      status: 'assigned',
      amount: 1000,
      screen: 1,
      quantity_items: 100,
      merchant_id: parseFloat(currentShop.shopownerid),
      branch_id: parseFloat(currentShop.restid),
      brand_id: parseFloat(PARTNER_ID),
      unexpired: false,
    };
    dispatch(getListVoucherAction(body));
  };
  useLayoutEffect(() => {
    initUser();

    skipForceUpdate();
    fetchListBanner();

    let timeout = setTimeout(() => {
      setCount(prev => (prev += 1));
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const onPressEvent = ski => {
    asyncStorage.setSkipForceUpdate(ski);
    if (ski === 'true') {
      setSkip(true);
    }
  };
  //---------------------------DeepLink-----------------------------
  // const handleInitialDeepLink = async () => {
  //   // Lấy URL deep link ban đầu
  //   const initialUrl = await Linking.getInitialURL();
  //   if (initialUrl) {
  //     // Nếu có URL deep link ban đầu, xử lý nó
  //     if (initialUrl && initialUrl.includes('neocafe://app/statusCashIn')) {
  //       navigation.navigate(NAVIGATION_STATUS_CASH_IN, {
  //         urlCallbackDeeplinkMomo: initialUrl,
  //       });
  //     }
  //     if (
  //       initialUrl &&
  //       initialUrl.includes('neocafe://app?refId') &&
  //       isClickLinkAffi !== true
  //     ) {
  //       dispatch(clickLinkAffiliate(true));
  //       var slicedString = initialUrl.substring(initialUrl.indexOf('20') + 2);
  //       if (!currentUser?.custphone) {
  //         setModalNotiLink(true);
  //       } else if (typeof slicedString === 'string') {
  //         const query = {
  //           code: '+' + slicedString,
  //           userId: currentUser?.custid,
  //           userPhone: currentUser?.custphone,
  //         };
  //         dispatch(applyAffiliateV2(query));
  //         // Thực hiện các hành động cần thiết với URL deep link
  //         // Ví dụ: điều hướng đến màn hình tương ứng với URL deep link
  //       }
  //     }
  //   }
  // };

  // const handleDeepLink = event => {
  //   // Kiểm tra nếu event.url không rỗng (null)
  //   if (
  //     event.url &&
  //     event.url.includes('neocafe://app?refId') &&
  //     isClickLinkAffi !== true
  //   ) {
  //     dispatch(clickLinkAffiliate(true));
  //     var slicedString = event.url.substring(event.url.indexOf('20') + 2);

  //     if (!currentUser?.custphone) {
  //       setModalNotiLink(true);
  //     } else if (typeof slicedString === 'string' && currentUser?.custid) {
  //       const query = {
  //         code: '+' + slicedString,
  //         userId: currentUser?.custid,
  //         userPhone: currentUser?.custphone,
  //       };
  //       dispatch(applyAffiliateV2(query));
  //       // Thực hiện các hành động cần thiết với URL deep link
  //       // Ví dụ: điều hướng đến màn hình tương ứng với URL deep link
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Đăng ký sự kiện khi ứng dụng được khởi chạy
  //   const unsubscribeLink = Linking.addEventListener('url', handleDeepLink);
  //   const unsubscribe = navigation.addListener('beforeRemove', () => {
  //     // Xử lý khi sự kiện beforeRemove xảy ra(vì khi chuyển màn hình thì mình đã reset router, nên đã xóa Splash ra khỏi stack)
  //     // Nếu chỉ navigate chuyển màn, mà trong stack vẫn còn Splash thì lúc đó chỉ là mất tập trung => dùng sự kiện blur thay vì beforeRemove
  //     unsubscribeLink.remove();
  //   });

  //   // Trả về một hàm để hủy bỏ trình nghe khi màn hình bị unmount
  //   return unsubscribe;
  // }, [navigation]);

  useEffect(() => {
    if (
      isStatusRecommendedProduct === Status.ERROR ||
      isStatusRecommendedProduct === Status.SUCCESS
    ) {
      dispatch(resetRecommendedProduct());
      if (!categoryProducts || !categoryProducts.products) {
        fetchProductAllShop();
      }
    }
  }, [isStatusRecommendedProduct]);

  //---------------------------BANER----------------------------------------
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    setCurrentUser(tempUser ? tempUser : {custid: -1});
    if (!currentShop) {
      getListShops();
    }
    // dispatch(checkAffiliate(tempUser?.custid));
  };
  useEffect(() => {
    if (statusGetListShop === Status.SUCCESS) {
      dispatch(resetGetListShop());
    }
  }, []);

  useEffect(() => {
    if (currentShop && currentShop?.restid && currentUser.custid !== -1) {
      // fetchProductAllShop();
      updateListMessage();
      // dispatch(checkAffiliate(currentUser?.custid));
    }
  }, [currentShop]);

  const updateListMessage = () => {
    const body = {
      custid: currentUser?.custid,
      sesskey: currentUser?.session_key,
      typemsg: 0,
      typeget: 'ALL',
      partnerid: PARTNER_ID,
    };
    dispatch(getMessage(body));
  };

  const fetchListBanner = async () => {
    dispatch(getListBanner({partner_id: PARTNER_ID}));
  };
  useEffect(() => {
    if (currentUser && currentUser.custid !== -1) {
      initVoucher();
      // handleInitialDeepLink();
    }
  }, [currentUser]);

  const clickDetailProduct = async item => {
    if (currentUser.custid === -1) {
      setModalConfirm(true);
      return;
    }
    dispatch(setCurrentProduct(item));
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = 0;
      navigation.navigate(NAVIGATION_PRODUCT_STORY);
    }, 10);
  };
  // CHECK STATUS OF LISTING CATEGORY AND SHOP
  // ONLY CALL FUNCTION WHEN STATUS WENT WRONG
  const getListShops = () => {
    if (currentUser && currentUser?.custid !== -1) {
      const bodyListShop = {
        lat: currentLocation.latitude,
        long: currentLocation.longitude,
        custid: currentUser?.custid,
      };
      dispatch(getListShop(bodyListShop));
      dispatch(getListShopShowMoney(bodyListShop));
    }
  };

  //BACK TO THE LOGIN SCREEN FOR THE FIRST LOG IN
  const handleConfirmChange = () => {
    setModalConfirm(false);
    setModalNotiLink(false);
    dispatch(logout());
    let time = setTimeout(() => {
      clearTimeout(time);
      time = 0;
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
    }, 50);
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <Header
        listMessage={listMessage}
        navigation={navigation}
        currentUser={currentUser}
        content={currentUser.custname || ''}
        updateListMessage={updateListMessage}
      />
      <View
        style={[
          styles.content,
          {
            marginTop:
              Platform.OS === 'android'
                ? -heightDevice * 0.1 - insets.top
                : -heightDevice * 0.068 - insets.top,
          },
        ]}>
        <View style={styles.contentSwiper}>
          {/* <Swipers data={listBanners} /> */}
          <Swipers data={listBanners ? listBanners : []} />
        </View>
        <VoucherSection {...{navigation}} />
        <TextNormalSemiBold style={styles.textCategory}>
          {strings.homeScreen.homeStoryTitle.toUpperCase()}
        </TextNormalSemiBold>
        <ProductList
          categoryProducts={categoryProducts}
          clickDetailProduct={val => clickDetailProduct(val)}
        />
        <ConfirmationModal
          isOpen={modalConfirm}
          onCancel={() => setModalConfirm(false)}
          onConfirm={() => handleConfirmChange()}
          textContent={strings.common.loginNotification}
        />
        {/* <PopUpVersion
          isSkip={isSkip}
          isUpdate={isUpdate}
          forceUpdate={forceUpdate}
          versionNew={versionNew}
          versionApp={versionApp}
          onPressEvent={onPressEvent}
        />
        <PopUpVersion
          isSkip={skipStore}
          isUpdate={updateStore}
          forceUpdate={false}
          versionNew={verStore}
          versionApp={versionApp}
          onPressEvent={onCancelUpdateStore}
        /> */}
        <ConfirmationModal
          isOpen={
            updateInstalledCodePush && modalConfirmUpdate && updateStore != true
          }
          onCancel={() => onCancelUpdate()}
          onConfirm={() => handleConfirmUpdate()}
          textContent={strings.common.updateNotification}
        />
        <ConfirmationModal
          isOpen={modalNotiLink}
          onCancel={() => setModalNotiLink(false)}
          onConfirm={() => handleConfirmChange()}
          textContent={
            'Bạn cần phải đăng nhập và ấn lại vào đường link để được liên kết'
          }
        />
        <ConfirmationModal
          isOpen={
            statusAffiliate === Status.SUCCESS ||
            statusAffiliate === Status.ERROR
          }
          onCancel={() => dispatch(resetAffiliateV2())}
          isWarning={true}
          textContent={
            statusAffiliate === Status.SUCCESS
              ? 'Liên kết thành công'
              : 'Có lỗi xảy ra: ' + errorApplyingAffiliate
          }
        />
      </View>
    </ScrollView>
  );
};

export default Home;
