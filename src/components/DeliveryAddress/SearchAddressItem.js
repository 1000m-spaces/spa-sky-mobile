import React, {memo} from 'react';
import {styles} from './SearchAddress';
import {
  TextNormalSemiBold,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import {View} from 'react-native';
import Svg from 'common/Svg/Svg';

const SearchAddressItem = ({structured_formatting, data, type}) => {
  return (
    <View
      style={
        type === 1 ? styles.wrapperSearchResult : styles.wrapperSearchResult2
      }>
      <Svg name={'icon_location_search'} size={20} />
      {type === 1 ? (
        <View style={styles.wrapperContentResult}>
          <TextNormalSemiBold>
            {structured_formatting ? structured_formatting.main_text : ''}
          </TextNormalSemiBold>
          <TextSmallTwelve style={styles.addressText}>
            {data.description}
          </TextSmallTwelve>
        </View>
      ) : (
        <TextSmallMedium
          style={{paddingHorizontal: 10, flex: 1, flexWrap: 'wrap'}}>
          {data && data.formatted_address ? data.formatted_address : ''}
        </TextSmallMedium>
      )}
    </View>
  );
};

export default memo(SearchAddressItem);
