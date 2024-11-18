import {TextNormal, TextSemiBold, TextSmallMedium} from 'common/Text/TextFont';
import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {IMAGE_URL} from 'assets/constans';
import {statusSetCurrentShop} from 'store/selectors';
import {formatMoney} from 'assets/constans';
import {useSelector} from 'react-redux';
import Status from 'common/Status/Status';
const ShopItem = ({onPress, data, index, indexSelect, isModal, hiddenMap}) => {
  // console.log('data Shop Item: ', data);
  const stausSetShop = useSelector(state => statusSetCurrentShop(state));
  return (
    <TouchableOpacity
      style={styles.container}
      disabled={stausSetShop === Status.LOADING}
      onPress={() => onPress(data, index)}>
      <CheckBox
        boxType={'square'}
        lineWidth={2}
        style={styles.styleCheckbox}
        onTintColor={Colors.buttonTextColor}
        onFillColor={Colors.buttonTextColor}
        tintColors={{true: Colors.buttonTextColor, false: 'gray'}}
        onCheckColor={Colors.whiteColor}
        width={15}
        value={index === indexSelect && !hiddenMap}
        onValueChange={() => onPress(data, index)}
      />
      {isModal === false && (
        <Images
          style={styles.styleLogoShop}
          source={{uri: `${IMAGE_URL}${data.img}`}}
        />
      )}
      <View style={styles.content}>
        <TextSemiBold style={{fontSize: 13, fontWeight: '600'}}>
          {data.restname}
        </TextSemiBold>
        {isModal === true && (
          <TextNormal style={{fontSize: 14}}>{data.restaddr}</TextNormal>
        )}
        {/* {isModal === false && (
          <View>
            <TextSmallMedium style={styles.voucherContent}>
              {`\u25CF E - Voucher 1: ${formatMoney(data.balance1)}p`}
            </TextSmallMedium>
            <TextSmallMedium style={styles.voucherContent}>
              {`\u25CF E - Voucher 2: ${formatMoney(data.balance2)}p`}
            </TextSmallMedium>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    paddingVertical: 12,
    // marginBottom: 5,
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 10,
  },
  styleCheckbox: {
    //checkbox bên android khoảng cách margin đang hơi lỗi nên cần chỉnh lại
    marginLeft: Platform.OS === 'ios' ? 10 : 3, //checkbox tự cách left 7px ở android
    marginRight: Platform.OS === 'ios' ? 10 : 16, //checkbox tự cách right -6px ở android
    height: 18,
    width: 18,
    // backgroundColor: Colors.buttonTextColor,
  },
  styleLogoShop: {
    height: 50,
    width: 50,
  },
  content: {
    marginLeft: 15,
    width: '80%',
    marginRight: 10,
  },
  voucherContent: {
    marginTop: 3,
  },
});
