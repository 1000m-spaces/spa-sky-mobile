import {widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import {TextNormalSemiBold} from 'common/Text/TextFont';
import strings from 'localization/Localization';
import React from 'react';
import {StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';

const FilterList = ({
  onPressCategory,
  onSearch,
  onFocus,
  focus = false,
  refInput,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressCategory} style={styles.button}>
        <TextNormalSemiBold style={styles.textCate}>
          {strings.common.categories}
        </TextNormalSemiBold>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSearch}>
        <Icons
          color={Colors.textGrayColor}
          type={'Feather'}
          name={'search'}
          size={18}
        />
        <TextInput
          ref={refInput}
          onFocus={onFocus}
          autoFocus={focus}
          style={styles.textInput}
          placeholder={strings.homeScreen.searchInput}
          placeholderTextColor={Colors.textGrayColor}
          underlineColorAndroid="transparent"
          onChangeText={onSearch}
          returnKeyLabel={'Hoàn Thành'}
          returnKeyType={'done'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FilterList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  button: {
    backgroundColor: Colors.buttonTextColor,
    borderRadius: 20,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textCate: {
    color: Colors.whiteColor,
  },
  buttonSearch: {
    flexDirection: 'row',
    borderWidth: 1,
    paddingVertical: 8,
    paddingRight: 15,
    paddingLeft: 8,
    borderRadius: 20,
    borderColor: Colors.buttonTextColor,
    height: 35,
    alignItems: 'center',
  },
  textInput: {
    width: widthDevice - 180,
    height: 45,
    color: 'black',
    fontFamily: 'SVN-Poppins-Medium',
    fontSize: 13,
  },
});
