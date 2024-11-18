import {heightDevice, widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  styleWrapperOptionLine: {
    paddingHorizontal: 10,
  },
  containerAnimatedOption: {paddingTop: 10, flex: 1},
  wrapperHeaderTitle: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  textHeader: {color: Colors.buttonTextColor, paddingLeft: 5},
  wrapperAnimationHeader: {
    position: 'absolute',
    top: 0,
    zIndex: 100,
    elevation: 1,
    width: '100%',
    backgroundColor: 'white',
    height: 60,
  },
  containerOption: {
    flex: 1,
    paddingVertical: 10,
  },
  buttonInfo: {
    position: 'absolute',
    bottom: 3,
    right: 10,
    padding: 5,
  },
  content: {
    paddingHorizontal: 16,
    backgroundColor: 'white',
    // height: heightDevice * 0.223,
  },
  imageProduct: {
    width: widthDevice,
    height: widthDevice,
    backgroundColor: 'white',
  },
  imageProductHeart: {
    width: widthDevice,
    height: (widthDevice * 5) / 8,
  },
  buttonClose: {
    position: 'absolute',
    // top: 15,
    left: 8,
    padding: 5,
    zIndex: 300,
  },
  // buttonInfo: {
  //   position: 'absolute',
  //   bottom: 15,
  //   right: 7,
  //   padding: 5,
  // },
  iconInfo: {
    height: 26,
    width: 26,
  },
  viewNameProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
  },
  nameProduct: {
    color: Colors.buttonTextColor,
    lineHeight: 22,
    marginTop: 0,
    textAlign: 'center',
    paddingTop: 5,
    // height: '50%',
  },
  containerMoneyProduct: {
    alignItems: 'flex-start',
    paddingBottom: 5,
    paddingTop: 5,
  },
  viewMoneyProduct: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonTextColor,
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 40,
  },
  moneyProduct: {
    color: 'white',
  },
  textDetail: {
    color: Colors.blackColor,
    marginTop: 10,
    marginBottom: 4,
  },
  viewLike: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  separator: {
    width: 1,
    height: 13,
    backgroundColor: Colors.textGrayColor,
    marginHorizontal: 10,
  },
  textLike: {
    color: Colors.textGrayColor,
  },
  wrapperListOption: {
    // height: heightDevice - heightDevice * 0.17 - heightDevice * 0.296,
    // paddingBottom: 10,
    backgroundColor: Colors.whiteColor,
    flex: 1,
  },
  listOptionsWrapper: {
    flex: 1,
    // flexGrow: 1,
    // height: 'auto',
    // backgroundColor: Colors.whiteColor,
    paddingTop: 10,
  },
  line: {
    width: 100,
    height: 4,
    backgroundColor: 'gray',
    borderRadius: 4,
    alignSelf: 'center',
  },
  wrapperAction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    paddingVertical: 10,
  },
  scrollContainer: {flex: 1, backgroundColor: 'white'},
  containerCart: {
    // height: heightDevice * 0.17,
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // // backgroundColor: 'transparent',
    // right: 0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
    flexDirection: 'column',
    elevation: 20,
    shadowColor: '#52006A',
  },
  styleContainerModalCart: {
    width: widthDevice * 0.6066,
    paddingHorizontal: 30,
  },
  separatorLine: {
    width: widthDevice - 36,
    backgroundColor: '#BCBCBC',
  },
  pointSeparator: {
    backgroundColor: '#BCBCBC',
  },
  textOrder: {
    textAlign: 'center',
    color: 'white',
  },
  textOrderAdd: {
    textAlign: 'center',
    color: Colors.buttonTextColor,
    fontWeight: 'bold',
  },
  buttonClickBuy: {
    backgroundColor: Colors.buttonTextColor,
    width: 160,
    height: 50,
    justifyContent: 'center',
    borderRadius: 40,
  },
  buttonAdd: {
    backgroundColor: Colors.buttonTextColor,
    flexDirection: 'row',
    width: 160,
    height: 50,
    borderRadius: 40,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImage: {
    flexDirection: 'row',
    height: 36,
  },
  quantity: {
    backgroundColor: Colors.numberColor,
    height: 25,
    width: 25,
    borderRadius: 20,
    marginLeft: -3,
    marginBottom: 15,
  },
  textQuantity: {
    color: Colors.buttonTextColor,
    textAlign: 'center',
  },
  containerImage: {},
});

export default styles;
