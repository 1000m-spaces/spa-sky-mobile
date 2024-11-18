import Titles from 'common/Titles/Titles';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from 'theme/Colors';
import {heightDevice, widthDevice} from 'assets/constans';
import AddressItem from './AddressItem';
import AddressForm from './AddressForm';
import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';
import SearchAddress from './SearchAddress';
import {useDispatch, useSelector} from 'react-redux';
import {resetListDelivery, selectDeliveryAction} from 'store/actions';
import {
  defaultDeliSelector,
  deliveryAddressSelector,
  getCurrentShop,
  getSelectedDelivery,
  isListShopShowMoney,
  statusListDelivery,
} from 'store/selectors';
import Status from 'common/Status/Status';
import * as geolib from 'geolib';
import {useFocusEffect} from '@react-navigation/native';
import Svg from 'common/Svg/Svg';
import Icons from 'common/Icons/Icons';
import {asyncStorage} from 'store/index';
import {NAVIGATION_CART_DETAIL, NAVIGATION_MENU} from 'navigation/routes';
const MAX_DISTANCE_METER = 3500;
const DeliveryAddress = ({navigation, route}) => {
  // 1: DEDAULT (show all address or empty page)
  // 2: Create new address page
  // 3: Search for address page
  const [typeScreen, setTypeScreen] = useState(1);
  const [fromCart, setFromCart] = useState(false);
  const [isEditing, setIsEditting] = useState({val: false, item: -1});
  const [toMyLocation, setToMyLocation] = useState(false);
  const [newAddress, setNewAddress] = useState('');
  const currentShop = useSelector(state => getCurrentShop(state));
  const currentUser = useRef(null);
  const [name, setName] = useState(null);
  const [phone, setPhone] = useState(null);
  const [address, setAddress] = useState(null);
  const selectedDelivery = useSelector(state => getSelectedDelivery(state));
  const defaultDelivery = useSelector(state => defaultDeliSelector(state));
  const deliveryAddress = useSelector(state => deliveryAddressSelector(state));
  const statusGetDelivery = useSelector(state => statusListDelivery(state));
  const listShops = useSelector(state => isListShopShowMoney(state));
  const listShopLocation = useRef(null);
  const dispatch = useDispatch();
  const checkFrom = () => {
    const {cart} = route.params ? route.params : false;
    cart && setFromCart(true);
  };
  useEffect(() => {
    console.log('defaultDelivery:::', defaultDelivery);
  }, [defaultDelivery]);
  useFocusEffect(
    useCallback(() => {
      if (listShops && listShops.length > 0) {
        listShopLocation.current = Array.from(listShops || [], a => ({
          latitude: parseFloat(a.latitude),
          longitude: parseFloat(a.longitude),
        }));
      }
      checkFrom();
      initUser();
    }, [route]),
  );
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser ? tempUser : null;
  };
  useEffect(() => {
    if (statusGetDelivery === Status.SUCCESS) {
      dispatch(resetListDelivery());
    }
  }, [statusGetDelivery]);
  useEffect(() => {
    if (typeScreen === 1) {
      setupForm(-1, 1);
      isEditing.val && setIsEditting({val: false, item: -1});
    }
  }, [typeScreen]);
  const setupForm = (item, screen) => {
    setName(screen === 2 ? item.recipient_name : null);
    setPhone(screen === 2 ? item.recipient_phone : null);
    setAddress(screen === 2 ? item.address : null);
    screen === 1 && setNewAddress(null);
  };

  const onEdit = useCallback(
    item => {
      toMyLocation && setToMyLocation(false);
      setupForm(item, 2);
      setTypeScreen(2);
      setIsEditting({val: true, item: item});
    },
    [deliveryAddress],
  );

  const renderAddress = ({item, index}) => {
    let valid = false;
    if (listShopLocation.current && item) {
      let nearest = geolib.findNearest(
        {
          longitude: item.lng,
          latitude: item.lat,
        },
        listShopLocation.current,
      );

      let distance = geolib.getDistance(
        {
          longitude: item.lng,
          latitude: item.lat,
        },
        nearest,
      );
      valid = distance <= MAX_DISTANCE_METER;
    }
    return (
      <AddressItem
        key={item.id}
        item={item}
        valid={valid}
        onEdit={onEdit}
        lastItem={index === deliveryAddress.length - 1}
        onPress={onPressItem}
      />
    );
  };

  const onPressItem = a => {
    if (!fromCart) {
      return;
    }
    dispatch(
      selectDeliveryAction({
        ...a,
        to_my_location: false,
      }),
    );
    navigation && navigation.navigate(NAVIGATION_CART_DETAIL);
  };
  const onBack = useCallback(() => {
    if (typeScreen === 2 || typeScreen === 4) {
      setTypeScreen(1);
      return;
    } else if (typeScreen === 1) {
      navigation && navigation.pop();
      return;
    }
  }, [typeScreen]);
  const onMoveToCreate = useCallback(() => {
    toMyLocation && setToMyLocation(false);
    setTypeScreen(4);
  }, []);
  const onMoveToSearch = useCallback(type => {
    // 1 -> ONLY USE LOCATION WITHOUT SAVING ADDRESS
    // 2 -> FOR EDITING OR SAVING NEW ADDRESS
    if (type === 1) {
      setToMyLocation(true);
    }
    setTypeScreen(3);
  }, []);
  const onSearchBack = useCallback(() => {
    if (toMyLocation) {
      setTypeScreen(1);
    } else {
      setTypeScreen(isEditing.val ? 2 : 4);
    }
  }, [typeScreen]);
  const onCompleteSearch = useCallback(
    val => {
      if (toMyLocation === false || !toMyLocation) {
        setNewAddress(val);
        setTypeScreen(isEditing.val ? 2 : 4);
        return;
      }
      toMyLocation &&
        dispatch(
          selectDeliveryAction({
            lng: val.longitude || 0,
            lat: val.latitude || 0,
            address: val?.name || '',
            recipient_name: 'Giao đến tôi',
            recipient_phone: currentUser.current.custphone || '',
            to_my_location: true,
          }),
        );
      navigation &&
        navigation.navigate(
          fromCart ? NAVIGATION_CART_DETAIL : NAVIGATION_MENU,
        );
    },
    [typeScreen],
  );

  const headerList = (
    <View style={styles.headerList}>
      <TextNormalSemiBold style={{fontSize: 16}}>
        {'Địa chỉ đã lưu'}
      </TextNormalSemiBold>
    </View>
  );
  const footerList = (
    <TouchableOpacity
      onPress={onMoveToCreate}
      style={styles.createAddressSection}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Svg name={'plus_address'} size={16} />
        <TextNormal style={{paddingLeft: 8}}>{'Thêm địa chỉ mới'}</TextNormal>
      </View>
      <Icons
        name={'chevron-right'}
        type={'Feather'}
        size={16}
        color={Colors.secondary}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {typeScreen === 1 && (
        <ScrollView style={styles.wrapperContainer}>
          <Titles
            iconBack={true}
            onPressBack={onBack}
            title={'Chọn địa chỉ nhận hàng'}
          />
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => onMoveToSearch(1)}
              style={styles.useMyLocationBtn}>
              <Svg name={'icon_location'} size={24} />
              <TextNormal style={{color: 'black', marginLeft: 8}}>
                {'Chọn vị trí của tôi trên bản đồ'}
              </TextNormal>
            </TouchableOpacity>

            <FlatList
              data={deliveryAddress || []}
              renderItem={renderAddress}
              scrollEnabled={false}
              keyExtractor={item => `${item.id}`}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={headerList}
              ListFooterComponent={footerList}
            />
          </View>
        </ScrollView>
      )}
      {(typeScreen === 2 || typeScreen === 4) && (
        <AddressForm
          {...{
            name,
            phone,
            typeScreen,
            newAddress,
            defaultDelivery,
            selectedDelivery,
            address,
          }}
          setPhone={setPhone}
          onBack={onBack}
          setName={setName}
          item={isEditing.item}
          onSearch={() => onMoveToSearch(2)}
          onDone={onBack}
        />
      )}
      {typeScreen === 3 && (
        <SearchAddress
          navigation={navigation}
          onBack={onSearchBack}
          currentShop={currentShop}
          myLocation={toMyLocation}
          onCompleteSelection={onCompleteSearch}
        />
      )}
    </SafeAreaView>
  );
};

