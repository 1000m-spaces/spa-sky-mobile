import {NAVIGATION_ACCESS_LOCATION, NAVIGATION_BASE_PROFILE, NAVIGATION_LOGIN} from 'navigation/routes';
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
  deleteAccountReset,
  confirmDeleteAccountOtp,
  logout,
} from 'store/actions';
import {
  isErrorConfirm,
  isStatusDeleteAccount,
  isStatusConfirmOtp,
  statusConfirmOtpDelete,
} from 'store/selectors';
import Status from 'common/Status/Status';
import {TextNormal} from 'common/Text/TextFont';
import {CommonActions} from '@react-navigation/native';
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
      asyncStorage.setTheFirstLogin(false);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_BASE_PROFILE}],
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
  const [timer, setTimer] = useState(60);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(interval);
        return lastTimerCount - 1;
      });
    }, 1000);
  }, []);
  return (
    <SafeAreaView style={styles.safeView}>
      <Pressable style={styles.safeView} onPress={Keyboard.dismiss}>
        <View style={[styles.container]}>
          {/* Title */}
          <View style={styles.wrapperTitle}>
            <TextNormal style={styles.textIntro1}>
              {'Chào mừng bạn đến với'}
            </TextNormal>
            <TextNormal style={styles.textIntro}>{'SPA SKY'}</TextNormal>
            {/* <TextSemiBold>aa:{BASE_PATH_CAFE}</TextSemiBold> */}
            <View style={styles.wrapperSubtitle}>
              <TextNormal style={styles.subtitle}>
                {strings.verifyScreen.title}
              </TextNormal>
              <TextNormal style={styles.textReceive}>
                {'+84' + phone}
              </TextNormal>
            </View>
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
            {errorConfirmOtp && (
              <TextNormal style={styles.textError}>
                {errorConfirmOtp || 'Mã xác minh không đúng'}
              </TextNormal>
            )}
          </View>
          {pinReady ? (
            <View style={styles.wrapperSubtitle}>
              <TextNormal style={styles.subtitle}>Đang xác minh...</TextNormal>
            </View>
          ) : (
            <View>
              {timer > 0 ? (
                <View style={styles.textShowTimer}>
                  <TextNormal style={styles.questionSendback}>
                    Bạn không nhận được mã? Gửi lại mã sau
                  </TextNormal>
                  <TextNormal style={styles.textReceive}>
                    {timer <= 59
                      ? timer <= 9
                        ? `00:0${timer}`
                        : `00:${timer}`
                      : `0${parseInt(timer / 60, 10)}:${
                          timer % 60 > 9 ? timer % 60 : '0' + (timer % 60)
                        } `}
                  </TextNormal>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleSendCodeAgain}
                  disabled={disableSendAgainButton || timer > 0}>
                  <TextNormal style={styles.textSend}>
                    {strings.verifyScreen.sendBack}
                  </TextNormal>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

export default VerifyCode;
