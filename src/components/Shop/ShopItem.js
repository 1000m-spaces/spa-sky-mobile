import {TextSemiBold, TextSmallEleven} from 'common/Text/TextFont';
import CheckBox from '@react-native-community/checkbox';
import React, {memo} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {tra_logo} from 'assets/constans';
import {statusSetCurrentShop} from 'store/selectors';
import {useSelector} from 'react-redux';
import Status from 'common/Status/Status';
const ShopItem = ({onPress, data, index, indexSelect, isModal, hiddenMap}) => {
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
        <Images style={styles.styleLogoShop} source={tra_logo} />
      )}
      <View style={styles.content}>
        <TextSemiBold style={{fontSize: 13, fontWeight: 'bold'}}>
          {data.restname}
        </TextSemiBold>
        {isModal === false && (
          <View>
            <TextSmallEleven style={styles.voucherContent}>
              {`\u25CF ${data.restaddr}`}
            </TextSmallEleven>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default memo(ShopItem);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    paddingVertical: 15,
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
    borderRadius: 10,
  },
  content: {
    marginLeft: 15,
    width: '80%',
    marginRight: 10,
    flex: 1,
  },
  voucherContent: {
    marginTop: 3,
    color: Colors.secondary,
  },
});
