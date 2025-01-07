import {tra_logo, widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import Images from 'common/Images/Images';
import Svg from 'common/Svg/Svg';
import {useIsFocused} from '@react-navigation/native';
import {
  TextNormal,
  TextNormalSemiBold,
  // TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import {NAVIGATION_DELIVERY_ADDRESS, NAVIGATION_SHOP} from 'navigation/routes';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentOrder, getSelectedDelivery} from 'store/selectors';
import Colors from 'theme/Colors';
import {asyncStorage} from 'store/index';
import {setCurrentOrder} from 'store/actions';
const HeaderMenu = ({navigation, content, showLoginModal}) => {
  const [IsDelivery, setIsDelivery] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useRef(null);
  const isFocused = useIsFocused();
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const selectedDelivery = useSelector(state => getSelectedDelivery(state));
  useLayoutEffect(() => {
    initUser();
    if (isFocused && currentOrder) {
      setIsDelivery(currentOrder.takeaway);
    }
  }, []);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser ? tempUser : null;
  };
  const onNavigate = type => {
    if (!currentUser.current) {
      showLoginModal();
      return;
    }
    navigation &&
      type === 2 &&
      navigation.navigate(NAVIGATION_DELIVERY_ADDRESS);
    navigation && type === 1 && navigation.navigate(NAVIGATION_SHOP);
  };
  useEffect(() => {
    if (isFocused && currentUser.current && currentOrder) {
      setIsDelivery(currentOrder.takeaway);
    }
  }, [currentOrder]);
  const handleTakeaway = val => {
    if (!currentUser.current) {
      showLoginModal();
      return;
    }
    if (val === IsDelivery) {
      return;
    }
    dispatch(
      setCurrentOrder({
        ...currentOrder,
        takeaway: val,
      }),
    );
  };

  return (
    <View style={[styles.containerHomeMain]}>
      <View style={styles.wrapperTab}>
        {/* <TouchableOpacity
          onPress={() => handleTakeaway(false)}
          style={[
            styles.tab,
            IsDelivery && styles.unfocusedTabLeft,
            {borderTopLeftRadius: 16},
          ]}>
          {IsDelivery === true ? (
            <View style={styles.row}>
              <Svg name={'pickup_icon'} size={20} />
              <TextNormal style={styles.pickupText}>{'Pick up'}</TextNormal>
            </View>
          ) : (
            <View style={styles.row}>
              <Svg name={'pickup_icon_active'} size={20} color={'red'} />
              <TextNormalSemiBold style={styles.pickupActiveText}>
                {'Pick up'}
              </TextNormalSemiBold>
            </View>
          )}
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => handleTakeaway(true)}
          // disabled={true}
          style={[
            styles.tab,
            !IsDelivery && styles.unfocusedTabRight,
            {borderTopRightRadius: 16},
          ]}>
          {IsDelivery === false ? (
            <View style={styles.row}>
              <Svg name={'inactive_deli'} size={20} />
              <TextNormal style={styles.pickupText}>{'Delivery'}</TextNormal>
            </View>
          ) : (
            <View style={styles.row}>
              <Svg name={'ship_bike'} size={20} />
              <TextNormalSemiBold style={styles.pickupActiveText}>
                {'Delivery'}
              </TextNormalSemiBold>
            </View>
          )}
          {/* <View style={styles.wrapperComming}>
            <TextSmallMedium style={{color: '#F9A50B'}}>
              {'Soon'}
            </TextSmallMedium>
          </View> */}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => onNavigate(1)}
        style={[styles.wrapperLine, styles.borderBottom]}>
        <Images
          resizeMode="contain"
          style={styles.imageStyle}
          source={tra_logo}
        />
        <TextNormalSemiBold>{content}</TextNormalSemiBold>
      </TouchableOpacity>

      {IsDelivery && (
        <TouchableOpacity
          onPress={() => onNavigate(2)}
          style={styles.wrapperLine}>
          <Svg name={'icon_location'} size={24} />
          {selectedDelivery ? (
            <View style={styles.wrapperContent}>
              <View style={styles.wrapperPrimaryLine}>
                <TextNormalSemiBold>
                  {selectedDelivery?.recipient_name || ''}
                </TextNormalSemiBold>
                <TextNormal style={{paddingHorizontal: 8}}>
                  {selectedDelivery.to_my_locatiton === false ? '|' : ''}
                </TextNormal>
                {selectedDelivery.to_my_locatiton === false && (
                  <TextNormalSemiBold>
                    {selectedDelivery.recipient_phone}
                  </TextNormalSemiBold>
                )}
              </View>
              <TextSmallTwelve style={{color: Colors.secondary}}>
                {selectedDelivery.address}
              </TextSmallTwelve>
            </View>
          ) : (
            <View style={{marginLeft: 12}}>
              <TextNormalSemiBold>
                {'Bạn muốn giao đến đâu?'}
              </TextNormalSemiBold>
            </View>
          )}
          <Icons
            name={'right'}
            type={'AntDesign'}
            size={15}
            color={'gray'}
            style={styles.iconNavigate}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderMenu;
const styles = StyleSheet.create({
  wrapperComming: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginLeft: 5,
    backgroundColor: '#FFF5C4',
    borderRadius: 4,
  },
  row: {flexDirection: 'row', alignItems: 'center'},
  pickupText: {color: '#393939', marginLeft: 3},
  pickupActiveText: {color: Colors.hot, marginLeft: 3},
  textName: {
    color: Colors.primary,
  },
  wrapperContent: {
    paddingHorizontal: 15,
    // backgroundColor: 'red',
    flex: 1,
  },
  wrapperPrimaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  iconNavigate: {
    position: 'absolute',
    right: 10,
    // backgroundColor: 'red',
  },
  wrapperLine: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    marginBottom: 1,
    alignItems: 'center',
    // backgroundColor: 'red',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    borderStyle: 'solid',
  },
  imageStyle: {
    width: 25,
    marginRight: 12,
    height: 25,
    resizeMode: 'cover',
    borderRadius: 7,
  },
  unfocusedTabLeft: {
    // backgroundColor: 'red',
    backgroundColor: 'lightgray',
    borderBottomRightRadius: 16,
  },
  unfocusedTabRight: {
    backgroundColor: 'lightgray',
    borderBottomLeftRadius: 16,
  },
  wrapperTab: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  contentInfo: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
  },
  containerHomeMain: {
    width: widthDevice - 30,
    backgroundColor: Colors.whiteColor,
    // paddingBottom: 15,
    borderRadius: 16,
    marginHorizontal: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    // elevation: 2,
    zIndex: 200,
    marginVertical: 10,
  },
});
