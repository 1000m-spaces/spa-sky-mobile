import {heightDevice, widthDevice} from 'assets/constans';
import {TextMoneyBold, TextNormalSemiBold} from 'common/Text/TextFont';
import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import {useSelector} from 'react-redux';
import {getCurrentOrder} from 'store/selectors';
import {formatMoney} from 'assets/constans';
import Svg from 'common/Svg/Svg';

const ModalCart = ({styleContainerModalCart, onPress, showCart, type}) => {
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const [totalMoney, setTotalMoney] = React.useState(0);
  const [totalProduct, setTotalProduct] = React.useState(0);

  useEffect(() => {
    updateTotalMoney();
  }, [currentOrder]);
  const updateTotalMoney = () => {
    let totalPayment = 0;
    let totalProducts = 0;
    if (currentOrder?.products && currentOrder.products.length > 0) {
      currentOrder.products.map(product => {
        let tempExtra = 0;
        if (product?.extra_items && product?.extra_items.length > 0) {
          product.extra_items.map(extra => {
            tempExtra = extra?.price > 0 ? tempExtra + extra?.price : tempExtra;
          });
        }
        totalPayment +=
          parseInt(product.order_price + tempExtra, 10) *
          parseInt(product.quantity, 10);
        totalProducts += parseInt(product.quantity, 10);
      });
    }
    setTotalMoney(totalPayment);
    setTotalProduct(totalProducts);
  };

  return (
    <Animated.View style={[styles.container, styleContainerModalCart]}>
      <TouchableOpacity
        onPress={showCart}
        style={[
          {
            justifyContent: 'space-between',
            flex: 1,
            flexDirection: 'row',
            alignItems: type === 1 ? 'center' : 'flex-start',
          },
        ]}>
        <View style={type === 1 ? styles.viewImage : styles.wrapperCart}>
          <Svg name={'icon_giohang1'} size={30} />
          <View style={[styles.quantity, type === 2 && {top: 0}]}>
            <TextNormalSemiBold style={styles.textQuantity}>
              {totalProduct}
            </TextNormalSemiBold>
          </View>
        </View>
        <TextMoneyBold style={[styles.textMoney, type === 2 && {marginTop: 5}]}>
          {formatMoney(totalMoney)}đ
        </TextMoneyBold>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress} style={styles.paymentBtn}>
        <TextNormalSemiBold style={{color: 'white'}}>{'Thanh toán'}</TextNormalSemiBold>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ModalCart;

const styles = StyleSheet.create({
  paymentBtn: {
    width: 114,
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    borderRadius: 40,
    marginHorizontal: 10,
    backgroundColor: Colors.hot,
  },
  wrapperCart: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    // paddingVertical: 5,
    // backgroundColor: 'red',
    // alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'orange',
  },
  container: {
    backgroundColor: Colors.buttonTextColor,
    flexDirection: 'row',
    // height: 50,
    width: widthDevice,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewImage: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  image: {
    height: 30,
    width: 30,
    tintColor: 'white',
  },
  textMoney: {
    color: 'white',
    // lineHeight: 22,
    fontSize: 16,
  },
  quantity: {
    backgroundColor: Colors.redColor,
    height: 22,
    position: 'absolute',
    right: -2,
    width: 22,
    top: 7,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -5,
  },
  textQuantity: {
    color: Colors.whiteColor,
  },
});
