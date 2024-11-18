import {widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  expiredText: {
    textAlign: 'center',
    fontWeight: '600',
    color: Colors.redColor,
    fontSize: 15,
  },
  wrapperProductPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  wrapperProductPriceHome: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wrapperExpired: {
    position: 'absolute',
    top: (widthDevice - 36) / 4,
    zIndex: 100,
  },
  textAppOnly: {fontSize: 10, color: Colors.primary, fontWeight: '700'},
  wrapperAppOnly: {
    borderRadius: 4,
    paddingHorizontal: 4,
    alignItems: 'center',
    borderColor: Colors.primary,
    justifyContent: 'center',
    height: 16,
    // paddingVertical: 1,
    borderWidth: 1,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  content: {
    // justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 8,
  },
  image: {},
  wrapperProductName: {
    paddingBottom: 8,
  },
  textName: {
    fontSize: 13,
    // backgroundColor: 'red',
  },
  categoryIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  quantityText: {
    color: Colors.whiteColor,
    fontSize: 16,
  },
  quantityNumber: {
    position: 'absolute',
    opacity: 0.9,
    height: 32,
    width: 32,
    backgroundColor: Colors.primary,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    top: 4,
    left: 4,
  },
  icon: {
    marginLeft: 1,
    marginBottom: 2,
    fontWeight: 'bold',
    width: 17,
    height: 17,
  },
  separatorLine: {
    width: '70%',
    backgroundColor: '#1F443D',
    // paddingTop: -10,
  },
  productId: {
    paddingBottom: 6,
  },
  priceText: {
    color: Colors.hot,
    // paddingHorizontal: 8,
    // backgroundColor: 'red',
    paddingRight: 8,
    fontSize: 14,
  },
  priceSaleText: {
    color: Colors.hot,
    fontSize: 14,
  },
  priceSaleTextHome: {
    color: Colors.redColor,
    fontSize: 14,
    marginLeft: 4,
  },
  priceOriginalText: {
    color: 'grey',
    fontSize: 12,
    textDecorationLine: 'line-through',
    paddingRight: 8,
    // paddingLeft: 8,
    // backgroundColor: 'red',
  },
  priceOriginalTextHome: {
    color: 'grey',
    textDecorationLine: 'line-through',
    fontSize: 12,
  },
  productSelected: {
    paddingBottom: 6,
    // paddingRight: 20,
    color: Colors.buttonTextColor,
  },
});

export default styles;
