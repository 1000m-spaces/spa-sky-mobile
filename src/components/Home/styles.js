import {heightDevice, widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 5,
  },
  voucherAction: {
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    flex: 1,
  },
  dashed: {
    height: 73,
    width: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.backgroundColor,
  },
  desVoucher: {
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  wrapperVoucherSection: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
    // borderRightWidth: 1,
    // borderRightColor: 'white',
    // borderStyle: 'dashed',
    width: '74%',
    alignItems: 'center',
  },
  wrapperLineVoucher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
    alignItems: 'center',
  },
  voucherName: {
    color: Colors.whiteColor,
    fontSize: 16,
    textAlign: 'center',
    paddingLeft: 10,
  },
  wrapperGreeting: {
    marginTop: 15,
    marginBottom: 10,
    width: widthDevice - 30,
    alignSelf: 'center',
    height: 98,
    justifyContent: 'space-between',
    flexDirection: 'row',
    // backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
    borderRadius: 12,
  },
  labelBonus: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 20,
    backgroundColor: '#EF0000',
    marginLeft: 3,
  },
  textExpired: {
    color: '#EF0000',
    fontSize: 10,
    paddingVertical: 5,
  },
  topUpBtn: {
    paddingHorizontal: 8,
    paddingVertical: 7,
    backgroundColor: '#FFD85A',
    position: 'absolute',
    top: 0,
    right: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteText: {color: Colors.whiteColor},
  whiteText10: {color: Colors.whiteColor, fontSize: 10},
  wrapperBalance: {
    width: widthDevice / 2 - 15,
    paddingVertical: 8,
    backgroundColor: Colors.buttonTextColor,
    marginTop: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 0,
    marginTop: -heightDevice * 0.08,
    zIndex: 1,
  },
  contentSwiper: {
    // flex: 1,
    height: widthDevice + 15,
    width: widthDevice,
  },
  styleContainerProduct: {
    width: widthDevice * 0.36,
    height: heightDevice * 0.25 + 10,
    // marginHorizontal: 15,
    marginLeft: 15,
  },
  styleImageProduct: {
    width: widthDevice * 0.36,
    height: heightDevice * 0.15 + 2.5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignSelf: 'center',
  },
  textCategory: {
    marginTop: 3,
    paddingVertical: 7,
    paddingLeft: 15,
  },
  textCate: {
    textAlign: 'center',
    marginBottom: 10,
  },
  containerModalCategory: {
    paddingTop: 10,
    backgroundColor: Colors.backgroundColor,
    width: widthDevice - 24,
    borderRadius: 18,
  },
});

export default styles;
