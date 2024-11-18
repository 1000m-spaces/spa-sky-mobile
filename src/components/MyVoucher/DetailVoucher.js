import {React} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallEleven,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';

import moment from 'moment';
import {styles} from './MyVoucher';
import {NAVIGATION_MENU} from 'navigation/routes';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {campaign_bg} from 'assets/constans';
import Icons from 'common/Icons/Icons';

const DetailVoucher = ({navigation, voucher, item, onPressItem}) => {
  return (
    <TouchableOpacity
      onPress={onPressItem}
      key={voucher.id}
      style={styles.wrapperVoucherItem}>
      <Images
        source={campaign_bg}
        resizeMode={'stretch'}
        style={[styles.wrapperVoucherInfo]}>
        <TextNormalSemiBold style={styles.mainText}>
          <TextNormal style={{color: Colors.whiteColor}}>
            {'Voucher\n'}
          </TextNormal>
          {'Khuyến mãi'}
        </TextNormalSemiBold>
        <View style={styles.line} />
      </Images>
      <View style={styles.row}>
        <TextNormalSemiBold>{voucher?.name || ''}</TextNormalSemiBold>
      </View>
      <View style={[styles.row, styles.customRow]}>
        <TextSmallTwelve>
          <Icons
            name={'calendar'}
            type={'AntDesign'}
            size={16}
            color={'gray'}
          />
          {'   Sử dụng đến ' + moment(item.end_date).format('DD/MM/YYYY')}
        </TextSmallTwelve>
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATION_MENU)}
          style={styles.applyBtn}>
          <TextSmallMedium style={{color: Colors.hot}}>
            {'Đặt hàng ngay'}
          </TextSmallMedium>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default DetailVoucher;
