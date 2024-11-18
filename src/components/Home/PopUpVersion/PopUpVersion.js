import React from 'react';
import {View, Image, Linking, Text, Platform} from 'react-native';
import styles from './styles';
import Button from './Button';
import {tra_logo} from 'assets/constans';
import MyModal from 'common/MyModal/MyModal';
import {TextNormal} from 'common/Text/TextFont';

const PopUpVersion = ({
  isUpdate,
  isSkip = false,
  forceUpdate,
  versionApp,
  versionNew = '1.1.0',
  onPressEvent,
}) => {
  return (
    <MyModal
      onPressOutSide={() => {}}
      // transparent={true}
      visible={
        (isUpdate == true && isSkip == 'false') ||
        (isUpdate == true && forceUpdate == true)
      }>
      <View style={styles.viewContent}>
        <View>
          <Image style={styles.image} source={tra_logo} />
          <TextNormal style={styles.textVerApp}>
            Version: {versionApp}
          </TextNormal>
        </View>
        {forceUpdate == true ? (
          <Button
            text={`Cập nhật phiên bản ${versionNew}`}
            styleView={{paddingHorizontal: 0, width: '100%'}}
            styleButton={{width: '100%'}}
            onPressEvent={() => {
              onPressEvent('false');
              if (Platform.OS === 'android') {
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.tea.thousand',
                );
              } else {
                Linking.openURL(
                  'https://apps.apple.com/us/app/tr%C3%A0-1000m/id6502510423',
                );
              }
            }}
          />
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Button
              text={'Bỏ qua'}
              styleView={{paddingHorizontal: 0, marginRight: 10}}
              styleButton={{width: '100%'}}
              onPressEvent={() => {
                onPressEvent('true');
                // asyncStorage.setSkipForceUpdate('true')
                // setSkip(true)
              }}
            />
            <Button
              text={`Cập nhật ${versionNew}`}
              styleView={{paddingHorizontal: 0}}
              styleButton={{width: '100%'}}
              onPressEvent={() => {
                onPressEvent('false');
                // asyncStorage.setSkipForceUpdate('false')
                if (Platform.OS === 'android') {
                  Linking.openURL(
                    'https://play.google.com/store/apps/details?id=com.tea.thousand',
                  );
                } else {
                  Linking.openURL(
                    'https://apps.apple.com/us/app/tr%C3%A0-1000m/id6502510423',
                  );
                }
              }}
            />
          </View>
        )}
      </View>
    </MyModal>
  );
};

export default PopUpVersion;
