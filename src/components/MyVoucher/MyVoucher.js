import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Titles from 'common/Titles/Titles';
import Colors from 'theme/Colors';
import {asyncStorage} from 'store/index';
import {getCurrentShop, getListVoucher} from 'store/selectors';
import {getListVoucherAction, resetGetVouchers} from 'store/actions';
import {useFocusEffect} from '@react-navigation/native';
import {PARTNER_ID} from 'assets/config';
import DetailVoucher from './DetailVoucher';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetFooter,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {heightDevice, widthDevice} from 'assets/constans';
import BottomSheetItem from './BottomSheetItem';
import {NAVIGATION_MENU} from 'navigation/routes';
import UnauthorizedPage from './UnauthorizedPage';
import EmptyVoucher from './EmptyVoucher';
const MyVoucher = ({navigation}) => {
  const currentShop = useSelector(state => getCurrentShop(state));
  // const [toggle, setToggle] = useState(-1);
  const sheetRef = useRef(null);
  const [detail, setDetail] = useState(null);
  const [campaignInfo, setCampaignInfo] = useState([]);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState({custid: -1});
  const myVouchers = useSelector(state => getListVoucher(state));

  const insets = useSafeAreaInsets();
  const initVoucher = () => {
    const body = {
      user_id: currentUser.custid,
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
  useFocusEffect(
    useCallback(() => {
      const initUser = async () => {
        const tempUser = await asyncStorage.getUser();
        tempUser && tempUser.custid && setCurrentUser(tempUser);
      };
      initUser();
      return () => {
        dispatch(resetGetVouchers());
      };
    }, []),
  );
  useEffect(() => {
    if (currentUser) {
      initVoucher();
    }
  }, [currentUser]);
  const showBottomVoucher = val => {
    setDetail(val);
    const listText =
      val?.voucher && val?.voucher.campaign
        ? val?.voucher.campaign?.description.split('.')
        : [];
    setCampaignInfo(
      Array.from(listText, a => a.trim()).filter(a => a.length > 0),
    );
    sheetRef.current && sheetRef.current?.present();
  };
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.8}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );
  const renderFooter = useCallback(
    props => (
      <BottomSheetFooter {...props} bottomInset={10}>
        <TouchableOpacity
          onPress={() => {
            onCloseBottomSheet();
            navigation.navigate(NAVIGATION_MENU);
          }}
          style={[styles.saveModalBtn, {marginBottom: insets.bottom}]}>
          <TextNormalSemiBold style={{color: Colors.whiteColor}}>
            {'Đặt hàng ngay'}
          </TextNormalSemiBold>
        </TouchableOpacity>
      </BottomSheetFooter>
    ),
    [],
  );
  const onCloseBottomSheet = () => {
    sheetRef.current && sheetRef.current.dismiss();
  };
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Titles title={'Giỏ quà của tôi'} />
      </SafeAreaView>
      <ScrollView style={styles.wrapperContent}>
        {currentUser.custid !== -1 &&
          myVouchers.gift_baskets &&
          [...myVouchers.gift_baskets].map((item, index) => {
            const {voucher} = item;
            return (
              <DetailVoucher
                key={voucher.name}
                onPressItem={() => showBottomVoucher(item)}
                {...{
                  index,
                  item,
                  voucher,
                  navigation,
                }}
              />
            );
          })}
        {currentUser.custid !== -1 && myVouchers.gift_baskets.length === 0 && (
          <EmptyVoucher />
        )}
        {currentUser.custid === -1 && (
          <UnauthorizedPage navigation={navigation} />
        )}
      </ScrollView>
      <BottomSheetModal
        enablePanDownToClose={false}
        enableOverDrag={false}
        footerComponent={renderFooter}
        overDragResistanceFactor={0}
        enableHandlePanningGesture={false}
        handleIndicatorStyle={{display: 'none'}}
        backdropComponent={renderBackdrop}
        onChange={v => v === -1 && onCloseBottomSheet()}
        ref={sheetRef}
        snapPoints={['70%']}>
        <BottomSheetScrollView style={{flex: 1}}>
          {detail && (
            <BottomSheetItem
              detail={detail}
              onCloseBottomSheet={onCloseBottomSheet}
              campaignInfo={campaignInfo}
            />
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default MyVoucher;
const M_RIGHT = 30;
export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'white'},
  descriptionText: {
    color: '#555555',
    paddingVertical: 4,
    paddingLeft: 5,
  },
  closeIcon: {position: 'absolute', right: 0},
  wrapperContain: {flex: 1, paddingVertical: 10},
  paddingVertical8: {paddingVertical: 8},
  wrapperDes: {
    borderTopColor: Colors.border,
    borderTopWidth: 0.5,
    // flex: 1,
    // backgroundColor: 'red',
    paddingTop: 16,
    marginTop: 16,
  },
  containerBottom: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
  },
  headerBottom: {
    paddingBottom: 15,
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
  },
  wrapperContentRight: {
    marginLeft: 10,
    flex: 1,
  },
  rowLine: {flexDirection: 'row'},
  label: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F9CFD0',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 8,
  },
  saveModalBtn: {
    backgroundColor: Colors.buttonTextColor,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: widthDevice * 0.9,
    height: 48,
    // position: 'absolute',
    // bottom: 15,
    alignSelf: 'center',
    elevation: 10,
    zIndex: 100,
    marginBottom: 5,
    paddingVertical: 12,
  },
  textEmpty: {
    paddingVertical: 10,
    color: Colors.secondary,
    textAlign: 'center',
  },
  campaignName: {fontSize: 13, paddingVertical: 5},
  showMoreBtn: {alignSelf: 'flex-end'},
  customRow: {paddingTop: 5, paddingBottom: 22},
  mainText: {
    color: '#DC4A4E',
    textAlign: 'center',
    paddingVertical: 10,
    marginRight: M_RIGHT,
    fontSize: 20,
    alignSelf: 'center',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    width: 67,
    marginRight: M_RIGHT,
    alignSelf: 'center',
  },
  showMoreText: {color: Colors.link, textDecorationLine: 'underline'},
  textDes: {
    fontStyle: 'italic',
    color: Colors.secondary,
    paddingVertical: 3,
  },
  wrapperEmpty: {
    height: heightDevice * 0.7,
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperCode: {
    alignSelf: 'flex-start',
  },
  applyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    // backgroundColor: Colors.primary,
    // height: 24,
    borderColor: Colors.hot,
    borderRadius: 8,
    // marginTop: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapperContent: {
    // height: heightDevice,
    flex: 1,
    // paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: Colors.backgroundColor,
    // marginVertical: 10,
  },
  textSecondary: {color: Colors.secondary},
  wrapperItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 5,
    padding: 15,
    marginVertical: 5,
  },
  wrapperVoucherItem: {
    // paddingTop: 5,
    // paddingBottom: 10,
    borderRadius: 12,
    backgroundColor: Colors.whiteColor,
    // marginHorizontal: 10,
    borderStyle: 'solid',
    flex: 1,
    borderWidth: 1,
    // paddingHorizontal: 12,
    width: widthDevice - 30,
    marginVertical: 8,
    borderColor: Colors.border,
  },
  wrapperVoucherInfo: {
    // paddingTop: 10,
    // paddingBottom: 15,
    // flex: 1,
    // width: widthDevice - 40,
    // alignSelf: 'center',
    // borderBottomColor: Colors.border,/
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // borderBottomWidth: 1,
    // borderStyle: 'dashed',
    // borderRadius: 12,
    width: widthDevice - 31,
    marginBottom: 12,
    height: 80,
    // alignSelf: 'center',
    // marginHorizontal: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 15,
  },
  codesLengthText: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 15,
    paddingVertical: 3,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    backgroundColor: '#F1DCB1',
  },
});
