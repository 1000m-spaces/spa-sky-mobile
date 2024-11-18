import React, {useState, useRef, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  GOOGLE_MAP_KEY,
  GOOGLEMAP_URL,
  heightDevice,
  widthDevice,
} from 'assets/constans';

import Colors from 'theme/Colors';
import Svg from 'common/Svg/Svg';
import {getSelectedDelivery, isListShopShowMoney} from 'store/selectors';
import {useSelector} from 'react-redux';
import HttpClient from 'http/HttpClient';

const MapViewSearch = ({
  currentShop,
  currentLocation,
  setListMyLocation,
  myLocation,
}) => {
  const selectedDelivery = useSelector(state => getSelectedDelivery(state));
  const mapRef = useRef();
  const [coordinate, setCoordinate] = useState(null);

  // const [customLocation, setCustomLocation] = useState(null);
  const listShops = useSelector(state => isListShopShowMoney(state));
  const onDragEndHandler = async ({nativeEvent}) => {
    const {latitude, longitude} = nativeEvent.coordinate;
    setCoordinate({
      latitude,
      longitude,
    });
    try {
      const {data} = await HttpClient.get(
        `${GOOGLEMAP_URL}${latitude},${longitude}&key=${GOOGLE_MAP_KEY}`,
      );
      if (data && data.status === 'OK') {
        setListMyLocation(data?.results || []);
      }
    } catch (error) {
      console.log('error:::', error);
    }
  };
  return (
    <View style={styles.wrapperMap}>
      <MapView
        ref={mapRef}
        style={styles.styleMap}
        showsUserLocation={true}
        onLayout={() => {
          mapRef.current.fitToCoordinates(
            [
              currentLocation,
              {
                latitude: parseFloat(currentShop?.latitude),
                longitude: parseFloat(currentShop?.longitude),
              },
              {
                latitude:
                  myLocation && selectedDelivery
                    ? selectedDelivery.lat
                    : currentLocation.latitude,
                longitude:
                  myLocation && selectedDelivery
                    ? selectedDelivery.lng
                    : currentLocation.longitude,
              },
            ],
            {
              animated: true,
            },
          );
        }}
        provider={'google'}
        // onMarkerPress={a => console.log('marker press::', a)}
        initialRegion={{
          latitude: coordinate
            ? parseFloat(coordinate?.latitude)
            : selectedDelivery
            ? selectedDelivery.lat
            : currentLocation.latitude,
          longitude: coordinate
            ? parseFloat(coordinate?.longitude)
            : selectedDelivery
            ? selectedDelivery.lng
            : currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Circle
          // key={'key'}
          center={{
            latitude: parseFloat(currentShop?.latitude),
            longitude: parseFloat(currentShop?.longitude),
          }}
          radius={3500}
          strokeWidth={1}
          strokeColor={'#1a66ff'}
          fillColor={'rgba(230,238,255,0.6)'}
          // onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
        />
        {listShops.map((marker, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(marker?.latitude),
                longitude: parseFloat(marker?.longitude),
              }}
              description={marker?.restaddr || marker?.restname}
              title={marker?.restname || `1000M ${marker.restname}`}>
              <Svg name={'icon_location'} size={30} />
            </Marker>
          );
        })}
        {(coordinate || selectedDelivery || currentLocation) && (
          <Marker
            coordinate={{
              latitude: coordinate
                ? coordinate?.latitude
                : myLocation && selectedDelivery
                ? selectedDelivery.lat
                : currentLocation.latitude,
              longitude: coordinate
                ? coordinate?.longitude
                : myLocation && selectedDelivery
                ? selectedDelivery.lng
                : currentLocation.longitude,
            }}
            onDragEnd={onDragEndHandler}
            draggable={true}
            // onPress={onPressMap}
            isPreselected={true}
          />
        )}
        <MapViewDirections
          origin={
            coordinate
              ? coordinate
              : myLocation && selectedDelivery
              ? {
                  longitude: selectedDelivery.lng,
                  latitude: selectedDelivery.lat,
                }
              : currentLocation
          }
          destination={{
            latitude: parseFloat(currentShop?.latitude),
            longitude: parseFloat(currentShop?.longitude),
          }}
          apikey={GOOGLE_MAP_KEY}
          language={'vi'}
          mode={'DRIVING'}
          strokeWidth={2}
          strokeColor={Colors.hot}
        />
      </MapView>
    </View>
  );
};

export default memo(MapViewSearch);

const styles = StyleSheet.create({
  paddVer5: {paddingVertical: 5},
  wrapperInfoDistance: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  makerShop: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  buttonSection: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingVertical: 20,
  },
  wrapperMap: {
    // height: heightDevice,
    borderRadius: 10,
    flex: 1,
    marginTop: 10,
  },
  chooseBtn: {
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    borderColor: Colors.primary,
    borderWidth: 1.3,
    backgroundColor: Colors.whiteColor,
    width: widthDevice - 60,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtn: {
    height: 45,
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 5,
    backgroundColor: Colors.primary,
    width: widthDevice - 60,
    borderRadius: 12,
    alignItems: 'center',
  },
  styleMap: {
    height: heightDevice * 0.5,
    width: widthDevice,
  },
  bottomCard: {
    backgroundColor: 'white',
    width: '100%',
    padding: 30,
    borderTopEndRadius: 24,
    borderTopStartRadius: 24,
  },
  inpuStyle: {
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
  },
});
