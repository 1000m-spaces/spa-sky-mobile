import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallEleven,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React, { memo } from 'react';
import {TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import styles from './styles';
import Icons from 'common/Icons/Icons';
const options = [
  {
    name: 'Trải nghiệm tại cửa hàng',
    icon_name: 'sofa',
    icon_type: 'MaterialCommunityIcons',
    note: '*Vui lòng đến quầy nhận đồ khi có thông báo',
    val: 1,
  },
  {
    name: 'Take Away',
    icon_name: 'coffee-to-go-outline',
    icon_type: 'MaterialCommunityIcons',
    note: '*Vui lòng nhập thời gian truớc khi đặt hàng',
    val: 3,
  },
  // {
  //   name: 'FreeShip',
  //   icon_name: 'bike-fast',
  //   icon_type: 'MaterialCommunityIcons',
  //   note: 'Chưa có gói FreeShip khả dụng',
  //   val: 2,
  // },
];
const OptionSelector = ({
  currentShop,
  experienceOption,
  // freeShip,
  closeBottomSheet,
  setExperienceOption,
}) => {
  return (
    <View style={{flex: 1}}>
      <View style={[styles.wrapperTitleModal]}>
        <TextNormalSemiBold>{'Phương thức đặt hàng'}</TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>

      {options.map(item => (
        <TouchableOpacity
          key={item.val}
          // disabled={item.val === 2 && freeShip.address.length === 0}
          onPress={() => setExperienceOption(item.val)}
          style={[
            // experienceOption === item.val
            //   ? styles.activeOption
            styles.wrapperOption,
          ]}>
          <Icons
            type={'FontAwesome'}
            name={experienceOption === item.val ? 'dot-circle-o' : 'circle-o'}
            size={20}
            color={'black'}
            style={{paddingRight: 16}}
          />
          <View>
            <TextNormal style={{fontSize: 15, fontWeight: '600'}}>{item.name}</TextNormal>
            {item.val !== 2 && (
              <TextSmallTwelve
                style={[styles.textSecondary, {paddingVertical: 3}]}>
                {currentShop.restname}
              </TextSmallTwelve>
            )}
            <TextSmallEleven
              style={[
                styles.textSecondary,
                item.val !== 2 && {color: Colors.warning},
              ]}>
              {item.note}
            </TextSmallEleven>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(OptionSelector);
