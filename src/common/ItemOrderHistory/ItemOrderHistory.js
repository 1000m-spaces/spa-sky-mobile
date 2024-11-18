import {logo, tra_logo, widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import Images from 'common/Images/Images';
import {
  TextNormalSemiBold,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import {formatMoney} from 'assets/constans';
import strings from 'localization/Localization';

const ItemOrderHistory = ({data, onPressDetail}) => {
  const [statusOfOrder, setStatusOfOrder] = useState('');
  useEffect(() => {
    handleStatusOrder();
  }, [data]);
  const handleStatusOrder = () => {
    if (data.is_complete === 1) {
      setStatusOfOrder(strings.common.completed);
    } else if (data.is_cancel === 1) {
      setStatusOfOrder(strings.common.canceled);
    } else if (data.is_served === 1) {
      setStatusOfOrder(strings.common.serving);
    } else if (data.is_check === 1) {
      setStatusOfOrder(strings.common.confirmed);
    } else if (data.is_paid === 0) {
      setStatusOfOrder(strings.common.notPaid);
    } else if (data.is_paid === 2) {
      setStatusOfOrder(strings.common.paid_failed);
    } else {
      setStatusOfOrder(strings.common.pending);
    }
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPressDetail(data)}>
      <View style={styles.content}>
        <Images
          resizeMode={'contain'}
          source={tra_logo}
          style={styles.image}
          styleContainer={styles.styleContainerImage}
        />
        <View style={styles.viewText}>
          <TextNormalSemiBold style={styles.textRestname}>
            {data.restname}
          </TextNormalSemiBold>
          <TextSmallTwelve style={{marginVertical: 3}}>
            {'Mã đơn: #'}
            <TextSmallMedium>{data.id}</TextSmallMedium>
          </TextSmallTwelve>
          <View style={styles.styleDate}>
            <TextSmallMedium
              style={{
                marginBottom: 3,
                color:
                  (data.is_paid === 0 || data.is_cancel === 1) &&
                  data?.is_check === 0
                    ? Colors.redColor
                    : Colors.buttonTextColor,
              }}>
              {statusOfOrder}
            </TextSmallMedium>
          </View>
          <View>
            <View style={styles.viewStyleDate}>
              <TextSmallTwelve style={{color: Colors.secondary}}>
                {data.time_create && data.time_create.length > 0
                  ? data.time_create
                      .substring(0, 16)
                      .replaceAll('-', '.')
                      .replaceAll(' ', ' | ')
                  : ''}
              </TextSmallTwelve>
              <TextNormalSemiBold style={styles.money}>
                {formatMoney(data.price_paid)}đ
              </TextNormalSemiBold>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.viewNext}>
        <Icons color={'gray'} type={'AntDesign'} name={'right'} size={18} />
      </View>
    </TouchableOpacity>
  );
};

export default ItemOrderHistory;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 10,
    paddingLeft: 12,
    paddingRight: 10,
    marginBottom: 15,
    paddingVertical: 15,
    borderRadius: 10,
  },
  textRestname: {
    fontSize: 14,
    color: Colors.buttonTextColor,
    lineHeight: 17,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    width: 1,
    height: 15,
    backgroundColor: Colors.textGrayColor,
    marginHorizontal: 5,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 12,
  },
  viewText: {
    marginLeft: 10,
    width: widthDevice - 55 - 70,
  },
  viewStyleDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  styleDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  money: {
    marginRight: 10,
    color: Colors.buttonTextColor,
  },
  viewNext: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    width: '100%',
    backgroundColor: '#BCBCBC',
  },
  pointSeparator: {
    backgroundColor: '#BCBCBC',
  },
});
