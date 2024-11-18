import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, TextInput, View, FlatList, Share} from 'react-native';
import styles from './styles';
import {
  TextNormalSemiBold,
  TextSemiBold,
  TextNormal,
  TextMoneyBold,
} from 'common/Text/TextFont';
import {TouchableOpacity} from 'react-native';
import Icons from 'common/Icons/Icons';
import Colors from 'theme/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCampaignsPresentee,
  getCampaignsReferrer,
  getListUserAffiliate,
} from 'store/actions';
import {
  getListUserAffiliates,
  isCampaignPresentee,
  isCampaignReferrer,
} from 'store/selectors';
import {asyncStorage} from 'store/index';
import {Clipboard} from 'react-native';
import Toast from 'common/Toast/Toast';
import {LINK_AFFILIATE} from 'assets/config';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Affiliate = ({navigation}) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const currentUser = useRef({custid: -1});
  const [link, setLink] = useState('');
  const [copy, setCopy] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const listUserAffiliate = useSelector(state => getListUserAffiliates(state));
  const campaignReferrer = useSelector(state => isCampaignReferrer(state));
  const campaignPresentee = useSelector(state => isCampaignPresentee(state));
  //   console.log('campaign:', campaignReferrer, campaignPresentee);

  useEffect(() => {
    dispatch(getListUserAffiliate());
    //get campaigns referrer
    dispatch(
      getCampaignsReferrer({
        brandId: 100,
        branchId: 0,
        merchantId: 0,
        type: 2,
        status: 1,
      }),
    );
    // get campaign presentee
    dispatch(
      getCampaignsPresentee({
        brandId: 100,
        branchId: 0,
        merchantId: 0,
        type: 10,
        status: 1,
      }),
    );
    console.log('campaign::', campaign);
  }, []);

  const generalCode = async () => {
    const user = await asyncStorage.getUser();
    if (user) {
      currentUser.current = user;
    }
    let c = LINK_AFFILIATE + 'ref?refId=' + user?.custphone;
    setLink(c);
  };
  useEffect(() => {
    generalCode();
  }, []);

  useEffect(() => {
    let cpaign = [];
    if (campaignReferrer && campaignReferrer.length > 0) {
      cpaign = [...cpaign, campaignReferrer[0]];
    }
    if (campaignPresentee && campaignPresentee.length > 0) {
      cpaign = [...cpaign, campaignPresentee[0]];
    }
    setCampaign(cpaign);
  }, [campaignReferrer, campaignPresentee]);
  const renderItemUser = list =>
    list.map((item, index) => {
      return (
        <TouchableOpacity style={styles.userContainer}>
          <Icons
            color={'gray'}
            type={'FontAwesome'}
            name={'user-circle'}
            size={35}
          />
          <View style={{flex: 1, paddingLeft: 10}}>
            <TextNormalSemiBold numberOfLines={1}>
              {item?.UserName || '' + ' - ' + item?.UserId || ''}
            </TextNormalSemiBold>
            <TextNormal style={{color: Colors.secondary, marginTop: 3}}>
              {item?.UserPhone || ''}
            </TextNormal>
          </View>
        </TouchableOpacity>
      );
    });

  const onShare = async li => {
    try {
      const result = await Share.share({
        message: li,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.pop()}
        style={[styles.buttonBack, {top: 5 + insets.top}]}>
        <Icons
          type={'Ionicons'}
          name={'chevron-back'}
          size={30}
          color={'white'}
        />
      </TouchableOpacity>
      <View style={[styles.viewUpper, {paddingTop: 15 + insets.top}]}>
        <View style={styles.viewTextTitleUpper}>
          <TextMoneyBold style={styles.textTitleUpper}>
            {'Mời bạn ngay, quà trao tay'}
          </TextMoneyBold>
          {campaign &&
            campaign.length > 0 &&
            campaign.map(c => (
              <View style={styles.row}>
                <Icons
                  type={'Feather'}
                  name={'check'}
                  size={15}
                  color={'white'}
                />
                <TextNormal style={styles.subtitleText}>{c?.name}</TextNormal>
              </View>
            ))}
        </View>
      </View>
      <View style={styles.viewShare}>
        <TextNormal style={styles.textInside}>Link giới thiệu</TextNormal>
        <View style={styles.shareLinkcontainer}>
          <TouchableOpacity
            onPress={() => onShare(link)}
            style={styles.buttonLink}>
            <TextNormal numberOfLines={1} style={{color: Colors.secondary}}>
              {link}
            </TextNormal>
          </TouchableOpacity>
          <Icons
            style={styles.iconInput}
            color={Colors.blackColor}
            type={'Entypo'}
            name={'share'}
            size={22}
            onPress={() => onShare(link)}
          />
        </View>
        <TextNormal style={styles.textInside}>Mã giới thiệu</TextNormal>
        <View style={styles.shareLinkcontainer}>
          <TouchableOpacity
            onPress={() => {
              Clipboard.setString(currentUser.current?.custphone);
              setCopy(true);
              setTimeout(() => setCopy(false), 2000);
            }}
            style={styles.buttonLink}>
            <TextNormal numberOfLines={1} style={{color: Colors.secondary}}>
              {currentUser.current?.custphone}
            </TextNormal>
          </TouchableOpacity>
          <Icons
            style={styles.iconInput}
            color={Colors.blackColor}
            type={'Feather'}
            name={'copy'}
            size={18}
            onPress={() => {
              Clipboard.setString(currentUser.current?.custphone);
              setCopy(true);
              setTimeout(() => setCopy(false), 2000);
            }}
          />
        </View>
      </View>
      <View style={styles.viewBottom}>
        <View
          style={[
            styles.row,
            {paddingVertical: 15, justifyContent: 'space-between'},
          ]}>
          <TextNormalSemiBold>
            {`Danh sách bạn đã mời (${listUserAffiliate.length})`}
          </TextNormalSemiBold>
          {/* <TouchableOpacity>
            <TextNormal>Xem tất cả</TextNormal>
          </TouchableOpacity> */}
        </View>
        {renderItemUser(listUserAffiliate)}
      </View>

      {copy && <Toast showModal={true} />}
    </View>
  );
};

export default Affiliate;
