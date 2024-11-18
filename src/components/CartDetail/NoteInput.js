import {TextNormalSemiBold, TextSmallMedium} from 'common/Text/TextFont';
import React, {memo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icons from 'common/Icons/Icons';
const MAX_LENGTH = 200;
const NoteInput = ({children, noteOrder, closeBottomSheet}) => {
  return (
    <View>
      <View style={[styles.wrapperTitleModal]}>
        <TextNormalSemiBold>{'Vui lòng điền ghi chú'}</TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={[styles.wrapperInputArea]}>
        <Icons
          type={'Entypo'}
          name={'text'}
          size={18}
          style={styles.iconText}
          color={'gray'}
        />
        {children}
        <TextSmallMedium style={styles.textAreaNote}>
          {`${noteOrder.length}/${MAX_LENGTH}`}
        </TextSmallMedium>
      </TouchableOpacity>
    </View>
  );
};

export default memo(NoteInput);
