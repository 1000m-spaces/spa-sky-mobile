import ItemOrderHistory from 'common/ItemOrderHistory/ItemOrderHistory';
import Titles from 'common/Titles/Titles';
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, View} from 'react-native';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  getListHistoryOrders,
  getStatusListHistoryOrder,
  isErrorGetListHistoryOrder,
  // statusCancelOrder,
} from 'store/selectors';
import {asyncStorage} from 'store/index';
import {
  getListHistoryOrder,
  getListHistoryOrderReset,
  resetRefund,
  setDetailOrder,
} from 'store/actions';
import Status from 'common/Status/Status';
import {
  NAVIGATION_ACCOUNT,
  NAVIGATION_DETAIL_ORDER,
} from '../../navigation/routes';
import {useFocusEffect} from '@react-navigation/native';
import {StackActions} from '@react-navigation/native';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import ProgressScreen from 'common/Loading/ProgressScreen';
import strings from 'localization/Localization';
import Colors from 'theme/Colors';
import {PARTNER_ID} from 'assets/config';

const HistoryOrder = ({navigation}) => {
  const dispatch = useDispatch();
  const currentUser = useRef(null);
  const [removeStack, setRemoveStack] = useState(true);
  // const statusCancel = useSelector(state => statusCancelOrder(state));
  const listHistoryOrder = useSelector(state => getListHistoryOrders(state));
  const errorGetListHistoryOrder = useSelector(state =>
    isErrorGetListHistoryOrder(state),
  );
  const statusListHisOrder = useSelector(state =>
    getStatusListHistoryOrder(state),
  );
  const initializeListHistoryOrder = async () => {
    const storageUser = await asyncStorage.getUser();
    currentUser.current = storageUser;
    if (currentUser && currentUser.current) {
      const data = {
        userid: currentUser?.current?.custid,
        partnerid: PARTNER_ID,
        session: currentUser?.current?.session_key,
      };
      // console.log('init history::', data);
      dispatch(getListHistoryOrder(data));
    }
  };
  const handlePressDetail = detailOrder => {
    if (detailOrder) {
      dispatch(setDetailOrder(detailOrder));
      setTimeout(() => {
        setRemoveStack(false);
        navigation.navigate(NAVIGATION_DETAIL_ORDER);
      }, 100);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      dispatch(resetRefund());
      initializeListHistoryOrder();
    }, []),
  );
  // useEffect(() => {
  //   initializeListHistoryOrder();
  // }, [statusCancel]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      //xử lý khi màn hình không bị xóa mà chỉ bị chèn stack lên
      //còn muốn Xử lý khi sự kiện trước khi xóa màn hình thì dùng beforeRemove
      //Remove HistoryOrder from stack navigation
      setTimeout(() => {
        setRemoveStack(true);
        if (removeStack) {
          navigation.dispatch(StackActions.replace(NAVIGATION_ACCOUNT));
        }
      }, 300);
    });

    // Trả về một hàm để hủy bỏ trình nghe khi màn hình bị unmount
    return unsubscribe;
  }, [navigation, removeStack]);

  const handleConfirmMessage = () => {
    dispatch(getListHistoryOrderReset());
  };
  const renderHistoryItem = ({item}) => {
    return <ItemOrderHistory data={item} onPressDetail={handlePressDetail} />;
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, backgroundColor: Colors.backgroundColor}}>
          <Titles
            title={strings.accountScreen.orderHistory}
            iconBack={true}
            onPressBack={() => navigation.pop()}
          />
          {statusListHisOrder === Status.LOADING && <ProgressScreen />}
          {statusListHisOrder === Status.SUCCESS &&
            listHistoryOrder &&
            listHistoryOrder.length > 0 && (
              <FlatList
                data={listHistoryOrder}
                keyExtractor={item => item?.id.toString()}
                contentContainerStyle={styles.styleFlatList}
                initialNumToRender={6}
                renderItem={renderHistoryItem}
              />
            )}
          <ModalStatusOrder
            status={statusListHisOrder}
            showModal={statusListHisOrder === Status.ERROR}
            errorException={errorGetListHistoryOrder}
            messageSuccess={''}
            messageError={'Xảy ra lỗi'}
            handleConfirmMessage={handleConfirmMessage}
            navigation={navigation}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HistoryOrder;
