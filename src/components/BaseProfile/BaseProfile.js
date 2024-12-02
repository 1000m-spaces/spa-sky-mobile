import {heightDevice, widthDevice} from 'assets/constans';
import CustomButton from 'common/CustomButton/CustomButton';
import CustomDatePicker from 'common/DatePicker/DatePicker';
import GenderPicker from 'common/GenderPicker/GenderPicker';
import Icons from 'common/Icons/Icons';
import MyModal from 'common/MyModal/MyModal';
import {TextMoneyBold, TextNormal, TextSemiBold} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import { NAVIGATION_CONNECTION, NAVIGATION_MAIN } from 'navigation/routes';
import {React, useState} from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { asyncStorage } from 'store/index';
import Colors from 'theme/Colors';

const BaseProfile = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [modal, setModal] = useState(-1);
  const [date, setDate] = useState(new Date());
  const [height, setHeight] = useState(165);
  function formatBirthday(birthdayInput) {
    const bdArr = birthdayInput.substring(0, 10).split('-');
    return `${bdArr[0]}-${bdArr[1]}-${bdArr[2]}T00:00:00Z`;
  }
  const handleSubmitInfo = async () => {
    if (!fullName) {
      return;
    }
    const payload = {
      full_name: fullName,
      gender: gender === 'Nam' ? 1 : 0,
      info_submitted: 1,
      birthday: formatBirthday(date.toISOString()),
    };
    await asyncStorage.setProfile(payload);
    navigation.navigate(NAVIGATION_CONNECTION);
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <View onTouchStart={Keyboard.dismiss} style={styles.container}>
        <View style={styles.wrapperTitle}>
          <TextMoneyBold style={{fontSize: 24}}>
            {'Thông tin cơ bản'}
          </TextMoneyBold>
        </View>
        <View style={styles.wrapperSection}>
          <TextNormal style={{fontSize: 15}}>Họ tên</TextNormal>
          <TextInput
            style={styles.textInput}
            placeholder={'Nhập họ tên của bạn'}
            returnKeyType={'done'}
            placeholderTextColor={Colors.textGrayColor}
            onSubmitEditing={Keyboard.dismiss}
            value={fullName}
            onChangeText={setFullName}
            underlineColorAndroid="transparent"
          />
        </View>

        <View style={styles.wrapperSection}>
          <TextNormal>Ngày sinh</TextNormal>
          <TouchableOpacity
            style={styles.birthSection}
            onPress={() => setModal(1)}>
            <TextNormal>
              {date.toLocaleDateString() || 'Nhập ngày sinh của bạn'}
            </TextNormal>
          </TouchableOpacity>
        </View>
        <View style={[styles.wrapperSection]}>
          <TextNormal>Giới tính</TextNormal>
          <TouchableOpacity
            style={styles.birthSection}
            onPress={() => setModal(2)}>
            <TextNormal style={{color: !gender ? Colors.secondary : 'black'}}>
              {!gender ? 'Chọn giới tính của bạn' : gender}
            </TextNormal>
          </TouchableOpacity>
        </View>
        <View style={styles.wrapperButton}>
          <CustomButton
            onPress={handleSubmitInfo}
            isDisabled={!fullName}
            label={strings.common.continue}
            labelStyled={!fullName && {color: 'white'}}
            styledButton={[
              styles.btnContinue,
              {
                backgroundColor: !fullName ? 'lightgray' : Colors.primary,
              },
            ]}
          />
        </View>
      </View>
      <CustomDatePicker
        isOpen={modal === 1}
        title={'Chọn ngày sinh'}
        type={'date'}
        onConfirm={v => {
          setDate(v);
          setModal(-1);
        }}
        onClose={() => setModal(-1)}
      />
      <GenderPicker
        isOpen={modal === 2}
        title={'Chọn giới tính'}
        onSelect={(v) => {
          setGender(v);
          setModal(-1);
        }}
        onClose={() => setModal(-1)}
      />
    </SafeAreaView>
  );
};

export default BaseProfile;

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 10,
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.backgroundColor,
  },
  wrapperTitle: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 15,
    // backgroundColor: 'red',
  },
  textInput: {
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 16,
    height: 48,
    paddingHorizontal: 15,
    color: 'black',
    borderWidth: 1,
    borderColor: Colors.textGrayColor,
  },
  wrapperSection: {
    paddingVertical: 15,
    // paddingHorizontal: 15,
  },
  birthSection: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    marginTop: 5,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.textGrayColor,
  },
  btnContinue: {
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    width: widthDevice - 50,
  },
  wrapperButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  textButton: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.black,
  },
  modalView: {
    backgroundColor: 'white',
    position: 'absolute',
    bottom: -heightDevice / 2.3,
    left: -widthDevice / 2 + 10,
    paddingVertical: 10,
    width: widthDevice - 20,
    shadowColor: '#000',
    borderRadius: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textTitleModal: {textAlign: 'center', fontSize: 24, fontWeight: 'bold'},
  wrapperContentModal: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  wrapperItemGender: {
    width: widthDevice / 2 - 40,
    // paddingVertical: 10,
    height: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  avatarIcon: {position: 'absolute', top: -25, zIndex: 100, elevation: 10},
  wrapperContentGender: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    alignItems: 'center',

    // backgroundColor: 'red',
  },
  activeGenderMale: {
    backgroundColor: '#DDE1FF',
    borderWidth: 1,
    borderColor: 'blue',
  },
  activeGenderFemale: {
    backgroundColor: '#FFD9E0',
    borderWidth: 1,
    borderColor: 'red',
  },
  btnSelectGender: {
    paddingHorizontal: 10,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 40,
    backgroundColor: Colors.primary,
    width: '90%',
  },
});