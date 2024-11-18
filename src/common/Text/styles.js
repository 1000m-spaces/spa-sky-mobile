import {Platform, StyleSheet} from 'react-native';
import Colors from 'theme/Colors';
const isAndroid = Platform.OS === 'android';

const styles = StyleSheet.create({
  small11: {
    fontFamily: isAndroid ? 'Roboto-Regular' : 'SF Pro Display Regular',
    fontSize: 11,
    color: Colors.blackColor,
    // fontWeight: '400',
  },
  small12: {
    fontFamily: isAndroid ? 'Roboto-Regular' : 'SF Pro Display Regular',
    fontSize: 12,
    color: Colors.blackColor,
    // fontWeight: '400',
  },
  smallMedium12: {
    fontFamily: isAndroid ? 'Roboto-Regular' : 'SF Pro Display Medium',
    fontSize: 12,
    color: Colors.blackColor,
    // fontWeight: '500',
  },
  normal13: {
    fontFamily: isAndroid ? 'Roboto-Regular' : 'SF Pro Display Regular',
    fontSize: 13,
    color: Colors.blackColor,
    fontWeight: '600',
  },
  normalSemiBold13: {
    fontFamily: isAndroid ? 'Roboto-Bold' : 'SF Pro Display Semibold',
    fontSize: 13,
    color: Colors.blackColor,
    // fontWeight: '700',
  },
  highLightBold16: {
    fontFamily: isAndroid ? 'Roboto-Bold' : 'SF Pro Display Bold',
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: '700',
  },
  semiBold16: {
    fontFamily: isAndroid ? 'Roboto-Bold' : 'SF Pro Display Semibold',
    fontSize: 16,
    color: Colors.blackColor,
    fontWeight: '700',
    // fontStyle: 'normal',
  },
  moneyBold20: {
    fontFamily: isAndroid ? 'Roboto-Bold' : 'SF Pro Display Bold',
    fontSize: 20,
    color: Colors.blackColor,
    fontWeight: isAndroid ? 'bold' : '700',
  },
});

export default styles;
