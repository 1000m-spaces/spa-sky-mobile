import {
  TextNormalSemiBold,
  TextSemiBold,
  TextSmallEleven,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import React, {memo, useCallback, useState} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icons from 'common/Icons/Icons';
import {formatMoney} from 'assets/constans';
import ProductCart from './ProductCart';
import Colors from 'theme/Colors';
export const FEE_SHIP = 15000;
const ProductList = ({currentOrder, payment}) => {
  const [showMore, setShowMore] = useState(false);
  const renderProductItem = ({item, index}) => {
    return (
      <ProductCart
        product={item}
        voucher={currentOrder.voucher}
        voucherType={currentOrder?.voucher?.voucher_discount_type || -1}
        isLast={
          (!showMore && index === 1) ||
          index === currentOrder?.products.length - 1 ||
          index === currentOrder?.applied_products.length - 1
        }
        showMore={showMore}
        index={index}
      />
    );
  };
  const onShowMore = useCallback(() => setShowMore(prev => (prev = !prev)), []);
  return (
    <View style={styles.contentContainer}>
      <TextSemiBold style={styles.textTitle}>
        {strings.cartScreen.listProducts}
      </TextSemiBold>
      <FlatList
        scrollEnabled={false}
        data={
          currentOrder.voucher &&
          currentOrder.voucher.voucher_discount_type === 1
            ? currentOrder.applied_products
            : currentOrder?.products
        }
        renderItem={renderProductItem}
        keyExtractor={(item, idx) =>
          `${item.prodname || item.product_name}_${
            item.prodid || item.product_id
          }_${Array.from(item.extra_items || [], a => a.id)}_${
            item.option_item?.id || -1
          }_${idx}`
        }
        showsVerticalScrollIndicator={false}
      />
      {(currentOrder.products.length > 2 ||
        currentOrder.applied_products.length > 2) && (
        <View style={[styles.rowLineBetween]}>
          <View style={styles.decorateLine} />
          <TouchableOpacity
            onPress={onShowMore}
            style={[styles.row, {paddingHorizontal: 10}]}>
            <TextSmallEleven style={styles.showMoreText}>
              {showMore ? 'Rút gọn' : 'Xem thêm'}
            </TextSmallEleven>
            <Icons
              type={'AntDesign'}
              name={!showMore ? 'down' : 'up'}
              size={10}
              color={'gray'}
            />
          </TouchableOpacity>
          <View style={styles.decorateLine} />
        </View>
      )}
      <View style={[styles.rowBetween]}>
        <TextSmallEleven>{`Tổng cộng (${payment.prod} món)`}</TextSmallEleven>
        <TextSmallEleven>{formatMoney(payment.init) + 'đ'}</TextSmallEleven>
      </View>
      {currentOrder.voucher && currentOrder?.voucher?.price_discount > 0 && (
        <View style={[styles.rowBetween]}>
          <TextSmallEleven style={{color: Colors.link}}>
            {'Ưu đãi'}
          </TextSmallEleven>
          <TextSmallMedium style={styles.discountText}>{`-${formatMoney(
            currentOrder?.voucher?.price_discount || 0,
          )}đ`}</TextSmallMedium>
        </View>
      )}
      {currentOrder.takeaway && (
        <View style={[styles.rowBetween]}>
          <TextSmallEleven style={{color: Colors.hot}}>
            {'Phí giao hàng'}
          </TextSmallEleven>
          <TextSmallTwelve style={styles.discountText}>{`+${formatMoney(
            FEE_SHIP,
          )}đ`}</TextSmallTwelve>
        </View>
      )}
      <View style={[styles.rowLineBetween, {paddingVertical: 15}]}>
        <TextNormalSemiBold>{'Thanh toán'}</TextNormalSemiBold>
        <TextNormalSemiBold style={{color: '#255D54'}}>
          {formatMoney(payment.total) + 'đ'}
        </TextNormalSemiBold>
      </View>
    </View>
  );
};

export default memo(ProductList);
