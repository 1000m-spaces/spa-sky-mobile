import {widthDevice, heightDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';
import Colors from 'theme/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentCode: {
    backgroundColor: Colors.button2Color,
  },
  contentSafeArea: {
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: Colors.button2Color,
    paddingVertical: 8,
  },
  buttonBack: {
    position: 'absolute',
    zIndex: 100,
    // backgroundColor: 'red',
    // top: 10,
    left: 15,
  },
  viewTextTitle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: widthDevice - 60,
  },
  viewUpper: {
    backgroundColor: Colors.buttonTextColor,
    paddingVertical: 20,
    height: 0.37 * heightDevice,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  viewBottom: {
    paddingHorizontal: 15,
    flex: 1,
  },
  viewShare: {
    width: widthDevice - 32,
    height: heightDevice * 0.25,
    borderRadius: 10,
    marginTop: -(heightDevice * 0.25) / 2,
    backgroundColor: '#F1DCB1',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitleText: {
    color: Colors.whiteColor,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  viewTextTitleUpper: {
    marginTop: 25,
    // paddingVertical: 10,
    marginHorizontal: 40,
    alignSelf: 'center',
  },
  textTitleUpper: {
    // marginLeft: -16,
    textAlign: 'center',
    color: Colors.whiteColor,
    marginBottom: 5,
  },
  textInside: {
    paddingVertical: 5,
    color: Colors.blackColor,
  },
  textTitleInside: {
    marginLeft: 16,
    marginTop: 10,
    color: Colors.blackColor,
  },
  textInsideCampaign: {
    marginLeft: 15,
    // marginTop: 10,
    width: widthDevice - 100,
    color: Colors.blackColor,
  },
  textsubView: {
    position: 'absolute',
    right: 20,
  },
  textInside3: {
    marginLeft: 25,
    marginTop: -28,
    // width: '100%',
    color: Colors.blackColor,
  },
  textInside4: {
    marginLeft: 10,
    // marginTop: -5,
    // width: '100%',
    color: Colors.blackColor,
  },
  viewText: {
    width: '100%',
  },
  buttonLink: {
    borderRadius: 3,
    paddingRight: 30,
    flex: 1,
    height: 40,
    justifyContent: 'center',
  },
  shareLinkcontainer: {
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: Colors.border,
    // borderColor: Colors.buttonTextColor,
    height: 40,
    alignItems: 'center',
    // marginHorizontal: 25,
    backgroundColor: '#FFF8E8',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  campaignContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginTop: 15,
    // width: widthDevice - 16,
  },
  userContainer: {
    // flex: 1,
    paddingVertical: 10,
    // backgroundColor: 'red',
    paddingHorizontal: 5,
    marginVertical: 5,
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // flexWrap: 'wrap',
  },
  iconInput: {
    position: 'absolute',
    right: 5,
  },
  iconCampaign: {
    // marginRight: 20,
    position: 'absolute',
    left: -10,
  },
  iconUser: {
    // marginRight: 20,
    // position: 'absolute',
    // left: -10,
    marginLeft: -20,
    marginBottom: 10,
  },
  viewcCampaign: {
    width: widthDevice - 59,
    height: heightDevice * 0.16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginLeft: 32,
    backgroundColor: Colors.whiteColor,
  },
  viewcReferral: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  seperator: {
    width: widthDevice - 60,
    height: 1,
    backgroundColor: Colors.blackColor,
  },
});

export default styles;
