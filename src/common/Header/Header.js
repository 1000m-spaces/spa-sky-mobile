import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';
import React, {memo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Platform, SafeAreaView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getClickNotification} from 'store/selectors';
import styles from './styles';
import {NAVIGATION_LOGIN, NAVIGATION_SHOP} from 'navigation/routes';
import Svg from 'common/Svg/Svg';
import MyModal from 'common/MyModal/MyModal';
import {
  updateMessage,
  getMessage,
  clickNotification,
  logout,
} from 'store/actions';
import strings from 'localization/Localization';
import {getCurrentShop, getIdMessageNoti} from '../../store/shop/shopSelector';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {heightDevice} from 'assets/constans';
import {CommonActions} from '@react-navigation/native';
import {PARTNER_ID} from 'assets/config';
import ListMessage from './ListMessage';

const Header = ({
  content,
  navigation,
  listMessage,
  currentUser,
  updateListMessage,
}) => {
  const insets = useSafeAreaInsets();
  const [openModalNotify, setOpenModalNotify] = useState(false);
  const [isIndexSelect, setIndexSelect] = useState(-1);
  const dispatch = useDispatch();

  const currentShop = useSelector(state => getCurrentShop(state)); // CURRENT SHOP
  const isClickNotification = useSelector(state => getClickNotification(state));
  const idMessageNoti = useSelector(state => getIdMessageNoti(state));
  const lengthMessageYetRead = listMessage
    ? listMessage.filter(message => message?.msg_status === 0)
    : [];
  const onPressOpenNotify = () => {
    setOpenModalNotify(true);
  };
  const onPressOutSide = () => {
    setOpenModalNotify(false);
    dispatch(clickNotification(false, ''));
  };

  const onPressSelectMess = (mess, index) => {
    setIndexSelect(index);
    if (mess.msg_status === 0) {
      const query = {
        msg_id: mess.id,
        session_key: currentUser?.session_key,
        cust_id: currentUser?.custid,
        is_delete: 0,
        msg_status: 1,
      };
      dispatch(updateMessage(query));
      updateListMessage();
    }
  };

  useEffect(() => {
    if (idMessageNoti && listMessage) {
      var index = listMessage.findIndex(item => item.id === idMessageNoti);
      if (index !== -1) {
        onPressSelectMess(listMessage[index], index);
        dispatch(clickNotification(false, ''));
      }
    }
  }, [idMessageNoti, listMessage]);
  useEffect(() => {
    getListMessage();
    if (!openModalNotify) {
      setIndexSelect(-1);
    }
  }, [openModalNotify]);
  const getListMessage = () => {
    if (currentUser?.custid && currentUser.session_key) {
      const body = {
        custid: currentUser?.custid,
        sesskey: currentUser?.session_key,
        typemsg: 0,
        typeget: 'ALL',
        partnerid: PARTNER_ID,
      };
      dispatch(getMessage(body));
    }
  };

  const handleClickLogin = async () => {
    if (!currentUser || currentUser?.custid === -1) {
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
      return;
    }
  };

  // OPEN NOTIFICATION
  useEffect(() => {
    let timeout;
    if (isClickNotification) {
      timeout = setTimeout(() => {
        onPressOpenNotify();
      }, 1000);
    }
    return () => clearTimeout(timeout);
  }, [isClickNotification]);

  return (
    <SafeAreaView
      style={[
        styles.containerHomeMain,
        {
          height:
            Platform.OS === 'android'
              ? heightDevice * 0.1 + insets.top
              : heightDevice * 0.068 + insets.top,
        },
      ]}>
      <View style={styles.content}>
        <View style={[styles.contentInfo]}>
          <Svg
            onPress={() => {
              navigation.navigate(NAVIGATION_SHOP);
            }}
            name={'icon_diachi1'}
            size={33}
            style={styles.imageAccount}
          />
          {(!content || content.length <= 0) && (
            <TouchableOpacity onPress={() => handleClickLogin()}>
              <TextNormal style={[styles.textHello]}>
                {strings.common.login}
              </TextNormal>
            </TouchableOpacity>
          )}
          {content && content.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate(NAVIGATION_SHOP)}>
              <TextNormalSemiBold numberOfLines={1} style={styles.textName}>
                {currentShop?.restname
                  ? currentShop?.restname.toString().split('-')[1]
                  : ''}
              </TextNormalSemiBold>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.wrapperBellBtn}
          onPress={() => onPressOpenNotify()}>
          <Svg name={'icon_notify1'} size={20} />
          {lengthMessageYetRead?.length > 0 && <View style={styles.quantity} />}
        </TouchableOpacity>
        <MyModal visible={openModalNotify} onPressOutSide={onPressOutSide}>
          <ListMessage
            isIndexSelect={isIndexSelect}
            onPressSelectMess={onPressSelectMess}
            onPressOutSide={onPressOutSide}
            listMessage={listMessage}
          />
        </MyModal>
      </View>
    </SafeAreaView>
  );
};

export default memo(Header);
