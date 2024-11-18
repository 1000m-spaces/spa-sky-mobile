import {TextMoneyBold} from 'common/Text/TextFont';
import React, {memo, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View, Animated} from 'react-native';
import Svg from 'common/Svg/Svg';
const ProductQuantityControl = ({setQuantity, quantity}) => {
  // const statusSetProduct = useSelector(state => statusSetCurrentProduct(state));
  const [isLoading, setIsLoading] = React.useState(false);
  const incrementQuantity = () => {
    setIsLoading(true);
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
  };
  const decreaseQuantity = () => {
    setIsLoading(true);
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
  };
  useEffect(() => {
    let timeout;
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);
  const handleQuantity = type => {
    if (type === 1) {
      incrementQuantity();
    } else {
      decreaseQuantity();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.containerButtonAction}>
        <TouchableOpacity
          disabled={isLoading}
          onPress={() => handleQuantity(-1)}>
          <Svg name={'icon_subtract'} size={36} color={'white'} />
        </TouchableOpacity>
        <TextMoneyBold style={styles.textMoney}>{quantity}</TextMoneyBold>
        <TouchableOpacity
          disabled={isLoading}
          onPress={() => handleQuantity(1)}>
          <Svg name={'icon_plus'} color={'white'} size={36} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ProductQuantityControl;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginTop: 8,
  },
  containerButtonAction: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 2,
  },
  textMoney: {
    marginHorizontal: 10,
    paddingHorizontal: 5,
    fontSize: 25,
  },
});
