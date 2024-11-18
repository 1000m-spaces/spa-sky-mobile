import {heightDevice, smart_phone, widthDevice} from 'assets/constans';
import Images from 'common/Images/Images';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import {NAVIGATION_ACCESS_LOCATION, NAVIGATION_LOGIN} from 'navigation/routes';
import {React, useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import styles from './style';
import CodeInput from './CodeInput';
import {
  confirmOtp,
  sendPhone,
  confirmOtpReset,
  getDeleteAccount,
  resetDeleteOtp,
  // resetGetListProduct,
  deleteAccountReset,
  resetOrder,
  confirmDeleteAccountOtp,
  logout,
} from 'store/actions';
import {
  isErrorConfirm,
  isStatusDeleteAccount,
  isStatusConfirmOtp,
  statusConfirmOtpDelete,
  getErrorMessageConfirm,
} from 'store/selectors';
import Status from 'common/Status/Status';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSemiBold,
} from 'common/Text/TextFont';
import Loading from 'common/Loading/Loading';
import {CommonActions} from '@react-navigation/native';
import Svg from 'common/Svg/Svg';
import {OneSignal} from 'react-native-onesignal';
import {asyncStorage} from 'store/index';
import strings from 'localization/Localization';

const VerifyCode = ({navigation, route}) => {
  const {phone, type} = route.params;
  const MAX_CODE_LENGTH = 6;
  const dispatch = useDispatch();
  const [code, setCode] = useState('');
  const [pinReady, setPinReady] = useState(false);
  const deviceId = useRef(null);
  const pushToken = useRef(null);
  const statusConfirmOtp = useSelector(state => isStatusConfirmOtp(state));
  const errorConfirmOtp = useSelector(state => isErrorConfirm(state));
  const [disableSendAgainButton, setDisableSendAgainButton] = useState(false);
  const statusDeleteAccount = useSelector(state =>
    isStatusDeleteAccount(state),
  );
  const statusConfirmDelete = useSelector(state =>
    statusConfirmOtpDelete(state),
  );
  const messageConfirmDelete = useSelector(state =>
    getErrorMessageConfirm(state),
  );
  const handleAuthenticate = () => {
    // navigation.navigate(NAVIGATION_ACCESS_LOCATION);
  };
  const handleSendCodeAgain = () => {
    setDisableSendAgainButton(true);
    dispatch(sendPhone('+84' + phone.replace(/^0/, '')));
  };
  useEffect(() => {
    let time;
    if (disableSendAgainButton === true) {
      time = setTimeout(() => {
        setDisableSendAgainButton(false);
      }, 60 * 1000);
    }
    return () => clearTimeout(time);
  }, [disableSendAgainButton]);

  useEffect(() => {
    if (pinReady) {
      if (type === 1) {
        dispatch(confirmDeleteAccountOtp(code));
      } else {
        dispatch(confirmOtp(code, deviceId.current, pushToken.current));
      }
    }
  }, [pinReady]);

  useEffect(() => {
    if (statusConfirmOtp === Status.SUCCESS) {
      // navigation.navigate(NAVIGATION_ACCESS_LOCATION);
      asyncStorage.setTheFirstLogin(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_ACCESS_LOCATION}],
        }),
      );
      dispatch(confirmOtpReset());
    }
  }, [statusConfirmOtp]);
  useEffect(() => {
    if (type === 1 && statusConfirmDelete === Status.SUCCESS) {
      dispatch(getDeleteAccount());
    }
  }, [statusConfirmDelete]);
  useEffect(() => {
    if (statusDeleteAccount === Status.SUCCESS) {
      dispatch(resetDeleteOtp());
      dispatch(logout());
      dispatch(deleteAccountReset());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
    }
  }, [statusDeleteAccount]);
  const skip = async () => {
    await asyncStorage.setTheFirstLogin(true);
    navigation.navigate(NAVIGATION_ACCESS_LOCATION);
  };
  useEffect(() => {
    getDeviceId();
    let time = setTimeout(() => {
      Keyboard.dismiss;
    }, 300);
    return () => clearTimeout(time);
  }, []);
  const getDeviceId = async () => {
    try {
      const id = await OneSignal.User.pushSubscription.getPushSubscriptionId();
      const token =
        await OneSignal.User.pushSubscription.getPushSubscriptionToken();
      deviceId.current = id;
      pushToken.current = token;
    } catch (error) {
      console.error('Lỗi khi lấy Subscription ID:', error);
    }
  };
  return (
    <SafeAreaView>
      <Pressable onPress={Keyboard.dismiss}>
        {/* Title */}
        <View style={styles.wrapperTitle}>
          {/* <Images
            resizeMode="contain"
            style={styles.imageStyle}
            source={smart_phone}
          />
          <View style={styles.dot}>
            <TextNormal style={styles.iconStar}>******</TextNormal>
          </View> */}
          <Svg
            name={'smart_phone'}
            color={'white'}
            // size={50}
            height={(77 / 852) * heightDevice}
            width={(74 / 393) * widthDevice}
            style={{
              marginTop: 0.08 * heightDevice,
              marginBottom: (30 / 852) * heightDevice,
            }}
          />
          <TextNormal style={styles.title}>
            {strings.verifyScreen.confirmOtp}
          </TextNormal>
          <TextNormal style={styles.subtitle}>
            {strings.verifyScreen.title + ' +84' + phone}
          </TextNormal>
          <SeparatorLine separatorLine={styles.separatorLine} />
        </View>
        {/* Input section */}
        <View style={styles.wrapperInput}>
          <CodeInput
            setPinReady={setPinReady}
            code={code}
            setCode={setCode}
            maxLength={MAX_CODE_LENGTH}
            navigation={navigation}
          />
          <TextNormal style={styles.textError}>{errorConfirmOtp}</TextNormal>
          {statusConfirmDelete === Status.ERROR && messageConfirmDelete && (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TextNormal style={{color: 'red'}}>
                {messageConfirmDelete}
              </TextNormal>
            </View>
          )}
          <TextNormal style={styles.textReceive}>
            {strings.verifyScreen.question}
          </TextNormal>
          <TouchableOpacity
            onPress={handleSendCodeAgain}
            disabled={disableSendAgainButton}>
            <TextNormal
              style={
                disableSendAgainButton === true
                  ? styles.textSendMessage
                  : styles.textSend
              }>
              {disableSendAgainButton === true
                ? strings.verifyScreen.resendRespond
                : strings.verifyScreen.sendBack}
            </TextNormal>
          </TouchableOpacity>
        </View>
        {/* Button Confirm */}
        <View style={styles.viewButton}>
          <TouchableOpacity
            onPress={handleAuthenticate}
            style={styles.buttonConfirm}>
            <TextSemiBold style={styles.textButton}>
              {strings.verifyScreen.verifyContinue}
            </TextSemiBold>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => skip()} style={styles.buttonSkip}>
            <TextNormalSemiBold style={styles.textSkip}>
              {strings.common.skip}
            </TextNormalSemiBold>
          </TouchableOpacity>
        </View>
      </Pressable>
      <Loading isHidden={statusConfirmOtp === Status.LOADING} />
    </SafeAreaView>
  );
};

export default VerifyCode;
