import React, {useEffect, useRef, useState} from 'react';
import {
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from 'theme/Colors';
import {TextNormal, TextSemiBold} from 'common/Text/TextFont';
import {heightDevice, isAndroid, widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import {useDispatch, useSelector} from 'react-redux';
import Status from 'common/Status/Status';
import {asyncStorage} from 'store';
import {NAVIGATION_HOME} from 'navigation/routes';
import {applyAffiliateV2} from 'store/actions';
import {getErrorApplyingAffiliate, getStatusAffiliate} from 'store/selectors';
import CustomButton from 'common/CustomButton/CustomButton';
import Svg from 'common/Svg/Svg';
import CheckBox from '@react-native-community/checkbox';
import strings from 'localization/Localization';
import styles from 'components/Login/styles';

const FOMART = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const maxLength = 6;
// -------------- TYPE = 1 --->>>>> MANUAL
// -------------- TYPE = 2 --->>>>> QRCODE
const Connection = ({navigation, route}) => {
  const [typeShow, setTypeShow] = useState(1);
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const codeDigitsArray = new Array(maxLength).fill(0);
  const textInputRef = useRef(null);
  const [inputContainerFocus, setInputContainerFocus] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useRef({id: -1});
  const refInput = useRef(null);

  const statusApplyAffiliate = useSelector(state => getStatusAffiliate(state));
  const errorApplyingAffiliate = useSelector(state =>
    getErrorApplyingAffiliate(state),
  );

  const handleOnBlur = () => {
    setInputContainerFocus(false);
    setInputContainerFocus(false);
  };
  useEffect(() => {
    const {type} = route ? route?.params : 1;
    setTypeShow(type);
    checkUser();
  }, []);
  const checkUser = async () => {
    const user = (await asyncStorage.getUser()) || {id: -1};
    currentUser.current = user ? user : {id: -1};
  };
  // useEffect(() => {
  //   if (code.length === maxLength && currentUser.current.id !== -1) {
  //     const query = {
  //       code: code,
  //       userId: currentUser.current?.custid,
  //       userPhone: currentUser.current?.custphone.substring(1),
  //     };
  //     dispatch(applyAffiliateV2(query));
  //   }
  // }, [code]);

  const submitPhone = () => {
    const query = {
      code: phone,
      userId: currentUser.current?.custid,
      userPhone: currentUser.current?.custphone.substring(1),
    };
    dispatch(applyAffiliateV2(query));
  };

  useEffect(() => {
    if (statusApplyAffiliate === Status.SUCCESS) {
      navigation.navigate(NAVIGATION_HOME);
    }
  }, [statusApplyAffiliate]);

  const handleOnPress = () => {
    setInputContainerFocus(true);
    textInputRef?.current?.focus();
  };
  const toCodeDigitInput = (value, index) => {
    const emptyInputChar = '';
    const digit = code[index] || emptyInputChar;
    return (
      <View key={index} style={[styles.otpInputView]}>
        <TextNormal style={styles.otpInputText}>
          {digit ? digit : '-'}
        </TextNormal>
      </View>
    );
  };
  return (
    // <SafeAreaView style={styles.container}>
    //   {typeShow === 1 && (
    //     <View style={styles.container}>
    //       <TouchableOpacity
    //         onPress={() => navigation.navigate(NAVIGATION_HOME)}
    //         style={styles.wrapperClose}>
    //         <Icons
    //           type={'Feather'}
    //           name={'arrow-left'}
    //           size={25}
    //           color={'black'}
    //         />
    //       </TouchableOpacity>
    //       <View style={styles.inputSection}>
    //         <TextSemiBold style={{paddingVertical: 30}}>
    //           {'Bạn hãy nhập mã giới thiệu'}
    //         </TextSemiBold>
    //         <Pressable
    //           style={styles.inputContainerPressable}
    //           onPress={handleOnPress}>
    //           {codeDigitsArray.map(toCodeDigitInput)}
    //         </Pressable>

    //         <TextInput
    //           value={code}
    //           onChangeText={setCode}
    //           maxLength={maxLength}
    //           // keyboardType="number-pad"
    //           returnKeyType="done"
    //           textContentType="oneTimeCode"
    //           ref={textInputRef}
    //           onBlur={handleOnBlur}
    //           style={styles.hiddenTextInput}
    //           autoFocus={true}
    //         />
    //       </View>
    //     </View>
    //   )}
    // </SafeAreaView>
    <SafeAreaView style={styles.safeView}>
      <Pressable style={styles.safeView} onPress={Keyboard.dismiss}>
        <View style={[styles.container]}>
          <View>
            <View
              style={{
                paddingBottom: 30,
                marginTop: heightDevice * 0.11,
                paddingHorizontal: 10,
              }}>
              <TextNormal style={styles.textIntro1}>
                {'Vui lòng nhập mã giới thiệu'}
              </TextNormal>
              <TextNormal style={styles.textIntro}>{'SPA-SKY'}</TextNormal>
            </View>
            <View style={{paddingBottom: 10, alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => refInput.current.focus()}
                style={styles.containerButtonInputPhone}>
                <View style={styles.viewImageVietnam}>
                  {/* <Images source={icon_vietnam} style={styles.imageVietNam} /> */}
                  <Svg name={'viet'} size={22} style={styles.imageVietNam} />
                </View>
                <TextNormal style={styles.codeCountry}>(+84)</TextNormal>
                <TextInput
                  ref={refInput}
                  placeholder="000 000 000 "
                  placeholderTextColor={Colors.textGrayColor}
                  style={styles.styleTextInput}
                  keyboardType={isAndroid ? 'number-pad' : 'phone-pad'}
                  returnKeyLabel={'Done'}
                  returnKeyType={'done'}
                  onChangeText={text => setPhone(text)}
                />
              </TouchableOpacity>
            </View>
          </View>
          {errorApplyingAffiliate != '' && (
            <TextNormal style={styles.textError}>
              {errorApplyingAffiliate}
            </TextNormal>
          )}
          <View style={[styles.viewButtonSubmitPhone]}>
            <CustomButton
              onPress={submitPhone}
              isDisabled={!phone || phone.length === 0}
              styledButton={styles.buttonSubmitPhone}
              label={strings.common.continue}
            />
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default Connection;
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.backgroundColor,
//   },
//   inputContainerPressable: {
//     width: widthDevice - 40,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     // backgroundColor: 'green',
//   },
//   wrapperClose: {
//     // height: 30,
//     // width: 30,
//     borderRadius: 30,
//     padding: 10,
//     backgroundColor: Colors.whiteColor,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'absolute',
//     top: 16,
//     left: 16,
//   },
//   hiddenTextInput: {
//     // borderColor: '#004D40',
//     // borderWidth: 2,
//     // borderRadius: 5,
//     // padding: 12,
//     // marginTop: 15,
//     // width: 300,
//     // color: 'red',
//     position: 'absolute',
//     width: 0,
//     height: 1,
//     zIndex: 1000,
//     opacity: 0,
//   },
//   inputSection: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     // marginTop: 30,
//     // height: '80%',
//     marginTop: heightDevice * 0.25,
//     // backgroundColor: 'red',
//   },
//   otpInputView: {
//     borderColor: 'gray',
//     // minWidth: '13%',
//     borderWidth: 0.5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 7,
//     width: 35,
//     height: 55,
//   },
//   activeInputView: {
//     borderColor: 'gray',
//     // minWidth: '13%',
//     borderWidth: 0.5,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 7,
//     width: 35,
//     height: 55,
//   },
//   otpInputText: {
//     fontSize: 29,
//     textAlign: 'center',
//     // alignSelf: 'center',

//     color: 'black',
//     fontWeight: '700',
//     // paddingVertical: 2,
//     // paddingHorizontal: 1,
//     // backgroundColor: 'red',
//   },
// });
