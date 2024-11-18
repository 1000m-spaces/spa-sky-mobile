import {widthDevice, heightDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  buttonClose: {
    position: 'absolute',
    top: 6,
    right: 3,
    paddingRight: 5,
    paddingTop: 5,
  },
  wrapperVnSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 5,
  },
  wrapperSelectedOption: {
    borderRadius: 10,
    // borderStyle: 'solid',
    // borderColor: Colors.buttonTextColor,
    // borderWidth: 1,
    backgroundColor: '#E0F2F1',
  },
  contentContainerBottom: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
  },
  wrapperTitleSelection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.textGrayColor,
    borderStyle: 'solid',
  },
  wrapperEnglishSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -heightDevice / 2,
    left: -widthDevice / 2,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 10,
    width: widthDevice,
    shadowColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  viewIconClose: {
    position: 'absolute',
    left: 5,
    top: 9,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    backgroundColor: '#F2F2F2',
    flex: 1,
    // alignItems: 'center',
    // //
    // justifyContent: 'center',
  },
  flatlistContainer: {
    // height: heightDevice * 0.9,
    // marginTop: 10,
  },
  textVersion: {
    color: Colors.buttonTextColor,
    marginBottom: 5,
  },
  containerSelect: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    right: 15,
    paddingHorizontal: 10,
    width: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 47,
  },
  iconLanguage: {
    height: 16,
    width: 16,
  },
  containerImage: {
    marginLeft: 5,
  },
  point: {
    backgroundColor: '#BCBCBC',
  },
  separator: {
    width: '100%',
    backgroundColor: '#BCBCBC',
  },
  containerModalVoucher: {
    // paddingTop: 20,
    backgroundColor: 'whitesmoke',
    width: widthDevice - 24,
    borderRadius: 18,
    // height: heightDevice / 3,
  },
  textVoucher: {
    textAlign: 'center',
    paddingVertical: 10,
  },
  headerModal: {
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10,
  },
  bodyModal: {
    // height: heightDevice / 2.9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  textInput: {
    width: widthDevice - 90,
    height: 45,
    color: 'black',
    fontStyle: 'italic',
    backgroundColor: 'white',
    // borderColor: 'gray',
    // borderWidth: 1,
    marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.buttonTextColor,
    borderRadius: 20,
    width: 120,
    height: 40,
    marginTop: 20,
    justifyContent: 'center',
    // width: 100,
  },
  textButton: {
    textAlign: 'center',
    color: 'white',
  },
  textMessage: {
    textAlign: 'center',
    width: '80%',
    color: '#004D40',
    fontStyle: 'italic',
    marginTop: 5,
  },
  textMessageError: {
    textAlign: 'center',
    width: '80%',
    color: 'red',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default styles;
