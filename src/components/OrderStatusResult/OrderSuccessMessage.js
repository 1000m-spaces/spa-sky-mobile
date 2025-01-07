import Svg from 'common/Svg/Svg';
import { TextNormal, TextNormalSemiBold } from 'common/Text/TextFont';

import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Linking,
  StyleSheet,
} from 'react-native';
import Colors from 'theme/Colors';
// import styles from './styles';
import { widthDevice } from 'assets/constans';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STEPS = [
  'Bật thông báo trên điện thoại để nhận tin từ Spa Sky',
  'Mời bạn đến quầy để nhận món',
  'Cung cấp mã đơn hàng cho nhân viên',
];
const OrderSuccessMessage = ({ onClose }) => {
  const insets = useSafeAreaInsets();
  const renderStepItem = ({ item, index }) => {
    return (
      <View style={styles.wrapperStepItem}>
        <View style={styles.stepIndex}>
          <TextNormal>{index + 1}</TextNormal>
        </View>
        <TextNormal> {item} </TextNormal>
      </View>
    );
  };
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 5 }]}>
      <Svg name={'order_ms_bg'} width={widthDevice} height={180} />
      {/* <Images source={order_message_bg} style={{height: 192, width: 342}} /> */}
      <TextNormalSemiBold style={styles.message}>
        {'Vui lòng đến quầy để nhận món khi có thông báo'}
      </TextNormalSemiBold>
      <FlatList
        data={STEPS}
        keyExtractor={i => i}
        renderItem={renderStepItem}
      />
      <View>
        <TouchableOpacity onPress={onClose} style={styles.btnReturn}>
          <TextNormalSemiBold style={{ color: Colors.whiteColor }}>
            {'Tôi đã hiểu'}
          </TextNormalSemiBold>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Linking.openSettings();
            onClose();
          }}
          style={styles.btnSettings}>
          <TextNormalSemiBold style={{ color: '#2B3B5E' }}>
            {'Bật thông báo'}
          </TextNormalSemiBold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderSuccessMessage;

const styles = StyleSheet.create({
  wrapperStepItem: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    paddingBottom: 12,
    alignItems: 'center',
    flex: 1,
  },
  stepIndex: {
    height: 20,
    width: 20,
    borderRadius: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  btnReturn: {
    height: 40,
    borderRadius: 12,
    backgroundColor: '#2B3B5E',
    width: widthDevice - 48,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  btnSettings: {
    padding: 5,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  message: {
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 24,
    paddingBottom: 19,
    lineHeight: 33,
  },
});
