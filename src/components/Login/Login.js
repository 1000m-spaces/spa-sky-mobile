import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useEffect, useRef, useState} from 'react';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import {
  Keyboard,
  Pressable,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
  Platform,
} from 'react-native';
import strings from 'localization/Localization';
import styles from './styles';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import {heightDevice} from 'assets/constans';
import Colors from 'theme/Colors';
import {
  NAVIGATION_ACCESS_LOCATION,
  NAVIGATION_VERIFY_CODE,
} from 'navigation/routes';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import {useDispatch, useSelector} from 'react-redux';
import {isErrorSendOtp, isStatusSendPhone} from 'store/selectors';
import {sendPhone} from 'store/actions';
import Status from 'common/Status/Status';
import Svg from 'common/Svg/Svg';
import CheckBox from '@react-native-community/checkbox';
import {asyncStorage} from 'store/index';
const hotline = '+84971579233';
const policy = 'Vui lòng đồng ý với điều khoản và chính sách của Trà 1000M';
const Login = props => {
  const dispatch = useDispatch();
  const [confirmPolicy, setConfirmPolicy] = useState(true);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [phone, setPhone] = useState('');
  const [isWarning, setWarning] = useState(false);
  const [showError, setShowError] = useState(false);
  const [heightContent, setHeightContent] = useState(0);
  const [heightActive, setHeightActive] = useState(0);
  const [heightButton, setHeightButton] = useState(0);
  const [screenSmall, setScreenSmall] = useState(false);
  const refInput = useRef(null);

  // const listProductExpired = useSelector(state => isListProductExpired(state));
  const statusSendPhone = useSelector(state => isStatusSendPhone(state));
  const errorSendPhone = useSelector(state => isErrorSendOtp(state));

  const handleCheckBoxPolicy = () => {
    setConfirmPolicy(prev => (prev = !prev));
  };

  useEffect(() => {
    let phoneRegex = /^\+?[0-9]+$/;
    let formatPhone = phoneRegex.test(phone);
    if (formatPhone || phone === '') {
      setWarning(false);
    } else {
      setWarning(true);
    }
    // console.log('VALIIIITEEEEE:', formatPhone);
  }, [phone]);

  useEffect(() => {
    if (statusSendPhone === Status.SUCCESS) {
      props.navigation.navigate(NAVIGATION_VERIFY_CODE, {
        phone: phone.replace(/^0/, ''),
      });
    } else if (statusSendPhone === Status.ERROR) {
      setShowError(true);
    }
  }, [statusSendPhone]);

  const submitPhone = () => {
    if (!phone || phone === '' || phone.length === 0) {
      !isWarning && setWarning(true);
      return;
    }
    if (confirmPolicy === false) {
      setModalConfirm(true);
      return;
    }
    dispatch(sendPhone('+84' + phone.replace(/^0/, '')));
  };
  const handleLinking = async type => {
    if (type === 2) {
      await Linking.openURL(`tel:${hotline}`);
    } else if (type === 1) {
      const link = 'https://neocafe.tech/policy/';
      await Linking.openURL(link);
    }
  };
  const skip = async () => {
    await asyncStorage.setTheFirstLogin(true);
    props.navigation.navigate(NAVIGATION_ACCESS_LOCATION);
  };
  useEffect(() => {
    if (
      heightActive - heightContent - heightButton < 10 &&
      heightActive != 0 &&
      heightContent != 0
    ) {
      setScreenSmall(true);
    }
  }, [heightActive, heightContent, heightButton]);
  return (
    <SafeAreaView
      onLayout={event => {
        const {height} = event.nativeEvent.layout;
        setHeightActive(height);
        // console.log('Kích Thước màn hình::::::::::::::', height, heightDevice);
      }}
      style={styles.safeView}>
      <Pressable style={{flex: 1}} onPress={Keyboard.dismiss}>
        <View style={[styles.container, {paddingTop: screenSmall ? 0 : 20}]}>
          <View
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              setHeightContent(height);
              // console.log('Kích ThướcCONTENTTTT::::::::::::::', height);
            }}>
            <View style={{marginTop: screenSmall ? 0 : 20}}>
              <TextNormal style={styles.textHello}>
                {strings.loginScreen.greeting}
              </TextNormal>
              {/* <TextSemiBold>aa:{BASE_PATH_CAFE}</TextSemiBold> */}
              <TextNormal
                style={[
                  styles.textIntro,
                  {paddingVertical: screenSmall ? 10 : 20},
                ]}>
                {strings.loginScreen.title}
              </TextNormal>
            </View>
            <View
              style={[
                styles.separatorLine,
                {marginTop: screenSmall ? 20 : 40},
              ]}>
              <SeparatorLine />
            </View>
            <View style={{paddingTop: screenSmall ? 30 : 0.16 * heightDevice}}>
              <TouchableOpacity
                onPress={() => refInput.current.focus()}
                style={styles.containerButtonInputPhone}>
                <View style={styles.viewImageVietnam}>
                  {/* <Images source={icon_vietnam} style={styles.imageVietNam} /> */}
                  <Svg name={'viet'} size={22} style={styles.imageVietNam} />
                  <Svg
                    name={'icon_down'}
                    size={10}
                    style={styles.iconDown}
                    color={'white'}
                  />
                </View>
                <TextNormal style={styles.codeCountry}>+84</TextNormal>
                <TextInput
                  ref={refInput}
                  placeholder="(000) 000 00 00"
                  placeholderTextColor={Colors.textGrayColor}
                  style={styles.styleTextInput}
                  keyboardType="number-pad"
                  returnKeyLabel={strings.common.finish}
                  returnKeyType={'done'}
                  onChangeText={text => setPhone(text)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.policyWrapper}>
              <TouchableOpacity
                onPress={handleCheckBoxPolicy}
                style={styles.checkboxSection}>
                <CheckBox
                  boxType={'square'}
                  lineWidth={2}
                  style={styles.styleCheckbox}
                  onTintColor={Colors.buttonTextColor}
                  onFillColor={Colors.buttonTextColor}
                  tintColors={{true: Colors.buttonTextColor, false: 'gray'}}
                  onCheckColor={Colors.whiteColor}
                  width={20}
                  value={confirmPolicy}
                  onChange={
                    Platform.OS === 'android' ? handleCheckBoxPolicy : () => {}
                  }
                />
                <TextNormal style={{marginHorizontal: 10}}>
                  {strings.loginScreen.checkboxPolicy}
                </TextNormal>
              </TouchableOpacity>
              <View style={styles.contentPolicySection}>
                {/* <TouchableOpacity onPress={() => handleLinking(1)}> */}
                <TouchableOpacity>
                  <TextNormal style={styles.linkText}>
                    {strings.loginScreen.policyInfo}
                  </TextNormal>
                </TouchableOpacity>
                <View style={styles.column} />
                <TouchableOpacity onPress={() => handleLinking(2)}>
                  <TextNormal style={styles.linkText}>
                    {strings.loginScreen.hotline}
                  </TextNormal>
                </TouchableOpacity>
              </View>
            </View>
            {isWarning && (
              <TextNormal style={styles.textError}>
                {strings.loginScreen.notValidPhone}
              </TextNormal>
            )}
            {showError === true && (
              <TextNormal style={styles.textError}>{errorSendPhone}</TextNormal>
            )}
          </View>
          <View
            onLayout={event => {
              const {height} = event.nativeEvent.layout;
              setHeightButton(height);
            }}
            style={[
              styles.viewButtonSubmitPhone,
              {paddingTop: screenSmall ? 50 : 80},
            ]}>
            <TouchableOpacity
              onPress={() => submitPhone()}
              disabled={statusSendPhone === Status.LOADING}
              style={[
                styles.buttonSubmitPhone,
                statusSendPhone === Status.LOADING && {opacity: 0.5},
              ]}>
              {/* <Icons
                type={'MaterialIcons'}
                name={'navigate-next'}
                size={40}
                color={'white'}
              /> */}
              <TextSemiBold style={styles.textConfirm}>
                {strings.loginScreen.continue}
              </TextSemiBold>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => skip()} style={styles.buttonSkip}>
              <TextNormalSemiBold style={styles.textSkip}>
                {strings.common.skip}
              </TextNormalSemiBold>
            </TouchableOpacity>
          </View>
        </View>
        <ConfirmationModal
          isOpen={modalConfirm}
          onCancel={() => setModalConfirm(false)}
          onConfirm={() => setModalConfirm(false)}
          isWarning={true}
          textContent={policy}
        />
      </Pressable>
    </SafeAreaView>
  );
};

export default Login;
