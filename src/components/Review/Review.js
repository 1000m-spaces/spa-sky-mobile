// import Header from 'common/Header/Header';
// import {heightDevice, widthDevice} from 'assets/constans';
// import Colors from 'theme/Colors';
// import Status from 'common/Status/Status';
// import {
//   TextNormal,
//   TextNormalSemiBold,
//   TextSemiBold,
//   TextSmallMedium,
//   TextSmallTwelve,
// } from 'common/Text/TextFont';
// import {star} from 'assets/constans';
// import {launchImageLibrary} from 'react-native-image-picker';
import React, {useEffect, useRef, useState} from 'react';
// import { Rating, AirbnbRating } from 'react-native-ratings';
// import {useDispatch, useSelector} from 'react-redux';
import {
  SafeAreaView,
  //   View,
  //   TextInput,
  //   FlatList,
  //   TouchableOpacity,
  //   StyleSheet,
  //   Platform,
} from 'react-native';
// import {
//   getCurrentShop,
//   getStatusCreateReview,
//   getMessageCreateReview,
// } from 'store/selectors';
// // import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {
//   createReviewAction,
//   getTopPurchasedProducts,
//   resetReviewAction,
// } from 'store/actions';
// import {asyncStorage} from 'store/index';
// // import Images from 'common/Images/Images';
// import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
// import Svg from 'common/Svg/Svg';
// import Images from 'common/Images/Images';
// import Icons from 'common/Icons/Icons';
// import Loading from 'common/Loading/Loading';
// import {NAVIGATION_MENU} from 'navigation/routes';
// import strings from 'localization/Localization';
// const reviews = [
//   {id: 1, title: 'Sản phẩm', en_title: 'Product', rating: 0},
//   {id: 1, title: 'Phục vụ', en_title: 'Service', rating: 0},
//   {id: 1, title: 'Không gian', en_title: 'Atmosphere', rating: 0},
// ];
const Review = ({navigation, route}) => {
  // const [listImageUploaded, setImageUploaded] = useState([]);
  // const currentUser = useRef({custid: -1});
  // const dispatch = useDispatch();
  // const [noteOrder, setNoteOrder] = useState('');
  // const [isNotUser, setIsNotUser] = useState(false);
  // const [isGeneralStar, setGeneralStar] = useState(5);
  // const [isProductStar, setProductStar] = useState(0);
  // const [isServiceStar, setServiceStar] = useState(0);
  // const [isAtmosphereStar, setAtmosphereStar] = useState(0);
  // const currentShop = useSelector(state => getCurrentShop(state));
  // const [showModal, setShowModal] = useState(true);
  // const statusCreateReview = useSelector(state => getStatusCreateReview(state));
  // const messageReview = useSelector(state => getMessageCreateReview(state));
  // useEffect(() => {
  //   checkUser();
  //   return () => {
  //     setImageUploaded([]);
  //     setShowModal(false);
  //     setNoteOrder('');
  //     if (statusCreateReview !== Status.DEFAULT) {
  //       dispatch(resetReviewAction());
  //     }
  //   };
  // }, []);
  // useEffect(() => {
  //   const selectedOrderId = route?.params || -1;
  //   if (selectedOrderId !== -1) {
  //     setNoteOrder(`Đơn hàng ${selectedOrderId} `);
  //   }
  // }, [route]);

  // //CHECK THE FIRST LOGIN

  // const checkUser = async () => {
  //   currentUser.current = await asyncStorage.getUser();
  //   const theFirstLogin = await asyncStorage.getTheFirstLogin();
  //   if (currentUser.current.custid !== -1 || theFirstLogin) {
  //     setIsNotUser(true);
  //   }
  //   // if (currentUser.current && currentUser.current.custid !== -1) {
  //   //   dispatch(
  //   //     getTopPurchasedProducts({
  //   //       userId: currentUser.current.custid,
  //   //       branchId: currentShop.restid,
  //   //     }),
  //   //   );
  //   // }
  // };
  // useEffect(() => {
  //   if (statusCreateReview === Status.SUCCESS) {
  //     setShowModal(true);
  //   }
  // }, [statusCreateReview]);
  // const handleUploadImage = async () => {
  //   try {
  //     await launchImageLibrary(
  //       {
  //         mediaType: 'photo',
  //       },
  //       e => {
  //         if (e && e.assets && e.assets.length > 0) {
  //           setImageUploaded([...listImageUploaded, ...e.assets]);
  //         }
  //       },
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // const handleCreateReview = async () => {
  //   if (isServiceStar === 0 && isAtmosphereStar === 0 && isProductStar === 0) {
  //     return;
  //   }
  //   const lastOrder = await asyncStorage.getLastOrder();
  //   const {order} = lastOrder;
  //   const query = {
  //     branch_id:
  //       order && order?.rest_id
  //         ? order.rest_id
  //         : parseInt(currentShop.restid, 10),
  //     brand_id: 100,
  //     order_id: order && order?.id ? order.id : 0,
  //     comment: noteOrder || '',
  //     images:
  //       listImageUploaded && listImageUploaded.length > 0
  //         ? Array.from(listImageUploaded, value => value.uri)
  //         : [],
  //     merchant_id:
  //       order && order?.shopowner_id
  //         ? order.shopowner_id
  //         : parseInt(currentShop.shopownerid, 10),
  //     title: '',
  //     phone: currentUser.current?.custphone || '',
  //     user_id: parseInt(currentUser.current?.custid, 10) || 0,
  //     user_name: currentUser.current?.custname || '',
  //     general_star: isGeneralStar || 0,
  //     product_star: isProductStar || 0,
  //     service_star: isServiceStar || 0,
  //     atmosphere_start: isAtmosphereStar || 0,
  //   };
  //   dispatch(createReviewAction(query));
  // };
  // const handleConfirm = async () => {
  //   // await asyncStorage.setLastOrder({
  //   //   order: {},
  //   //   refusedTimes: -1,
  //   //   skipped_time: new Date().toString(),
  //   // });
  //   dispatch(resetReviewAction());
  //   setImageUploaded([]);
  //   setShowModal(false);
  //   setNoteOrder('');
  //   navigation.navigate(NAVIGATION_MENU);
  // };
  // const handleRemoveImage = item => {
  //   if (!item) {
  //     return;
  //   }
  //   const temp = listImageUploaded.filter(image => image.uri !== item.uri);
  //   setImageUploaded(temp);
  // };

  // const onReviewStart = (index, sta) => {
  //   switch (index) {
  //     case 0:
  //       setProductStar(sta);
  //       break;
  //     case 1:
  //       setServiceStar(sta);
  //       break;
  //     case 2:
  //       setAtmosphereStar(sta);
  //       break;
  //     default:
  //   }
  // };

  // const renderImage = ({item, index}) => {
  //   return (
  //     <View style={styles.wrapperItemImage}>
  //       <Images
  //         resizeMode={'contain'}
  //         style={styles.image}
  //         source={{uri: item.uri}}
  //       />
  //       <TouchableOpacity
  //         onPress={() => handleRemoveImage(item)}
  //         style={styles.buttonClose}>
  //         <Icons
  //           type={'AntDesign'}
  //           name={'close'}
  //           color={'white'}
  //           size={20}
  //           // onPress={() => setOpenCartDetail(!openCartDetail)}
  //         />
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* <Header
        title={'Trà 1000M'}
        content={currentShop?.restname}
        navigation={navigation}
        isMyFavorite={true}
      />
      <View style={{backgroundColor: '#F2F2F2', flex: 1}}>
        <View style={styles.contents}>
          <View style={styles.contentUploadSection}>
            <TextInput
              placeholder={strings.reviewScreen.placeholderInput}
              placeholderTextColor={Colors.textGrayColor}
              underlineColorAndroid="transparent"
              keyboardType="default"
              blurOnSubmit={true}
              multiline={true}
              textAlignVertical="top"
              numberOfLines={5}
              returnKeyLabel={strings.common.finish}
              returnKeyType={'done'}
              style={[
                styles.styleTextInputNote,
                Platform.OS === 'ios' && {minHeight: 120},
              ]}
              value={noteOrder}
              onChangeText={setNoteOrder}
            />
          </View>
          <TouchableOpacity
            onPress={handleUploadImage}
            disabled={listImageUploaded && listImageUploaded.length >= 5}
            style={styles.uploadButton}>
            <Svg name={'icon_camera_review'} size={38} />
            <TextSmallMedium style={{color: Colors.buttonTextColor}}>
              {strings.reviewScreen.addphoto}
            </TextSmallMedium>
          </TouchableOpacity>
          {listImageUploaded && listImageUploaded.length > 0 && (
            <View style={styles.wrapperImageSection}>
              <FlatList
                data={listImageUploaded}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}_${item?.uri}`}
                renderItem={renderImage}
              />
            </View>
          )}
        </View>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            onPress={handleCreateReview}
            disabled={
              isNotUser === false || statusCreateReview === Status.LOADING
            }
            style={styles.createButton}>
            <TextSemiBold style={{color: Colors.whiteColor}}>
              {strings.common.send}
            </TextSemiBold>
          </TouchableOpacity>
        </View>
        {showModal === true &&
          (statusCreateReview === Status.SUCCESS ||
            statusCreateReview === Status.ERROR) && (
            <ConfirmationModal
              isOpen={showModal}
              onCancel={handleConfirm}
              onConfirm={handleConfirm}
              isWarning={true}
              textContent={messageReview}
            />
          )}
        <Loading isHidden={statusCreateReview === Status.LOADING} />
      </View> */}
    </SafeAreaView>
  );
};

export default Review;
// const styles = StyleSheet.create({
//   wrapperRatingSection: {
//     marginTop: 10,
//     borderRadius: 10,
//     paddingVertical: 10,
//     backgroundColor: Colors.whiteColor,
//     marginHorizontal: 10,
//   },
//   textDes: {
//     marginHorizontal: 10,
//     fontStyle: 'italic',
//     color: Colors.textGrayColor,
//   },
//   wrapperItemImage: {
//     marginRight: 15,
//     marginVertical: 5,
//   },
//   buttonClose: {
//     position: 'absolute',
//     top: -5,
//     right: -10,
//     borderRadius: 30,
//     backgroundColor: Colors.blackColor,
//   },
//   wrapperRatingTitle: {flex: 0.9, justifyContent: 'center'},
//   wrapperImageSection: {
//     alignItems: 'flex-start',
//     marginHorizontal: 10,
//     marginVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.buttonTextColor,
//     borderStyle: 'dotted',
//     // backgroundColor: 'red',
//   },
//   wrapperRatingItem: {
//     flexDirection: 'row',
//     // marginBottom: 5,
//     // backgroundColor: 'green',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },
//   image: {
//     width: 70,
//     height: 50,
//     borderRadius: 5,
//   },
//   wrapperButton: {
//     // marginTop: 10,
//     // position: 'absolute',
//     // bottom: 20,
//     // width: widthDevice,
//     // backgroundColor: 'blue',
//     marginBottom: 5,
//     alignSelf: 'center',
//   },
//   contentUploadSection: {
//     // paddingHorizontal: 10,
//     marginHorizontal: 10,
//     // alignItems: 'flex-start',/
//     // alignSelf: 'flex-start',
//     // backgroundColor: 'red',
//     paddingBottom: 10,
//     paddingTop: 5,
//   },
//   createButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     backgroundColor: Colors.buttonTextColor,
//     borderColor: Colors.buttonTextColor,
//     borderRadius: 40,
//     width: widthDevice * 0.57,
//     // paddingHorizontal: 20,
//     paddingVertical: 12,
//   },
//   uploadButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 3,
//     marginBottom: 10,
//     // marginHorizontal: 10,
//     borderWidth: 1.5,
//     width: (widthDevice - 40) / 2,
//     borderColor: Colors.buttonTextColor,
//     borderStyle: 'solid',
//   },
//   styleTextInputNote: {
//     color: Colors.blackColor,
//     width: widthDevice - 40,
//     fontSize: 14,
//     fontFamily: 'SVN-Poppins-Medium',
//     borderWidth: 1,
//     height: heightDevice / 7,
//     backgroundColor: '#F5F5F5',
//     // elevation: 1,
//     borderColor: '#D4D4D4',
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     marginVertical: 5,
//   },
//   contents: {
//     // alignSelf: 'center',
//     // alignItems: 'center',
//     backgroundColor: Colors.whiteColor,
//     flex: 1,
//     marginHorizontal: 10,
//     // paddingHorizontal: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     paddingVertical: 10,
//     // height: heightDevice,
//   },
// });
