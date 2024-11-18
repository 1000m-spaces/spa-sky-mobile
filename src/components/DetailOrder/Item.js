import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from 'common/Images/Images';
import styles from './styles';
import {IMAGE_URL, formatMoney, tra_logo, neocafe_logo} from 'assets/constans';
import {
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallEleven,
} from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import strings from 'localization/Localization';

const Item = ({product, last}) => {
  const [extraPrice, setExtraPrice] = useState(0);
  const [extraText, setExtraText] = useState('');
  useEffect(() => {
    if (product) {
      let tempPrice = 0;
      let tempList = [];
      if (product?.opt_names && product?.opt_names !== '') {
        tempList.push(product?.opt_names);
      }
      if (product.extra_items && product.extra_items.length > 0) {
        product.extra_items.map((extra, i) => {
          tempList.push(extra.name);
          tempPrice += extra.price;
        });
      }
      setExtraPrice(tempPrice);
      if (tempList && tempList.length > 0) {
        setExtraText(tempList.join(', '));
      }
      // setExtraText();
    }
    return () => {
      setExtraPrice(0);
      setExtraText('');
    };
  }, []);
  return (
    <View style={[styles.itemWrapper, last && {borderBottomWidth: 0}]}>
      {product.img1.length > 0 ? (
        <Images
          resizeMode="contain"
          style={styles.imageStyle}
          source={{uri: `${IMAGE_URL}/${product.img1}`}}
        />
      ) : (
        <Images resizeMode="contain" style={styles.imageStyle} source={tra_logo} />
      )}
      <View style={styles.contentWrapperItem}>
        <View style={styles.wrapperProductLine}>
          <View style={styles.wrapperProductName}>
            <TextSemiBold style={styles.productName} numberOfLines={2}>
              {product?.prodname}
            </TextSemiBold>
          </View>

          <TextSmallEleven style={styles.textQuantity}>
            {strings.common.quantity + ': ' + product?.quantity}
          </TextSmallEleven>
        </View>
        <View style={styles.contentPrice}>
          <View style={styles.contentExtra}>
            <TextSmallEleven
              style={{color: Colors.textGrayColor, width: '90%'}}
              numberOfLines={2}>
              {extraText}
            </TextSmallEleven>
          </View>
          <TextNormalSemiBold style={styles.textPrice}>
            {formatMoney(product?.paid_price + extraPrice) + 'đ'}
          </TextNormalSemiBold>
        </View>
      </View>
    </View>
  );
};

export default Item;
