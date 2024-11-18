import React, {memo, useEffect, useState} from 'react';
import {SafeAreaView, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Status from 'common/Status/Status';
import {TextHighLightBold} from 'common/Text/TextFont';
import Svg from 'common/Svg/Svg';

const ProductAction = ({currentOrder, handleClickBuy, statusAddProduct}) => {
  const [totalProduct, setTotalProduct] = useState(0);
  useEffect(() => {
    updateTotalMoney();
  }, [currentOrder]);
  const updateTotalMoney = () => {
    if (
      !currentOrder ||
      !currentOrder?.products ||
      !currentOrder.products.length
    ) {
      return;
    }
    let totalProducts = 0;
    if (currentOrder?.products && currentOrder.products.length > 0) {
      currentOrder.products.map(product => {
        totalProducts += parseInt(product.quantity, 10);
      });
    }
    setTotalProduct(totalProducts);
  };
  return (
    <SafeAreaView style={styles.wrapperAction}>
      <TouchableOpacity
        onPress={() => handleClickBuy(1)}
        disabled={statusAddProduct === Status.LOADING}
        style={styles.buttonClickBuy}>
        <TextHighLightBold style={styles.textOrder}>
          {'Mua ngay'}
        </TextHighLightBold>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={statusAddProduct === Status.LOADING}
        onPress={() => handleClickBuy(2)}
        style={styles.buttonAdd}>
        <View style={[styles.viewImage]}>
          <Svg
            name={'icon_giohang2'}
            size={36}
            style={[styles.containerImage]}
          />
        </View>
        <View style={styles.quantity}>
          <TextHighLightBold style={styles.textQuantity}>
            {currentOrder && currentOrder?.products.length > 0
              ? totalProduct
              : 0}
          </TextHighLightBold>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProductAction;
