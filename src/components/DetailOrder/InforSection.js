import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallEleven,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import React from 'react';
import styles from './styles';
import {View} from 'react-native';
import strings from 'localization/Localization';
import Colors from 'theme/Colors';

const InforSection = ({detailOrder, statusOfOrder}) => {
  return (
    <View>
      <View style={styles.contentWrapper}>
        <TextNormalSemiBold style={styles.productRestName}>
          {detailOrder?.restname}
        </TextNormalSemiBold>
        <View style={styles.orderInforLine}>
          <TextSmallTwelve>
            {strings.detailOrderScreen.orderId + ': #' + detailOrder?.id}
          </TextSmallTwelve>
          <TextNormalSemiBold
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              color:
                (detailOrder.is_paid === 0 || detailOrder.is_cancel === 1) &&
                detailOrder.is_check === 0
                  ? Colors.redColor
                  : Colors.buttonTextColor,
              marginBottom: 5,
              // fontStyle: 'italic',
              paddingHorizontal: 10,
              flex: 1,
              fontSize: 12,
              // backgroundColor: 'green',
              textAlign: 'right',
              fontFamily: 'SVN-Poppins-LightItalic',
            }}>
            {statusOfOrder || ''}
          </TextNormalSemiBold>
        </View>
        <TextNormal style={styles.inforContent}>
          {detailOrder?.time_create
            ? strings.detailOrderScreen.orderTime +
              ': ' +
              detailOrder?.time_create
                .toString()
                .substring(0, 16)
                .replaceAll('-', '.')
                .replaceAll(' ', ' | ')
            : ''}
        </TextNormal>
      </View>
    </View>
  );
};

export default InforSection;
