import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallMedium,
} from 'common/Text/TextFont';
import {CommonActions} from '@react-navigation/native';
import {NAVIGATION_MENU} from 'navigation/routes';
import Svg from 'common/Svg/Svg';
const options = [
  {name: 'Delivery', icon: 'ship_bike', to: NAVIGATION_MENU},
  {name: 'Pick up', icon: 'pickup_icon_active', to: NAVIGATION_MENU},
  {name: 'Ưu đãi', icon: 'home_gift', to: ''},
  {name: 'Góp ý', icon: 'review_icon', to: ''},
];
const VoucherSection = ({navigation}) => {
  return (
    <View style={styles.wrapperCard}>
      {options.map((item, _) => {
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => item.to && navigation.navigate(item.to)}
            style={styles.items}>
            <Svg name={item.icon} size={36} />
            <TextNormalSemiBold style={styles.name}>
              {item.name}
            </TextNormalSemiBold>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default VoucherSection;

const styles = StyleSheet.create({
  wrapperCard: {
    marginHorizontal: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1C',
  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
