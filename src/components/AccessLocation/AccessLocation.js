import {
  GOOGLE_MAP_KEY,
  GOOGLEMAP_URL,
  heightDevice,
  logo_noborder,
  widthDevice,
} from 'assets/constans';
import Images from 'common/Images/Images';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import { React, useRef, useEffect, useState } from 'react';
import { NAVIGATION_MAIN } from 'navigation/routes';
import { useDispatch, useSelector } from 'react-redux';
import {
  getListShop,
  getListShopShowMoney,
  getProductExpired,
  getRecommendedProduct,
  getTopPurchasedProducts,
  selectDeliveryAction,
  setCurrentShop,
} from 'store/actions';
import { asyncStorage } from 'store/index';
import ShopItem from 'common/ShopItem/ShopItem';
import { TextNormal, TextSemiBold } from 'common/Text/TextFont';
import { getProducAllByShop, setCurrentLocation } from 'store/actions';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  AppState,
  Platform,
} from 'react-native';
import {
  getCurrentShop,
  getCurrentLocation,
  isListShopShowMoney,
  getStatusSetLocation,
  getStatusRecommendedProduct,
} from 'store/selectors';
import MyModal from 'common/MyModal/MyModal';
// import Toast from 'react-native-simple-toast';
import { checkEnableLocation, turnOnLocation } from 'utils/LocationConfig';
import Status from 'common/Status/Status';
import ProgressScreen from 'common/Loading/ProgressScreen';
import strings from 'localization/Localization';
import HttpClient, { setDefaultLanguage } from 'http/HttpClient';
import Colors from 'theme/Colors';

