import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
import Images from 'common/Images/Images';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import {asyncStorage} from 'store/index';
import Colors from 'theme/Colors';
import Svg from 'common/Svg/Svg';

import {heightDevice, tra_logo, widthDevice} from 'assets/constans';

const Avata = ({nameIcon, onPressIconAvata}) => {
  const currentUser = React.useRef({custid: -1});
  const [userCurrent, setUserCurrent] = useState({custid: ''});

  React.useEffect(() => {
    initUser();
  }, []);
  const initUser = async () => {
    const user = await asyncStorage.getUser();
    if (user && user.custid) {
      currentUser.current = user || {custid: -1};
      setUserCurrent(user);
    }
  };

  return (
    <View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Images source={tra_logo} style={styles.image} />
          {nameIcon ? (
            <TouchableOpacity onPress={onPressIconAvata} style={styles.button}>
              <Svg
                name={nameIcon === 'icon_edit1' ? 'icon_edit1' : 'icon_camera1'}
                size={32}
                color={Colors.textGrayColor}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.textBalance}>
          <TextNormalSemiBold style={{color: Colors.buttonTextColor}}>
            ID: {userCurrent.custid}
          </TextNormalSemiBold>
        </View>
      </ScrollView>
    </View>
  );
};

export default Avata;

const styles = StyleSheet.create({
  voucherSection: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  textVoucher: {
    color: Colors.redColor,
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 5,
  },
  containerSeparatorLine: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  separatorLine: {
    height: 100,
    width: 1,
  },
  containerInfo: {
    width: '50%',
    alignItems: 'center',
    marginRight: 10,
  },
  buttonClose: {
    position: 'absolute',
    top: 5,
    right: 0,
    paddingRight: 5,
    paddingTop: 5,
  },
  iconFire: {
    width: 30,
    height: 30,
  },
  freeshipText: {
    fontWeight: 'bold',
    marginTop: 7,
    color: '#B71C1C',
  },
  listShopText: {
    fontWeight: 'bold',
    marginLeft: 15,
    color: Colors.buttonTextColor,
  },
  freeship: {
    justifyContent: 'space-between',
    borderStyle: 'solid',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#B71C1C',
    borderRadius: 10,
    backgroundColor: '#FFEBEE',
    width: 100,
    height: 35,
    marginTop: 3,
    marginHorizontal: 5,
  },
  textListShop: {
    textAlign: 'center',
  },
  headerModal: {
    // height: 50,
    // backgroundColor: '#255D54',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 5,
    // paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bodyModal: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listShop: {
    justifyContent: 'space-between',
    borderStyle: 'solid',
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: Colors.buttonTextColor,
    borderRadius: 10,
    backgroundColor: '#bce8e1',
    width: 100,
    height: 35,
    marginTop: 3,
  },
  containerModalListShop: {
    // paddingTop: 20,
    backgroundColor: Colors.backgroundColor,
    width: widthDevice - 24,
    borderRadius: 20,
    maxHeight: heightDevice * 0.63,
    // paddingBottom: 10,
  },
  container: {
    paddingVertical: 10,
    width: widthDevice,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  content: {
    borderWidth: 1,
    borderColor: Colors.button2Color,
    width: 92,
    height: 92,
    borderRadius: 92,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 88,
    height: 88,
    borderRadius: 88,
  },
  button: {
    position: 'absolute',
    top: -5,
    right: -25,
  },
  icon: {
    height: 32,
    width: 32,
  },
  textAccount: {
    color: Colors.buttonTextColor,
  },
  textBalance: {
    // height: 69,
    marginTop: 5,
    marginBottom: 5,
  },
  textBal1: {
    color: 'black',
  },
  viewIconRefresh: {
    position: 'absolute',
    top: 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIconRefresh: {
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 25,
  },
  iconRefresh: {
    // position: 'absolute',
    // top: 10,
    // right: 10,
  },
});
