import {React, useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  FlatList,
} from 'react-native';
import Colors from 'theme/Colors';
import Icons from 'common/Icons/Icons';

import {GOOGLE_MAP_KEY, heightDevice, widthDevice} from 'assets/constans';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {TextNormalSemiBold, TextSmallMedium} from 'common/Text/TextFont';
import {asyncStorage} from 'store/index';
import strings from 'localization/Localization';
import Svg from 'common/Svg/Svg';
import {useSelector} from 'react-redux';
import {getCurrentLocation} from 'store/selectors';
import SearchAddressItem from './SearchAddressItem';
import MapViewSearch from './MapViewSearch';

const SearchAddress = ({
  onBack,
  onCompleteSelection,
  myLocation,
  currentShop,
}) => {
  const [origin, setOrigin] = useState(null);
  const currentLocation = useSelector(state => getCurrentLocation(state));
  const [listMyLocation, setListMyLocation] = useState(null);
  const currentUser = useRef({});
  // const [warning, setWarning] = useState(null);
  const refAuto = useRef('');
  useEffect(() => {
    initUser();

    return () => {
      setListMyLocation([]);
      currentUser.current = null;
      // setWarning(null);
    };
  }, []);

  const resetTextSearch = useCallback(() => {
    refAuto.current?.setAddressText('');
    refAuto.current?.focus();
    setOrigin(null);
  });
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser || {};
    !myLocation && refAuto.current?.focus();
  };

  // ------------- COMPLETE ACTION SELECT ADDRESS ------------------------

  // PRESS ON ITEM AFTER SEARCHING
  const onSelectAddress = (data, {geometry}) => {
    const {location} = geometry || false;
    location &&
      setOrigin({
        latitude: location.lat,
        longitude: location.lng,
        name: data?.description || '',
      });
  };
  // RENDER RESULT ADDRESS AFTER SEARCHING
  const renderListAddress = useCallback((data, _) => {
    const {structured_formatting} = data;
    return (
      <SearchAddressItem
        key={structured_formatting.main_text}
        {...{structured_formatting, data}}
        type={1}
      />
    );
  }, []);

  // SELECT ONE ITEM FROM LIST MY LOCATION
  const onSelectMyLocation = ({formatted_address, geometry}) => {
    const {location} = geometry;
    Keyboard.dismiss();
    refAuto.current?.blur();
    setOrigin({
      longitude: location.lng,
      latitude: location.lat,
      name: formatted_address || '',
    });
  };

  useEffect(() => {
    if (origin) {
      onCompleteSelection(origin);
      setListMyLocation(null);
    }
  }, [origin]);
  const onMarkerChange = useCallback(
    val => {
      setOrigin(null);
      Keyboard.dismiss();
      refAuto.current?.blur();
      setListMyLocation(val);
    },
    [listMyLocation],
  );
  const renderMyLocation = ({item, index}) => {
    return index < 5 ? (
      <TouchableOpacity
        onPress={() => onSelectMyLocation(item)}
        style={styles.wrapperSearchResult2}>
        <Svg name={'icon_location_search'} size={20} />
        <TextSmallMedium style={styles.textMyAddressItem}>
          {item.formatted_address || ''}
        </TextSmallMedium>
      </TouchableOpacity>
    ) : null;
  };
  return (
    <ScrollView
      // keyboardDismissMode="on-drag"
      nestedScrollEnabled={true}
      keyboardShouldPersistTaps={'always'}
      style={styles.wrapperContainer}>
      <View style={styles.inputSearchAddress}>
        {/* CLOSE ICON */}
        <TouchableOpacity onPress={onBack} style={styles.backIcon}>
          <Icons
            type={'AntDesign'}
            name={'arrowleft'}
            size={20}
            color={'#3C3C3C'}
          />
        </TouchableOpacity>
        {/* SEARCH INPUT */}
        <GooglePlacesAutocomplete
          ref={refAuto}
          disableScroll={true}
          minLength={2}
          placeholder={strings.common.findDeliveryAddress}
          fetchDetails={true}
          enablePoweredByContainer={false}
          debounce={200}
          textInputProps={{
            placeholderTextColor: Colors.textGrayColor,
            returnKeyType: 'search',
          }}
          renderRow={renderListAddress}
          styles={styles.searchInputStyle}
          onPress={onSelectAddress}
          onFail={e => console.log(e)}
          query={{
            key: GOOGLE_MAP_KEY,
            language: 'vi',
          }}
        />
        {/* RESET ICON */}
        <Icons
          type={'AntDesign'}
          name={'closecircleo'}
          size={25}
          style={styles.resetIcon}
          color={Colors.secondary}
          onPress={resetTextSearch}
        />
      </View>
      <MapViewSearch
        onResetOrigin={resetTextSearch}
        setListMyLocation={onMarkerChange}
        {...{myLocation, currentShop, currentLocation}}
      />

      <FlatList
        data={listMyLocation}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <TextNormalSemiBold style={styles.titleMyLocation}>
            {listMyLocation && listMyLocation.length ? 'Lựa chọn địa chỉ' : ''}
          </TextNormalSemiBold>
        }
        renderItem={renderMyLocation}
        keyExtractor={item => item.place_id}
      />
    </ScrollView>
  );
};

