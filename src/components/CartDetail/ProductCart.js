import {TextNormal, TextSemiBold, TextSmallEleven} from 'common/Text/TextFont';
import {View, StyleSheet} from 'react-native';
import {formatMoney, logo} from 'assets/constans';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';
import {IMAGE_URL} from 'assets/constans';
import {React, memo, useEffect, useState} from 'react';

const ProductCart = ({
  product,
  isLast,
  voucher,
  showMore,
  index,
  voucherType,
}) => {
  const [extraText, setExtraText] = useState('');
  const [extraPrice, setExtraPrice] = useState(0);
  useEffect(() => {
    let tempText;
    let tempPrice = 0;
    if (product) {
      tempText =
        product?.option_item?.id !== -1
          ? `${product?.option_item?.name_vn}`
          : '';
      if (product?.extra_items && product?.extra_items.length > 0) {
        tempText += Array.from(product?.extra_items || [], (a, i) =>
          i === 0 ? `, ${a.name_vn}` : ` ${a.name_vn}`,
        ).toString();

        product?.extra_items.map(extra => {
          tempPrice = extra?.price > 0 ? tempPrice + extra?.price : tempPrice;
        });
      }

      tempPrice > 0 && setExtraPrice(tempPrice);
      tempText && setExtraText(tempText);
    }
  }, []);

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.itemWrapper,
          isLast && index > 0 && {borderBottomColor: 'transparent'},
          !showMore && index > 1 && {display: 'none'},
        ]}>
        <Images
          resizeMode="contain"
          style={styles.imageStyle}
          source={
            product?.prodimg && product?.prodimg.length > 0
              ? {
                  uri: product?.prodimg.includes('https')
                    ? `${product?.prodimg}`
                    : `${IMAGE_URL}${product?.prodimg}`,
                }
              : logo
          }
        />
        <View style={[styles.contentWrapper]}>
          <TextSemiBold numberOfLines={2} style={styles.productName}>
            {voucher && voucherType === 1
              ? product?.product_name || product?.prodname
              : product?.prodname || product?.product_name}
          </TextSemiBold>
          {extraText !== '' && (
            <TextSmallEleven
              numberOfLines={2}
              style={{color: Colors.secondary}}>
              {extraText}
            </TextSmallEleven>
          )}
          <TextNormal>{`x${product?.quantity}`}</TextNormal>
        </View>
        <View>
          <TextSemiBold style={styles.moneyText}>
            {formatMoney(
              voucher && voucherType === 1
                ? product?.amount ||
                    (product.order_price + extraPrice) * product?.quantity
                : (product.order_price + extraPrice) * product?.quantity,
            ) + 'đ'}
          </TextSemiBold>
          {product && product?.price_discount > 0 && (
            <TextNormal style={styles.initPrice}>
              {formatMoney(product ? product?.paid_price : 0) + 'đ'}
            </TextNormal>
          )}
        </View>
      </View>
    </View>
  );
};
export default memo(ProductCart);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  initPrice: {
    textDecorationLine: 'line-through',
    color: Colors.secondary,
  },
  wrapperPriceLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingTop: 3,
    alignItems: 'center',
  },
  extraSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // backgroundColor: 'red',
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
    // backgroundColor: 'blue',
    // marginBottom: 5,
  },
  moneyText: {
    fontSize: 13,
    // color: Colors.redColor,
    alignSelf: 'center',
  },
  itemWrapper: {
    paddingVertical: 12,
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    // marginHorizontal: 10,
    borderBottomColor: '#E9E9E9',
    borderBottomWidth: 0.7,
    borderStyle: 'solid',
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
    // justifyContent: 'space-between',
  },
});
