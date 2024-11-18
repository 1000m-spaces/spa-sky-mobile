import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Keyboard,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';
import MapView from 'react-native-maps';
import ShopItem from './ShopItem';
import Icons from 'common/Icons/Icons';
import Colors from 'theme/Colors';
import {asyncStorage} from 'store/index';
import {useSelector, useDispatch} from 'react-redux';
// import MyModal from 'common/MyModal/MyModal';
import {
  getCurrentShop,
  isListShopShowMoney,
  getStatusCheckShop,
  getCurrentOrder,
  getCheckPopupShopLocation,
  getStatusCreateCashinOrder,
} from 'store/selectors';
import {
  resetOrder,
  setCurrentShop,
  setCurrentLocation,
  getProductExpired,
  getTopPurchasedProducts,
  getRecommendedProduct,
  resetCheckShopLocation,
  checkPopupShopLocation,
} from 'store/actions';
import {NAVIGATION_MENU} from 'navigation/routes';
import Loading from 'common/Loading/Loading';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import Status from 'common/Status/Status';
import strings from 'localization/Localization';
const Shop = ({navigation}) => {
  const dispatch = useDispatch();
  const refInput = useRef(null);
  const refStore = useRef(null);
  const [isRegion, setRegion] = useState(null);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalDetectedtLocation, setModalDetected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [dataSearch, setDataSearch] = useState([]);
  const [hiddenMap, setHiddenMap] = useState(false);
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const [isIndexSelect, setIndexSelect] = useState(0);
  const listShops = useSelector(state => isListShopShowMoney(state));
  const currentShop = useSelector(state => getCurrentShop(state));
  const currentUser = React.useRef({custid: -1});
  const statusCheckShopLocation = useSelector(state =>
    getStatusCheckShop(state),
  );
  const isCheckPopupShopLocation = useSelector(state =>
    getCheckPopupShopLocation(state),
  );
  const statusCreateCashinOrder = useSelector(state =>
    getStatusCreateCashinOrder(state),
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    return () => {
      setModalConfirm(false);
      setLoading(false);
      setModalDetected(false);
      refStore.current = null;
    };
  }, []);
  useEffect(() => {
    if (
      statusCheckShopLocation &&
      statusCheckShopLocation?.changedLocation === true &&
      statusCheckShopLocation?.newShop
    ) {
      refStore.current = statusCheckShopLocation?.newShop
        ? statusCheckShopLocation?.newShop
        : null;
      setModalDetected(true);
    }
  }, [statusCheckShopLocation]);
  const handleAutoChangeShop = () => {
    setModalDetected(false);
    setLoading(true);
    dispatch(checkPopupShopLocation(false));
    if (
      listShops &&
      listShops.length > 0 &&
      refStore.current &&
      refStore.current?.restid !== -1
    ) {
      setRegion({
        longitude: parseFloat(refStore.current?.longitude),
        latitude: parseFloat(refStore.current?.latitude),
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      });
      dispatch(setCurrentShop(refStore.current));
      dispatch(
        setCurrentLocation({
          latitude: parseFloat(refStore.current.latitude),
          longitude: parseFloat(refStore.current.longitude),
        }),
      );
      dispatch(resetOrder());
      dispatch(resetCheckShopLocation());
    }
  };

  const onCancelModalChangeShop = () => {
    dispatch(checkPopupShopLocation(false));
    dispatch(resetCheckShopLocation());
    setModalDetected(false);
  };

  useEffect(() => {
    if (listShops && listShops.length > 0 && currentShop.restid) {
      listShops.map((item, index) => {
        if (item.restid === currentShop.restid) {
          setIndexSelect(index);
        }
      });
    }
  }, [listShops]);
  const selectNewStore = region => {
    const tempChangedStore =
      listShops.find(
        shop =>
          parseFloat(shop.latitude) === region.latitude &&
          parseFloat(shop.longitude) === region.longitude,
      ) || -1;
    if (tempChangedStore !== -1) {
      dispatch(setCurrentShop(tempChangedStore));
      dispatch(
        setCurrentLocation({
          latitude: parseFloat(tempChangedStore.latitude),
          longitude: parseFloat(tempChangedStore.longitude),
        }),
      );
      dispatch(resetOrder());
    }
  };
  const onPressSelectShop = (data, index, type) => {
    if (index === isIndexSelect) {
      let time = setTimeout(() => {
        clearTimeout(time);
        time = 0;
        navigation.pop();
      }, 50);

      return;
    }
    if (currentOrder && currentOrder.products.length > 0 && type === 1) {
      refStore.current = {
        ...data,
        index,
      };
      setModalConfirm(true);
    } else {
      if (
        parseFloat(data.longitude) === parseFloat(currentShop.longitude) &&
        parseFloat(data.latitude) === parseFloat(currentShop.latitude)
      ) {
        return;
      }
      if (currentShop?.restid !== data?.restid) {
        setLoading(true);
      }
      setTextSearch('');
      setDataSearch(null);
      const location = {
        longitude: parseFloat(data.longitude),
        latitude: parseFloat(data.latitude),
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      };
      try {
        setRegion(location);
        setIndexSelect(index);
      } catch (e) {
      } finally {
        // console.log('get to finally');
        selectNewStore(location);
      }
    }
  };

  useEffect(() => {
    if (isRegion) {
      handleShopChange();
    }
  }, [currentShop]);
  const handleShopChange = async () => {
    listShops.map((store, index) => {
      if (store.restid === currentShop.restid) {
        setIndexSelect(index);
      }
    });
    const tempUser = await asyncStorage.getUser();
    const theFirstLogin = await asyncStorage.getTheFirstLogin();
    const storedRecommend = await asyncStorage.getListRecommned();
    currentUser.current = tempUser || {custid: -1};
    if (currentShop && currentShop.restid) {
      if (currentUser.current?.custid !== -1 && theFirstLogin !== true) {
        dispatch(getProductExpired(currentShop?.restid));
        dispatch(
          getTopPurchasedProducts({
            userId: parseInt(currentUser.current.custid, 10),
            branchId: parseInt(currentShop.restid, 10),
          }),
        );
        if (storedRecommend) {
          const {list1, created_at, index_recommend} = storedRecommend;
          if (list1) {
            dispatch(
              getRecommendedProduct({
                userId: parseInt(currentUser.current.custid, 10),
                branchId: parseInt(currentShop.restid, 10),
                current: index_recommend,
                length: list1.length,
              }),
            );
            await asyncStorage.setListRecommned({
              ...storedRecommend,
              // index_recommend:
              //   index_recommend < list1.length ? index_recommend + 1 : 1,
              index_recommend: index_recommend ? index_recommend + 1 : 1,
            });
          } else {
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
      }
      // dispatch(
      //   getProducAllByShop({
      //     custid:
      //       currentUser?.current?.custid !== -1
      //         ? currentUser?.current?.custid
      //         : 0,
      //     restid: currentShop?.restid,
      //     categoryid: null,
      //   }),
      // );
      setModalConfirm(false);
      setLoading(false);
      let time = setTimeout(() => {
        clearTimeout(time);
        time = 0;
        navigation.pop();
      }, 800);
    }
  };

  // HANDLE SEARCH SHOP
  const handleSearch = query => {
    const formatQuery = query.toLowerCase();
    const filterData = listShops.filter(shop =>
      shop?.restname.toString().toLowerCase().includes(formatQuery),
    );
    if (formatQuery === '') {
      setDataSearch(null);
    } else {
      setDataSearch(filterData);
    }
  };
  const handleConfirmChange = () => {
    onPressSelectShop(refStore.current, refStore.current?.index, 2);
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const handleCloseKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderShopItem = ({item, index}) => {
    return (
      <ShopItem
        data={item}
        onPress={() => onPressSelectShop(item, index, 1)}
        index={index}
        isModal={false}
        indexSelect={isIndexSelect}
        hiddenMap={hiddenMap}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}> */}
      <View
        style={styles.container}
        onStartShouldSetResponder={() => Keyboard.dismiss()}>
        {!hiddenMap ? (
          <MapView
            style={styles.styleMap}
            initialRegion={{
              latitude: parseFloat(currentShop?.latitude),
              longitude: parseFloat(currentShop?.longitude),
              latitudeDelta: 0.0008,
              longitudeDelta: 0.0008,
            }}
            region={isRegion}
          />
        ) : null}
        <View style={styles.viewTextInput}>
          <TouchableOpacity
            onPress={() => refInput.current.focus()}
            style={styles.buttonTextInput}>
            <Icons
              color={Colors.textGrayColor}
              type={'Feather'}
              name={'search'}
              size={18}
            />
            <TextInput
              ref={refInput}
              placeholder={strings.shopScreen.placeholderInput}
              placeholderTextColor={Colors.textGrayColor}
              underlineColorAndroid="transparent"
              returnKeyLabel={strings.common.finish}
              returnKeyType={'done'}
              style={styles.styleTextInput}
              value={textSearch}
              onChangeText={text => {
                setTextSearch(text);
                handleSearch(text);
              }}
              onFocus={() => setHiddenMap(true)}
              onBlur={() => setHiddenMap(false)}
            />
          </TouchableOpacity>
          {isKeyboardVisible === true && (
            <TouchableOpacity
              onPress={handleCloseKeyboard}
              style={{
                position: 'absolute',
                right: 15,
              }}>
              <Icons
                color={'black'}
                type={'AntDesign'}
                name={'close'}
                size={25}
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={dataSearch && dataSearch.length > 0 ? dataSearch : listShops}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => `${item?.restid}`}
          keyboardShouldPersistTaps="handled"
          renderItem={renderShopItem}
        />
        <Loading isHidden={isLoading} />
        {/* <TouchableOpacity style={styles.buttonSelect} onPress={selectNewStore}>
        <TextSemiBold style={styles.textSelect}>Chọn</TextSemiBold>
      </TouchableOpacity> */}
      </View>
      {currentOrder &&
        currentOrder.products &&
        currentOrder.products.length > 0 && (
          <ConfirmationModal
            isOpen={modalConfirm}
            onCancel={() => setModalConfirm(false)}
            onConfirm={handleConfirmChange}
            textContent={strings.shopScreen.removeOrderBeforeChange}
          />
        )}
      {modalDetectedtLocation && (
        <ConfirmationModal
          isOpen={
            modalDetectedtLocation &&
            isCheckPopupShopLocation &&
            statusCreateCashinOrder !== Status.SUCCESS
          }
          onCancel={() => onCancelModalChangeShop()}
          onConfirm={handleAutoChangeShop}
          textContent={`${strings.shopScreen.detectingNotification1} "${statusCheckShopLocation?.newShop?.restname}" shop, ${strings.shopScreen.detectingNotification2}`}
        />
      )}
      {/* </KeyboardAwareScrollView> */}
    </SafeAreaView>
  );
};

export default Shop;
