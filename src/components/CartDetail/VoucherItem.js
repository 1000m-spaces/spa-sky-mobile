import React, {memo, useEffect, useState} from 'react';

import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {
  TextNormalSemiBold,
  TextSmallEleven,
  TextSmallMedium,
  TextSmallTwelve,
} from 'common/Text/TextFont';
import Colors from 'theme/Colors';
import Icons from 'common/Icons/Icons';
import Svg from 'common/Svg/Svg';

const VoucherItem = ({
  item,
  appliedVoucher,
  statusAppliedVoucher,
  code,
  handleApplyVoucher,
  campaign,
  voucher,
  valid,
}) => {
  const [toggle, setToggle] = useState(false);
  const [campaignInfo, setCampaignInfo] = useState([]);
  const [currentVoucher, setVoucher] = useState({});
  const [isApplied, setIsApplied] = useState(false);
  useEffect(() => {
    if (voucher || campaign) {
      setVoucher(voucher);
      const listText = campaign?.description.split('.');
      setCampaignInfo(
        Array.from(listText, a => a.trim()).filter(a => a.length > 0),
      );
    }
  }, [campaign, voucher]);
  useEffect(() => {
    if (appliedVoucher && appliedVoucher.code && code.code && valid) {
      setIsApplied(appliedVoucher?.code === code.code);
    } else {
      setIsApplied(false);
    }
  }, [appliedVoucher, code]);
  const handleSelectItem = () => {
    if (appliedVoucher && appliedVoucher.code === code.code) {
      return;
    }
    handleApplyVoucher(item);
  };
  return (
    <View style={{marginVertical: 8}}>
      <TouchableOpacity
        onPress={() => handleSelectItem()}
        key={item.voucher_info_id}
        disabled={!valid || statusAppliedVoucher === 'LOADING'}
        style={[
          styles.wrapperVoucherItem,
          !valid && {
            backgroundColor: '#00000009',
          },
        ]}>
        <View
          style={[
            styles.row,
            styles.wrapperVoucherInfo,
            toggle && styles.toggledStyle,
          ]}>
          <View style={styles.row}>
            <Icons
              type={'FontAwesome'}
              name={isApplied && valid ? 'check-circle' : 'circle-o'}
              size={20}
              color={isApplied && valid ? 'green' : 'gray'}
              style={{paddingRight: 10}}
            />
            <Svg name={'icon_voucher'} size={35} />
          </View>
          <View style={{flex: 1, paddingHorizontal: 10}}>
            <TextNormalSemiBold
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{fontSize: 12}}>
              {currentVoucher.name}
            </TextNormalSemiBold>
            <View
              style={
                !valid || !isApplied ? {paddingVertical: 5} : styles.wrapperCode
              }>
              <TextSmallMedium
                style={{
                  color: !valid || !isApplied ? 'gray' : 'white',
                }}>
                {currentVoucher.code}
              </TextSmallMedium>
            </View>
            <View style={styles.row}>
              <TextSmallTwelve
                style={[
                  !valid ? {color: Colors.warning} : styles.textSecondary,
                ]}>
                {valid && code.end_date
                  ? `HSD: ${code.end_date
                      .substring(0, 10)
                      .split('-')
                      .reverse()
                      .join('.')}`
                  : 'Chưa khả dụng'}
              </TextSmallTwelve>
              <TouchableOpacity
                onPress={() => setToggle(prev => (prev = !prev))}
                style={styles.paddingHorizontal10}>
                <TextSmallTwelve style={{color: Colors.link}}>
                  {!toggle ? 'Điều kiện' : 'Rút gọn'}
                </TextSmallTwelve>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {toggle && campaignInfo && campaignInfo.length > 0 && (
          <View style={styles.paddingVertical10}>
            {campaignInfo.map(a => {
              return (
                <TextSmallEleven
                  key={a}
                  style={
                    styles.descriptionText
                  }>{`\u25CF  ${a}`}</TextSmallEleven>
              );
            })}
          </View>
        )}

        <View style={styles.codesLengthText}>
          <TextSmallMedium>{`x${item.total}`}</TextSmallMedium>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default memo(VoucherItem);
