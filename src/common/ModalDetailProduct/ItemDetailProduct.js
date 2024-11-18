import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';

const ItemDetailProduct = ({data}) => {
  return (
    <TouchableOpacity activeOpacity={1} style={styles.container}>
      <View style={styles.viewTitle}>
        <View style={styles.dot} />
        <TextNormalSemiBold style={styles.textTitle}>
          {data.title}
        </TextNormalSemiBold>
      </View>
      <TextNormal>{data.content}</TextNormal>
    </TouchableOpacity>
  );
};

export default ItemDetailProduct;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  viewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: Colors.blackColor,
  },
  textTitle: {
    marginLeft: 8,
  },
});
