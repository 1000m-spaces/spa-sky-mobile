import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
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
import { heightDevice, isAndroid } from 'assets/constans';
import Colors from 'theme/Colors';
import {
  NAVIGATION_ACCESS_LOCATION,
  NAVIGATION_VERIFY_CODE,
} from 'navigation/routes';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import { useDispatch, useSelector } from 'react-redux';
import { isErrorSendOtp, isStatusSendPhone } from 'store/selectors';
import { sendPhone } from 'store/actions';
import Status from 'common/Status/Status';
import Svg from 'common/Svg/Svg';
import CheckBox from '@react-native-community/checkbox';

import { asyncStorage } from 'store/index';
import CustomButton from 'common/CustomButton/CustomButton';
const FOMART = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
const hotline = '+84971579233';

const policy = 'Vui lòng đồng ý với điều khoản và chính sách của Spa Sky';
const Login = props => {
  const dispatch = useDispatch();
  const [confirmPolicy, setConfirmPolicy] = useState(true);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [phone, setPhone] = useState('');
  const [isAgreePolicy, setAgreePolicy] = useState(true);
  const [showPhoneError, setShowPhoneError] = useState(false);
  const refInput = useRef(null);

  // const listProductExpired = useSelector(state => isListProductExpired(state));
  const statusSendPhone = useSelector(state => isStatusSendPhone(state));
  const errorSendPhone = useSelector(state => isErrorSendOtp(state));
  useEffect(() => {
    let phoneRegex = /^\+?[0-9]+$/;
    let formatPhone = phoneRegex.test(phone);
    if (formatPhone || phone === '') {
      setShowPhoneError(false);
    } else {
      setShowPhoneError(true);
    }
    // console.log('VALIIIITEEEEE:', formatPhone);
  }, [phone]);

  useEffect(() => {
    if (statusSendPhone === Status.SUCCESS) {
      props.navigation.navigate(NAVIGATION_VERIFY_CODE, {
        phone: phone.replace(/^0/, ''),
      });
    } else if (statusSendPhone === Status.ERROR) {
      setShowPhoneError(true);
    }
  }, [statusSendPhone]);

  const submitPhone = () => {
    if (!phone || phone === '' || phone.length === 0) {
      setShowPhoneError(true);
      return;
    }
    if (confirmPolicy === false) {
      setModalConfirm(true);
      return;
    }
    dispatch(sendPhone('+84' + phone.replace(/^0/, '')));
  };

  return (
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
                {'Chào mừng bạn đến với'}
              </TextNormal>
              <TextNormal style={styles.textIntro}>{'SPA-SKY'}</TextNormal>
              {/* <TextSemiBold>aa:{BASE_PATH_CAFE}</TextSemiBold> */}
              <TextNormal style={[styles.textHello]}>
                {'Nhập số điện thoại để tiếp tục đăng nhập'}
              </TextNormal>
            </View>
            <View style={{ paddingBottom: 10, alignItems: 'center' }}>
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
              {(phone.match(/[a-z]/i) ||
                FOMART.test(phone) ||
                showPhoneError) && (
                  <TextNormal style={styles.errorMessage}>
                    {errorSendPhone
                      ? errorSendPhone
                      : 'Số điện thoại không hợp lệ'}
                  </TextNormal>
                )}
            </View>
          </View>
          <View style={[styles.viewButtonSubmitPhone]}>
            <View style={styles.policyWrapper}>
              <TouchableOpacity
                onPress={() => setAgreePolicy(prev => (prev = !prev))}
                style={styles.checkboxSection}>
                <CheckBox
                  boxType={'square'}
                  lineWidth={2}
                  style={styles.styleCheckbox}
                  onTintColor={Colors.primary}
                  onFillColor={Colors.primary}
                  tintColors={{
                    true: Colors.primary,
                    false: 'black',
                  }}
                  onCheckColor={Colors.whiteColor}
                  width={20}
                  value={isAgreePolicy}
                />
                <View style={{ flexDirection: 'row' }}>
                  <TextNormal>{'Tôi đồng ý với điều khoản và '}</TextNormal>
                  <TextNormal style={styles.linkText1}>
                    {'chính sách bảo mật'}
                  </TextNormal>
                </View>
              </TouchableOpacity>
            </View>
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

export default Login;
