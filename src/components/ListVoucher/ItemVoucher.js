import {View, StyleSheet} from 'react-native';
import React from 'react';
import Images from 'common/Images/Images';
import {voucher} from 'assets/constans';
import {TextNormal, TextNormalSemiBold} from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import strings from 'localization/Localization';

const ItemVoucher = ({item}) => {
  // console.log('itemVoucher', item);
  if (item && item.name) {
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          <Images
            resizeMode="contain"
            style={styles.imageStyle}
            source={voucher}
          />
          <View style={styles.contentWrapper}>
            <TextNormalSemiBold> {item?.name || ''}</TextNormalSemiBold>
            {item && item?.end_date && (
              <TextNormal>
                {'\u25CF ' +
                  strings.common.expiredDate +
                  ': ' +
                  item?.end_date
                    .toString()
                    .substring(0, 10)
                    .split('-')
                    .reverse()
                    .join('-')}
              </TextNormal>
            )}
          </View>
        </View>
      </View>
    );
  }
};

export default ItemVoucher;
const styles = StyleSheet.create({
  contentWrapper: {
    flex: 1,
    // backgroundColor: 'green',
    paddingHorizontal: 5,
  },
  itemContainer: {},
  imageStyle: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
  },
  itemWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    // justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
  },
  textAddress: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#004D40',
    marginBottom: 10,
  },
});
