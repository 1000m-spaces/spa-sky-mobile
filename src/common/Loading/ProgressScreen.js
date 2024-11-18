import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {TextSemiBold} from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import {heightDevice, widthDevice} from 'assets/constans';
import MyModal from 'common/MyModal/MyModal';
const ProgressScreen = ({loading}) => {
  return (
    <MyModal
      onPressOutSide={() => console.log('out')}
      visible={loading}
      style={{
        justifyContent: 'center',
        position: 'absolute',
        width: widthDevice,
        height: heightDevice,
        zIndex: 1000,
        alignItems: 'center',
        top: 0,
      }}>
      <View>
        <ActivityIndicator color={Colors.whiteColor} size="large" />
        <TextSemiBold style={{textAlign: 'center', color: Colors.whiteColor}}>
          Loading...
        </TextSemiBold>
      </View>
    </MyModal>
  );
};

export default ProgressScreen;
