import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import {tra_logo} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import Images from 'common/Images/Images';
import Svg from 'common/Svg/Svg';

const FloatHeader = ({
  currentOrder,
  handlePickUp,
  onPressCate,
  catePosi,
  categoryProducts,
}) => {
  return (
    <View>
      <View style={styles.wrapperHeaderDelivery}>
        <TouchableOpacity
          onPress={handlePickUp}
          style={[
            styles.headerDelivery,
            !currentOrder.takeaway && {backgroundColor: Colors.whiteColor},
          ]}>
          <TextNormalSemiBold
            style={{
              fontWeight: currentOrder.takeaway ? '500' : '700',
              color: currentOrder.takeaway ? Colors.secondary : Colors.hot,
            }}>
            Pick up
          </TextNormalSemiBold>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePickUp}
          style={[
            styles.headerDelivery,
            currentOrder.takeaway && {backgroundColor: Colors.whiteColor},
          ]}>
          <TextNormalSemiBold
            style={{
              fontWeight: !currentOrder.takeaway ? '500' : '700',
              color: !currentOrder.takeaway ? Colors.secondary : Colors.hot,
            }}>
            Delivery
          </TextNormalSemiBold>
        </TouchableOpacity>
      </View>
      {catePosi >= 0 &&
        categoryProducts &&
        catePosi < categoryProducts.length && (
          <TouchableOpacity
            onPress={onPressCate}
            style={styles.headerLineTitle}>
            <Svg name={'cate_header'} style={styles.smallIcon} size={32} />
            <TextNormalSemiBold style={{paddingHorizontal: 8}}>
              {categoryProducts[catePosi].name}
            </TextNormalSemiBold>
            <Icons
              name={'chevron-down'}
              type={'Entypo'}
              size={15}
              color={'gray'}
            />
          </TouchableOpacity>
        )}
    </View>
  );
};

export default FloatHeader;
