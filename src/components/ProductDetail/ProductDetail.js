import Icons from 'common/Icons/Icons';
import Options from 'common/Options/Options';
import ProductQuantityControl from 'common/ProductQuantityControl/ProductQuantityControl';
import React, {useCallback, useEffect, useRef, useState} from 'react';

import {
  getCurrentSelectedProduct,
  statusAddingProduct,
  getCurrentOrder,
} from 'store/selectors';
import {useSelector, useDispatch} from 'react-redux';
import {FlatList, TouchableOpacity, View, ScrollView} from 'react-native';
import styles from './styles';

import {addProductToOrder, setCurrentProduct} from 'store/actions';
import {NAVIGATION_CART_DETAIL, NAVIGATION_MENU} from 'navigation/routes';
import {asyncStorage} from 'store/index';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Description from './Description';
import ProductAction from './ProductAction';
import {TextSemiBold} from 'common/Text/TextFont';
const ProductDetail = ({navigation}) => {
  const insets = useSafeAreaInsets();
  // ------------------------------------ LOCAL STATE --------------------------------
  const [listOption, setListOption] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const didMount = useRef(false);

  // --------------------------------------- GLOBAL STATE --------------------------------
  const dispatch = useDispatch();
  const currentProduct = useSelector(
    state => getCurrentSelectedProduct(state) || {},
  );
  const statusAddProduct = useSelector(state => statusAddingProduct(state));
  const currentOrder = useSelector(state => getCurrentOrder(state));

  // --------------------------------------- METHODS AND FUNCTIONS --------------------------------
  // WATCH CURRENT PRODUCT ----> UPDATE OPTIONS FOR SELECTED PRODUCT
  useEffect(() => {
    if (
      didMount.current === false &&
      currentProduct &&
      currentProduct?.prodid
    ) {
      setupOptions();
    }
  }, []);
  const mapStorageExtraProduct = async (tempMapExtra, listOptions) => {
    const extraProducts = (await asyncStorage.getExtraProducts()) || [];
    if (!extraProducts || extraProducts.length === 0) {
      setListOption(listOptions);
      return;
    }

    let checkExistProduct = false;
    extraProducts.map(extra => {
      if (extra?.product_id && extra?.product_id === currentProduct?.prodid) {
        checkExistProduct = true;
        if (extra && extra.extra_ids && extra.extra_ids.length >= 1) {
          const extraDefault = [];
          const tempMapSetListOption = new Map();

          extra?.extra_ids.map(item => {
            if (tempMapExtra.has(item)) {
              extraDefault.push(tempMapExtra.get(item));
              tempMapSetListOption.set(item, tempMapExtra.get(item));
            }
          });

          listOptions.map(cate => {
            if (cate && cate?.data && cate?.data.length > 0) {
              cate?.data.map(item => {
                if (tempMapSetListOption.has(item?.id)) {
                  item.value = true;
                } else if (
                  !tempMapSetListOption.has(item?.id) &&
                  item.value &&
                  cate.id === 1
                ) {
                  item.value = false;
                }
              });
            }
          });

          setListOption(listOptions);

          dispatch(
            setCurrentProduct({
              ...currentProduct,
              extraIds: extra?.extra_ids,
              extra_items: extraDefault,
            }),
          );
        }
      }
    });
    if (checkExistProduct === false) {
      setListOption(listOptions);
    }
  };
  // SET UP OPTIONS FOR PRODUCT
  const setupOptions = async () => {
    if (!currentProduct) {
      return;
    }
    let listOptions = [];
    // SET UP OPTION
    if (currentProduct.options && currentProduct.options !== false) {
      const tempListOption = [];
      currentProduct?.options.forEach(option => {
        option.forEach(item => {
          tempListOption.push({
            ...item,
            value:
              currentProduct.option_item.id !== -1 &&
              currentProduct.option_item.id === item.id,
            typeName: 'option',
            group_type: -1,
            price: -1,
          });
        });
      });
      listOptions.push({
        id: 999,
        title: 'Options*',
        data: tempListOption,
      });
    }
    // SET UP EXTRA
    if (currentProduct.extras && currentProduct.extras !== false) {
      const mapSubTypes = new Map( // initialize Map object {extraId, {data}}
        currentProduct.extras[0].map(item => {
          return [
            item?.group_type,
            {
              id: item?.group_type,
              title:
                item.group_type === 1
                  ? item.group_extra_name + '*'
                  : item.group_extra_name,
              data: [],
            },
          ];
        }),
      );
      const tempMapExtra = new Map(); // Map all extra to check for storage
      currentProduct?.extras[0].map(item => {
        tempMapExtra.set(item?.id, {...item, value: false}); // Set the value
        if (mapSubTypes.has(item?.group_type)) {
          mapSubTypes.get(item?.group_type)?.data.push({
            ...item,
            value: currentProduct.extraIds.includes(item?.id),
          });
        }
      });
      listOptions = [
        ...listOptions,
        ...Array.from(mapSubTypes, ([_, val]) => val),
      ];
      mapStorageExtraProduct(tempMapExtra, listOptions); // Become paramater
    } else {
      setListOption(listOptions);
    }
  };
  // UPDATE OPTIONS FOR PRODUCT
  const handleOptionChange = item => {
    if (!item) {
      return;
    }
    didMount.current = true;
    switch (item.group_type) {
      case -1: // CHANGE OPTION
        dispatch(
          setCurrentProduct({
            ...currentProduct,
            option_item: item,
          }),
        );
        break;
      case 1: // CHANGE EXTRA TYPE 1
        let listCheck = [...currentProduct.extra_items].filter(
          extra => extra.group_type !== 1,
        );
        dispatch(
          setCurrentProduct({
            ...currentProduct,
            extra_items: [...listCheck, item],
            extraIds: [...Array.from(listCheck, val => val.id), item.id],
          }),
        );
        break;
      case 0: // CHANGE EXTRA TYPE 0
        const newExtraSelected = JSON.parse(
          JSON.stringify(currentProduct.extra_items),
        );
        if (item.value === true) {
          newExtraSelected.push({...item, value: true});
        }
        dispatch(
          setCurrentProduct({
            ...currentProduct,
            extra_items: item.value
              ? newExtraSelected
              : newExtraSelected.filter(extra => extra.id !== item.id),
            extraIds: Array.from(
              item.value
                ? newExtraSelected
                : newExtraSelected.filter(extra => extra.id !== item.id),
              value => value.id,
            ),
          }),
        );
        let prevList0 = Array.from(listOption);
        prevList0.map(itemOption => {
          itemOption.id === 0 &&
            itemOption.data.map(extra => {
              if (extra.id === item.id) {
                extra.value = item.value;
              }
            });
        });
        setListOption(prevList0);
        break;
      case 2: // CHANGE EXTRA TYPE 2
        let tempChecks = [];
        let isValid = true;
        if (item?.value === true) {
          tempChecks = Array.from(currentProduct.extra_items);
          const checkLength = tempChecks.filter(
            extra => extra?.group_type === 2,
          ).length;
          if (checkLength >= 2) {
            isValid = false;
          } else {
            tempChecks.push({...item, value: true});
          }
        } else {
          tempChecks = currentProduct?.extra_items.filter(
            extra => extra?.id !== item?.id,
          );
        }
        if (isValid === true) {
          dispatch(
            setCurrentProduct({
              ...currentProduct,
              extra_items: tempChecks,
              extraIds: Array.from(tempChecks, value => value.id),
            }),
          );

          setListOption(prev => {
            prev.map(itemOption => {
              if (itemOption.id === 2) {
                itemOption.data.map(extra => {
                  if (extra.id === item.id) {
                    extra.value = item.value;
                  }
                });
              }
            });
            return prev;
          });
        }
        break;
    }
  };
  // ADD PRODUCT TO ORDER
  const handleClickBuy = type => {
    // type === 1 -> BUY NOW ---------------- type === 2 -> ADD TO CART
    dispatch(
      addProductToOrder({
        ...currentProduct,
        quantity: quantity,
        extraIds: Array.from([...currentProduct.extra_items], val => val.id),
      }),
    );
    let timeout = setTimeout(() => {
      clearTimeout(timeout);
      timeout = 0;
      navigation.navigate(
        type === 2 ? NAVIGATION_MENU : NAVIGATION_CART_DETAIL,
      );
    }, 100);
  };

  const renderOptions = ({item, _}) => {
    return (
      <View key={item.title} style={styles.styleWrapperOptionLine}>
        <View style={styles.styleWrapperOptionLine}>
          <TextSemiBold>{item.title}</TextSemiBold>
        </View>
        {item.data && item.data?.length > 0 && (
          <Options
            listOption={item.data}
            updateOptionChange={handleOptionChange}
          />
        )}
      </View>
    );
  };
  const handleClose = () => {
    if (navigation) {
      navigation.navigate(NAVIGATION_MENU);
    }
  };

  return (
    <View style={styles.container}>
      {/* ANIMATED SCROLL */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* CLOSE BUTTON */}
        <TouchableOpacity
          onPress={handleClose}
          style={[styles.buttonClose, {top: insets.top + 10}]}>
          <Icons type={'AntDesign'} name={'left'} color={'black'} size={30} />
        </TouchableOpacity>
        {/* IMAGE && DESCRIPTION SECTION */}
        <Description currentProduct={currentProduct} />
        {/* OPTIONS & EXTRA SECTION */}
        <FlatList
          data={listOption}
          keyExtractor={item => item.title}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          scrollEnabled={false}
          contentContainerStyle={styles.listOptionsWrapper}
          renderItem={renderOptions}
        />
      </ScrollView>
      {/* QUANTITY & ACTIONS SECTION */}
      <View style={styles.containerCart}>
        <ProductQuantityControl
          setQuantity={setQuantity}
          quantity={quantity}
          navigation={navigation}
        />
        <ProductAction
          currentOrder={currentOrder}
          handleClickBuy={handleClickBuy}
          statusAddProduct={statusAddProduct}
        />
      </View>
    </View>
  );
};

export default ProductDetail;
