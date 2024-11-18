import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Titles from 'common/Titles/Titles';

import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
} from 'react-native';
import { widthDevice } from 'assets/constans';
import VoucherItem from './ItemVoucher';
import { TextNormal, TextSemiBold } from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCurrentShop,
  getStatusListVoucher,
  getListVoucher,
  getCurrentLanguage,
} from 'store/selectors';
import { asyncStorage } from 'store/index';
import { getListVoucherAction } from 'store/actions';
import Status from 'common/Status/Status';
import strings from 'localization/Localization';

const listTabs = [
  { id: 1, title: strings.common.available, index: 0 },
  { id: 2, title: strings.common.claimed, index: 1 },
  { id: 3, title: strings.common.expired, index: 2 },
];

const ListVoucher = ({ navigation }) => {
  const dispatch = useDispatch();
  const [tabActive, setTabActive] = useState(-1);
  const [vouchers, setVouchers] = useState([]);
  const currentUser = useRef({ custid: -1 });
  const listVoucher = useSelector(state => getListVoucher(state));
  const statusGetVouchers = useSelector(state => getStatusListVoucher(state));
  const currentShop = useSelector(state => getCurrentShop(state));
  const currentUserLanguage = useSelector(state => getCurrentLanguage(state));
  const [listTab, setListTab] = useState(listTabs);
  useEffect(() => {
    setListTab([
      { id: 1, title: strings.common.available, index: 0 },
      { id: 2, title: strings.common.claimed, index: 1 },
      { id: 3, title: strings.common.expired, index: 2 },
    ]);
  }, [currentUserLanguage]);
  useEffect(() => {
    initUser();
  }, []);
  useEffect(() => {
    if (
      statusGetVouchers === Status.SUCCESS &&
      listVoucher &&
      listVoucher.length >= 0
    ) {
      setTabActive(0);
    }
  }, [listVoucher, statusGetVouchers]);
  useEffect(() => {
    if (tabActive >= 0) {
      let tempList = [];
      if (tabActive === 0) {
        tempList = Array.from(listVoucher).filter(
          item => item.status === 'assigned',
        );
      } else if (tabActive === 1) {
        tempList = Array.from(listVoucher).filter(
          item => item.status === 'claimed',
        );
      } else if (tabActive === 2) {
        tempList = Array.from(listVoucher).filter(
          item => item.status === 'expired',
        );
      }
      setVouchers(tempList);
    }
  }, [tabActive]);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || { custid: -1 };
    if (currentUser.current.custid !== -1) {
      dispatch(
        getListVoucherAction({
          user_id: currentUser.current.custid,
          branch_id: parseInt(currentShop?.restid, 10),
          merchant_id: parseInt(currentShop?.shopownerid, 10),
          unexpired: true,
          status: true,
        }),
      );
    }
  };
  const handleChangeTab = tab => {
    if (tab === tabActive) {
      return;
    } else {
      setTabActive(tab);
    }
  };
  const renderItemTab = listTab.map((item, index) => {
    console.log('index:::', item, strings.common);
    return (
      <TouchableOpacity
        onPress={() => handleChangeTab(index)}
        key={item.id}
        style={[
          tabActive === index ? styles.itemTabActive : styles.itemTab,
          {
            backgroundColor:
              tabActive === index ? Colors.buttonTextColor : Colors.whiteColor,
          },
        ]}>
        <TextNormal
          style={{
            color: tabActive === index ? Colors.whiteColor : Colors.buttonTextColor,
          }}>
          {item.title}
        </TextNormal>
      </TouchableOpacity>
    );
  });
  const renderItemVoucher = ({ index, item }) => {
    return <VoucherItem item={item?.voucher} />;
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Titles
        iconBack={true}
        title={strings.accountScreen.voucherTitle}
        onPressBack={() => navigation.pop()}
      />
      {/* CONTENT SECTION */}
      <View style={{ flex: 1 }}>
        {/* TAB SECTION */}
        <View style={styles.tabContainer}>{renderItemTab}</View>
        {/* LIST ITEM VOUCHER */}
        {vouchers && vouchers.length > 0 ? (
          <FlatList
            data={vouchers || []}
            showsVerticalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.containerFlatList}
            renderItem={renderItemVoucher}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TextSemiBold>{strings.accountScreen.notData} ...</TextSemiBold>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ListVoucher;
const styles = StyleSheet.create({
  contentContainerSheet: {
    flex: 1,
    alignItems: 'center',
  },
  containerFlatList: {
    paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  itemTabActive: {
    width: 0.27 * widthDevice + 10,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTab: {
    width: 0.27 * widthDevice + 10,
    paddingVertical: 5,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.buttonTextColor,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 10,
    // backgroundColor: 'green',
    justifyContent: 'space-evenly',
  },
});
