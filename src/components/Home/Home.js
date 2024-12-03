import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Platform,
  ScrollView,
  AppState,
  Linking,
  TouchableOpacity,
} from 'react-native';
import styles from './styles';
import {TextNormal} from 'common/Text/TextFont';
import Svg from 'common/Svg/Svg';
import {widthDevice} from 'assets/constans';
import Colors from 'theme/Colors';
import {NAVIGATION_CONNECTION} from 'navigation/routes';

const Home = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Svg name={'spa_empty_page'} size={150} />
      <TouchableOpacity
        onPress={() => navigation.navigate(NAVIGATION_CONNECTION, {type: 1})}
        style={{
          height: 47,
          width: widthDevice - 40,
          backgroundColor: Colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 10,
          borderRadius: 12,
        }}>
        <TextNormal
          style={{
            color: 'white',
            fontWeight: '600',
            fontSize: 15,
            textAlgin: 'center',
          }}>
          {'Nhập mã thủ công'}
        </TextNormal>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
