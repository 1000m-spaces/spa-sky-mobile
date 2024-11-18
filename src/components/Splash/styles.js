import Colors from 'theme/Colors';
import {StyleSheet} from 'react-native';
import {heightDevice, widthDevice} from 'assets/constans';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewLogo: {
    width: 130,
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    // marginTop: heightDevice - widthDevice * 1.4188 - 65,
    backgroundColor: '#B29171',
    borderRadius: 30,
  },
  viewLogoSlogan: {
    backgroundColor: '#162D25',
    alignItems: 'center',
    width: widthDevice,
    // height: heightDevice - widthDevice * 1.4188,
    zIndex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  iconLogo: {
    // height: 135,
    // width: 135,
    marginTop: 245,
    marginBottom: 15,
  },
  textShop: {
    fontSize: 16,
    color: Colors.whiteColor,
  },
  imageSlogan: {
    height: 26,
    width: 220,
  },
  viewBottom: {
    width: widthDevice,
    // height: widthDevice * 1.4188,
    zIndex: 0,
  },
  containerUpdate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default styles;
