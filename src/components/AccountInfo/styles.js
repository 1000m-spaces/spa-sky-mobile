import {heightDevice, widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  containerForm: {
    backgroundColor: Colors.whiteColor,
    marginHorizontal: 15,
    paddingVertical: 5,
    marginTop: 10,
    borderRadius: 10,
  },
  removeAccountBtn: {
    position: 'absolute',
    right: 0,
    bottom: 5,
    paddingRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  containerGender: {
    height: 50,
  },
  column: {
    width: 1,
    height: 22,
    backgroundColor: Colors.border,
    marginLeft: 15,
  },
  separator: {
    width: widthDevice - 40,
    backgroundColor: '#BCBCBC',
  },
  pointSeparator: {
    backgroundColor: '#BCBCBC',
  },
  styleTextInput: {
    paddingHorizontal: 10,
    color: 'black',
    height: 40,
    width: 250,
    // backgroundColor: 'red',
    marginLeft: 20,
  },
  textPhone: {
    marginLeft: 30,
    fontSize: 15,
    color: Colors.secondary,
  },
  birthdaySection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    height: 40,
    width: 200,
    // backgroundColor: 'red',
  },
  textGendeTitle: {
    marginLeft: 30,
    // fontStyle: 'italic',
    color: Colors.textGrayColor,
    paddingHorizontal: 2,
  },
  containerName: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 60,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
    marginHorizontal: 10,
    borderStyle: 'solid',
    // backgroundColor: 'green',
  },
  contentGender: {
    width: widthDevice - 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  content: {
    backgroundColor: Colors.backgroundColor,
    justifyContent: 'center',
    // height: '100%',
  },
  viewFlatlist: {
    borderRadius: 10,
  },
  styleCheckbox: {
    height: 18,
    width: 20,
  },
  textNameGender: {
    marginLeft: 15,
  },
  textNameGenderSelected: {
    marginLeft: 20,
    // backgroundColor: 'red',
    paddingHorizontal: 10,
  },
  viewItemGender: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  viewFooter: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.backgroundColor,
  },
  buttonSave: {
    justifyContent: 'center',
    alignItems: 'center',
    width: widthDevice * 0.6,
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: Colors.buttonTextColor,
  },
  buttonDelete: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    height: 40,
    borderRadius: 20,
    borderColor: '#FF5252',
    borderWidth: 2,
  },
  textSave: {
    color: Colors.whiteColor,
  },
});

export default styles;
