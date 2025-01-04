import React, {useEffect, useRef, useState} from 'react';
import {Platform, View} from 'react-native';
import {
  backGSplash,
  GOOGLE_MAP_KEY,
  GOOGLEMAP_URL,
  heightDevice,
  logo_splash_spa,
  tra_logo,
  widthDevice,
} from 'assets/constans';
import Images from 'common/Images/Images';
import styles from './styles';
import {
  NAVIGATION_ACCESS_LOCATION,
  NAVIGATION_BASE_PROFILE,
  NAVIGATION_LOGIN,
  NAVIGATION_MAIN,
} from 'navigation/routes';
import {asyncStorage} from 'store/index';
import {checkEnableLocation} from 'utils/LocationConfig';
import {useDispatch, useSelector} from 'react-redux';
import {
  getListShop,
  getListShopShowMoney,
  setCurrentLocation,
  getProductExpired,
  // getProductMenu,
  getProducAllByShop,
  getVersion,
  getTopPurchasedProducts,
  getRecommendedProduct,
  getUpdateInstalledCodePush,
  listDeliAddres,
  selectDeliveryAction,
  checkAffiliate,
} from 'store/actions';
import {getCurrentLocation, getCurrentShop} from 'store/selectors';
import CodePush, {UpdateState} from 'react-native-code-push';
import {TextNormal, TextSemiBold} from 'common/Text/TextFont';
import * as Progress from 'react-native-progress';
import Svg from 'common/Svg/Svg';
import DeviceInfo from 'react-native-device-info';
import {CODE_PUSH_KEY, PARTNER_ID} from 'assets/config';
import strings from 'localization/Localization';
import HttpClient, {setDefaultLanguage} from 'http/HttpClient';

var timeOutt = null;

