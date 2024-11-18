import { heightDevice, widthDevice } from 'assets/constans';
import { StyleSheet } from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contents: {
    paddingHorizontal: 5,
    flex: 1,
    paddingBottom: 10,
  },
  styleContainerProduct: {
    width: (widthDevice - 50) / 2 + 4,
    height: heightDevice * 0.28 + 5,
    marginBottom: 10,
    marginHorizontal: 8,
  },
  textCate: {
    textAlign: 'center',
    marginBottom: 19,
  },
  errorContainer: { justifyContent: 'center', width: '100%', height: '100%' },
  styleImageProduct: {
    width: widthDevice * 0.3125,
    height: heightDevice * 0.14 + 2.5,
    borderRadius: 10,
  },
  styleModalCart: {
    position: 'absolute',
    bottom: 5,
    width: widthDevice - 99,
    left: 50,
  },
  modalNoti: {
    width: widthDevice - 40,
    // minHeight: '35%',
    paddingVertical: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  containerModalCategory: {
    paddingTop: 20,
    backgroundColor: Colors.backgroundColor,
    width: widthDevice - 24,
    // height: heightDevice * 0.634,
    borderRadius: 17,
  },
  buttonConfirmNewOrder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.buttonTextColor,
    paddingVertical: 7,
    width: 120,
    borderRadius: 30,
  },
  imageStyle: {
    width: 120,
    height: 50,
  },
});

export default styles;
