import React, {useState, useEffect} from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {TextNormalSemiBold, TextSmallTwelve} from 'common/Text/TextFont';
import Icons from 'common/Icons/Icons';
import strings from 'localization/Localization';
import Colors from 'theme/Colors';

const TimeSelector = ({closeBottomSheet, timeDelivery, handleSelectPicker}) => {
  const [listTimer, setListTimer] = useState([]);
  useEffect(() => {
    let result = [];
    for (let i = 1; i <= 18; i++) {
      result.push({
        title:
          strings.getLanguage() === 'vi'
            ? `${i * 5}  phút`
            : `${i * 5}  minutes`,
        val: i * 5,
      });
    }
    setListTimer(result);
  }, []);
  return (
    <View style={styles.containerModalPicker}>
      <View style={styles.titleSectionPicker}>
        <TextNormalSemiBold>
          {strings.cartScreen.receiveCounterTime}
        </TextNormalSemiBold>
        <TouchableOpacity
          onPress={closeBottomSheet}
          style={styles.iconCloseModal}>
          <Icons type={'Feather'} name={'x'} color={'gray'} size={20} />
        </TouchableOpacity>
      </View>

      {listTimer.map((item, index) => (
        <TouchableOpacity
          onPress={() => handleSelectPicker(item.val)}
          style={styles.itemTimePicker}
          key={index}>
          <View style={styles.row}>
            <Icons
              type={'Feather'}
              name={timeDelivery === item.val ? 'check-circle' : 'circle'}
              size={15}
              color={
                timeDelivery === item.val ? Colors.buttonTextColor : 'gray'
              }
            />
            <TextSmallTwelve style={{paddingHorizontal: 10}}>
              {item.title}
            </TextSmallTwelve>
          </View>

          {/* <Icons
            type={'FontAwesome'}
            name={tableNumber === item.val ? 'check-square-o' : 'circle-o'}
            color={tableNumber === item.val ? 'green' : 'gray'}
            size={18}
          /> */}
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TimeSelector;
