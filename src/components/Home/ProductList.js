import React from 'react';
import {FlatList} from 'react-native';
import styles from './styles';
// import ProductItem from 'common/ProductItem/ProductItem';
import ProductHome from './ProductHome';

const ProductList = ({categoryProducts, clickDetailProduct}) => {
  const renderProductItem = ({item, index}) => {
    return (
      <ProductHome
        key={item.prodid}
        product={item}
        last={index === categoryProducts[0]?.products?.length - 1}
        onPressDetail={() => clickDetailProduct(item)}
      />
    );
  };
  return (
    <FlatList
      data={
        categoryProducts && categoryProducts.length > 0
          ? categoryProducts[0]?.products
          : []
      }
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{marginLeft: 16, marginRight: 24}}
      renderItem={renderProductItem}
      keyExtractor={(item, index) => `${item.prodid}_${index}`}
    />
  );
};

export default ProductList;