export default DeliveryAddress;

export const styles = StyleSheet.create({
  errorInput: {
    borderColor: Colors.warning,
    borderWidth: 1.5,
  },
  headerList: {flex: 1, paddingBottom: 12, paddingLeft: 16, paddingTop: 9},
  invalidAddressText: {
    color: Colors.hot,
    paddingTop: 4,
  },
  textEditAddress: {color: Colors.hot, paddingLeft: 4},
  mainAddressSection: {paddingLeft: 8, flex: 1},
  addressItem: {color: Colors.secondary, width: '80%'},
  createAddressSection: {
    flex: 1,
    padding: 16,
    paddingRight: 20,
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    height: 52,
    justifyContent: 'space-between',
  },
  useMyLocationBtn: {
    height: 48,
    width: widthDevice - 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 15,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  emptyImage: {
    justifyContent: 'flex-end',
    height: heightDevice / 2.1,
    alignSelf: 'center',
    paddingBottom: 50,
  },
  titleInvalid: {
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  wrapperScrollView: {
    backgroundColor: Colors.backgroundColor,
    flex: 1,
    height: heightDevice,
  },
  warningText: {paddingBottom: 5, color: Colors.warning},
  removeAddressBtn: {
    height: 52,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.whiteColor,
    width: widthDevice - 30,
    borderRadius: 12,
    alignItems: 'center',
  },
  wrapperBottomAction: {
    backgroundColor: Colors.whiteColor,
    // marginTop: 12
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    // flex: 1,
  },
  titleText: {paddingBottom: 4, paddingTop: 12},
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: Colors.hot,
  },
  separatorLine: {paddingHorizontal: 8, color: Colors.secondary},
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  wrapperButtonLocation: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapperFormAddress: {
    flex: 1,
    paddingTop: 10,
    height: heightDevice,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 15,
  },
  wrapperInput: {
    minHeight: 50,
    borderRadius: 12,
    color: 'black',
    backgroundColor: Colors.whiteColor,
    borderWidth: 0.5,
    borderColor: Colors.border,
    // flexWrap: 'wrap',
    borderStyle: 'solid',
    paddingHorizontal: 15,
    // alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  containerItemAddress: {
    backgroundColor: Colors.whiteColor,
    flexDirection: 'row',
    paddingTop: 16,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    // backgroundColor: 'red',
    borderStyle: 'solid',
    paddingBottom: 16,
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  wrapperPrimaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  editBtn: {
    position: 'absolute',
    top: -10,
    right: -5,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    zIndex: 100,
    // backgroundColor: 'red',
  },
  wrapperContent: {
    // paddingBottom: 10,
    // borderBottomColor: Colors.border,
    // borderBottomWidth: 1,
    // // backgroundColor: 'red',
    // borderStyle: 'solid',
    paddingBottom: 5,
    flex: 1,
  },
  labelIsDefault: {
    borderRadius: 3,
    borderColor: Colors.hot,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
  wrapperContainer: {flex: 1, backgroundColor: Colors.backgroundColor},
  createAddressBtn: {
    width: widthDevice - 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 13,
    height: 48,
    marginVertical: 25,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  textBtn: {color: Colors.whiteColor, fontSize: 16},
  wrapperEmptyPage: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
});
