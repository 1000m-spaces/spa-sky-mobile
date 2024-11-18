import CheckBox from '@react-native-community/checkbox';
import {widthDevice} from 'assets/constans';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Colors from 'theme/Colors';

const ItemWithOptions = ({data, index, length, handleCheckbox}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.viewCheckBox}>
          <CheckBox
            boxType={'square'}
            lineWidth={2}
            disabled={false}
            style={styles.styleCheckbox}
            tintColors={{true: Colors.buttonTextColor, false: 'gray'}}
            onTintColor={Colors.buttonTextColor}
            onFillColor={Colors.buttonTextColor}
            onCheckColor={Colors.whiteColor}
            width={15}
            value={data.value}
            onValueChange={newValue => handleCheckbox(data, newValue)}
          />
          <TextNormal style={styles.textNameOption}>{data.name}</TextNormal>
        </View>
        <TextNormalSemiBold style={styles.money}>
          {data.money}
        </TextNormalSemiBold>
      </View>
      {!(index === length - 1) ? (
        <SeparatorLine
          separatorLine={styles.separatorLine}
          pointSeparatorLine={styles.pointSeparator}
        />
      ) : null}
    </View>
  );
};

export default ItemWithOptions;

const styles = StyleSheet.create({
  container: {},
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  viewCheckBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleCheckbox: {
    marginRight: 20,
    marginLeft: 2,
    height: 18,
    width: 18,
  },
  textNameOption: {},
  separatorLine: {
    width: widthDevice - 35,
    backgroundColor: '#E9E9E9',
  },
  pointSeparator: {
    backgroundColor: '#E9E9E9',
  },
  money: {
    color: Colors.buttonTextColor,
  },
});
