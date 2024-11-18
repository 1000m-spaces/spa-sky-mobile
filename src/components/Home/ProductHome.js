import {TextSmallMedium} from 'common/Text/TextFont';
import {IMAGE_URL, widthDevice} from 'assets/constans';
import React, {memo} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

import FastImage from 'react-native-fast-image';
import Colors from 'theme/Colors';

const ProductHome = ({onPressDetail, product, last}) => {
  if (!product) {
    console.log('product is undefined');
    return;
  }
  return (
    <TouchableOpacity
      onPress={() => onPressDetail(product)}
      style={[styles.container, last && {marginRight: 24}]}>
      <View style={styles.content}>
        <FastImage
          style={styles.image}
          source={{
            uri: product.prodimg.includes('https')
              ? `${product.prodimg}`
              : `${IMAGE_URL}${product.prodimg}`,
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{padding: 8}}>
          <TextSmallMedium numberOfLines={2} style={styles.textName}>
            {product.prodname}
          </TextSmallMedium>
          <TextSmallMedium numberOfLines={2} style={styles.des}>
            {product.proddest.replace('"', '')}
          </TextSmallMedium>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductHome);

const styles = StyleSheet.create({
  des: {
    fontSize: 12,
    color: '#555555', 
  },
  image: {
    width: widthDevice * 0.4,
    height: 175,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  textName: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    width: widthDevice * 0.4,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
});
