import {
  TextHighLightBold,
  TextNormal,
  TextNormalSemiBold,
  TextSmallMedium,
} from 'common/Text/TextFont';
import {IMAGE_URL} from 'assets/constans';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {formatMoney} from 'assets/constans';
import strings from 'localization/Localization';
import FastImage from 'react-native-fast-image';

const ProductItem = ({
  styleContainer,
  styleImage,
  onPressDetail,
  product,
  screen = '',
}) => {
  if (!product) {
    console.log('product is undefined');
    return;
  }
  return (
    <TouchableOpacity
      onPress={() => onPressDetail(product)}
      style={[styles.container, styleContainer]}>
      <View style={styles.content}>
        <FastImage
          style={[
            styles.image,
            styleImage,
            product.isExpired && {
              opacity: 0.5,
              backgroundColor: 'gray',
            },
          ]}
          source={{
            uri: product.prodimg.includes('https')
              ? `${product.prodimg}`
              : `${IMAGE_URL}${product.prodimg}`,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{padding: 8}}>
          <View style={styles.wrapperProductName}>
            <TextSmallMedium numberOfLines={2} style={styles.textName}>
              {product.prodname}
            </TextSmallMedium>
          </View>
          {screen === 'Home' && (
            <View style={styles.wrapperProductPriceHome}>
              {product.prodprice !== product.order_price && (
                <TextNormal style={styles.priceOriginalTextHome}>
                  {formatMoney(product.prodprice) + 'đ'}
                </TextNormal>
              )}
              <TextHighLightBold
                style={
                  product.prodprice !== product.order_price
                    ? screen === 'Home'
                      ? styles.priceSaleTextHome
                      : styles.priceSaleText
                    : styles.priceText
                }>
                {formatMoney(product.order_price) + 'đ'}
              </TextHighLightBold>
            </View>
          )}
          {/* styles.priceOriginalText */}
          {screen !== 'Home' && (
            <View>
              {product.prodprice !== product.order_price && (
                <TextNormal style={styles.priceOriginalText}>
                  {formatMoney(product.prodprice) + 'đ'}
                </TextNormal>
              )}
              <View style={styles.wrapperProductPrice}>
                <TextHighLightBold
                  style={
                    product.prodprice !== product.order_price
                      ? styles.priceSaleText
                      : styles.priceText
                  }>
                  {formatMoney(product.order_price) + 'đ'}
                </TextHighLightBold>
                {product?.app_only === 1 && (
                  <View style={styles.wrapperAppOnly}>
                    <TextSmallMedium style={styles.textAppOnly}>
                      {'Chỉ trên App'}
                    </TextSmallMedium>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </View>
      {product?.quantity > 0 && product.categoryid !== -1 && (
        <TouchableOpacity style={styles.quantityNumber}>
          <TextNormalSemiBold style={styles.quantityText}>
            {'+' + product.quantity}
          </TextNormalSemiBold>
        </TouchableOpacity>
      )}
      {product.isExpired && (
        <View style={styles.wrapperExpired}>
          <TextNormal style={styles.expiredText}>
            {strings.common.soldOut}
          </TextNormal>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default memo(ProductItem);
