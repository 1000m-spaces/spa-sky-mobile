import React, {useEffect, useState} from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {
  TextSemiBold,
  TextSmallEleven,
  TextSmallTwelve,
  TextNormalSemiBold,
  TextNormal,
} from 'common/Text/TextFont';
import Images from 'common/Images/Images';
import {tra_logo} from 'assets/constans/';
import Svg from 'common/Svg/Svg';
import Colors from 'theme/Colors';
import Icons from 'common/Icons/Icons';
import {NAVIGATION_DELIVERY_ADDRESS} from 'navigation/routes';
import {getSelectedDelivery} from 'store/selectors';
import {useDispatch, useSelector} from 'react-redux';
import * as geolib from 'geolib';
import {setCurrentOrder} from 'store/actions';
const MAX_DISTANCE_METER = 3500;
const StoreSection = ({currentShop, currentOrder, navigation}) => {
  const selectedDelivery = useSelector(state => getSelectedDelivery(state));
  const [valid, setValid] = useState(false);
  const dipatch = useDispatch();
  useEffect(() => {
    if (selectedDelivery && currentShop) {
      checkValidDelivery();
    }
  }, [selectedDelivery, currentShop]);
  const checkValidDelivery = () => {
    const current = {
      longitude: selectedDelivery?.lng,
      latitude: selectedDelivery?.lat,
    };
    const v = geolib.isPointWithinRadius(
      current,
      {
        longitude: parseFloat(currentShop.longitude),
        latitude: parseFloat(currentShop.latitude),
      },
      MAX_DISTANCE_METER,
    );
    dipatch(setCurrentOrder({...currentOrder, valid_delivery: v}));
    setValid(v);
  };

  const onNavigate = () => {
    navigation &&
      navigation.navigate(NAVIGATION_DELIVERY_ADDRESS, {cart: true});
  };
  return (
    <View style={styles.storeSection}>
      <View
        style={[
          styles.rowBetween,
          {flexDirection: 'column', alignItems: 'flex-start'},
        ]}>
        <TextSemiBold>
          {currentOrder && currentOrder?.takeaway === true
            ? 'Giao hàng tận nơi'
            : 'Trải nghiệm tại cửa hàng'}
        </TextSemiBold>
        {currentOrder?.takeaway === true && (
          <View style={[styles.wrapperStoreInfo, {paddingBottom: 0}]}>
            <Images
              resizeMode="contain"
              style={styles.logoTea}
              source={tra_logo}
            />
            <View style={styles.contentStore}>
              <TextSemiBold numberOfLines={2} style={styles.storeName}>
                {currentShop?.restname}
              </TextSemiBold>
            </View>
          </View>
        )}
      </View>
      {currentOrder && currentOrder?.takeaway === true ? (
        <TouchableOpacity onPress={onNavigate} style={styles.wrapperLine}>
          <Svg name={'icon_location'} size={24} />

          {selectedDelivery ? (
            <View style={styles.wrapperContent}>
              <View style={styles.wrapperPrimaryLine}>
                <TextNormalSemiBold>
                  {selectedDelivery?.recipient_name || ''}
                </TextNormalSemiBold>
                <TextNormal style={{paddingHorizontal: 8}}>|</TextNormal>
                <TextNormalSemiBold>
                  {selectedDelivery?.recipient_phone || ''}
                </TextNormalSemiBold>
              </View>
              <TextSmallTwelve
                style={{color: Colors.secondary, paddingBottom: 4}}>
                {selectedDelivery?.address || ''}
              </TextSmallTwelve>
              {!valid && (
                <TextSmallEleven style={styles.warningText}>
                  {'*Địa chỉ nằm ngoài phạm vi giao hàng (3km).'}
                </TextSmallEleven>
              )}
            </View>
          ) : (
            <TextNormalSemiBold style={{flex: 1, marginLeft: 12}}>
              {'Bạn muốn giao đến đâu?'}
            </TextNormalSemiBold>
          )}

          <Icons
            name={'right'}
            type={'AntDesign'}
            size={15}
            color={'gray'}
            style={styles.iconNavigate}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.wrapperStoreInfo}>
          <Images
            resizeMode="contain"
            style={styles.imageStyle}
            source={tra_logo}
          />
          <View style={styles.contentStore}>
            <TextSemiBold numberOfLines={2} style={styles.storeName}>
              {currentShop?.restname}
            </TextSemiBold>
            <TextSmallEleven numberOfLines={2} style={styles.storeAddress}>
              {currentShop?.restaddr}
            </TextSmallEleven>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(StoreSection);
