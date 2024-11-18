/* eslint-disable react-native/no-inline-styles */
import {
  TextSemiBold,
  TextSmallEleven,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React, {memo} from 'react';
import {FlatList, Linking, TouchableOpacity, View} from 'react-native';
import styles from './styles';
// import Icons from 'common/Icons/Icons';
import Svg from 'common/Svg/Svg';
import Colors from 'theme/Colors';
import {isAndroid, vqr, widthDevice} from 'assets/constans';
import Images from 'common/Images/Images';

const items = [
  {id: 3, name: 'Zalopay', icon: 'zalo_pay'},
  {id: 4, name: 'Apple Pay', icon: 'apple_pay'},
  // {id: 2, name: 'MoMo', icon: 'icon_momo'},
  {id: 1, name: 'Chuyển khoản', icon: 'viet_qr'},
  {id: 5, name: 'Thẻ quốc tế', icon: 'master_icon'},
  {id: 6, name: 'Thẻ ATM', icon: 'atm_icon'},
];
const PaymentGateway = ({onPress, paymentType}) => {
  const renderPaymentItem = ({item, idx}) => {
    return (
      <TouchableOpacity
        key={idx}
        onPress={() => onPress(item.id)}
        disabled={item.id === 2}
        style={[
          {
            marginRight: 7,
            width: widthDevice / 3 - 15,
            marginBottom: 6,
            borderRadius: 2,
            minHeight: 36,
            borderColor:
              paymentType === item.id ? Colors.primary : Colors.border,
            borderWidth: 1,
            backgroundColor:
              paymentType === item.id ? '#E2ECFF' : Colors.whiteColor,
          },
        ]}>
        <View style={[styles.wrapperPaymentName]}>
          {item.id !== 1 ? (
            <Svg
              name={item.icon}
              size={20}
              style={{opacity: item.id === 2 ? 0.4 : 1}}
            />
          ) : (
            <Images source={vqr} style={{height: 17, width: 17}} />
          )}
          <View>
            <TextSmallEleven
              style={{
                paddingLeft: 4,
                opacity: item.id === 2 ? 0.4 : 1,
              }}>
              {item.name}
            </TextSmallEleven>
            {item.id === 2 && (
              <TextSmallEleven
                style={{
                  paddingLeft: 4,
                  color: Colors.redColor,
                }}>
                {'Đang bảo trì'}
              </TextSmallEleven>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.paymentGateway}>
      <TextSemiBold>{'Phương thức thanh toán'}</TextSemiBold>
      <FlatList
        data={isAndroid ? items.filter(a => a.id !== 4) : items}
        renderItem={renderPaymentItem}
        numColumns={3}
        contentContainerStyle={styles.paddingTop16}
        keyExtractor={i => i.id}
        scrollEnabled={false}
      />
      <TextSmallEleven
        style={{textAlign: 'center', marginHorizontal: 5, marginTop: 10}}>
        Bằng việc thanh toán, Quý khách đã đồng ý với{' '}
        <TextSmallEleven
          onPress={() =>
            Linking.openURL('https://1000m.vn/chinh-sach-dat-hang')
          }
          style={{color: '#00A2F3', textDecorationLine: 'underline'}}>
          Chính sách đặt hàng
        </TextSmallEleven>
        {' và '}
        <TextSmallEleven
          onPress={() => Linking.openURL('https://1000m.vn/chinh-sach-bao-mat')}
          style={{color: '#00A2F3', textDecorationLine: 'underline'}}>
          Chính sách bảo mật
        </TextSmallEleven>{' '}
        tại 1000M
      </TextSmallEleven>
    </View>
  );
};

export default memo(PaymentGateway);