const AccessLocation = ({ navigation }) => {
  const appState = useRef(AppState.currentState);
  const [showLoading, setShowLoading] = useState(false);
  const [modalShop, setModalShop] = useState(false);
  const [tempStore, setTempStore] = useState({ restid: -1 });
  const [tempIndex, setTempIndex] = useState(-1);
  const [hiddeShop, setHiddeShop] = useState(true);
  const dispatch = useDispatch();
  const [theFirstLogin, setFirstLogin] = useState(false);
  const currentUser = useRef({ custid: -1 });
  const currentShop = useSelector(state => getCurrentShop(state));
  const listShopShowMoney = useSelector(state => isListShopShowMoney(state));
  const statusSetLocation = useSelector(state => getStatusSetLocation(state));
  const currentLocation = useSelector(state => getCurrentLocation(state));
  const isStatusRecommendedProduct = useSelector(state =>
    getStatusRecommendedProduct(state),
  );

  //Check Location Ios foreground and background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        Platform.OS === 'ios'
      ) {
        checkEnableLocation(loc => {
          // console.log('location::::', loc);
          if (loc === 'Denied') {
            setHiddeShop(false);
          }
          if (loc != null && loc !== 'Denied') {
            setShowLoading(true);
            // console.log('location subcription ::::', loc);
            dispatch(setCurrentLocation(loc));
          }
        });
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    getUserLocalStorage();
    checkEnableLocation(loc => {
      if (loc === 'Denied') {
        setHiddeShop(false);
      }
      if (loc != null && loc !== 'Denied') {
        // console.log('location use effect:::', loc);
        setShowLoading(true);
        dispatch(setCurrentLocation(loc));
      } else {
        Alert.alert(
          'Spa Sky',
          'Vui lòng cung cấp quyền truy cập dịch vụ định vị để có trải nghiệm tốt hơn',
          [
            {
              text: 'OK',
              onPress: () => {
                // turnOnGPS();
              },
            },
          ],
          { cancelable: false },
        );
      }
    });
  }, []);
  const getUserLocalStorage = async () => {
    const user = await asyncStorage.getUser();
    const firstLogin = await asyncStorage.getTheFirstLogin();
    setFirstLogin(firstLogin);
    currentUser.current = user || { custid: -1 };
    // console.log('set up user: ', currentUser.current);
    const language = currentUser?.current?.language
      ? currentUser.current?.language
      : 'vi';
    strings.setLanguage(language);
    setDefaultLanguage(language);
    const bodyListShop = {
      lat: 0,
      long: 0,
      custid: theFirstLogin ? 0 : currentUser.current?.custid,
    };
    dispatch(getListShopShowMoney(bodyListShop));
  };

  useEffect(() => {
    if (isStatusRecommendedProduct === Status.SUCCESS) {
      getUserLocalStorage();
    }
  }, [isStatusRecommendedProduct]);

  const turnOnGPS = () => {
    turnOnLocation(loc => {
      if (loc != null && loc !== 'Denied') {
        setShowLoading(true);
        dispatch(setCurrentLocation(loc));
      }
      if (loc === 'Denied') {
        setHiddeShop(false);
      }
    });
  };

  // GET LIST SHOP AFTER LOCATION UPDATE
  useEffect(() => {
    // console.log('current location changed', currentLocation);
    if (
      currentLocation &&
      currentLocation?.longitude &&
      currentLocation?.latitude
    ) {
      initializeShopData();
      initDeliveryAddress();
    }
  }, [currentLocation]);
  const initDeliveryAddress = async () => {
    if (!currentLocation) {
      return;
    }

    try {
      const { data } = await HttpClient.get(
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

  const initializeShopData = () => {
    if (currentLocation?.longitude && currentLocation?.latitude) {
      const bodyListShop = {
        lat: currentLocation?.latitude,
        long: currentLocation?.longitude,
        custid: theFirstLogin
          ? 0
          : currentUser?.current?.custid
            ? currentUser?.current?.custid
            : 0,
      };
      dispatch(getListShop(bodyListShop));
    }
  };
  // const initializeShopData = async () => {
  //   const bodyListShop = {
  //     lat: currentLocation?.latitude,
  //     long: currentLocation?.longitude,
  //     custid: currentUser.current?.custid === -1 ? 0 : currentUser.current?.custid,
  //   };
  //   dispatch(getListShop(bodyListShop));
  //   dispatch(getListShopShowMoney(bodyListShop));
  // };

  useEffect(() => {
    // console.log('current shop changed', currentShop);
    if (currentShop && currentShop?.restid) {
      initListProductMenu();
    }
  }, [currentShop]);

  const initListProductMenu = async () => {
    setShowLoading(false);
    dispatch(
      getProducAllByShop({
        custid: theFirstLogin
          ? 0
          : currentUser?.current?.custid
            ? currentUser?.current?.custid
            : 0,
        restid: currentShop?.restid,
        categoryid: null,
      }),
    );
    if (!theFirstLogin) {
      dispatch(getProductExpired(currentShop?.restid));
      dispatch(
        getTopPurchasedProducts({
          userId: parseInt(currentUser?.current?.custid, 10),
          branchId: parseInt(currentShop?.restid, 10),
        }),
      );
      const storedRecommend = await asyncStorage.getListRecommned();
      if (storedRecommend) {
        const { list1, created_at, index_recommend } = storedRecommend;
        if (list1) {
          dispatch(
            getRecommendedProduct({
              userId: parseInt(currentUser.current.custid, 10),
              branchId: parseInt(currentShop.restid, 10),
              current: index_recommend - 1,
              length: list1.length,
            }),
          );
        }
      }
      if (
        !storedRecommend &&
        currentUser.current &&
        currentUser.current.custid
      ) {
        dispatch(
          getRecommendedProduct({
            userId: parseInt(currentUser.current.custid, 10),
            branchId: parseInt(currentShop.restid, 10),
            current: 0,
            length: 0,
          }),
        );
      }
    }
    navigation.reset({
      index: 0,
      routes: [{ name: NAVIGATION_MAIN }],
    });
  };
  const handleModalShop = () => {
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = 0;
      setModalShop(true);
    }, 500);
  };
  const handleSetShop = () => {
    setModalShop(false);
    if (tempStore.restid !== -1) {
      dispatch(setCurrentShop(tempStore));
    }
  };
  const onPressSelectShop = (item, index) => {
    setTempIndex(index);
    setTempStore(item);
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.imageStyle}>
        {statusSetLocation !== Status.LOADING && showLoading === false && (
          <View style={{ marginTop: heightDevice * 0.1, padding: 10 }}>
            <View
              style={{
                width: 102,
                height: 102,
                backgroundColor: 'white',
                alignSelf: 'center',
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Images
                resizeMode="contain"
                source={logo_noborder}
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                  borderRadius: 19,
                }}
              />
            </View>
            <TextSemiBold style={styles.slogan}>Shan Tuyết 1000M</TextSemiBold>
            <SeparatorLine separatorLine={styles.separatorLine} />
            <TextSemiBold style={styles.questionStyle}>
              {strings.locationScreen.question}
            </TextSemiBold>
            <TextNormal style={styles.subQuestion}>
              {strings.locationScreen.subtitle}
            </TextNormal>
            <TouchableOpacity style={styles.button} onPress={() => turnOnGPS()}>
              <TextSemiBold style={styles.buttonContent}>
                {strings.locationScreen.turnonGPS}
              </TextSemiBold>
            </TouchableOpacity>
            {!hiddeShop ? (
              <TouchableOpacity style={styles.button} onPress={handleModalShop}>
                <TextSemiBold style={styles.buttonContent}>
                  {strings.common.selectStore}
                </TextSemiBold>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        {statusSetLocation === Status.LOADING ||
          (showLoading === true && (
            <ProgressScreen />
            // <View style={styles.loadingContainer}>
            //   <ActivityIndicator color={'white'} size="large" />
            //   <TextSemiBold style={styles.textLoading}>
            //     Loading...
            //   </TextSemiBold>
            // </View>
          ))}
      </View>
      <MyModal visible={modalShop} onPressOutSide={() => console.log('ok')}>
        <View style={styles.containerModal}>
          <View style={styles.wrapperList}>
            <FlatList
              data={listShopShowMoney}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <ShopItem
                    data={item}
                    onPress={() => onPressSelectShop(item, index)}
                    index={index}
                    isModal={true}
                    indexSelect={tempIndex}
                  />
                );
              }}
            />
          </View>

          <TouchableOpacity style={styles.modalButton} onPress={handleSetShop}>
            <TextSemiBold style={styles.modalButtonText}>
              {strings.common.confirm}
            </TextSemiBold>
          </TouchableOpacity>
        </View>
      </MyModal>
    </View>
  );
};

export default AccessLocation;
const styles = StyleSheet.create({
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    height: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  containerModal: {
    paddingTop: 20,
    backgroundColor: 'whitesmoke',
    width: widthDevice - 24,
    height: heightDevice * 0.4,
    borderRadius: 10,
  },
  wrapperList: {
    maxHeight: '90%',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLoading: {
    // fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    fontSize: 19,
  },
  slogan: {
    color: 'white',
    // fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  imageStyle: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.teaColor,
  },
  separatorLine: {
    width: '80%',
    marginTop: 20,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  questionStyle: {
    color: '#F1DBB0',
    textAlign: 'center',
    // fontWeight: 'bold',
    marginTop: 20,
    fontSize: 18,
  },
  subQuestion: {
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    marginHorizontal: 25,
    lineHeight: 20,
    marginBottom: 30,
  },
  button: {
    width: widthDevice * 0.6 + 60,
    height: 60,
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: '#F1DBB0',
    borderWidth: 1,
    borderRadius: 20,
    marginVertical: 10,
  },
  buttonContent: {
    textAlign: 'center',
    color: '#F1DBB0',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
