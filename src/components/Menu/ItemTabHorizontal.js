import React, {memo} from 'react';
import {TouchableOpacity} from 'react-native';
import styles from './styles';
import {TextSmallMedium} from 'common/Text/TextFont';
import Colors from 'theme/Colors';

const ItemTabHorizontal = ({item, index, handleSelectTab, catePosi}) => {
  const onSelectTab = () => handleSelectTab(item, index);
  return (
    <TouchableOpacity
      onPress={onSelectTab}
      style={
        index === catePosi ? styles.tabCategoryActive : styles.tabCategory
      }>
      <TextSmallMedium
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          fontSize: 13,
          color: index === catePosi ? Colors.buttonTextColor : 'black',
          fontFamily:
            index === catePosi ? 'SVN-Poppins-SemiBold' : 'SVN-Poppins-Medium',
        }}>
        {item.name.replaceAll('\t', '').trim()}
      </TextSmallMedium>
    </TouchableOpacity>
  );
};

export default memo(ItemTabHorizontal);
