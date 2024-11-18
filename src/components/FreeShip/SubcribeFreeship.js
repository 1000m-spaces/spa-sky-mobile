import { React, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from 'theme/Colors';
import ShopItem from 'common/ShopItem/ShopItem';
import MapView, { Marker } from 'react-native-maps';
import Titles from 'common/Titles/Titles';
import Icons from 'common/Icons/Icons';
import MyModal from 'common/MyModal/MyModal';
import {
  getCurrentShop,
  isListShopShowMoney,
  getMessageSubcribe,
  getSelectedPackage,
  getStatusSubcribe,
  isDataAutoComplete,
  getSubcribedPackage,
  isDataCurrentPlaceSelected,
  getMessagePaymentPackage,
  isDetailDirectionLocation,
  getStatusPaymentPackage,
} from 'store/selectors';
import { KEY_GOONG_API, heightDevice, widthDevice } from 'assets/constans';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import { asyncStorage } from 'store/index';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import {
  getAddressAutoComplete,
  getDetailPlaceSelect,
  getDirectionLocation,
  resetDataAutoComplete,
  resetSubcribePackage,
  subcribePackage,
  paymentPackage,
} from 'store/actions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Status from 'common/Status/Status';
import Loading from 'common/Loading/Loading';
import { NAVIGATION_ACCOUNT } from 'navigation/routes';
let typingTimeout = null;
const SubcribeFreeship = ({ navigation }) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const [showModalShop, setShowModalShop] = useState(false);
  const [isRegion, setRegion] = useState(null);
  const [shopSelected, setShopSelected] = useState(null);
  const [isIndexSelect, setIndexSelect] = useState(0);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [infoItinerary, setInfoItinerary] = useState(null);
  const [modalSubcribe, setModalSubcribe] = useState(false);
  const [hideTextAuto, setHideTextAuto] = useState(true);

  const mapRef = useRef(null);
  const selectedPackage = useSelector(state => getSelectedPackage(state));
  const statusSubcribePackage = useSelector(state => getStatusSubcribe(state));
  const messageSubcribePackage = useSelector(state =>
    getMessageSubcribe(state),
  );
  const listShopShowMoney = useSelector(state => isListShopShowMoney(state));
  const currentShop = useSelector(state => getCurrentShop(state));
  const dataAutoComplete = useSelector(state => isDataAutoComplete(state));
  const dataCurrentPlaceSelected = useSelector(state =>
    isDataCurrentPlaceSelected(state),
  );
  const detailDirectionLocation = useSelector(state =>
    isDetailDirectionLocation(state),
  );
  const currentUser = useRef({});
  const statusPaymentPackage = useSelector(state =>
    getStatusPaymentPackage(state),
  );
  const messagePaymentPackage = useSelector(state =>
    getMessagePaymentPackage(state),
  );
  const subcribedPackage = useSelector(state => getSubcribedPackage(state));

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  //---------------------- RESET DATA SEARCH LOACTION --------------------
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      //xử lý sự kiện khi màn hình trước khi bị remove
      //trường hợp này không cho vào ngăn stack vì chỉ có pop() về, mà nếu back về màn hình cũ thì sẽ xóa màn hình này ra khỏi stack => không dùng blur
      dispatch(resetDataAutoComplete());
    });

    // Trả về một hàm để hủy bỏ trình nghe khi màn hình bị unmount
    return unsubscribe;
  }, [navigation]);

  //Save data Search Loaction
  useEffect(() => {
    if (
      dataAutoComplete.predictions &&
      dataAutoComplete.predictions.length > 0
    ) {
      setResults(dataAutoComplete.predictions);
    }
  }, [dataAutoComplete]);
  useEffect(() => {
    if (currentShop && currentShop?.restid) {
      setShopSelected(currentShop);
      listShopShowMoney.map((item, index) => {
        if (item.restid === currentShop.restid) {
          setIndexSelect(index);
        }
      });
    }
  }, []);

  //---------------------------- GET INFORMATION DIRECTION ------------------------------
  useEffect(() => {
    if (
      dataCurrentPlaceSelected &&
      dataCurrentPlaceSelected?.geometry &&
      destination
    ) {
      let infoParams = {
        locationOrigin: `${dataCurrentPlaceSelected?.geometry?.location.lat},${dataCurrentPlaceSelected?.geometry?.location.lng}`,
        locationDestination: `${destination.latitude},${destination.longitude}`,
        apiKey: KEY_GOONG_API,
        vehicle: 'bike',
      };
      dispatch(getDirectionLocation(infoParams));
      moveToLocation(
        dataCurrentPlaceSelected?.geometry?.location.lat,
        dataCurrentPlaceSelected?.geometry?.location.lng,
      );
      setOrigin({
        latitude: dataCurrentPlaceSelected?.geometry?.location.lat,
        longitude: dataCurrentPlaceSelected?.geometry?.location.lng,
        name: dataCurrentPlaceSelected?.formatted_address || '',
      });
    }
  }, [dataCurrentPlaceSelected]);

  //------------------------ QUERY ADDRESS SEARCH --------------------
  const handleAutocomplete = text => {
    clearTimeout(typingTimeout);
    if (text) {
      setHideTextAuto(false);
    } else {
      setHideTextAuto(true);
    }
    setQuery(text);
    typingTimeout = setTimeout(() => {
      dispatch(getAddressAutoComplete(text, KEY_GOONG_API));
    }, 2000);
  };

  //----------------- GET INFO DETAIL PLACE SELECTED ----------------
  const handlePlaceSelect = placeId => {
    dispatch(getDetailPlaceSelect(KEY_GOONG_API, placeId));
  };

  const clearTextSearch = () => {
    setQuery('');
    setHideTextAuto(true);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemTextAuto}
      onPress={() => {
        setHideTextAuto(true);
        handlePlaceSelect(item.place_id);
        setQuery(item.description);
      }}>
      <TextNormal>{item.description}</TextNormal>
    </TouchableOpacity>
  );

  const handleShowListShop = () => {
    setShowModalShop(prev => (prev = !prev));
  };
  const onPressSelectShop = (item, index) => {
    if (dataCurrentPlaceSelected) {
      let infoParams = {
        locationOrigin: `${dataCurrentPlaceSelected?.geometry?.location.lat},${dataCurrentPlaceSelected?.geometry?.location.lng}`,
        locationDestination: `${parseFloat(item?.latitude)},${parseFloat(
          item?.longitude,
        )}`,
        apiKey: KEY_GOONG_API,
        vehicle: 'bike',
      };
      dispatch(getDirectionLocation(infoParams));
    }
    let locationSelect = {
      latitude: parseFloat(item?.latitude),
      longitude: parseFloat(item?.longitude),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setDestination(locationSelect);
    setRegion(locationSelect);
    setShopSelected(item);
    setIndexSelect(index);
  };
  const moveToLocation = (latitude, longitude) => {
    mapRef.current.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      2000,
    );
  };

  useEffect(() => {
    initUser();
    if (currentShop) {
      setShopSelected(currentShop);
      setDestination({
        latitude: currentShop.latitude,
        longitude: currentShop.longitude,
      });
    }
    return () => {
      setIsUpdated(false);
    };
  }, []);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };
  // ------------------------- HANDLE SUBCRIBE A PACKAGE ------------
  const handleSubcirePackage = () => {
    if (
      selectedPackage &&
      selectedPackage.id &&
      dataCurrentPlaceSelected?.formatted_address &&
      shopSelected
    ) {
      const query = {
        address: dataCurrentPlaceSelected?.formatted_address,
        branch_id: parseInt(shopSelected.restid, 10),
        brand_id: 100,
        lat: parseFloat(destination.latitude),
        lng: parseFloat(destination.longitude),
        merchant_id: parseInt(shopSelected?.shopownerid, 10),
        package_id: selectedPackage?.id,
        user_id: parseInt(currentUser.current?.custid, 10),
      };
      dispatch(subcribePackage(query));
      setIsUpdated(true);
    }
  };
  const handleAfterSubcribePackage = () => {
    dispatch(resetSubcribePackage());
    setModalSubcribe(false);
    navigation.pop();
  };

  // -------------------- HANDLE PAYMENT PACKAGE --------------------
  const paymentPackages = () => {
    const tempOrder = {
      products: [
        {
          pid: selectedPackage?.id,
          quantity: 1,
          price: selectedPackage?.price,
        },
      ],
      restaurant: shopSelected?.restid,
      takeaway_time: 0,
      table_order: '1',
      register_id: subcribedPackage?.register_id,
      shipping_address: dataCurrentPlaceSelected?.formatted_address,
      customer: currentUser.current?.custid,
    };
    dispatch(paymentPackage(tempOrder));
  };

  // ------------- WATCH STATUS OF PAYMENT PACKAGE ------------------------
  useEffect(() => {
    if (
      statusSubcribePackage === Status.SUCCESS &&
      isUpdated === true &&
      subcribedPackage &&
      subcribedPackage?.register_id
    ) {
      paymentPackages();
      setModalSubcribe(true);
    }
    if (statusSubcribePackage === Status.ERROR) {
      setModalSubcribe(true);
    }
  }, [statusSubcribePackage, subcribedPackage]);

  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={'Đăng ký'}
        iconBack={true}
        onPressBack={() => navigation.pop()}
      />
      <View style={styles.wrapperContainer}>
        <View style={styles.wrapperMap}>
          <MapView
            ref={mapRef}
            style={styles.styleMap}
            initialRegion={{
              latitude: parseFloat(currentShop?.latitude),
              longitude: parseFloat(currentShop?.longitude),
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
            region={isRegion}>
            {listShopShowMoney.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: parseFloat(marker?.latitude),
                    longitude: parseFloat(marker?.longitude),
                  }}
                  description={marker?.restaddr}
                  title={marker?.restname}
                />
              );
            })}
            {origin != null && (
              <Marker
                coordinate={{
                  latitude: origin?.latitude,
                  longitude: origin?.longitude,
                }}
                title={'Điểm giao hàng'}
                description={origin?.name}
              />
            )}
          </MapView>
        </View>
        <View style={styles.contentWrapper}>
          <TextNormal>Cửa hàng đăng ký:</TextNormal>
          <View style={styles.wrapperSelector}>
            <TouchableOpacity
              style={styles.buttonSelectShop}
              onPress={handleShowListShop}>
              <TextNormal style={styles.contentText}>
                {shopSelected?.restname || currentShop.restname}
              </TextNormal>
              <Icons
                type={'Ionicons'}
                name={'chevron-down'}
                size={23}
                color={'#004D40'}
              />
            </TouchableOpacity>
          </View>
        </View>
        {origin != null && query ? (
          <View style={styles.contentWrapper}>
            <TextNormal>Ship đến địa chỉ:</TextNormal>
            <TextNormalSemiBold style={styles.contentText}>
              {origin?.name}
            </TextNormalSemiBold>
          </View>
        ) : null}
        {origin != null &&
          query &&
          detailDirectionLocation &&
          detailDirectionLocation?.legs ? (
          <View style={styles.contentWrapper}>
            <TextNormal>Khoảng cách:</TextNormal>
            <TextNormalSemiBold style={styles.contentText}>
              {detailDirectionLocation?.legs[0].distance.text}
            </TextNormalSemiBold>
          </View>
        ) : null}
        <View
          style={{
            position: 'absolute',
            top: 0,
            alignItems: 'center',
          }}>
          <View style={styles.viewSearch}>
            <TextInput
              style={styles.textIn}
              placeholder="Search for places..."
              returnKeyLabel={'Hoàn Thành'}
              returnKeyType={'done'}
              placeholderTextColor={Colors.textGrayColor}
              value={query}
              onChangeText={handleAutocomplete}
            />
            <Icons
              type={'AntDesign'}
              name={'closecircle'}
              size={25}
              color={Colors.textGrayColor}
              onPress={() => clearTextSearch()}
            />
          </View>
          {!hideTextAuto && (
            <FlatList
              data={results}
              renderItem={renderItem}
              keyExtractor={item => item.place_id}
            />
          )}
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleSubcirePackage}>
          <TextSemiBold style={styles.confirmText}>Đăng kí</TextSemiBold>
        </TouchableOpacity>
      </View>
      {statusSubcribePackage === Status.ERROR && isUpdated && modalSubcribe && (
        <ModalStatusOrder
          status={statusSubcribePackage}
          showModal={modalSubcribe}
          errorException={messageSubcribePackage}
          messageSuccess={''}
          messageError={messageSubcribePackage}
          handleConfirmMessage={handleAfterSubcribePackage}
          navigation={navigation}
        />
      )}
      {statusSubcribePackage === Status.SUCCESS &&
        statusPaymentPackage === Status.SUCCESS &&
        isUpdated && (
          <ModalStatusOrder
            status={statusPaymentPackage}
            showModal={modalSubcribe}
            errorException={messagePaymentPackage}
            messageSuccess={'Đăng kí thành công'}
            messageError={messagePaymentPackage}
            handleConfirmMessage={() => {
              dispatch(resetSubcribePackage());
              setModalSubcribe(false);
              navigation.navigate(NAVIGATION_ACCOUNT);
            }}
            navigation={navigation}
          />
        )}
      <MyModal visible={showModalShop} onPressOutSide={() => console.log('ok')}>
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
                    indexSelect={isIndexSelect}
                  />
                );
              }}
            />
          </View>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowModalShop(false)}>
            <TextSemiBold style={styles.modalButtonText}>Xác nhận</TextSemiBold>
          </TouchableOpacity>
        </View>
      </MyModal>
      <Loading
        isHidden={
          statusSubcribePackage === Status.LOADING ||
          statusPaymentPackage === Status.LOADING
        }
      />
    </SafeAreaView>
  );
};

