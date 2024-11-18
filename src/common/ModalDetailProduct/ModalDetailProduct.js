import {heightDevice, widthDevice} from 'assets/constans';
import MyModal from 'common/MyModal/MyModal';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import {
  TextMoneyBold,
  TextNormal,
  TextNormalSemiBold,
} from 'common/Text/TextFont';
import React from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import Colors from 'theme/Colors';
import strings from 'localization/Localization';
import Icons from 'common/Icons/Icons';

const ModalDetailProduct = ({data, openModal, onPressOutSide, onClose}) => {
  return (
    <MyModal visible={openModal} onPressOutSide={onPressOutSide}>
      <View activeOpacity={3} style={styles.containerModal}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.contentModal}>
          <TouchableOpacity activeOpacity={1}>
            <TouchableOpacity
              onPress={onClose}
              style={{padding: 3, alignSelf: 'flex-end'}}>
              <Icons
                type={'AntDesign'}
                name={'close'}
                size={20}
                color={'gray'}
              />
            </TouchableOpacity>
            <TextMoneyBold style={styles.nameProductModal}>
              {data.prodname}
            </TextMoneyBold>

            <SeparatorLine
              separatorLine={styles.separatorLine}
              pointSeparatorLine={styles.point}
            />
            <TextNormalSemiBold style={styles.title}>
              {'\u25CF ' + strings.common.description}
            </TextNormalSemiBold>
            <TextNormal style={styles.textContent}>{data.proddest}</TextNormal>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </MyModal>
  );
};

export default ModalDetailProduct;

const styles = StyleSheet.create({
  containerModal: {
    backgroundColor: Colors.backgroundColor,
    width: widthDevice - 25,
    borderRadius: 18,
    zIndex: 1000,
    padding: 10,
    height: heightDevice * 0.7,
  },
  title: {marginTop: 10, marginBottom: 3},
  textContent: {
    // fontStyle: 'italic',
    flex: 1,
    marginBottom: 20,
    paddingBottom: 20,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  contentModal: {
    backgroundColor: Colors.backgroundColor,
    // flex: 1,
    borderRadius: 18,
    borderWidth: 1.3,
    zIndex: 1000,
    padding: 10,
    borderStyle: 'dashed',
    borderColor: '#E3E3E3',
  },
  nameProductModal: {
    color: Colors.buttonTextColor,
  },
  separatorLine: {
    backgroundColor: '#BCBCBC',
    width: widthDevice - 77,
  },
  point: {
    backgroundColor: '#BCBCBC',
  },
});
