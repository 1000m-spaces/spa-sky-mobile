import {widthDevice} from 'assets/constans';
import Icons from 'common/Icons/Icons';
import {TextNormalSemiBold, TextSemiBold} from 'common/Text/TextFont';
import React, {useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Colors from 'theme/Colors';

const InputTable = ({tableNumber, closeBottomSheet, children}) => {
  return (
    <View style={styles.container}>
      <View style={styles.wrapperTitle}>
        <TextNormalSemiBold>{'Vui lòng nhập số bàn'}</TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.wrapperInput}>
        <TextSemiBold style={styles.numberTable}>
          {tableNumber ? tableNumber : '--'}
        </TextSemiBold>
        {children}
      </View>
    </View>
  );
};

export default InputTable;

const styles = StyleSheet.create({
  numberTable: {fontSize: 36, color: Colors.buttonTextColor},
  wrapperTitle: {
    paddingBottom: 10,
    marginBottom: 15,
    width: widthDevice,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: 0.7,
    borderStyle: 'solid',
  },
  iconCloseModal: {
    position: 'absolute',
    top: -5,
    right: 15,
    padding: 5,
    zIndex: 200,
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  wrapperInput: {
    // width: '60%',
    // backgroundColor: '#E9E9E9',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 20,
    // alignSelf: 'center',
    paddingVertical: 5,
    alignItems: 'center',
    // paddingVertical: 20,
  },
  textInput: {
    position: 'absolute',
    width: '100%',
    // height: 100,
    top: 0,
    // backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
    paddingVertical: 20,
    flex: 1,
  },
});
