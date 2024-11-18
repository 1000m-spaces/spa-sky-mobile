import { React, useEffect, useState, useRef } from 'react'; // Free ship
import {
  SafeAreaView,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icons from 'common/Icons/Icons';
import Titles from 'common/Titles/Titles';
import Images from 'common/Images/Images';
import { formatMoney, heightDevice, widthDevice } from 'assets/constans';
import {
  NAVIGATION_SUBCRIBE_FREESHIP,
  NAVIGATION_SUBCRIBE_FREESHIP_GOOGLE_MAP,
} from 'navigation/routes';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import { useDispatch, useSelector } from 'react-redux';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import {
  getCurrentShop,
  getMyPackages,
  // getStatusMyPackages,
  getErrorUnrenew,
  getStatusUnrenew,
} from 'store/selectors';
import {
  getMyShipmentPackages,
  unrenewPackageAction,
  resetUnrenewPackage,
} from 'store/actions';
import Colors from 'theme/Colors';
import { asyncStorage } from 'store/index';
import Status from 'common/Status/Status';
import { prime1, prime2 } from 'assets/constans';
import strings from 'localization/Localization';

const tempList = [
  { id: 1, img: prime1 },
  { id: 2, img: prime2 },
];
const FreeShip = ({ navigation, route }) => {
  const { fromAvatar } = route?.params || false;
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const dispatch = useDispatch();
  const [onFocuses, setOnFocus] = useState(1);
  const refPackage = useRef({ id: -1 });
  const [selectedItem, setSelectedItem] = useState(-1);
  // const listShowPackage = useSelector(state => getShowingPackages(state));
  // const statusShowingPackage = useSelector(state =>
  //   getStatusShowingPackages(state),
  // );
  const [showModal, setShowModal] = useState(false);
  const statusUnrenewPackage = useSelector(state => getStatusUnrenew(state));
  const errorUnrenewPackage = useSelector(state => getErrorUnrenew(state));
  const myPackages = useSelector(state => getMyPackages(state));
  // const statusMyPackages = useSelector(state => getStatusMyPackages(state));
  const currentUser = useRef(null);
  const [textWarning, setTextWarning] = useState('');
  const currentShop = useSelector(state => getCurrentShop(state));
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
  };
  useEffect(() => {
    initUser();
  }, []);
  useEffect(() => {
    // initializeShowingPackage();
    if (currentUser.current !== null) {
      intializeMyPackage();
    }
    setTimeout(() => {
      if (fromAvatar === true) {
        setOnFocus(2);
      }
    }, 100);
  }, [currentUser]);
  useEffect(() => {
    if (textWarning && textWarning.length > 0) {
      setTimeout(() => {
        setTextWarning('');
      }, 10000);
    }
  }, [textWarning]);
  // const initializeShowingPackage = () => {
  //   const query = {
  //     merchantId: 0,
  //     brandId: 100,
  //     pkgType: 1,
  //   };
  //   dispatch(listShowingPackages(query));
  // };
  const intializeMyPackage = () => {
    const query = {
      userId: parseInt(currentUser.current?.custid, 10),
      // brandId: 100,
      // merchantId: parseInt(currentShop?.shopownerid, 10),
      // branchId: parseInt(currentShop.restid, 10),
    };
    dispatch(getMyShipmentPackages(query));
  };
  const handleSelectPackage = item => {
    if (onFocuses === 1) {
      if (item.id === selectedItem) {
        setSelectedItem(-1);
      } else {
        setSelectedItem(item.id);
      }
    } else {
      return;
    }
  };
  const handleUnrenewPackage = item => {
    if (!item) {
      return;
    }
    refPackage.current = JSON.parse(JSON.stringify(item)) || { id: -1 };
    setShowModalConfirm(true);
  };
  const confirmUnrenewPackage = () => {
    if (refPackage.current.id === -1) {
      setShowModalConfirm(false);
      return;
    }
    const query = {
      id: refPackage.current?.id,
      userId: refPackage.current?.user_id,
      updatedBy: refPackage.current?.user_id,
    };
    dispatch(unrenewPackageAction(query));
    setShowModalConfirm(false);
  };
  useEffect(() => {
    if (
      statusUnrenewPackage === Status.SUCCESS ||
      statusUnrenewPackage === Status.ERROR
    ) {
      setShowModal(true);
    }
  }, [statusUnrenewPackage]);
  const handleSelectStore = () => {
    if (myPackages && myPackages.length > 0) {
      strings.getLanguage() === 'vi'
        ? setTextWarning(
          `Bạn đang dùng gói ${myPackages[0].package.name}. Bạn cần hủy gói hiện tại và đợi đến hết hạn để đăng ký tiếp gói mới.`,
        )
        : setTextWarning(
          `You are on plan ${myPackages[0].package.name}. You need to cancel your current plan and wait until it expires to subscribe to a new plan.`,
        );
      return;
    }
    navigation.navigate(NAVIGATION_SUBCRIBE_FREESHIP_GOOGLE_MAP);
  };
  const handleConfirmMessage = () => {
    intializeMyPackage();
    dispatch(resetUnrenewPackage());
    setShowModal(false);
  };
  const renderPackageItem = ({ item, index }) => {
    return onFocuses === 2 ? (
      <TouchableOpacity
        disabled={item.is_renewable === false}
        onPress={() => handleSelectPackage(item)}
        style={styles.wrapperCard}>
        <View style={styles.wrapperContent}>
          <TextNormal style={styles.textTitle}>
            {strings.freeshipScreen.packageName}
          </TextNormal>
          <TextSemiBold style={styles.textContent}>
            {item.package.name}
          </TextSemiBold>
        </View>
        <View style={styles.wrapperContent}>
          <TextNormal style={styles.textTitle}>
            {strings.freeshipScreen.packageAddress}
          </TextNormal>
          <TextSemiBold style={styles.textContent}>
            {item?.address}
          </TextSemiBold>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={styles.wrapperContent}>
            <TextNormal style={styles.textTitle}>
              {strings.freeshipScreen.packageTime}
            </TextNormal>
            {
              <TextSemiBold style={styles.textContent}>
                {item?.package.value_time}
                {item?.package.pkg_time === 'month'
                  ? ` ${strings.common.month}`
                  : ` ${strings.common.day}`}
              </TextSemiBold>
            }
          </View>
          <View style={styles.wrapperContent}>
            <TextNormal style={styles.textTitle}>
              {strings.freeshipScreen.radius}
            </TextNormal>
            <TextSemiBold style={styles.textContent}>
              {item?.package.shipping_package?.max_distance.toFixed(2) + ' km'}
            </TextSemiBold>
          </View>
          <View style={styles.wrapperContent}>
            <TextNormal style={styles.textTitle}>
              {strings.freeshipScreen.status}
            </TextNormal>
            <TextSemiBold
              style={[
                styles.textContent,
                {
                  color:
                    item.state === 3 ? Colors.redColor : Colors.buttonTextColor,
                },
              ]}>
              {item?.state === 0
                ? strings.freeshipScreen.inactive
                : item.state === 1
                  ? strings.freeshipScreen.active
                  : strings.common.canceled}
            </TextSemiBold>
          </View>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            disabled={item.is_renewable === false}
            onPress={() => handleUnrenewPackage(item)}
            style={styles.unrenewButton}>
            {item.is_renewable === false && (
              <Icons
                type={'Feather'}
                name={'check'}
                color={'#F44336'}
                size={20}
              />
            )}
            <TextNormalSemiBold style={{ color: Colors.redColor }}>
              {item.is_renewable === true
                ? strings.freeshipScreen.cancelRenewal
                : strings.freeshipScreen.packageRenewalCanceled}
            </TextNormalSemiBold>
          </TouchableOpacity>
        </View>
        {/* {selectedItem === item.id && (
          <View style={{position: 'absolute', top: 1, right: 2}}>
            <Icons
              type={'Feather'}
              name={'check'}
              size={29}
              color={'green'}
            />
          </View>
        )} */}
      </TouchableOpacity>
    ) : (
      <View style={styles.wrapperImage}>
        {/* <TextNormal>Hello</TextNormal> */}
        <Images
          source={item.img}
          style={styles.imagePrime}
          resizeMode={'contain'}
        />
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Titles
        title={strings.freeshipScreen.freeshipPackage}
        iconBack={true}
        onPressBack={() => navigation.pop()}
      />
      <View style={styles.wrapperTab}>
        <TouchableOpacity
          onPress={() => setOnFocus(1)}
          style={[
            styles.tabSection,
            {
              backgroundColor:
                onFocuses === 1 ? Colors.buttonTextColor : 'white',
            },
          ]}>
          <TextSemiBold
            style={{
              fontSize: 13,
              color:
                onFocuses === 1 ? Colors.whiteColor : Colors.buttonTextColor,
            }}>
            {strings.freeshipScreen.listPackage}
          </TextSemiBold>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setOnFocus(2)}
          style={[
            styles.tabSection,
            {
              backgroundColor:
                onFocuses === 2 ? Colors.buttonTextColor : 'white',
            },
          ]}>
          <TextSemiBold
            style={{
              fontSize: 13,
              color:
                onFocuses === 2 ? Colors.whiteColor : Colors.buttonTextColor,
            }}>
            {strings.freeshipScreen.myPackage}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
      <View style={styles.wrapperContainer}>
        <FlatList
          data={onFocuses === 1 ? tempList : myPackages}
          keyExtractor={item => item.id}
          renderItem={renderPackageItem}
        />
      </View>
      {textWarning && textWarning.length > 0 && onFocuses === 1 && (
        <View style={styles.warningSection}>
          <TextSmallTwelve style={styles.textWarning}>
            {textWarning}
          </TextSmallTwelve>
        </View>
      )}
      {onFocuses === 1 && (
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={[styles.confirmButton]}
            onPress={handleSelectStore}>
            <TextSemiBold style={styles.confirmText}>
              {strings.common.subscribe}
            </TextSemiBold>
          </TouchableOpacity>
        </View>
      )}
      {showModal === true && statusUnrenewPackage !== Status.LOADING && (
        <ModalStatusOrder
          status={statusUnrenewPackage}
          showModal={showModal}
          errorException={errorUnrenewPackage}
          messageSuccess={strings.freeshipScreen.cancelRenewalSuccess}
          messageError={errorUnrenewPackage}
          handleConfirmMessage={handleConfirmMessage}
          navigation={navigation}
        />
      )}
      {showModalConfirm === true && (
        <ConfirmationModal
          isOpen={showModalConfirm}
          onCancel={() => setShowModalConfirm(false)}
          onConfirm={confirmUnrenewPackage}
          textContent={strings.freeshipScreen.confirmCancel}
        />
      )}
    </SafeAreaView>
  );
};