export default SubcribeFreeship;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemTextAuto: {
    backgroundColor: 'white',
    width: widthDevice,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
  },
  modalButtonText: {
    color: Colors.whiteColor,
    // fontSize: 15,
    // fontWeight: 'bold',
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonTextColor,
    height: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  wrapperList: {
    maxHeight: '90%',
  },
  containerModal: {
    paddingTop: 20,
    backgroundColor: Colors.backgroundColor,
    width: widthDevice - 24,
    height: heightDevice / 1.5,
    borderRadius: 10,
  },
  wrapperSelector: {
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 5,
    borderColor: '#004D40',
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    height: 55,
    width: '102%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  buttonSelectShop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  contentText: {
    // fontWeight: 'bold',
    // fontSize: 16,
    color: '#004D40',
  },
  viewSearch: {
    flexDirection: 'row',
    // backgroundColor: 'blue',
    alignItems: 'center',
    width: widthDevice,
    height: 35,
  },
  textIn: {
    paddingHorizontal: 5,
    width: widthDevice - 30,
    color: Colors.blackColor,
    // backgroundColor: 'red',
    justifyContent: 'center',
  },
  inputSearchAddress: {
    position: 'absolute',
    width: '100%',
  },
  contentWrapper: {
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  wrapperMap: {
    // borderWidth: 2,
    // borderStyle: 'solid',
    // borderColor: '#004D40',
    marginBottom: 10,
  },
  styleMap: {
    height: heightDevice * 0.38,
    width: widthDevice,
  },
  wrapperContent: {
    marginBottom: 0,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  wrapperContainer: {
    height: heightDevice * 0.78,
    marginBottom: 10,
    marginTop: 2,
    paddingTop: 38,
    flex: 1,
  },
  confirmButton: {
    width: widthDevice / 2,
    borderRadius: 17,
    height: 45,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
  viewTextInput: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteColor,
  },
  buttonTextInput: {
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingVertical: 8,
    paddingRight: 15,
    paddingLeft: 8,
    borderRadius: 20,
    borderColor: Colors.buttonTextColor,
    height: 50,
    alignItems: 'center',
    width: widthDevice * 0.8,
    backgroundColor: Colors.whiteColor,
  },
  styleTextInput: {
    height: 50,
  },
});
