import { React, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import Colors from 'theme/Colors';
import MapView, { Marker } from 'react-native-maps';
import Titles from 'common/Titles/Titles';
import Icons from 'common/Icons/Icons';

import {
  getCurrentShop,
  listShop,
  getStatusStoringAddress,
  getStatusPackageWithAddress,
  getPackagesWithAddress,
} from 'store/selectors';
import { GOOGLE_MAP_KEY, heightDevice, widthDevice } from 'assets/constans';
import { useSelector, useDispatch } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapViewDirections from 'react-native-maps-directions';
import {
  TextNormal,
  TextSmallMedium,
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import { asyncStorage } from 'store/index';

import {
  getPackageWithAddress,
  resetPackageWithAddress,
  storeShipmentAddress,
} from 'store/actions';
import Status from 'common/Status/Status';
import { NAVIGATION_SUBCRIPTION_SHIPMENT } from 'navigation/routes';
import Loading from 'common/Loading/Loading';
import strings from 'localization/Localization';

const SubcribeFreeshipGoogleMap = ({ navigation }) => {
  const dispatch = useDispatch();

  const [isRegion, setRegion] = useState(null);

  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [infoItinerary, setInfoItinerary] = useState(null);
  const statusStoringAddress = useSelector(state =>
    getStatusStoringAddress(state),
  );
  const mapRef = useRef(null);
  const [listShowingShop, setListShowingShop] = useState([]);
  // const [modalSubcribe, setModalSubcribe] = useState(false);
  const currentUser = useRef({});
  const refAuto = useRef('');
  const listPackageWithAddress = useSelector(state =>
    getPackagesWithAddress(state),
  );
  const statusPackageWithAddress = useSelector(state =>
    getStatusPackageWithAddress(state),
  );

  const listShops = useSelector(state => listShop(state));
  const currentShop = useSelector(state => getCurrentShop(state));

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // refAuto.current.focus();
    initUser();
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
      dispatch(resetPackageWithAddress());
      setListShowingShop([]);
      setOrigin(null);
      setDestination(null);
      setInfoItinerary(null);
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  useEffect(() => {
    if (listPackageWithAddress && listPackageWithAddress.length > 0) {
      const mapStore = new Map(
        listShops.map(store => {
          store.isIncluded = false;
          return [parseInt(store.restid, 10), store];
        }),
      );
      if (
        listPackageWithAddress[0].branchs &&
        listPackageWithAddress[0].branchs.length > 0
      ) {
        listPackageWithAddress[0].branchs.map(branch => {
          if (mapStore.has(branch.branch_id) === true) {
            const temp = mapStore.get(branch.branch_id);
            temp.isIncluded = true;
            temp.distance = branch.distance;
            mapStore.set(branch.branch_id, temp);
          }
        });
      }
      const tempList = Array.from(mapStore.values());
      setListShowingShop(tempList.filter(item => item.isIncluded === true));
    } else if (
      listPackageWithAddress &&
      listPackageWithAddress.length === 0 &&
      statusPackageWithAddress === Status.SUCCESS
    ) {
      handleStoreAddress();
    }
  }, [listPackageWithAddress]);
  const handleStoreAddress = () => {
    const query = {
      cust_id: currentUser?.current?.custid,
      address: origin?.name,
      phone: currentUser?.current?.custphone,
      lat: origin?.latitude,
      lon: origin?.longitude,
    };
    dispatch(storeShipmentAddress(query));
  };

  const resetTextSearch = () => {
    refAuto.current?.setAddressText('');
    refAuto.current?.focus();
    setOrigin(null);
  };
  const moveToLocation = (latitude, longitude) => {
    mapRef?.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      2000,
    );
  };
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };

  // ------------- CALL API TO CHECK ADDRESS AFTER SELECTING ONE ------------------------
  useEffect(() => {
    console.log('Checking origin:', origin);
    if (origin !== null && origin?.name) {
      setTimeout(() => {
        validateAddress();
      }, 100);
    } else {
      setListShowingShop([]);
      dispatch(resetPackageWithAddress());
    }
  }, [origin]);
  const validateAddress = () => {
    if (!currentShop || !currentUser.current) {
      return;
    }
    console.log('calling validateAddress.....');
    setListShowingShop([]);
    const query = {
      userId: parseInt(currentUser.current?.custid, 10),
      brandId: 100,
      branchId: parseInt(currentShop.restid, 10),
      merchantId: parseInt(currentShop.shopownerid, 10),
      // pkgType: 1,
      address: origin?.name,
    };
    dispatch(getPackageWithAddress(query));
  };

  const handleConfirmAddress = () => {
    if (listPackageWithAddress.length <= 0) {
      return;
    } else {
      const address = {
        name: origin.name,
        latitude: origin.latitude,
        longitude: origin.longitude,
      };
      navigation.navigate(NAVIGATION_SUBCRIPTION_SHIPMENT, { address });
    }
  };
  const renderAddressItem = ({ item, index }) => {
    return (
      <View>
        <View style={styles.contentShop}>
          <TextSemiBold
            style={{
              fontSize: 16,
            }}>
            {'\u25CF ' + item?.restname}
          </TextSemiBold>
          <View
            style={{
              marginLeft: 12,
              marginTop: 3,
            }}>
            <TextSmallTwelve>
              {strings.common.address + ': ' + item?.restaddr}
            </TextSmallTwelve>
          </View>
          <View
            style={{
              marginLeft: 12,
              marginTop: 3,
              flexDirection: 'row',
            }}>
            <TextSmallTwelve>{`${strings.common.distance}: `}</TextSmallTwelve>
            <TextSmallMedium style={{ marginLeft: 5, color: Colors.redColor }}>
              {item?.distance.toFixed(2) + ' km'}
            </TextSmallMedium>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={strings.common.subscribe}
        iconBack={true}
        onPressBack={() => {
          Keyboard.dismiss();
          if (isKeyboardVisible) {
            setTimeout(() => navigation.pop(), 500);
          } else {
            navigation.pop();
          }
        }}
      />
      <View style={styles.wrapperContainer}>
        {/* <View style={styles.viewTextInput}>
          <TouchableOpacity style={styles.buttonTextInput}>
            <Icons
              color={Colors.textGrayColor}
              type={'Feather'}
              name={'search'}
              size={18}
            />
            <TextInput
              placeholder="Tìm kiếm địa chỉ"
              placeholderTextColor={Colors.textGrayColor}
              underlineColorAndroid="transparent"
              style={styles.styleTextInput}
            />
          </TouchableOpacity>
        </View> */}
        {isKeyboardVisible === false && (
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
              {listShops.map((marker, index) => {
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
                  title={strings.common.shippingAddress}
                  description={origin?.name}
                />
              )}
              {/* {origin != null && (
          <Polyline
            coordinates={[
              {latitude: origin?.latitude, longitude: origin?.longitude},
              {latitude: 21.067226, longitude: 105.797771},
              // {latitude: 37.7665248, longitude: -122.4161628},
              // {latitude: 37.7734153, longitude: -122.4577787},
              // {latitude: 37.7948605, longitude: -122.4596065},
            ]}
            strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={10}
          />
        )} */}
              <MapViewDirections
                origin={origin}
                destination={{
                  latitude: parseFloat(destination?.latitude),
                  longitude: parseFloat(destination?.longitude),
                }}
                apikey={GOOGLE_MAP_KEY}
                strokeWidth={5}
                strokeColor="hotpink"
                onReady={result => {
                  // MapData.distance = result.distance;
                  // MapData.duration = result.duration;
                  console.log(`Distance: ${result?.distance} km`);
                  console.log(`Duration: ${result?.duration} min.`);
                  setInfoItinerary({
                    distance: result?.distance,
                    time: result?.duration,
                  });
                }}
              />
            </MapView>
          </View>
        )}
        <View style={styles.inputSearchAddress}>
          {/* <TextNormal style={{margin: 10}}>
            {'\u25CF Chọn địa chỉ nhận hàng'}
          </TextNormal> */}
          <GooglePlacesAutocomplete
            ref={refAuto}
            placeholder={strings.common.findDeliveryAddress}
            fetchDetails={true}
            debounce={refAuto.current.getAddressText === '' ? 0 : 500}
            // getDefaultValue={() => ''}
            textInputProps={{
              placeholderTextColor: Colors.textGrayColor,
              returnKeyType: 'search',
              fontStyle: 'italic',
            }}
            styles={{
              textInput: {
                marginTop: 15,
                height: 40,
                color: 'black',
                fontSize: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: Colors.buttonTextColor,
                paddingRight: 35,
              },
              description: {
                color: 'black',
              },
              predefinedPlacesDescription: {
                color: Colors.redColor,
              },
            }}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              moveToLocation(
                details?.geometry?.location.lat,
                details?.geometry?.location.lng,
              );
              setOrigin({
                latitude: details?.geometry?.location.lat,
                longitude: details?.geometry?.location.lng,
                name: data?.description || '',
              });
              console.log('RESULt SEARCH:::: ', data, details);
            }}
            // listViewDisplayed={true}
            onFail={e => console.log('SEARCH ERROR:::', e)}
            query={{
              key: GOOGLE_MAP_KEY,
              language: 'vi',
            }}
          />
          <View style={styles.viewIconClose}>
            <Icons
              type={'AntDesign'}
              name={'closecircle'}
              size={25}
              color={Colors.textGrayColor}
              onPress={() => resetTextSearch()}
            />
          </View>
        </View>
      </View>
      {/* {
        <View style={styles.showAddressSection}>
          <TextNormal>{'\u25CF Địa chỉ nhận hàng:'}</TextNormal>
          <TextSemiBold style={{marginLeft: 8, marginBottom: 10, marginTop: 5}}>
            600 Lê Đại Hành, HBT, HN
          </TextSemiBold>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextNormal>{'\u25CF Địa chỉ nhận hàng:'}</TextNormal>
            <TextSemiBold style={{paddingHorizontal: 10}}>3km</TextSemiBold>
          </View>
        </View>
      } */}
      {origin != null && isKeyboardVisible === false && (
        <View style={styles.contentWrapper}>
          <TextSemiBold style={{ color: Colors.buttonTextColor }}>
            {strings.common.deliveryAddress}
          </TextSemiBold>
          <TextNormal style={styles.contentText}>{origin?.name}</TextNormal>
        </View>
      )}
      {/* {origin != null && (
        <View style={styles.contentWrapper}>
          <TextNormal>Khoảng cách:</TextNormal>
          <TextNormalSemiBold style={styles.contentText}>
            {infoItinerary?.distance}km
          </TextNormalSemiBold>
        </View>
      )} */}
      {isKeyboardVisible === false &&
        listPackageWithAddress &&
        listPackageWithAddress.length > 0 && (
          <View style={styles.wrapperListStore}>
            <TextSemiBold
              style={{
                paddingVertical: 5,
                color: Colors.buttonTextColor,
                fontSize: 16,
              }}>
              {strings.common.suitableCafe}
            </TextSemiBold>
            <FlatList
              data={listShowingShop || []}
              showsVerticalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderAddressItem}
            />
          </View>
        )}
      <View style={styles.buttonWrapper}>
        {listPackageWithAddress.length === 0 &&
          statusPackageWithAddress === Status.SUCCESS && (
            <TextNormal
              style={{ textAlign: 'center', color: Colors.redColor, padding: 5 }}>
              {strings.common.over2kmWarning}
            </TextNormal>
          )}
        {statusPackageWithAddress === Status.ERROR && (
          <TextNormal
            style={{ textAlign: 'center', color: Colors.redColor, padding: 5 }}>
            {strings.common.serviceNotAvailable}
          </TextNormal>
        )}
        {/* {listPackageWithAddress.length > 0 && isKeyboardVisible === false &&
          statusPackageWithAddress === Status.SUCCESS && (
            <TextNormal
              style={{textAlign: 'center', color: 'green', padding: 2}}>
              Địa chỉ khả dụng
            </TextNormal>
          )} */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            { opacity: listPackageWithAddress.length === 0 ? 0.7 : 1 },
          ]}
          onPress={handleConfirmAddress}>
          <TextSemiBold style={styles.confirmText}>
            {strings.common.continue}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
      <Loading isHidden={statusPackageWithAddress === Status.LOADING} />
    </SafeAreaView>
  );
};

