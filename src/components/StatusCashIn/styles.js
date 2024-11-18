import {widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    justifyContent: 'space-between',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  buttonBack: {
    height: 25,
    width: 30,
  },
  iconEnglish: {
    // alignSelf: 'center',
    marginTop: 5,
    height: 20,
    width: 20,
  },
  viewTextTitle: {
    width: widthDevice - 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    marginLeft: -30,
  },
  buttonLanguage: {
    flexDirection: 'row',
  },
  imageVietNam: {
    // height: 22,
    // width: 22,
    // marginRight: 5,
    marginTop: 5,
  },
  imageTranslate: {
    height: 23,
    width: 23,
  },
  continueOrderButton: {
    paddingVertical: 13,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 30,
    backgroundColor: Colors.buttonTextColor,
    alignItems: 'center',
    borderRadius: 30,
  },
  content: {
    height: 280,
    backgroundColor: 'white',
    marginTop: 21,
    marginHorizontal: 16,
  },
  contentStatus: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    // borderBottomWidth: 1,
    // borderStyle: 'dashed',
  },
  contentInfo: {flexDirection: 'row', justifyContent: 'space-between'},
  viewDot: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    marginTop: -6,
    marginLeft: -6,
  },
  viewDotR: {
    height: 12,
    width: 12,
    borderRadius: 12,
    backgroundColor: '#F6F6F6',
    marginTop: -6,
    marginRight: -6,
  },
  viewVoucher: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  viewInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  dottedLineContainer: {
    overflow: 'hidden',
    width: widthDevice - 50,
    position: 'absolute',
    bottom: -1,
  },
  dottedLineDot: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#BDBDBD',
    margin: -2,
    marginTop: 0,
  },
});

export default styles;
