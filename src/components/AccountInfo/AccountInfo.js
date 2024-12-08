import {widthDevice} from 'assets/constans';
import Avata from 'common/Avata/Avata';
// import ItemInfoAccount from 'common/ItemInfoAccount/ItemInfoAccount';
import {TextNormal, TextSemiBold, TextSmallTwelve} from 'common/Text/TextFont';
import Titles from 'common/Titles/Titles';
import React, {useEffect, useRef} from 'react';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import Svg from 'common/Svg/Svg';
import {
  // FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import styles from './styles';
import {useState} from 'react';
import Colors from 'theme/Colors';
import CheckBox from '@react-native-community/checkbox';
import {asyncStorage} from 'store/index';
import {StackActions} from '@react-navigation/native';
import {
  NAVIGATION_ACCOUNT,
  // NAVIGATION_LOGIN,
  NAVIGATION_VERIFY_CODE,
} from 'navigation/routes';
import {useDispatch, useSelector} from 'react-redux';
import {
  // deleteAccountReset,
  // getDeleteAccount,
  // logout,
  // resetGetListProduct,
  sendPhone,
  // resetOrder,
  resetUpdateUser,
  updateUserInformation,
} from 'store/actions';
import {
  getErrorUpdateUser,
  getUpdatedUser,
  getStatusUpdateUser,
  getCurrentLanguage,
  // isStatusDeleteAccount,
} from 'store/user/userSelector';

import Status from 'common/Status/Status';
import Loading from 'common/Loading/Loading';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyModal from 'common/MyModal/MyModal';
import moment from 'moment';
import Icons from 'common/Icons/Icons';
import strings from 'localization/Localization';

const listCheckBoxs = [
  {
    id: 0,
    name: strings.accountScreen.male,
  },
  {
    id: 1,
    name: strings.accountScreen.female,
  },
  {
    id: 2,
    name: strings.accountScreen.other,
  },
];

const AccountInfo = ({navigation}) => {
  const dispatch = useDispatch();
  const currentUser = useRef(null);
  const [currentAccount, setCurrentAccount] = useState({});
  const [isPickerShow, setPickerShow] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBirthday, setNewBirthday] = useState('');
  const birthday = useRef(new Date(Date.now()));
  const refBirthday = useRef({isChanged: false, val: -1});
  const [modalDate, setModalDate] = React.useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalUpdateUser, setModalUpdateUser] = useState(false);
  const [sexChecked, setSexChecked] = React.useState({});
  const updatedUser = useSelector(state => getUpdatedUser(state));
  const currentUserLanguage = useSelector(state => getCurrentLanguage(state));
  const [listCheckBox, setListCheckBox] = React.useState(listCheckBoxs);
  // const statusDeleteAccount = useSelector(state =>
  //   isStatusDeleteAccount(state),
  // );
  const statusUpdateUser = useSelector(state => getStatusUpdateUser(state));
  const errorUpdateUser = useSelector(state => getErrorUpdateUser(state));
  const handleCheckBox = item => {
    setSexChecked({[item.id]: true, val: item.name});
  };
  useEffect(() => {
    setListCheckBox([
      {
        id: 0,
        name: strings.accountScreen.male,
      },
      {
        id: 1,
        name: strings.accountScreen.female,
      },
      {
        id: 2,
        name: strings.accountScreen.other,
      },
    ]);
  }, [currentUserLanguage]);
  const renderListCheckBox = listCheckBox.map((item, index) => {
    return (
      <TouchableOpacity
        onPress={() => handleCheckBox(item)}
        style={styles.viewItemGender}
        key={item.name}>
        <CheckBox
          boxType={'square'}
          lineWidth={2}
          style={styles.styleCheckbox}
          onTintColor={Colors.buttonTextColor}
          onFillColor={Colors.buttonTextColor}
          tintColors={{true: Colors.buttonTextColor, false: 'gray'}}
          onCheckColor={Colors.whiteColor}
          width={15}
          value={sexChecked[item.id]}
          onChange={() => handleCheckBox(item)}
        />
        <TextNormal style={styles.textNameGender}>{item.name}</TextNormal>
      </TouchableOpacity>
    );
  });
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {custid: -1};
    setSexChecked({
      [tempUser?.gender ? parseInt(tempUser.gender, 10) : 4]: true,
    });
    setCurrentAccount(tempUser);
  };
  useEffect(() => {
    initUser();
    console.log('current Account::', currentAccount)
  }, []);

  useEffect(() => {
    if (updatedUser && updatedUser.id) {
      const tempUser = JSON.parse(JSON.stringify(currentAccount));
      const newUser = {
        ...tempUser,
        cust_birthday: newBirthday
          ? newBirthday
          : moment(currentAccount?.cust_birthday).format('DD/MM/YYYY'),
        custname: newName ? newName : currentAccount?.custname,
        gender: sexChecked[0] ? '0' : sexChecked[1] ? '1' : '2',
      };
      asyncStorage.setUser(newUser);
    }
  }, [updatedUser]);

  // useEffect(() => {
  //   if (statusDeleteAccount === Status.SUCCESS) {
  //     dispatch(resetOrder());
  //     dispatch(resetGetListProduct());
  //     dispatch(deleteAccountReset());
  //     AsyncStorage.clear(() => {
  //       console.log('REMOVED');
  //     });
  //     navigation.dispatch(
  //       CommonActions.reset({
  //         index: 0,
  //         routes: [{name: NAVIGATION_LOGIN}],
  //       }),
  //     );
  //   }
  // }, [statusDeleteAccount]);
  const handleUpdateUser = () => {
    const body = {
      cust_id: currentUser.current.custid,
      session_key: currentUser.current.session_key,
      cust_name: newName ? newName : currentAccount?.custname,
      cust_sex: sexChecked[0] === true ? '0' : sexChecked[1] ? '1' : '2',
      cust_birthday: newBirthday
        ? newBirthday
        : moment(currentAccount?.cust_birthday).format('DD/MM/YYYY'),
    };
    if (body.cust_birthday === 'Invalid date') {
      setModalDate(true);
    } else {
      console.log('body update::', body);
      dispatch(updateUserInformation(body));
    }
  };
  useEffect(() => {
    let timeout;
    if (
      statusUpdateUser === Status.ERROR ||
      statusUpdateUser === Status.SUCCESS
    ) {
      timeout = setTimeout(() => {
        setModalUpdateUser(true);
      }, 200);
    }
    return () => clearTimeout(timeout);
  }, [statusUpdateUser]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      // Xử lý khi sự kiện beforeRemove xảy ra
      //Remove AccountInfo from stack navigation
      navigation.dispatch(StackActions.replace(NAVIGATION_ACCOUNT));
    });

    // Trả về một hàm để hủy bỏ trình nghe khi màn hình bị unmount
    return unsubscribe;
  }, [navigation]);

  const handleConfirmChange = () => {
    setModalConfirm(false); //phải tắt modal đi nếu không sẽ bị crash khi back ra login?
    dispatch(sendPhone(currentUser.current?.custphone.replace(/^0/, '')));
    navigation.navigate(NAVIGATION_VERIFY_CODE, {
      type: 1,
      name: 'Delete account',
      phone: currentUser.current?.custphone.replace(/^\+84/, ''),
    });
  };
  const handleConfirmUpdate = () => {
    setModalUpdateUser(false);
    dispatch(resetUpdateUser());
    let timeout = setTimeout(() => {
      navigation.pop();
    }, 200);
    clearTimeout(timeout);
  };

  const onChangeDate = (e, v) => {
    const {timestamp} = e.nativeEvent;
    if (e.type === 'set') {
      const tempRef = {
        val: timestamp,
        isChanged: true,
      };
      refBirthday.current = tempRef;
      // birthday.current = new Date(timestamp);
    }
    if (Platform.OS === 'android') {
      setPickerShow(false);
    }
  };

  useEffect(() => {
    if (
      isPickerShow === false &&
      refBirthday.current.val !== -1 &&
      refBirthday.current.isChanged === true
    ) {
      const convertedDate = moment(refBirthday.current.val).format(
        'DD/MM/YYYY',
      );
      setNewBirthday(convertedDate);
    }
  }, [isPickerShow]);
  return (
    <SafeAreaView style={styles.container}>
      <Titles
        title={strings.accountScreen.accountInformation}
        iconBack={true}
        onPressBack={() => navigation.pop()}
      />
      <View style={styles.content}>
        {/* <Avata nameIcon={'camera'} inAccountInfo={true} /> */}
        <Avata inAccountInfo={true} />
        <View style={styles.containerForm}>
          {/* NAME */}
          <View style={styles.containerName}>
            <Svg name={'icon_06_6'} size={30} color={'white'} />
            <View style={styles.column} />
            <TextInput
              underlineColorAndroid="transparent"
              returnKeyLabel={strings.common.finish}
              returnKeyType={'done'}
              style={styles.styleTextInput}
              placeholder={strings.accountScreen.name}
              defaultValue={currentAccount?.custname}
              keyboardType={'default'}
              onChangeText={val => setNewName(val)}
            />
          </View>

          {/* PHONE */}
          <View style={styles.containerName}>
            <Svg name={'icon_call1'} size={30} color={'white'} />
            <View style={styles.column} />
            <TextNormal style={styles.textPhone}>
              {currentAccount?.custphone}
            </TextNormal>
          </View>

          {/* BIRTHDAY */}
          <View style={styles.containerName}>
            <Svg name={'icon_dieukhoan1'} size={30} color={'white'} />
            <View style={styles.column} />
            <TouchableOpacity
              onPress={() => setPickerShow(true)}
              style={styles.birthdaySection}>
              <TextNormal
                style={{
                  marginLeft: 20,
                  color: currentAccount?.cust_birthday
                    ? 'black'
                    : Colors.textGrayColor,
                }}>
                {newBirthday
                  ? newBirthday
                  : !currentAccount?.cust_birthday
                  ? strings.accountScreen.dateofBirth
                  : currentAccount?.cust_birthday.length < 12
                  ? moment(currentAccount?.cust_birthday, 'DD/MM/YYYY').format(
                      'DD/MM/YYYY',
                    )
                  : moment(
                      currentAccount?.cust_birthday,
                      'YYYY/MM/DD hh:mm:ss',
                    ).format('DD/MM/YYYY')}
              </TextNormal>
            </TouchableOpacity>
          </View>

          {/* GENDER */}
          <View style={styles.containerName}>
            <Svg name={'icon_sex1'} size={30} color={'white'} />
            <View style={styles.column} />
            <TextNormal
              style={
                sexChecked[4] === true
                  ? styles.textGendeTitle
                  : styles.textNameGenderSelected
              }>
              {sexChecked[4] !== true
                ? sexChecked[0] === true
                  ? strings.accountScreen.male
                  : sexChecked[1] === true
                  ? strings.accountScreen.female
                  : strings.accountScreen.other
                : strings.accountScreen.selectGender}
            </TextNormal>
          </View>

          <View style={styles.containerGender}>
            {listCheckBox && listCheckBox.length > 0 && (
              <View style={styles.contentGender}>{renderListCheckBox}</View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.viewFooter}>
        <TouchableOpacity style={styles.buttonSave} onPress={handleUpdateUser}>
          <TextSemiBold style={styles.textSave}>
            {strings.common.save}
          </TextSemiBold>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setModalConfirm(true)}
          style={styles.removeAccountBtn}>
          <TextSmallTwelve style={{color: Colors.warning}}>
            {strings.accountScreen.deleteAccount}
          </TextSmallTwelve>
        </TouchableOpacity>
      </View>
      {isPickerShow === true &&
        (Platform.OS === 'android' ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              backgroundColor: 'white',
              width: widthDevice,
            }}>
            <DateTimePicker
              value={birthday.current}
              mode={'date'}
              display={Platform.OS === 'android' ? 'default' : 'spinner'}
              onChange={onChangeDate}
              // locale={strings.getLanguage() === 'vi' ? 'vi-VN' : 'es-ES'}
              // timeZoneName={'Europe/Prague'}
              textColor="black"
              // style={styles.datePicker}
            />
          </View>
        ) : (
          <MyModal onPressOutSide={() => setPickerShow(false)}>
            <View
              style={{
                backgroundColor: 'white',
                width: widthDevice - 20,
                borderRadius: 10,
                paddingVertical: 20,
              }}>
              <DateTimePicker
                value={birthday.current}
                mode={'date'}
                display={Platform.OS === 'android' ? 'default' : 'spinner'}
                onChange={onChangeDate}
                textColor="black"
                // style={styles.datePicker}
              />
              <Icons
                type={'AntDesign'}
                name={'close'}
                color={Colors.textGrayColor}
                size={35}
                style={{position: 'absolute', right: 5, top: 5}}
                onPress={() => setPickerShow(false)}
              />
            </View>
          </MyModal>
        ))}
      <Loading isHidden={statusUpdateUser === Status.LOADING} />
      <ConfirmationModal
        isOpen={modalConfirm}
        onCancel={() => setModalConfirm(false)}
        onConfirm={() => handleConfirmChange()}
        textContent={strings.accountScreen.deleteNotification}
      />

      <ConfirmationModal
        isOpen={modalUpdateUser}
        onCancel={handleConfirmUpdate}
        onConfirm={() => {}}
        isWarning={true}
        textContent={
          statusUpdateUser === Status.SUCCESS
            ? strings.accountScreen.updateNotiSuccess
            : errorUpdateUser || strings.accountScreen.updateNotiError
        }
      />
      <ConfirmationModal
        isOpen={modalDate}
        onCancel={() => {
          setModalDate(false);
        }}
        onConfirm={() => {}}
        isWarning={true}
        textContent={'Ngày tháng năm sinh không hợp lệ'}
      />
      {/* <Loading isHidden={statusDeleteAccount === Status.LOADING} /> */}
    </SafeAreaView>
  );
};

export default AccountInfo;
