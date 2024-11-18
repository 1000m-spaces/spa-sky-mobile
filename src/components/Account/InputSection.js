import React, {useRef} from 'react';
import {Keyboard, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {TextSemiBold} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import Icons from 'common/Icons/Icons';
import Colors from 'theme/Colors';
import Status from 'common/Status/Status';

const InputSection = ({
  typeModal,
  messageCheckAffiliate,
  setTextCode,
  handleAddVouhcer,
  onPressOutSide,
  statusApplyAffiliate,
  statusAddVoucher,
  textCode,
}) => {
  const refInput = useRef(null);
  return (
    <View style={styles.containerModalVoucher}>
      <View style={styles.headerModal}>
        <TextSemiBold style={styles.textVoucher}>
          {typeModal === 1
            ? strings.accountScreen.inputVoucher
            : messageCheckAffiliate?.ref_phone
            ? strings.accountScreen.referralCode
            : strings.accountScreen.inputReferal}
        </TextSemiBold>
        <TouchableOpacity onPress={onPressOutSide} style={styles.buttonClose}>
          <Icons type={'AntDesign'} name={'close'} color={'black'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyModal}>
        <TextInput
          style={styles.textInput}
          placeholder={
            typeModal === 1
              ? strings.accountScreen.inputVoucher
              : strings.accountScreen.inputPhone
          }
          returnKeyLabel={strings.common.finish}
          returnKeyType={'done'}
          placeholderTextColor={Colors.textGrayColor}
          ref={refInput}
          onSubmitEditing={Keyboard.dismiss}
          value={textCode}
          onChangeText={setTextCode}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          style={styles.button}
          disabled={
            statusApplyAffiliate === Status.LOADING ||
            statusAddVoucher === Status.LOADING
          }
          onPress={handleAddVouhcer}>
          <TextSemiBold style={styles.textButton}>
            {strings.common.send}
          </TextSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputSection;
