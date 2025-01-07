import ModalCart from 'common/ModalCart/ModalCart';
import ProductItem from 'common/ProductItem/ProductItem';
import Status from 'common/Status/Status';
import {
  TextSemiBold,
  TextSmallEleven,
  TextSmallMedium,
} from 'common/Text/TextFont';
import {
  NAVIGATION_CART_DETAIL,
  NAVIGATION_CONNECTION,
  NAVIGATION_LOGIN,
  NAVIGATION_PRODUCT_DETAIL,
  NAVIGATION_STATUS_CASH_IN,
} from 'navigation/routes';
import {
  BottomSheetScrollView,
  BottomSheetModal,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import React, {useMemo, useEffect, useRef, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  FlatList,
  SafeAreaView,
  View,
  Animated,
  TouchableOpacity,
  Linking,
  ImageBackground,
  ScrollView,
} from 'react-native';
import styles from './styles';
import {
  getCurrentShop,
  getStatusCreateOrder,
  getMessageCreateOrder,
  isListProductExpired,
  statusAddingProduct,
  listCateWithProduct,
  getCurrentOrder,
  statusGetShops,
  statusProductAllShop,
  getStatusExpiredProduct,
  getStatusSetLocation,
  getMessageCheckAffiliate,
} from 'store/selectors';
import {
  setCurrentProduct,
  resetOrder,
  resetStatusAddingProduct,
  getProductExpired,
  resetGetListShop,
  setCurrentOrder,
  resetErrorOrder,
  logout,
  resetProductAllShop,
  resetExpired,
  resetCurrentLocation,
  resetMomoPayment,
  getOrderInfoReset,
  resetAppliedVoucher,
  resetQrCode,
  getProducAllByShop,
} from 'store/actions';
import {asyncStorage} from 'store/index';
import ModalStatusOrder from 'common/ModalStatusOrder/ModalStatusOrder';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import {CommonActions, useIsFocused} from '@react-navigation/native';
import ProgressScreen from 'common/Loading/ProgressScreen';
import strings from 'localization/Localization';
import {backGSplash} from 'assets/constans';
import BottomSheetCart from './BottomSheetCart';
import Icons from 'common/Icons/Icons';
import HeaderMenu from './HeaderMenu';
// import ItemTabHorizontal from './ItemTabHorizontal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import FloatHeader from './FloatHeader';
import {useComponentSize} from './hook/useComponentSize';
import Svg from 'common/Svg/Svg';

const MODAL_BOTTOM_HEIGHT = 100;
const throttle = (fn, delay) => {
  let lastTime;
  return () => {
    const now = new Date().getTime();
    if (now - lastTime < delay) {
      return;
    }
    lastTime = now;
    fn();
  };
};
// const itemCoordinates = [];
const Menu = ({navigation, route}) => {
  const [position, onLayout] = useComponentSize();
  const insets = useSafeAreaInsets();
  const isMenuScreen = useIsFocused();
  //---------------------------- LOCAL STATE ---------------------------
  const currentUser = useRef(null);
  const [messure, setMessure] = useState([]);
  const [catePosi, setCataPosi] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalAffi, setModalAffi] = useState(false);
  // const [myRef, setMyRef] = useState(null);
  // const refTabHorizontal = useRef(null);
  const positionY = useRef(new Animated.Value(0)).current;
  // -------------------------- GLOBAL  STATE-- USE SELECTOR--------------------------
  const dispatch = useDispatch();
  // ------------ PRODUCT AND CATEGORIES STATE -------------------
  const categoryProducts = useSelector(state => listCateWithProduct(state));
  const statusAddProduct = useSelector(state => statusAddingProduct(state));
  const statusGetProductAllShop = useSelector(state =>
    statusProductAllShop(state),
  );
  const listExpireProduct = useSelector(state => isListProductExpired(state));
  const statusExpiredProduct = useSelector(state =>
    getStatusExpiredProduct(state),
  );
  const messageCheckAffiliate = useSelector(state =>
    getMessageCheckAffiliate(state),
  );

  // ------------SHOP STATE
  const currentShop = useSelector(state => getCurrentShop(state)); // CURRENT SHOP
  const statusGetListShop = useSelector(state => statusGetShops(state));
  // ----------- ORDER STATE
  const currentOrder = useSelector(state => getCurrentOrder(state)); // CURRENT ORDER
  const messageCreateOrder = useSelector(state => getMessageCreateOrder(state)); // MESSAGE ERROR WHEN CREATE ORDER
  const statusCreateOrder = useSelector(state => getStatusCreateOrder(state)); // STATUS OF CREATING ORDER

  const statusSetLocation = useSelector(state => getStatusSetLocation(state)); // SET

  useEffect(() => {
    const handleInitialDeepLink = async () => {
      // Lấy URL deep link ban đầu
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Nếu có URL deep link ban đầu, xử lý nó
        if (initialUrl && initialUrl.includes('neocafe://app/statusCashIn')) {
          navigation.navigate(NAVIGATION_STATUS_CASH_IN, {
            urlCallbackDeeplinkMomo: initialUrl,
          });
        }
      }
    };
    const initUser = async () => {
      const tempUser = await asyncStorage.getUser();
      currentUser.current = tempUser ? tempUser : null;
    };
    initUser();
    handleInitialDeepLink();
    dispatch(getOrderInfoReset());
  }, []);

  // useEffect(() => {
  //   const saveCartToStorage = async () => {
  //     await asyncStorage.setCart(currentOrder);
  //   };
  //   if (currentOrder && currentOrder.products.length >= 0) {
  //     saveCartToStorage();
  //   }
  // }, [currentOrder]);
  useEffect(() => {
    const removeOrder = async () => {
      const tempUser = await asyncStorage.getUser();
      let body = {
        categoryid: null,
        custid: tempUser.custid || '444',
        restid: currentShop.restid,
        is_shipping_menu: currentOrder.takeaway ? 1 : 0,
      };
      dispatch(getProducAllByShop(body));
    };
    removeOrder();
  }, [currentShop]);

  // --------------------- HANDLE LAYOUT --------------------------------
  const [shipCardHeight, setShipCardHeight] = useState(null);
  const onLayoutDelivery = ({nativeEvent}) => {
    setShipCardHeight(nativeEvent.layout.height - 40);
  };

  useEffect(() => {
    const compareArrays = (a, b) =>
      a.length === b.length &&
      a.every((element, index) => element === b[index]);
    if (shipCardHeight && position.length > categoryProducts.length) {
      const r = Array.from(position, a => Math.ceil(a + shipCardHeight));
      if (compareArrays(r, messure)) {
        return;
      }
      setMessure(r);
    }
  }, [shipCardHeight, position]);

  // const updateCurrentOrder = useCallback(
  //   throttle(() => {
  //     console.log(
  //       'categoryProducts change::',
  //       currentOrder.products,
  //       categoryProducts,
  //     );
  //     const tempProducts = JSON.parse(JSON.stringify(currentOrder.products));
  //     const mapCateProd = new Map(
  //       categoryProducts.map(c => {
  //         return [c.id, c.products];
  //       }),
  //     );
  //     console.log('mapCateProd:::', mapCateProd);
  //     tempProducts.map(prodCart => {
  //       if (mapCateProd.has(prodCart.categoryid)) {
  //         const products = mapCateProd.get(prodCart.categoryid);
  //         console.log('products:::', products);
  //       }
  //     });
  //   }, 1100),
  //   [],
  // );
  // useEffect(() => {
  //   if (!isMenuScreen || !messure || messure?.length === 0) {
  //     return;
  //   }
  //   updateCurrentOrder();
  // }, [messure]);
  // const handleItemLayout = useCallback(index => event => {
  //   if (categoryProducts.length === posi.length - 1) {
  //     return 0;
  //   }
  //   const {x, y, width, height} = event.nativeEvent.layout;
  //   itemCoordinates[index] = {x, y, width, height};
  //   if (categoryProducts && itemCoordinates) {
  //     const outputArray = itemCoordinates.reduce(
  //       (accumulator, currentValue) => {
  //         if (accumulator.length === 0) {
  //           accumulator.push(currentValue.height);
  //         } else {
  //           const lastSum = accumulator[accumulator.length - 1];
  //           const newSum = lastSum + currentValue.height;
  //           accumulator.push(newSum);
  //         }
  //         return accumulator;
  //       },
  //       [deliveryCardHeight.current],
  //     );
  //     setPosi(outputArray);
  //   }
  // });
  //BACK TO THE LOGIN SCREEN FOR THE FIRST LOG IN
  const handleConfirmChange = useCallback(() => {
    setModalConfirm(false);
    dispatch(logout());
    let time = setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: NAVIGATION_LOGIN}],
        }),
      );
      clearTimeout(time);
    }, 200);
  });

  // ------------------------------- METHODS AND FUNCTIONS----------------------------------

  // ----------- HANDLE STATUS LOCATION ----------------
  useEffect(() => {
    if (
      statusSetLocation === Status.SUCCESS ||
      statusSetLocation === Status.ERROR
    ) {
      dispatch(resetCurrentLocation({isLogout: false}));
    }
  }, [statusSetLocation]);

  // ----------- HANDLE STATUS LIST SHOP------------
  useEffect(() => {
    if (statusGetListShop === Status.SUCCESS) {
      dispatch(resetGetListShop());
    }
  }, [statusGetListShop]);

  // ----------- HANDLE STATUS EXPIRED PRODUCT ----------------
  useEffect(() => {
    if (statusExpiredProduct === Status.ERROR) {
      getExpireProduct();
    } else if (statusExpiredProduct === Status.SUCCESS) {
      dispatch(resetExpired());
    }
  }, [statusExpiredProduct, statusGetProductAllShop]);

  /// ----------- HANDLE STATUS PRODUCT ALL SHOP ----------------
  useEffect(() => {
    if (statusGetProductAllShop === Status.LOADING) {
      setLoading(true);
    }
    if (statusGetProductAllShop === Status.SUCCESS) {
      dispatch(resetProductAllShop());
    }
  }, [statusGetProductAllShop]);

  // ----------- HANDLE GET EXPIRE PRODUCT ----------------
  const getExpireProduct = () => {
    if (currentShop && currentShop?.restid) {
      dispatch(getProductExpired(currentShop?.restid));
    }
  };
  // --------------HANDLE CLICK TO PRODUCT IMAGE-----------
  const handlePressProduct = async item => {
    const theFirstLogin = await asyncStorage.getTheFirstLogin();
    if (item?.isExpired) {
      return;
    }
    if (theFirstLogin) {
      setModalConfirm(true);
      return;
    }
    if (!messageCheckAffiliate?.ref_phone) {
      setModalAffi(true);
      return;
    }
    dispatch(setCurrentProduct(item));
    navigation.navigate(NAVIGATION_PRODUCT_DETAIL);
  };

  // ---------------------------------- ORDER SECTION ---------------------
  // const isFocused = useIsFocused();
  // HANDLE ERROR WHEN CREATE ORDER FAILED
  useEffect(() => {
    if (statusCreateOrder === Status.ERROR) {
      setShowNotification(true);
      // SHOW NOTIFICATION AFTER CREATE ORDER
    }
  }, [statusCreateOrder]);
  // const defaultDelivery = useSelector(state => defaultDeliSelector(state));
  // ------------------- HANDLE CONFIRM MESSAGE CREATE ORDER --------------------
  const handleConfirmMessage = () => {
    setShowNotification(false);
    if (statusCreateOrder === Status.SUCCESS) {
      dispatch(resetOrder()); // SUCCESS -> RESET ORDER
    }
    if (
      statusCreateOrder === Status.ERROR &&
      messageCreateOrder &&
      messageCreateOrder.includes('tạm thời hết hàng')
    ) {
      // EXPIRED  PRODUCT ---> REMOVE PRODUCT FROM ORDER
      getExpireProduct();
      return;
    }
    if (
      statusCreateOrder === Status.ERROR &&
      messageCreateOrder &&
      messageCreateOrder.includes('Voucher không hợp lệ')
    ) {
      dispatch(
        setCurrentOrder({...currentOrder, voucher: null, applied_products: []}),
      );
      dispatch(resetMomoPayment());
      dispatch(getOrderInfoReset());
      dispatch(resetQrCode());
      dispatch(resetAppliedVoucher());
      return;
    }
    // setModalConfirmUpdate(true);
  };
  useEffect(() => {
    // HANDLE ERROR EVENT WHEN CREATE ORDER ---> WRONG PRICE ---> GET NEW LIST PRODUCT -> PUSH TO LIST PRODUCT OF NEW ORDER
    if (
      statusCreateOrder === Status.ERROR &&
      messageCreateOrder &&
      (messageCreateOrder.includes('giá sp chính không chính xác') ||
        messageCreateOrder.includes('Giá sản phẩm không hợp lệ'))
    ) {
      const mapCheckProduct = new Map(
        currentOrder.products.map(product => {
          return [product.prodid, product];
        }),
      );
      const newProductOrder = [];
      categoryProducts.map(cate => {
        if (cate && cate.products) {
          cate.products.map(item => {
            if (mapCheckProduct.has(item.prodid)) {
              const prodOrder = mapCheckProduct.get(item.prodid);
              const updatedProduct = {
                ...item,
                quantity: prodOrder.quantity || 1,
                extra_items: prodOrder.extra_items,
                extraIds: prodOrder.extraIds,
              };
              newProductOrder.push(updatedProduct);
            }
          });
        }
      });
      dispatch(setCurrentOrder({...currentOrder, products: newProductOrder}));
      dispatch(resetErrorOrder());
    }
  }, [categoryProducts]);
  useEffect(() => {
    // HANDLE WRONG EVENT WHEN CREATE ORDER ----> EXPIRED PRODUCTS  ERROR----> REMOVED EXPIRED PRODUCTS
    if (
      statusCreateOrder === Status.ERROR &&
      messageCreateOrder &&
      messageCreateOrder.includes('tạm thời hết hàng')
    ) {
      const mapCheckExpired = new Map(
        listExpireProduct.map(item => {
          return [parseInt(item.prod_id, 10), item];
        }),
      );
      const {products} = currentOrder || [];
      products.map((product, index) => {
        if (mapCheckExpired.has(product.prodid)) {
          products.splice(index, 1);
        }
      });
      dispatch(setCurrentOrder({...currentOrder, products: products}));
      dispatch(resetErrorOrder());
    }
  }, [listExpireProduct]);
  // ------------------- HANDLE ANIMATION AND SCROLL TO ITEM
  useEffect(() => {
    if (statusAddProduct === Status.SUCCESS) {
      dispatch(resetStatusAddingProduct());
    }
  }, [statusAddProduct]);

  const renderCategoryProducts = ({item, index}) => {
    return (
      <View onLayout={onLayout(index)}>
        {item?.name && item.name !== '' && index > 0 && (
          <TextSemiBold style={styles.titleCategory}>
            {item.name.toUpperCase()}
          </TextSemiBold>
        )}
        <FlatList
          data={item.products}
          renderItem={useMemoProduct}
          keyExtractor={(prod, idx) => `${prod.prodid}_${idx}`}
          numColumns={2}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  };
  // RENDER PRODUCT
  const renderProductItems = ({item}) => {
    return (
      <ProductItem
        styleContainer={styles.styleContainerProduct}
        styleImage={styles.styleImageProduct}
        product={item}
        onPressDetail={handlePressProduct}
      />
    );
  };
  // RENDER TAB CATE ITEM
  // const renderTabHorizontalItem = useCallback(
  //   ({item, index}) => {
  //     return (
  //       <ItemTabHorizontal
  //         {...{item, index, catePosi}}
  //         handleSelectTab={handleSelectTab}
  //       />
  //     );
  //   },
  //   [categoryProducts, catePosi],
  // );

  // useEffect(() => {
  //   if (refTabHorizontal && refTabHorizontal.current && catePosi !== -1) {
  //     categoryProducts.length &&
  //       refTabHorizontal.current.scrollToIndex({
  //         animation: true,
  //         index: catePosi,
  //         viewPostion: 0,
  //       });
  //   }
  // }, [catePosi]);
  const [myRef, setMyRef] = useState(null);
  const handleSelectTab = (_, index) => {
    if (index === catePosi || !myRef) {
      return;
    }
    const newY = index > 0 && index < messure.length - 1 ? messure[index] : 0;
    myRef.scrollTo({
      x: 0,
      y: newY - 20,
      animated: true,
    });
  };
  const checkPostionY = y => {
    const len = messure.length;
    if (y > messure[len - 1] && catePosi !== len - 1) {
      setCataPosi(len - 1);
    } else if (y < messure[1] && catePosi !== 0) {
      setCataPosi(0);
    } else {
      let indexCate = -1;
      messure.forEach((_, index) => {
        const next = index < len - 1 ? index + 1 : -1;
        const limitUp = messure[index] - 40;
        const limitDown = messure[next] - 40;
        if (y >= limitUp && messure[next] && y <= limitDown) {
          indexCate = index;
        }
      });
      if (catePosi !== indexCate && indexCate !== -1) {
        setCataPosi(indexCate);
      }
    }
  };

  const animationHeader = type => ({
    opacity: positionY.interpolate({
      inputRange: [0, 150],
      outputRange: type === 1 ? [0, 1] : [1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: positionY.interpolate({
          inputRange: [0, 150],
          outputRange: type === 1 ? [-150, insets.top] : [0, -50],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  const memoizedCategory = useMemo(
    () => renderCategoryProducts,
    [categoryProducts],
  );
  const useMemoProduct = useMemo(() => renderProductItems, [categoryProducts]);

  // ------------------- BOTTOM SHEET CART STATE ---------------
  const [isShowcart, setShowCart] = useState(0);
  const sheetRef = useRef(null);

  // ------------------- BOTTOM SHEET CART HANDLER ---------------
  const onPressModalCart = () => {
    setShowCart(0);
    sheetRef.current?.dismiss();
    navigation && navigation.navigate(NAVIGATION_CART_DETAIL);
  };
  const handleShowUp = () => {
    setShowCart(prev => (prev = prev === 0 ? 1 : 0));
  };
  useEffect(() => {
    isShowcart === 0 && sheetRef.current?.dismiss();
    isShowcart > 0 && sheetRef.current?.present();
  }, [isShowcart]);
  const handleResetCart = useCallback(() => {
    sheetRef.current?.dismiss();
    setShowCart(0);
    dispatch(setCurrentOrder({...currentOrder, products: []}));
  });
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.8}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    [],
  );
  const renderFooterList = useCallback(
    () =>
      currentOrder.products.length > 0 && (
        <View style={{height: MODAL_BOTTOM_HEIGHT}} />
      ),
  );
  // const handleScrollFailed = useCallback(error => {
  //   if (refTabHorizontal.current && categoryProducts.length) {
  //     refTabHorizontal.current.scrollToOffset({
  //       offset: error.averageItemLength * error.index,
  //       animated: true,
  //     });
  //     refTabHorizontal.current.scrollToIndex({
  //       index: error.index,
  //       animated: true,
  //     });
  //   }
  // }, []);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [loading]);
  const handlePickUp = () => {
    let value = !currentOrder.takeaway;
    dispatch(
      setCurrentOrder({
        ...currentOrder,
        takeaway: value,
      }),
    );
  };
  const onPressCate = () => {
    setShowCart(2);
  };

  const handleNextAffi = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: NAVIGATION_CONNECTION,
            params: {type: 1},
          },
        ],
      }),
    );
  };

  return (
    <View style={[styles.container]}>
      <ImageBackground
        style={styles.wrapperScrollView}
        imageStyle={styles.wrapperScrollView}
        source={backGSplash}>
        {/* DROP HEADER WHEN SCROLLING */}
        <Animated.View style={[styles.newTabHeader, animationHeader(1)]}>
          {categoryProducts.length > 0 && (
            <FloatHeader
              {...{currentOrder, categoryProducts, catePosi}}
              handlePickUp={handlePickUp}
              onPressCate={onPressCate}
            />
          )}
        </Animated.View>
        {/* SCROLL VIEW */}
        <SafeAreaView>
          <ScrollView
            onScroll={({nativeEvent}) => {
              positionY.setValue(nativeEvent.contentOffset.y);
              checkPostionY(nativeEvent.contentOffset.y);
            }}
            ref={r => setMyRef(r)}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <Animated.View
              onLayout={onLayoutDelivery}
              style={[
                animationHeader(2),
                {
                  paddingTop: 12,
                  paddingBottom: 16,
                },
              ]}>
              <HeaderMenu
                content={currentShop?.restname}
                navigation={navigation}
                showLoginModal={() => {
                  if (currentUser.current === null || !currentUser.current) {
                    setModalConfirm(true);
                    return;
                  }
                }}
              />
            </Animated.View>

            {statusGetProductAllShop === Status.DEFAULT &&
              categoryProducts &&
              categoryProducts.length > 0 && (
                <FlatList
                  data={categoryProducts}
                  extraData={currentOrder.takeaway}
                  scrollEnabled={false}
                  keyExtractor={(cate, idx) => `${cate.name}_${cate.id}_${idx}`}
                  renderItem={memoizedCategory}
                  contentContainerStyle={[styles.containerFlatlist]}
                  ListFooterComponent={renderFooterList}
                  showsVerticalScrollIndicator={false}
                />
              )}
            {statusGetProductAllShop === Status.ERROR && (
              <View style={styles.errorContainer}>
                <TextSemiBold>{strings.common.errorOccurred}</TextSemiBold>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>

        {isShowcart > 0 && (
          <BottomSheetModal
            enablePanDownToClose={false}
            enableOverDrag={false}
            overDragResistanceFactor={0}
            enableHandlePanningGesture={false}
            handleIndicatorStyle={{display: 'none'}}
            backdropComponent={renderBackdrop}
            onChange={v => v === -1 && setShowCart(0)}
            ref={sheetRef}
            snapPoints={['80%']}>
            <View style={{flex: 1}}>
              <View
                style={[
                  styles.wrapperIndicator,
                  isShowcart === 2 && {justifyContent: 'flex-end'},
                ]}>
                {isShowcart === 1 && (
                  <TouchableOpacity onPress={handleResetCart}>
                    <TextSmallEleven style={{color: '#EF0000'}}>
                      {'Xoá tất cả'}
                    </TextSmallEleven>
                  </TouchableOpacity>
                )}
                <TextSemiBold style={styles.indicatorTitle}>
                  {isShowcart === 1 ? 'Giỏ hàng' : 'Danh mục'}
                </TextSemiBold>
                <TouchableOpacity onPress={handleShowUp}>
                  <Icons type={'Feather'} name={'x'} size={25} color={'gray'} />
                </TouchableOpacity>
              </View>
              <BottomSheetScrollView>
                {isShowcart === 1 && (
                  <BottomSheetCart
                    currentOrder={currentOrder}
                    handleShowUp={handleShowUp}
                  />
                )}
                {isShowcart === 2 && (
                  <View style={{flex: 1, paddingTop: 20}}>
                    <FlatList
                      data={categoryProducts}
                      contentContainerStyle={{paddingHorizontal: '1.5%'}}
                      renderItem={({item, index}) => {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              setShowCart(0);
                              handleSelectTab(item, index);
                            }}
                            style={{
                              marginBottom: 10,
                              alignItems: 'center',
                              marginRight: 4,
                              width: '24%',
                            }}>
                            <Svg name={`i_${item.id}`} size={77} />
                            <TextSmallMedium
                              numberOfLines={2}
                              style={{
                                textAlign: 'center',
                                marginTop: 8,
                                textTransform: 'capitalize',
                              }}>
                              {item.name}
                            </TextSmallMedium>
                          </TouchableOpacity>
                        );
                      }}
                      keyExtractor={(prod, idx) => `${prod.prodid}_${idx}`}
                      numColumns={4}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
              </BottomSheetScrollView>
              {isShowcart === 1 && (
                <ModalCart
                  onPress={onPressModalCart}
                  type={2}
                  showCart={handleShowUp}
                  styleContainerModalCart={styles.styleModalCart}
                />
              )}
            </View>
            {/* {isShowcart === 2 && <OrderSuccessMessage onClose={handleShowUp} />} */}
          </BottomSheetModal>
        )}

        {currentOrder.products && currentOrder.products.length > 0 && (
          <ModalCart
            onPress={onPressModalCart}
            type={1}
            showCart={handleShowUp}
            styleContainerModalCart={styles.modalCart}
          />
        )}

        <ModalStatusOrder
          status={statusCreateOrder}
          showModal={showNotification}
          errorException={messageCreateOrder}
          messageSuccess={strings.common.orderSuccess}
          messageError={strings.common.orderFailure}
          handleConfirmMessage={handleConfirmMessage}
          navigation={navigation}
        />
        <ConfirmationModal
          isOpen={modalConfirm}
          onCancel={() => setModalConfirm(false)}
          onConfirm={handleConfirmChange}
          textContent={strings.common.loginNotification}
        />
        <ConfirmationModal
          isOpen={modalAffi}
          onCancel={() => setModalAffi(false)}
          onConfirm={() => handleNextAffi()}
          textContent={'Bạn cần nhập mã giới thiệu để đặt hàng'}
        />
      </ImageBackground>
      {loading && isMenuScreen && <ProgressScreen {...{loading}} />}
    </View>
  );
};

export default Menu;
