import MyModal from 'common/MyModal/MyModal';
import {Modal, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextNormal, TextSemiBold} from 'common/Text/TextFont';
import {widthDevice} from 'assets/constans';
import {useDispatch} from 'react-redux';
import strings from 'localization/Localization';

const Toast = ({showModal}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(false), 2000);
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal && visible}
      style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: 30,
        }}>
        <View
          style={{
            height: 50,
            width: widthDevice * 0.6,
            backgroundColor: 'gray',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <TextNormal style={{color: 'white'}}>
            {strings.common.copySuccess}
          </TextNormal>
        </View>
      </View>
    </Modal>
  );
};

export default Toast;
