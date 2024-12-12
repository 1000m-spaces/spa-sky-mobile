import React, {useEffect, useRef, useState} from 'react';
import {View, SafeAreaView, FlatList} from 'react-native';
import styles from './styles';
import Titles from 'common/Titles/Titles';
import Avata from 'common/Avata/Avata';
import Feature from 'common/Feature/Feature';
import {TextNormal} from 'common/Text/TextFont';

import MyModal from 'common/MyModal/MyModal';
import {
  NAVIGATION_ACCOUNT_INFO,
  NAVIGATION_ACCOUNT_ORDER_HISTORY,
  NAVIGATION_AFFILIATE,
  NAVIGATION_LOGIN,
  NAVIGATION_MY_VOUCHER,
} from 'navigation/routes';
// import Colors from 'theme/Colors';
import {asyncStorage} from 'store/index';
import {useDispatch, useSelector} from 'react-redux';
import {
  addVoucher,
  logout,
  setLanguageAction,
  applyAffiliateV2,
  resetAffiliateV2,
} from 'store/actions';
import {
  getCurrentLocation,
  getStatusAddVoucher,
  getStatusAffiliate,
  // getMessageAddingVoucher,
  // isStatusGetListShopShowMoney,
  getCurrentShop,
  getErrorApplyingAffiliate,
  getMessageCheckAffiliate,
  getVersionCodePush,
} from 'store/selectors';
import Status from 'common/Status/Status';
import {resetVoucher} from 'store/actions';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import {CommonActions} from '@react-navigation/native';
import Loading from 'common/Loading/Loading';
import strings from 'localization/Localization';
import {setDefaultLanguage} from 'http/HttpClient';
import DeviceInfo from 'react-native-device-info';
import LanguageSelector from './LanguageSelector';
import InputSection from './InputSection';

const listFeatures = () => [
  // {
  //   name: strings.accountScreen.introduceOthers,
  //   icon: 'icon_intro_friend',
  //   link: NAVIGATION_AFFILIATE,
  //   group: {
  //     id: 1,
  //     index: 1,
  //   },
  // },
  // {
  //   name: strings.accountScreen.cashin,
  //   icon: 'icon_wallet',
  //   link: NAVIGATION_CASH_IN,
  //   group: {
  //     id: 1,
  //     index: 2,
  //   },
  // },
  {
    name: strings.accountScreen.orderHistory,
    icon: 'icon_his_donhang1',
    link: NAVIGATION_ACCOUNT_ORDER_HISTORY,
    group: {
      id: 1,
      index: 3,
    },
  },
  // {
  //   name: strings.accountScreen.voucherTitle,
  //   icon: 'icon_gift',
  //   link: NAVIGATION_MY_VOUCHER,
  //   group: {
  //     id: 1,
  //     index: 4,
  //   },
  // },
  // {
  //   name: strings.accountScreen.freeshipPackage,
  //   icon: 'icon_prime',
  //   link: NAVIGATION_FREE_SHIP,
  //   group: {
  //     id: 1,
  //     index: 5,
  //   },
  // },
  // {
  //   name: strings.accountScreen.voucherTitle,
  //   icon: 'icon_gift',
  //   link: NAVIGATION_E_VOUCHER,
  //   group: {
  //     id: 2,
  //     index: 1,
  //   },
  // },
  // {
  //   name: strings.accountScreen.giftCode,
  //   icon: 'icon_mail1',
  //   link: '',
  //   group: {
  //     id: 2,
  //     index: 3,
  //   },
  // },
  {
    name: strings.accountScreen.referralCode,
    icon: 'icon_voucher1',
    link: '',
    group: {
      id: 2,
      index: 4,
    },
  },
  {
    name: strings.accountScreen.language,
    icon: 'icon_language1',
    link: '',
    group: {
      id: 2,
      index: 5,
    },
  },
  {
    name: strings.accountScreen.logout,
    icon: 'icon_logout1',
    link: NAVIGATION_LOGIN,
    group: {
      id: 3,
      index: 1,
    },
  },
];

