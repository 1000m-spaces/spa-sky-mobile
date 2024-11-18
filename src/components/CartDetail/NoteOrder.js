import {TextSmallTwelve} from 'common/Text/TextFont';
import React, { memo } from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import Icons from 'common/Icons/Icons';
import strings from 'localization/Localization';
import Colors from 'theme/Colors';

const NoteOrder = ({onPressNote, noteOrder}) => {
  return (
    <TouchableOpacity onPress={onPressNote} style={[styles.paymentGateway]}>
      <View style={[styles.rowLineBetween, {paddingRight: 10}]}>
        <View style={{flexDirection: 'row'}}>
          <Icons
            type={'AntDesign'}
            name={'filetext1'}
            size={15}
            color={'gray'}
          />
          <TextSmallTwelve style={{paddingLeft: 5}}>
            {strings.common.note}
          </TextSmallTwelve>
        </View>
        <View style={[styles.row, {justifyContent: 'flex-end', width: '60%'}]}>
          {noteOrder && (
            <TextSmallTwelve
              numberOfLines={1}
              style={{color: Colors.secondary}}>
              {noteOrder}
            </TextSmallTwelve>
          )}
          <Icons type={'AntDesign'} name={'right'} size={15} color={'gray'} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(NoteOrder);
