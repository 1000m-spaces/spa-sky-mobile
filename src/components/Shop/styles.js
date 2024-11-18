import { heightDevice, widthDevice } from 'assets/constans';
import { StyleSheet } from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  styleMap: {
    height: heightDevice * 0.4096,
  },
  viewTextInput: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.whiteColor,
    flexDirection: 'row',
  },
  // viewTextInputKeyboard: {
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: 10,
  //   borderTopWidth: 1,
  //   borderTopColor: Colors.whiteColor,
  //   flexDirection: 'row',
  // },
  wrapperContentConfirm: {
    justifyContent: 'center',
    height: 80,
    alignItems: 'center',
  },
  buttonTextInput: {
    flexDirection: 'row',
    borderWidth: 0.5,
    paddingVertical: 8,
    paddingRight: 15,
    paddingLeft: 8,
    borderRadius: 20,
    borderColor: Colors.buttonTextColor,
    height: 35,
    alignItems: 'center',
    width: widthDevice * 0.6,
    backgroundColor: Colors.whiteColor,
  },
  headerModal: {
    height: 50,
    backgroundColor: Colors.buttonTextColor,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textConfirmTitle: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 12,
    color: 'white',
  },
  modalButtonCancel: {
    height: 37,
    width: 120,
    borderWidth: 2,
    borderColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  modalButtonOk: {
    height: 38,
    width: 120,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  modalButtonCancelText: {
    color: Colors.buttonTextColor,
  },
  modalButtonOkText: {
    color: 'white',
  },
  wrapperButtonSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: heightDevice / 3.5 - 80 - 50,
  },
  containerModal: {
    backgroundColor: 'whitesmoke',
    width: widthDevice - 24,
    height: heightDevice / 3.5,
    borderRadius: 10,
  },
  styleTextInput: {
    fontFamily: 'SVN-Poppins-Regular',
    fontSize: 12,
    lineHeight: 16,
    height: 50,
    width: 180,
    color: '#909090',
  },
  buttonSelect: {
    width: widthDevice * 0.57,
    backgroundColor: Colors.buttonTextColor,
    paddingVertical: 10,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: (widthDevice * 0.43) / 2,
    bottom: 10,
  },
  textSelect: {
    color: Colors.whiteColor,
  },
});

export default styles;
