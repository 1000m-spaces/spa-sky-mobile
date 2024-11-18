import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icons from 'common/Icons/Icons';
import Colors from 'theme/Colors';
import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';

const LanguageSelector = ({
  setTypeModal,
  handleSeclectLanguage,
  currentLanguage,
}) => {
  return (
    <View style={styles.modalView}>
      <View style={styles.wrapperTitleSelection}>
        <TouchableOpacity
          style={styles.viewIconClose}
          onPress={() => setTypeModal(-1)}>
          <Icons
            type={'AntDesign'}
            name={'close'}
            size={20}
            color={Colors.blackColor}
          />
        </TouchableOpacity>
        <TextNormalSemiBold style={{marginBottom: 5}}>
          Ngôn ngữ / Language
        </TextNormalSemiBold>
      </View>
      <TouchableOpacity
        onPress={() => handleSeclectLanguage('vi')}
        style={[
          styles.wrapperEnglishSelection,
          currentLanguage === 'vi' ? styles.wrapperSelectedOption : null,
        ]}>
        <TextNormal style={styles.modalText}>
          {currentLanguage === 'en' ? 'Vietnamese' : 'Tiếng Việt'}
        </TextNormal>
        {currentLanguage === 'vi' && (
          <Icons type={'Feather'} name={'check'} color={'green'} size={20} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => handleSeclectLanguage('en')}
        style={[
          styles.wrapperEnglishSelection,
          currentLanguage === 'en' ? styles.wrapperSelectedOption : null,
        ]}>
        <TextNormal style={styles.modalText}>
          {currentLanguage === 'en' ? 'English' : 'Tiếng Anh'}
        </TextNormal>
        {currentLanguage === 'en' && (
          <Icons type={'Feather'} name={'check'} color={'green'} size={20} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSelector;
