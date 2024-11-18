import React from 'react';
import {styles} from './MyVoucher';
import {
  TextNormal,
  TextSemiBold,
  TextSmallEleven,
  TextSmallMedium,
} from 'common/Text/TextFont';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Icons from 'common/Icons/Icons';
import Svg from 'common/Svg/Svg';
import Colors from 'theme/Colors';
import {MIDDLE_DOT} from 'assets/constans';
const BottomSheetItem = ({detail, campaignInfo, onCloseBottomSheet}) => {
  return (
    <View style={styles.containerBottom}>
      <View style={styles.headerBottom}>
        <TextSemiBold>{'Chi tiết quà tặng'}</TextSemiBold>
        <TouchableOpacity style={styles.closeIcon} onPress={onCloseBottomSheet}>
          <Icons type={'Feather'} name={'x'} size={20} color={'gray'} />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapperContain}>
        <View style={styles.rowLine}>
          <Svg name={'voucher_label'} size={25} />
          <View style={styles.wrapperContentRight}>
            <TextSemiBold>{detail.voucher.name}</TextSemiBold>
            <TextNormal style={styles.paddingVertical8}>
              {'Có hiệu lực trong hôm nay'}
            </TextNormal>
            <TextNormal>{'Dành cho khách hàng sử dụng app'}</TextNormal>
            <View style={styles.label}>
              <TextSmallMedium style={{color: Colors.hot}}>
                {'Nhận tại quầy'}
              </TextSmallMedium>
            </View>
            <ScrollView style={styles.wrapperDes}>
              <TextSmallMedium>{'Điều khoản sử dụng'}</TextSmallMedium>
              {campaignInfo.map(a => {
                return (
                  <TextSmallEleven
                    key={a}
                    style={
                      styles.descriptionText
                    }>{`${MIDDLE_DOT}  ${a}`}</TextSmallEleven>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={{height: 67}} />
    </View>
  );
};

export default BottomSheetItem;
