import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ProductCart from './ProductCart';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icons from 'common/Icons/Icons';
import Colors from 'theme/Colors';
import {TextSmallMedium} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import {useDispatch} from 'react-redux';
import {setCurrentOrder} from 'store/actions';
const bottom_height = 100;
const BottomSheetCart = ({currentOrder, handleShowUp}) => {
  useEffect(() => {
    if (currentOrder && currentOrder.products.length === 0) {
      handleShowUp();
    }
  }, [currentOrder]);
  let row = [];
  let prevOpenedRow;
  const dispatch = useDispatch();

  const removeItem = p => {
    let listProduct = currentOrder?.products.filter(
      a =>
        `${a.prodid}_${a?.option_item?.id}_${a?.extraIds}` !==
        `${p.prodid}_${p?.option_item?.id}_${p?.extraIds}`,
    );
    const updatedOrder = {
      ...currentOrder,
      products: JSON.parse(JSON.stringify(listProduct)),
    };
    dispatch(setCurrentOrder(updatedOrder));
  };
  const renderRightAc = (progress, dragX, p) => {
    return (
      <TouchableOpacity style={styles.swipeBtn} onPress={() => removeItem(p)}>
        <Icons
          name={'trash-can-outline'}
          type={'MaterialCommunityIcons'}
          size={25}
          color={'white'}
        />
        <TextSmallMedium style={{color: Colors.whiteColor}}>
          {strings.common.delete}
        </TextSmallMedium>
      </TouchableOpacity>
    );
  };

  const closeRow = index => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };
  return (
    <GestureHandlerRootView>
      {currentOrder.products.map(item => (
        <Swipeable
          key={`${item.prodid}_${item?.option_item?.id}_${item?.extraIds}`}
          onSwipeableOpen={() => closeRow(item.prodid)}
          ref={ref => (row[item.prodid] = ref)}
          containerStyle={styles.wrapperSwipeItem}
          renderRightActions={(progress, dragX) =>
            renderRightAc(progress, dragX, item)
          }>
          <ProductCart product={item} indexP={item.prodid} />
        </Swipeable>
      ))}
      {currentOrder.products && currentOrder.products.length > 4 && (
        <View style={{height: bottom_height}} />
      )}
    </GestureHandlerRootView>
  );
};

export default BottomSheetCart;
const styles = StyleSheet.create({
  wrapperSwipeItem: {
    paddingVertical: 12,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
    borderStyle: 'solid',
  },
  swipeBtn: {
    width: 80,
    backgroundColor: Colors.redColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
