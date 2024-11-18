import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React from 'react';
import {FlatList, View} from 'react-native';
import styles from './styles';
import strings from 'localization/Localization';
import {formatMoney} from 'assets/constans';
import Item from './Item';
const SHIP_FEE = 15000;
const ListItem = ({products, detailOrder}) => {
  const renderItem = ({item, index}) => {
    return (
      <Item
        key={index}
        product={item}
        index={index}
        last={index === products.length - 1}
      />
    );
  };
  return (
    <View style={styles.inforSection}>
      <TextSemiBold style={styles.titleText}>
        {strings.detailOrderScreen.orderedDrinks}
      </TextSemiBold>
      <FlatList
        data={products}
        keyExtractor={(_, i) => i}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
      {detailOrder?.price_discount > 0 && (
        <View
          style={[
            styles.totalText,
            {borderStyle: 'dashed', marginHorizontal: 10, paddingHorizontal: 0},
          ]}>
          <TextSmallTwelve>
            {strings.detailOrderScreen.discountTitle}
          </TextSmallTwelve>
          <TextNormalSemiBold>
            {'-' + formatMoney(detailOrder?.price_discount) + 'đ'}
          </TextNormalSemiBold>
        </View>
      )}
      {detailOrder && detailOrder.is_delivery === 1 && (
        <View style={styles.totalText}>
          <TextNormal>{'Phí giao hàng'}</TextNormal>
          <TextNormalSemiBold style={styles.contentTotal}>
            {'+' + formatMoney(SHIP_FEE) + 'đ'}
          </TextNormalSemiBold>
        </View>
      )}
      <View style={styles.totalText}>
        <TextNormalSemiBold>
          {strings.detailOrderScreen.totalAmount}
        </TextNormalSemiBold>
        <TextSemiBold style={styles.contentTotal}>
          {formatMoney(detailOrder.price_paid) + 'đ'}
        </TextSemiBold>
      </View>
    </View>
  );
};

export default ListItem;