export default SearchAddress;

export const styles = StyleSheet.create({
  titleMyLocation: {paddingHorizontal: 15, paddingVertical: 10},
  textMyAddressItem: {
    paddingHorizontal: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  wrapperContentResult: {paddingLeft: 10, width: '90%'},
  wrapperUseLocation: {
    backgroundColor: Colors.backgroundColor,
    alignItems: 'center',
  },
  wrapperSearchResult: {
    flexDirection: 'row',
    width: widthDevice * 0.95,
    // backgroundColor: 'red',
    paddingVertical: 1,
    alignItems: 'center',
    zIndex: 1000,
  },
  wrapperSearchResult2: {
    flexDirection: 'row',
    width: widthDevice - 30,
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 10,
    marginVertical: 5,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 1000,
  },
  addressText: {
    color: Colors.secondary,
    paddingVertical: 2,
    // width: '82%',
  },
  useMyLocationBtn: {
    height: 48,
    width: widthDevice - 30,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 15,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  resetIcon: {position: 'absolute', top: 25, right: 25, zIndex: 100},
  backIcon: {position: 'absolute', top: 25, left: 15, zIndex: 100},
  searchInputStyle: {
    textInput: {
      height: 45,
      marginLeft: 45,
      marginHorizontal: 15,
      marginTop: 15,
      paddingRight: 40,
      marginBottom: 15,
      color: 'black',
      fontSize: 16,
      backgroundColor: '#EFEFEF',
    },
    textInputContainer: {
      flex: 1,
      flexWrap: 'wrap',
      // backgroundColor: 'red',
    },
    predefinedPlacesDescription: {
      color: Colors.redColor,
    },
  },
  contentShop: {
    marginLeft: 15,
    width: '90%',
    marginRight: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 0.2,
    paddingBottom: 10,
  },
  wrapperListStore: {
    paddingHorizontal: 15,
    height: heightDevice * 0.27,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },

  wrapperList: {
    maxHeight: '90%',
  },

  contentText: {
    paddingLeft: 12,
  },
  inputSearchAddress: {
    backgroundColor: Colors.whiteColor,
    // elevation: 2,
    // height: 70,
    // paddingVertical: 10,
    justifyContent: 'center',
    // position: 'absolute',
    // top: 0,
    zIndex: 2000,
    flexDirection: 'row',
    // flex: 1,
  },
  contentWrapper: {
    marginTop: 0,
    paddingHorizontal: 15,
  },

  viewIconClose: {
    height: 35,
    justifyContent: 'center',
    position: 'absolute',
    top: 18,
    borderRadius: 10,
    right: 8,
  },
  buttonWrapper: {
    // position: 'absolute',
    // bottom: 0,
    width: widthDevice,
    justifyContent: 'center',
    paddingTop: 5,
    alignItems: 'center',
  },
  wrapperContainer: {
    // flex: 1,
    backgroundColor: Colors.backgroundColor,
    flexGrow: 1,
    // marginTop: 2,
  },
  confirmButton: {
    width: widthDevice / 2,
    borderRadius: 30,
    paddingVertical: 10,
    backgroundColor: Colors.buttonTextColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
  confirmText: {
    color: 'white',
    fontSize: 16,
  },
});
