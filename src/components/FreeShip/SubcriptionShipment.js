import { React, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Colors from 'theme/Colors';
import Titles from 'common/Titles/Titles';
import {
  getCurrentShop,
  getMessageSubcribe,
  getStatusSubcribe,
  isListShopShowMoney,
  getCurrentLocation,
  isStatusGetListShopShowMoney,
  getPackagesWithAddress,
  getSubcribedPackage,
} from 'store/selectors';
import { heightDevice, widthDevice } from 'assets/constans';
import { useSelector, useDispatch } from 'react-redux';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import { asyncStorage } from 'store/index';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import {
  resetSubcribePackage,
  subcribePackage,
  getListShopShowMoney,
  resetListShopMoney,
} from 'store/actions';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import Status from 'common/Status/Status';
import Images from 'common/Images/Images';
import Loading from 'common/Loading/Loading';

import { NAVIGATION_ACCOUNT } from 'navigation/routes';
import Icons from 'common/Icons/Icons';
import strings from 'localization/Localization';
const SubcriptionShipment = ({ navigation, route }) => {
  const { address } = route.params;
  const dispatch = useDispatch();
  // const selectedPackage = useSelector(state => getSelectedPackage(state));
  const statusSubcribePackage = useSelector(state => getStatusSubcribe(state));
  const messageSubcribePackage = useSelector(state =>
    getMessageSubcribe(state),
  );
  const [isWarning, setWarning] = useState(false);
  const [refPhone, setRefPhone] = useState('');
  const statusListShopMoney = useSelector(state =>
    isStatusGetListShopShowMoney(state),
  );
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalWarning, setModalWarning] = useState(false);
  const availablePackages = useSelector(state => getPackagesWithAddress(state));
  const currentUser = useRef({});
  const [checkBalance, setCheckBalance] = useState(false);
  const currentLocation = useSelector(state => getCurrentLocation(state));
  const currentShop = useSelector(state => getCurrentShop(state));
  const listShops = useSelector(state => isListShopShowMoney(state));
  const [selectedItem, setSelectedItem] = useState({ id: -1 });
  useEffect(() => {
    initUser();
  }, []);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };

  // ------------------------- HANDLE SUBCRIBE A PACKAGE ------------
  const handleSubcirePackage = () => {
    if (currentUser?.current && currentUser?.current?.custid) {
      const bodyListShop = {
        lat: currentLocation.latitude,
        long: currentLocation.longitude,
        custid: currentUser.current?.custid,
      };
      dispatch(getListShopShowMoney(bodyListShop));
    }
  };
  useEffect(() => {
    if (statusListShopMoney === Status.SUCCESS && modalConfirm === true) {
      let tempCurrentShop = { balance1: -1 };
      if (listShops && listShops.length > 0) {
        listShops.map(shop => {
          if (shop.restid === currentShop.restid) {
            tempCurrentShop = shop;
          }
        });
      }
      let check = false;
      if (tempCurrentShop?.balance1 < selectedItem?.price) {
        setModalConfirm(false);
        check = true;
      }
      if (check === true) {
        setTimeout(() => setCheckBalance(true), 100);
        // setCheckBalance(true);
        return;
      } else {
        if (selectedItem && selectedItem.id !== -1 && address) {
          const query = {
            address: address?.name,
            branch_id: parseInt(currentShop.restid, 10),
            brand_id: 100,
            lat: address?.latitude,
            ref_phone: refPhone || '',
            updated_by: 1,
            lng: address?.longitude,
            merchant_id: parseInt(currentShop?.shopownerid, 10),
            package_id: selectedItem?.id,
            user_id: parseInt(currentUser.current?.custid, 10),
          };
          dispatch(subcribePackage(query));
          setModalConfirm(false);
        }
      }
      dispatch(resetListShopMoney());
    }
  }, [statusListShopMoney]);
  useEffect(() => {
    if (
      statusSubcribePackage === Status.ERROR ||
      statusSubcribePackage === Status.SUCCESS
    ) {
      setModalPayment(true);
    }
  }, [statusSubcribePackage]);
  const handleAfterSubcribePackage = () => {
    if (statusSubcribePackage === Status.SUCCESS) {
      dispatch(resetSubcribePackage());
      setModalPayment(false);
      navigation.navigate(NAVIGATION_ACCOUNT);
    } else if (statusSubcribePackage === Status.ERROR) {
      dispatch(resetSubcribePackage());
      setModalPayment(false);
    }
  };

  /// PAYMENT PACKAGE SUCCESS
  const handleSelectItem = (item, index) => {
    const temp = JSON.parse(JSON.stringify(item));
    setSelectedItem({
      ...temp,
      index,
    });
  };
  const handleClickSubcribe = () => {
    if (selectedItem.id === -1) {
      setModalWarning(true);
    } else {
      setModalConfirm(true);
    }
  };

  useEffect(() => {
    let phoneRegex = /^\+?[0-9]+$/;
    let formatPhone = phoneRegex.test(refPhone);
    if (formatPhone || refPhone === '') {
      setWarning(false);
    } else {
      setWarning(true);
    }
  }, [refPhone]);
  const renderPackageItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handleSelectItem(item, index)}
        style={styles.wrapperImage}>
        <Images
          source={{
            uri: item.banners && item.banners.length > 0 ? item.banners[0] : '',
          }}
          style={styles.imagePrime}
          resizeMode={'stretch'}>
          <View
            style={[
              selectedItem.index === index
                ? { backgroundColor: '#FFF000' }
                : { backgroundColor: '#3BFFE6' },
              styles.wrapperSelectedContent,
            ]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                width: '100%',
              }}>
              <Icons
                type={'Feather'}
                name={selectedItem.index === index ? 'check' : 'circle'}
                color={'black'}
                size={20}
              />
              <TextNormalSemiBold>
                {' '}
                {selectedItem.index === index
                  ? strings.common.selected
                  : strings.common.select}
              </TextNormalSemiBold>
            </View>
          </View>
        </Images>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={strings.common.subscribe}
        iconBack={true}
        onPressBack={() => navigation.pop()}
      />
      <View style={styles.wrapperContainer}>
        <TextSemiBold
          style={{ textAlign: 'center', color: Colors.buttonTextColor }}>
          {strings.common.suitablePackage}
        </TextSemiBold>
        <FlatList
          data={availablePackages || []}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={renderPackageItem}
        />
        <View style={styles.buttonWrapper}>
          {/* <TextInput
            style={styles.textInput}
            placeholder="Nhập mã nhân viên giới thiệu"
            placeholderTextColor={Colors.textGrayColor}
            value={refPhone}
            onChangeText={setRefPhone}
            underlineColorAndroid="transparent"
          /> */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleClickSubcribe}>
            <TextSemiBold style={styles.confirmText}>
              {strings.common.subscribe}
            </TextSemiBold>
          </TouchableOpacity>
        </View>
      </View>
      {checkBalance === true && (
        <ModalStatusOrder
          status={Status.ERROR}
          showModal={checkBalance}
          errorException={strings.common.evoucherNotEnough}
          messageSuccess={''}
          messageError={strings.common.evoucherNotEnough}
          handleConfirmMessage={() => setCheckBalance(false)}
        />
      )}

      {statusSubcribePackage !== Status.LOADING && modalPayment && (
        <ModalStatusOrder
          status={statusSubcribePackage}
          showModal={modalPayment}
          errorException={messageSubcribePackage}
          messageSuccess={messageSubcribePackage}
          messageError={messageSubcribePackage}
          handleConfirmMessage={handleAfterSubcribePackage}
          navigation={navigation}
        />
      )}

      <Loading isHidden={statusSubcribePackage === Status.LOADING} />
      {modalConfirm && (
        <View>
          <ConfirmationModal
            isOpen={modalConfirm}
            onCancel={() => setModalConfirm(false)}
            onConfirm={handleSubcirePackage}
            title={strings.common.confirmSubcription}
            isDisableConfirm={isWarning}>
            <TextInput
              style={styles.textInput}
              placeholder={strings.common.enterReferalPhone}
              returnKeyLabel={strings.common.finish}
              returnKeyType={'done'}
              placeholderTextColor={Colors.textGrayColor}
              value={refPhone}
              onChangeText={setRefPhone}
              underlineColorAndroid="transparent"
            />
            {isWarning && (
              <TextNormal style={styles.textWarning}>
                {strings.common.notValidPhoneReferal}
              </TextNormal>
            )}
          </ConfirmationModal>
        </View>
      )}

      <ConfirmationModal
        isOpen={modalWarning}
        onCancel={() => setModalWarning(false)}
        onConfirm={() => setModalWarning(false)}
        isWarning={true}
        textContent={strings.common.selectPackageWarning}
      />
    </SafeAreaView>
  );
};

export default SubcriptionShipment;
const styles = StyleSheet.create({
  wrapperSelectedContent: {
    position: 'absolute',
    bottom: 15,
    right: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 25,
    borderRadius: 40,
  },
  textWarning: {
    color: 'red',
    marginVertical: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  textInput: {
    width: widthDevice / 1.5,
    height: 40,
    color: 'black',
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 25,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  separatorLine: {
    width: widthDevice - 20,
    backgroundColor: '#E9E9E9',
  },
  container: {
    flex: 1,
    // height: '100%',
  },
  wrapperImage: {
    justifyContent: 'center',
    alignContent: 'center',

    paddingHorizontal: 5,
  },
  imagePrime: {
    height: heightDevice / 3.6,
    borderRadius: 20,
  },

  contentWrapper: {
    // paddingHorizontal: 15,
    // backgroundColor: 'white',
    // flex: 1,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  wrapperContainer: {
    flex: 1,
    height: '100%',
  },
  confirmButton: {
    width: widthDevice / 2,
    borderRadius: 20,
    height: 45,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
  styleTextInput: {
    height: 50,
  },
});