const Account = ({navigation}) => {
  // const [hideLanguage, setHideLanguage] = useState(true);
  const [showModalMessage, setModalMessage] = useState(false);
  const [openModalVoucher, setOpenModalVoucher] = useState(false);
  const [typeModal, setTypeModal] = useState(-1);
  const [textCode, setTextCode] = useState('');
  const [listFeature, setListFeature] = useState([]);
  const currentShop = useSelector(state => getCurrentShop(state));
  const [modalConfirm, setModalConfirm] = useState(null);
  const statusAddVoucher = useSelector(state => getStatusAddVoucher(state));
  const currentUser = useRef({custid: -1});
  const dispatch = useDispatch();
  const [currentLanguage, setCurrentLanguage] = useState('');
  const statusApplyAffiliate = useSelector(state => getStatusAffiliate(state));
  const errorApplyAffiliate = useSelector(state =>
    getErrorApplyingAffiliate(state),
  );
  const isVersionCodePush = useSelector(state => getVersionCodePush(state));

  const version = DeviceInfo.getVersion();
  const messageCheckAffiliate = useSelector(state =>
    getMessageCheckAffiliate(state),
  );
  const onPressOpenVoucher = type => {
    if (type === 1 || type === 2) {
      setOpenModalVoucher(true);
    }
    setTypeModal(type);
  };
  const onPressOutSide = () => {
    setTextCode('');
    setOpenModalVoucher(false);
  };
  const handleConfirmMessage = () => {
    if (typeModal === 1) {
      dispatch(resetVoucher());
    }
    if (typeModal === 2 || typeModal === -1) {
      //typeModal === -1 Liên quan đến affiliate khi ấn vào link liên kết
      dispatch(resetAffiliateV2());
    }
    setTypeModal(-1);
    setModalMessage(false);
  };
  const handleAddVouhcer = () => {
    if (!textCode) {
      return;
    }
    if (currentUser.current && currentUser.current?.custid !== -1) {
      if (typeModal === 1) {
        const query = {
          cust_id: currentUser.current?.custid,
          session_key: currentUser.current?.session_key,
          gift_code: textCode,
          partner_id: 100,
        };
        dispatch(addVoucher(query));
      }
      if (typeModal === 2) {
        const query = {
          code: textCode,
          userId: currentUser.current?.custid,
          userPhone: currentUser.current?.custphone.substring(1),
        };
        dispatch(applyAffiliateV2(query));
      }
    }
    onPressOutSide();
  };
  useEffect(() => {
    let timeout;
    if (
      (statusAddVoucher !== Status.DEFAULT ||
        statusApplyAffiliate !== Status.DEFAULT) &&
      openModalVoucher === false
    ) {
      timeout = setTimeout(() => {
        setModalMessage(true);
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [statusAddVoucher, statusApplyAffiliate]);

  useEffect(() => {
    setupUser();
    setCurrentLanguage(strings.getLanguage());
  }, []);
  const setupUser = async () => {
    setListFeature(
      currentShop.restid === '218'
        ? listFeatures().filter(item => item.icon !== 'icon_prime')
        : listFeatures(),
    );
    const tempUser = await asyncStorage.getUser();
    if (tempUser) {
      currentUser.current = tempUser;
      setModalConfirm(false); //Mục đích chỉ là để render lại màn hình(ref không render màn hình) để có thể hiện Đăng xuất thay vì đăng nhập
    }
  };
  const handleSeclectLanguage = type => {
    setDefaultLanguage(type);
    setCurrentLanguage(type);
    strings.setLanguage(type);
    var account = currentUser.current;
    account.language = type;
    account.languague = type;
    if (account?.custid && account?.session_key) {
      asyncStorage.setUser(account);
    }
    setListFeature(
      currentShop.restid === '218'
        ? listFeatures().filter(item => item.icon !== 'icon_prime')
        : listFeatures(),
    );
    if (currentUser.current.custid !== -1) {
      dispatch(
        setLanguageAction({
          language: type,
          custid: currentUser.current?.custid || -1,
          session_key: currentUser.current?.session_key || '',
        }),
      );
    }
    setTypeModal(-1);
  };

  //BACK TO THE LOGIN SCREEN FOR THE FIRST LOG IN
  const handleConfirmChange = () => {
    setModalConfirm(false);
    dispatch(logout());
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
    }, 50);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={strings.accountScreen.account}
        iconLanguage={false}
        // pressSetLanguage={() => setHideLanguage(!hideLanguage)}
      />
      {/* <ScrollView> */}
      <View style={styles.content}>
        <Avata
          nameIcon={'icon_edit1'}
          freeShip={currentShop.restid === '218'}
          navigation={navigation}
          onPressIconAvata={() => {
            if (currentUser.current.custid !== -1) {
              navigation.navigate(NAVIGATION_ACCOUNT_INFO);
            } else {
              setModalConfirm(true);
            }
          }}
        />
        <FlatList
          data={listFeature}
          contentContainerStyle={{alignItems: 'center'}}
          showsVerticalScrollIndicator={false}
          renderItem={({item, index}) => {
            return (
              <Feature
                key={item.name}
                name={item.name}
                icon={item.icon}
                index={index}
                group={item.group}
                navigation={navigation}
                link={item.link}
                showModalLogin={() => setModalConfirm(true)}
                onPress={onPressOpenVoucher}
                user={currentUser.current}
                codeAffiliate={messageCheckAffiliate}
              />
            );
          }}
        />
        <View style={{alignItems: 'center', marginTop: 5}}>
          {isVersionCodePush ? (
            <TextNormal style={styles.textVersion}>
              Version: {version} ({isVersionCodePush})
            </TextNormal>
          ) : (
            <TextNormal style={styles.textVersion}>
              Version: {version}
            </TextNormal>
          )}
        </View>
      </View>
      <ConfirmationModal
        isOpen={showModalMessage}
        onCancel={handleConfirmMessage}
        onConfirm={handleConfirmMessage}
        isWarning={true}
        textContent={
          typeModal === 1
            ? statusAddVoucher === Status.SUCCESS
              ? strings.accountScreen.applyVoucherSuccess
              : strings.accountScreen.applyVoucherFailed
            : statusApplyAffiliate === Status.SUCCESS
            ? strings.accountScreen.applyReferralSuccess
            : errorApplyAffiliate
            ? 'Có Lỗi xảy ra: ' + errorApplyAffiliate
            : strings.accountScreen.applyReferralFailed
        }
      />
      <MyModal
        visible={typeModal === 3}
        onPressOutSide={() => setTypeModal(-1)}>
        <LanguageSelector
          setTypeModal={val => setTypeModal(val)}
          currentLanguage={currentLanguage}
          handleSeclectLanguage={val => handleSeclectLanguage(val)}
        />
      </MyModal>
      <MyModal visible={openModalVoucher} onPressOutSide={onPressOutSide}>
        <InputSection
          {...{
            typeModal,
            messageCheckAffiliate,
            statusAddVoucher,
            statusApplyAffiliate,
            textCode,
          }}
          setTextCode={setTextCode}
          handleAddVouhcer={handleAddVouhcer}
          onPressOutSide={onPressOutSide}
        />
      </MyModal>
      <Loading
        isHidden={
          statusAddVoucher === Status.LOADING ||
          statusApplyAffiliate === Status.LOADING
        }
      />
      <ConfirmationModal
        isOpen={modalConfirm}
        onCancel={() => setModalConfirm(false)}
        onConfirm={() => handleConfirmChange()}
        textContent={strings.common.loginNotification}
      />
    </SafeAreaView>
  );
};

export default Account;