export default SubcribeFreeshipGoogleMap;
const styles = StyleSheet.create({
  contentShop: {
    marginLeft: 15,
    width: '90%',
    marginRight: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    paddingBottom: 10,
  },
  wrapperListStore: {
    paddingHorizontal: 15,
    height: heightDevice * 0.27,
  },
  container: {
    flex: 1,
  },
  modalButtonText: {
    color: Colors.whiteColor,
    // fontSize: 15,
    // fontWeight: 'bold',
  },
  showAddressSection: {
    height: heightDevice * 0.2,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  modalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonTextColor,
    height: 53,
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
    borderColor: Colors.buttonTextColor,
    backgroundColor: '#E0F2F1',
    borderRadius: 10,
    height: 55,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  contentText: {
    // fontWeight: 'bold',
    // fontSize: 16,
    paddingLeft: 12,
  },
  inputSearchAddress: {
    marginHorizontal: 10,
    height: '100%',
  },
  contentWrapper: {
    marginTop: 0,
    paddingHorizontal: 15,
  },
  wrapperMap: {
    // borderWidth: 2,
    // borderStyle: 'solid',
    // borderColor: Colors.buttonTextColor,
    marginBottom: 1,
  },
  styleMap: {
    height: heightDevice * 0.3,
    width: widthDevice,
  },
  wrapperContent: {
    marginBottom: 0,
  },
  viewIconClose: {
    height: 35,
    justifyContent: 'center',
    position: 'absolute',
    top: 18,
    borderRadius: 10,
    right: 8,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 0,
    width: widthDevice,
    justifyContent: 'center',
    paddingTop: 5,
    alignItems: 'center',
  },
  wrapperContainer: {
    height: heightDevice * 0.4,
    marginTop: 2,
  },
  confirmButton: {
    width: widthDevice / 2,
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
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
