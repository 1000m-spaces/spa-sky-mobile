import {
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallEleven,
} from 'common/Text/TextFont';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {formatMoney} from 'assets/constans';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {IMAGE_URL} from 'assets/constans';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentOrder, statusSetCurrentProduct} from 'store/selectors';
import {setCurrentOrder} from 'store/actions';
import Svg from 'common/Svg/Svg';
import {React, useEffect, useState} from 'react';
import Status from 'common/Status/Status';

const ProductCart = ({product}) => {
  const statusSetProduct = useSelector(state => statusSetCurrentProduct(state));
  const currentOrder = useSelector(state => getCurrentOrder(state));
  const [extraText, setExtraText] = useState('');
  const dispatch = useDispatch();
  const [extraPrice, setExtraPrice] = useState(0);
  useEffect(() => {
    if (product && product?.prodid) {
      let tempText =
        product?.option_item?.id !== -1
          ? `${product?.option_item?.name_vn}`
          : '';
      let tempPrice = 0;

      product?.extra_items &&
        product.extra_items.map(extra => {
          tempPrice = extra?.price > 0 ? tempPrice + extra?.price : tempPrice;
        });
      tempText += Array.from(product.extra_items, (a, i) =>
        i === 0 ? `, ${a.name_vn}` : ` ${a.name_vn}`,
      ).toString();

      setExtraPrice(tempPrice);
      tempText && setExtraText(tempText);
    }
  }, []);
  const handleQuantity = type => {
    const listProduct =
      JSON.parse(JSON.stringify(Array.from([...currentOrder.products]))) || [];
    listProduct.map((prod, i) => {
      if (
        product.prodid === prod.prodid &&
        product?.option_item?.id === prod?.option_item?.id &&
        JSON.stringify(product.extraIds) === JSON.stringify(prod.extraIds)
      ) {
        if (product.quantity >= 1) {
          if (type === '-' && prod.quantity === 1) {
            listProduct.splice(i, 1);
          } else {
            prod.quantity =
              type === '+' ? prod.quantity + 1 : prod.quantity - 1;
          }
        }
      }
    });
    // console.log('NEW LIST PRODICT:::', listProduct);
    const updatedOrder = {
      ...currentOrder,
      products: JSON.parse(JSON.stringify(listProduct)),
    };
    dispatch(setCurrentOrder(updatedOrder));
  };

  return (
    <View>
      <View style={styles.itemWrapper}>
        <Images
          resizeMode="contain"
          style={styles.imageStyle}
          source={
            product && product?.prodimg && product?.prodimg.includes('http')
              ? {uri: `${product.prodimg}`}
              : {uri: `${IMAGE_URL}${product.prodimg}`}
          }
        />
        <View style={styles.contentWrapper}>
          <TextSemiBold numberOfLines={2} style={styles.productName}>
            {product?.prodname || ''}
          </TextSemiBold>
          <TextSmallEleven
            numberOfLines={2}
            style={{color: Colors.textGrayColor, width: '90%'}}>
            {extraText || ''}
          </TextSmallEleven>

          <View style={styles.wrapperLineProduct}>
            <TextSemiBold style={styles.moneyText}>
              {formatMoney(product.order_price + extraPrice || '') + 'đ'}
            </TextSemiBold>
            <View style={styles.wrapperQuantity}>
              <TouchableOpacity
                disabled={statusSetProduct === Status.LOADING}
                onPress={() => handleQuantity('-')}>
                <Svg name={'icon_subtract'} size={24} color={'white'} />
              </TouchableOpacity>
              <TextNormalSemiBold style={{fontSize: 15}}>
                {product.quantity}
              </TextNormalSemiBold>
              <TouchableOpacity
                disabled={statusSetProduct === Status.LOADING}
                onPress={() => handleQuantity('+')}>
                <Svg name={'icon_plus'} size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {currentOrder.takeaway && product.delivery_support === 0 && (
        <TextSmallEleven
          style={{color: Colors.warning, paddingLeft: 15, paddingTop: 2}}>
          {'*Sản phẩm không hỗ trợ giao hàng'}
        </TextSmallEleven>
      )}
    </View>
  );
};
export default ProductCart;

const styles = StyleSheet.create({
  swipeBtn: {
    width: 80,
    backgroundColor: Colors.redColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {flexDirection: 'row'},
  wrapperLineProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 3,
    alignItems: 'center',
  },
  wrapperQuantity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '30%',
  },
  extraSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  optionText: {
    fontStyle: 'italic',
    fontSize: 13,
    color: Colors.textGrayColor,
  },
  productInfor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moneyText: {
    color: Colors.buttonTextColor,
    fontSize: 13,
    alignSelf: 'center',
  },
  itemWrapper: {
    // paddingVertical: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    // marginVertical: 1,
  },
  productName: {
    fontSize: 13,
  },
  imageStyle: {
    width: 52,
    height: 52,
    resizeMode: 'cover',
    marginRight: 10,
    marginTop: 1,
    marginLeft: 0,
    // marginTop: 2,
    borderRadius: 4,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonQuantity: {
    height: 24,
    width: 24,
    marginRight: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
  },
});