const Splash = props => {
  const dispatch = useDispatch();
  const currentLocation = useSelector(state => getCurrentLocation(state));
  const currentShop = useSelector(state => getCurrentShop(state));
  const [theFirstLogin, setFirstLogin] = useState(false);
  const currentUser = useRef({custid: -1});
  const [showDownload, setShowDownload] = useState(false);
  const [valueUpdate, setValueUpdate] = useState(0);
  const [totalValue, setTotal] = useState(1);

  const version = DeviceInfo.getVersion();
  const os = Platform.OS === 'android' ? 'android' : 'ios';

  useEffect(() => {
    // strings.setLanguage('en');
    checkUpdate();
    dispatch(getVersion(os, version, parseFloat(PARTNER_ID)));
  }, []);

  //Check update CodePush
  const checkUpdate = async () => {
    var timeOutCheckDowload = setTimeout(() => {
      setShowDownload(false);
    }, 3000);
    const deploymentKey = CODE_PUSH_KEY[Platform.OS];
    const remotePackage = await CodePush.checkForUpdate(deploymentKey);
    console.log('remotePackage CodePush:', remotePackage);
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
      ({receivedBytes, totalBytes}) => {
        // alert("byte:")
        setTotal(totalBytes ?? 1);
        setValueUpdate(receivedBytes ?? 0);
      },
    );
    console.log('remotePackage:', remotePackage);
    clearTimeout(timeOutCheckDowload);
    if (
      remotePackage == null ||
      (remotePackage && remotePackage?.isMandatory === false)
    ) {
      CodePush.disallowRestart();
      setShowDownload(false);
    } else {
      setShowDownload(true);
      CodePush.allowRestart();
    }
  };

  useEffect(() => {
    timeOutt = setTimeout(() => {
      if (currentUser?.current?.custid === -1) {
        props.navigation.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        });
      } else {
        checkAutoLogin();
      }
    }, 300000);
    return () => {
      clearTimeout(timeOutt);
      timeOutt = 0;
    };
  }, []);

  // GET LIST SHOP AFTER CURRENT LOCATION CHANGE
  useEffect(() => {
    if (currentLocation?.longitude && currentLocation?.latitude) {
      initializeShopData();
      initDeliveryAddress();
    }
  }, [currentLocation]);

  const initDeliveryAddress = async () => {
    if (!currentLocation) {
      return;
    }

    try {
      const {data} = await HttpClient.get(
        `${GOOGLEMAP_URL}${currentLocation.latitude},${currentLocation.longitude}&key=${GOOGLE_MAP_KEY}`,
      );
      if (data && data.status === 'OK') {
        const firstAddress =
          data.results && data.results.length > 0 ? data.results[0] : -1;
        dispatch(
          selectDeliveryAction({
            lng: currentLocation.longitude || 0,
            lat: currentLocation.latitude || 0,
            address: firstAddress?.formatted_address || '',
            recipient_name: 'Giao đến tôi',
            recipient_phone: currentUser.current.custphone || '',
            to_my_location: true,
          }),
        );
      }
    } catch (error) {
      console.log('data address:::error::', error);
    }
  };

  const initializeShopData = async () => {
    if (currentLocation?.longitude && currentLocation?.latitude) {
      const firstLogin = await asyncStorage.getTheFirstLogin();
      const bodyListShop = {
        lat: currentLocation?.latitude,
        long: currentLocation?.longitude,
        custid: firstLogin
          ? 0
          : currentUser?.current?.custid
          ? currentUser?.current?.custid
          : 0,
      };
      dispatch(getListShop(bodyListShop));
      dispatch(getListShopShowMoney(bodyListShop));
      dispatch(listDeliAddres({user_id: currentUser?.current?.custid}));
    }
  };

  useEffect(() => {
    if (currentShop && currentShop?.restid && showDownload === false) {
      initListProductMenu();
    }
    // call info affiliate
    if (currentUser?.current?.custid !== -1) {
      dispatch(checkAffiliate(currentUser?.current?.custid));
    }
  }, [currentShop, showDownload]);
  // GET EXPIRE PRODUCT AFTER CURRENT SHOP CHANGE

  const initListProductMenu = async () => {
    const language = currentUser?.current?.language
      ? currentUser.current?.language
      : 'vi';
    strings.setLanguage(language);
    setDefaultLanguage(language);
    if (
      currentUser?.current?.custid !== -1 &&
      currentShop &&
      currentShop?.restid &&
      theFirstLogin !== true
    ) {
      dispatch(getProductExpired(currentShop?.restid));
      dispatch(
        getTopPurchasedProducts({
          userId: parseInt(currentUser.current.custid, 10),
          branchId: parseInt(currentShop.restid, 10),
        }),
      );
    }
    dispatch(
      getProducAllByShop({
        custid:
          theFirstLogin !== true && currentUser?.current?.custid !== -1
            ? currentUser?.current?.custid
            : 0,
        restid: currentShop?.restid,
        categoryid: null,
      }),
    );
    checkIndexRecommend();
    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        // routes: [
        //   {
        //     name:
        //       currentUser?.current?.custid === -1
        //         ? NAVIGATION_LOGIN
        //         : NAVIGATION_MAIN,
        //   },
        // ],
        routes: [{name: NAVIGATION_MAIN}],
      });
    }, 800);
  };

  const checkIndexRecommend = async () => {
    const storedRecommend = await asyncStorage.getListRecommned();
    // if (
    //   storedRecommend &&
    //   storedRecommend?.list1 &&
    //   storedRecommend?.list2 &&
    //   (storedRecommend?.index_recommend === storedRecommend?.list1.length ||
    //     storedRecommend?.index_recommend === storedRecommend?.list2.length)
    // ) {
    //   fetchRecommendProduct();
    // }
    if (storedRecommend) {
      const {list1, created_at, index_recommend} = storedRecommend;
      // CHECK IS OVER ONE DAY
      // console.log('index_recommend', index_recommend, list1);
      // if (
      //   Math.round(
      //     (new Date().getTime() - new Date(created_at).getTime()) / 60000,
      //   ) >=
      //   24 * 60
      // ) {
      //   fetchRecommendProduct();
      // } else {

      if (list1) {
        fetchRecommendProduct(index_recommend, list1.length);
        await asyncStorage.setListRecommned({
          ...storedRecommend,
          // index_recommend:
          //   index_recommend < list1.length ? index_recommend + 1 : 1,
          index_recommend: index_recommend ? index_recommend + 1 : 1,
        });
      }
      // }
    } else {
      fetchRecommendProduct(0, 0);
    }
  };

  const fetchRecommendProduct = (index, length) => {
    if (
      currentUser?.current?.custid !== -1 &&
      currentShop &&
      currentShop?.restid
    ) {
      dispatch(
        getRecommendedProduct({
          userId: parseInt(currentUser.current.custid, 10),
          branchId: parseInt(currentShop.restid, 10),
          current: index,
          length: length,
        }),
      );
    }
  };

  // CHECK USER AND SET LOCATION OF USER
  const checkAutoLogin = async () => {
    const user = await asyncStorage.getUser();
    const firstLogin = await asyncStorage.getTheFirstLogin();
    setFirstLogin(firstLogin);
    setTimeout(() => {
      if (user || firstLogin) {
        currentUser.current = user ? user : {custid: -1};
        checkEnableLocation(loc => {
          if (loc != null && loc !== 'Denied') {
            dispatch(setCurrentLocation(loc));
            // if (theFirstLogin) {
            //   props.navigation.reset({
            //     index: 0,
            //     routes: [{name: NAVIGATION_ACCESS_LOCATION}],
            //   });
            // }
          } else {
            // checkIndexRecommend();
            props.navigation.reset({
              index: 0,
              routes: [{name: NAVIGATION_ACCESS_LOCATION}],
            });
          }
        });
        // setAutoLogin(true);
      } else {
        // checkIndexRecommend();
        // console.log('PASS TO LOGIN RIGHT NOW');
        props.navigation.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        });
      }
    }, 300);
  };
  useEffect(() => {
    // console.log('showDownload:', showDownload);
    if (showDownload === false) {
      // console.log('COME TO CALL CHECK LOCA', currentLocation);
      checkAutoLogin();
    }
  }, [showDownload]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      // Xử lý khi sự kiện beforeRemove xảy ra(vì khi chuyển màn hình thì mình đã reset router, nên đã xóa Splash ra khỏi stack)
      // Nếu chỉ navigate chuyển màn, mà trong stack vẫn còn Splash thì lúc đó chỉ là mất tập trung => dùng sự kiện blur thay vì beforeRemove
      console.log('Screen1 is unmounting');
      clearTimeout(timeOutt);
    });

    // Trả về một hàm để hủy bỏ trình nghe khi màn hình bị unmount
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={styles.container}>
      {!showDownload ? (
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#FEFBD2',
            }}>
            {/* <Svg name={'banner_splash'} size={100} style={{backgroundColor: 'red', position: 'absolute', top: 0, left: widthDevice / 2}} /> */}
            <Images
              source={logo_splash_spa}
              resizeMode={'contain'}
              style={{width: 228, height: 150}}
            />
          </View>
        </View>
      ) : (
        <View style={styles.containerUpdate}>
          <View style={styles.containerUpdate}>
            <Images source={tra_logo} style={{height: 120, width: 120}} />
            <TextSemiBold style={{marginTop: 20}}>
              {'Đang cập nhật hệ thống'}
            </TextSemiBold>
          </View>
          <View
            style={[styles.containerUpdate, {justifyContent: 'flex-start'}]}>
            <Progress.Bar
              progress={valueUpdate / totalValue}
              width={widthDevice - 35}
              height={10}
            />
            <TextNormal
              // eslint-disable-next-line react-native/no-inline-styles
              style={{
                marginTop: 10,
                fontSize: 18,
                color:
                  (valueUpdate * 100) / totalValue <= 20
                    ? 'red'
                    : (valueUpdate * 100) / totalValue <= 40
                    ? '#FF9900'
                    : (valueUpdate * 100) / totalValue <= 60
                    ? '#00FF00'
                    : (valueUpdate * 100) / totalValue <= 80
                    ? '#33CCCC'
                    : '#00CCFF',
              }}>
              {((valueUpdate * 100) / totalValue).toFixed(0)}%
            </TextNormal>
            <TextNormal style={{fontSize: 18, marginTop: 20}}>
              Xin vui lòng đợi trong giây lát
            </TextNormal>
          </View>
        </View>
      )}
    </View>
  );
};
export default Splash;