export default FreeShip;
const styles = StyleSheet.create({
  warningSection: { flexDirection: 'row', justifyContent: 'center' },
  textWarning: {
    width: '90%',
    textAlign: 'center',
    fontStyle: 'italic',
    color: Colors.redColor,
  },
  wrapperTab: {
    height: 38,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  unrenewButton: {
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 20,
    marginTop: 10,
    borderColor: Colors.redColor,
    backgroundColor: '#FFEBEE',
    borderWidth: 1.5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabSection: {
    width: widthDevice / 2 - 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    height: '100%',
    borderWidth: 1,
    borderColor: Colors.buttonTextColor,
  },
  textTitle: {
    color: 'grey',
    fontSize: 12,
  },
  actionButton: {
    marginVertical: 10,
  },
  wrapperContent: {
    marginBottom: 10,
  },
  textContent: {
    fontSize: 15,
    color: Colors.buttonTextColor,
  },
  imagePrime: {
    width: '100%',
    height: heightDevice * 0.3,
  },
  wrapperImage: {
    justifyContent: 'center',
    alignContent: 'center',
  },
  wrapperCard: {
    backgroundColor: 'white',
    marginVertical: 10,
    width: widthDevice - 20,
    borderRadius: 15,
    padding: 12,
    alignSelf: 'center',
  },
  wrapperCardSelected: {
    height: heightDevice / 3.2,
    backgroundColor: '#E0F2F1',
    marginVertical: 10,
    width: widthDevice - 20,
    borderRadius: 15,
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.buttonTextColor,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  wrapperContainer: {
    maxHeight: heightDevice * 0.75,
    width: widthDevice,
    flex: 1,
  },
  confirmButton: {
    width: widthDevice / 1.8,
    flexDirection: 'row',
    borderRadius: 30,
    height: 45,
    marginBottom: 5,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectText: {
    fontWeight: '600',
    color: Colors.buttonTextColor,
    fontSize: 13,
  },
  confirmText: {
    color: 'white',
    marginRight: 5,
  },
});
