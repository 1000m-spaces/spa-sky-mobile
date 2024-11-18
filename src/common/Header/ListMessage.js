import React from 'react';
import {
  TextNormal,
  TextSemiBold,
  TextNormalSemiBold,
  TextSmallTwelve,
  TextSmallEleven,
  TextSmallMedium,
} from 'common/Text/TextFont';
import {
  FlatList,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icons from 'common/Icons/Icons';
import styles from './styles';
import ItemNotify from 'common/ItemNotify/ItemNotify';
import Colors from 'theme/Colors';
import Svg from 'common/Svg/Svg';
import {heightDevice} from 'assets/constans';
const ListMessage = ({
  onPressOutSide,
  listMessage,
  onPressSelectMess,
  isIndexSelect,
}) => {
  const renderMessageItem = ({item, index}) => {
    return (
      <ItemNotify
        data={item}
        onPressDetail={onPressSelectMess}
        index={index}
        isModal={false}
        indexSelect={isIndexSelect}
      />
    );
  };
  return (
    <View
      style={[
        styles.containerModalNotify,
        {justifyContent: 'center', height: heightDevice * 0.5},
      ]}>
      <View style={styles.headerModal}>
        <TextNormal style={{color: Colors.whiteColor}}>
          {'Thông báo'}
        </TextNormal>
        <TouchableOpacity onPress={onPressOutSide} style={styles.buttonClose}>
          <Icons type={'AntDesign'} name={'close'} color={'white'} size={20} />
        </TouchableOpacity>
      </View>
      {listMessage && listMessage.length > 0 ? (
        <FlatList
          data={listMessage}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          initialNumToRender={5}
          renderItem={renderMessageItem}
        />
      ) : (
        <View style={styles.wrapperEmpty}>
          <Svg name={'icon_empty'} size={150} />
          <TextSmallMedium style={{color: Colors.secondary}}>
            {'Danh sách thông báo trống'}
          </TextSmallMedium>
        </View>
      )}
    </View>
  );
};

export default ListMessage;
