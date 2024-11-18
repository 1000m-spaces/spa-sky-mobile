import Status from 'common/Status/Status';
import strings from 'localization/Localization';
import {NEOCAFE} from 'store/actionsTypes';

const initialState = {
  // RECOMMENDED PRODUCT
  recommendedProduct: {},
  statusRecommendedProduct: Status.DEFAULT,

  // CURRENT_SELECTED_PRODUCT
  currentSelectedProduct: {},
  statusSetCurrentProduct: Status.DEFAULT,
  // PRODUCT_EXPIRED
  listProductExpired: [],
  statusGetProductExpired: Status.DEFAULT,
  errorGetProductExpired: '',
  // PRODUCT_All
  listProductAllByShop: [],
  mapCategoryProduct: [],
  mapListProductAllByShop: new Map(),
  listMoneyOnline: [],
  statusProductAllShop: Status.DEFAULT,

  // TOP_PURCHASED_PRODUCT
  topPurchasedProduct: [],
  statusGetTopPurchased: Status.DEFAULT,
  // STATUS ADD FAVORITE PRODUCT
  statusAddFavorite: Status.DEFAULT,
  errorAddFavorite: '',
  // STATUS REMOVE FAVORITE PRODUCT
  statusRemoveFavorite: Status.DEFAULT,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    // RECOMMENDED PRODUCT
    case NEOCAFE.GET_RECOMMENDED_PRODUCT_REQUEST:
      return {
        ...state,
        statusRecommendedProduct: Status.LOADING,
      };
    case NEOCAFE.GET_RECOMMENDED_PRODUCT_SUCCESS:
      console.log('GET_RECOMMENDED_PRODUCT_SUCCESS::: ', payload);
      return {
        ...state,
        statusRecommendedProduct: Status.SUCCESS,
        recommendedProduct: payload,
      };
    case NEOCAFE.GET_RECOMMENDED_PRODUCT_ERROR:
      return {
        ...state,
        statusRecommendedProduct: Status.ERROR,
      };
    case NEOCAFE.GET_RECOMMENDED_PRODUCT_RESET:
      return {
        ...state,
        statusRecommendedProduct: Status.DEFAULT,
      };

    // GET_TOP_PURCHASED_PRODUCT
    case NEOCAFE.GET_TOP_PURCHASED_PRODUCT_REQUEST:
      return {
        ...state,
        statusGetTopPurchased: Status.LOADING,
      };
    case NEOCAFE.GET_TOP_PURCHASED_PRODUCT_SUCCESS:
      // console.log('topPurchasedProduct reducerrrrrr:::', payload);
      return {
        ...state,
        statusGetTopPurchased: Status.SUCCESS,
        topPurchasedProduct: payload,
        // topPurchasedProduct: pushSixPurchased(
        //   payload,
        //   [6642, 7390, 6656, 7224, 7566, 7724, 6649],
        // ),
      };
    case NEOCAFE.GET_TOP_PURCHASED_PRODUCT_ERROR:
      return {
        ...state,
        statusGetTopPurchased: Status.ERROR,
      };
    case NEOCAFE.GET_TOP_PURCHASED_PRODUCT_RESET:
      return {
        ...state,
        statusGetTopPurchased: Status.DEFAULT,
      };
    // PRODUCT EXPIRED
    case NEOCAFE.GET_PRODUCT_EXPIRED_REQUEST:
      return {
        ...state,
        statusGetProductExpired: Status.LOADING,
      };
    case NEOCAFE.GET_PRODUCT_EXPIRED_SUCCESS:
      let resultListMenu = [];
      let resultListAllShop = [];
      if (state.mapCategoryProduct && state.mapCategoryProduct.length > 0) {
        resultListMenu = checkExpiredCateProduct(
          state.mapCategoryProduct,
          payload.listProductExpired,
        );
      } else {
        resultListMenu = state.mapCategoryProduct;
      }
      if (state.listProductAllByShop.length > 0) {
        resultListAllShop = checkExpiredProduct(
          state.listProductAllByShop,
          payload.listProductExpired,
        );
      } else {
        resultListAllShop = state.listProductAllByShop;
      }
      return {
        ...state,
        listProductExpired: payload.listProductExpired,
        mapCategoryProduct: resultListMenu,
        listProductAllByShop: resultListAllShop,
        statusGetProductExpired: Status.SUCCESS,
      };
    case NEOCAFE.GET_PRODUCT_EXPIRED_ERROR:
      return {
        ...state,
        statusGetProductExpired: Status.ERROR,
      };
    case NEOCAFE.GET_PRODUCT_EXPIRED_RESET:
      return {
        ...state,
        statusGetProductExpired: Status.DEFAULT,
      };
    // SET CURRENT ORDER SUCCESS ---> UPDATE QUANTITY FOR PRODUCT MENU
    case NEOCAFE.SET_CURRENT_ORDER_SUCCESS:
      let newCateProductMenu = [];
      let tempCateProduct = Array.from([...state.mapCategoryProduct]);
      if (!payload.currentOrder || payload.currentOrder.products.length === 0) {
        tempCateProduct.map(cate => {
          if (cate?.products && cate?.products.length > 0) {
            cate.products.map(product => {
              product.quantity = 0;
            });
          }
        });
      } else {
        const listProductOfOrder = JSON.parse(
          JSON.stringify(Array.from([...payload.currentOrder.products])),
        );
        newCateProductMenu =
          updateQuantityCateProduct(listProductOfOrder, tempCateProduct) || [];
      }
      return {
        ...state,
        mapCategoryProduct:
          newCateProductMenu.length > 0 ? newCateProductMenu : tempCateProduct,
      };
    // REVERT ORDER
    case NEOCAFE.REVERT_ORDER_SUCCESS:
      const listProConvert = JSON.parse(
        JSON.stringify(Array.from(payload.listProConvert)),
      );
      const tempCategoryProduct = JSON.parse(
        JSON.stringify(Array.from(state.mapCategoryProduct)),
      );
      listProConvert.map(item => {
        item.prodid = item.prod_id;
      });
      const newListProductMenu = updateQuantityCateProduct(
        listProConvert,
        tempCategoryProduct,
      );
      return {
        ...state,
        mapCategoryProduct: newListProductMenu,
      };
    // PRODUCT ALL SHOP
    case NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_REQUEST:
      return {
        ...state,
        statusProductAllShop: Status.LOADING,
      };
    case NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_SUCCESS:
      // console.log('payload product all shop', payload);
      let listMoney = filterMoneyAllProduct(payload.listProductAllByShop);
      let listPro =
        (payload.listProductAllByShop &&
          payload.listProductAllByShop.filter(
            pro => pro.prodid < 1000000000,
          )) ||
        [];
      const filteredListCate =
        payload?.listCategory &&
        payload?.listCategory.filter(
          cate =>
            cate?.name_vi &&
            cate?.name_vi.toUpperCase() !== 'NẠP TIỀN' &&
            cate.name_vi !== 'Gói Vận Chuyển',
        );
      return {
        ...state,
        listProductAllByShop: listPro,
        mapCategoryProduct: mapCategoryProducts(
          filteredListCate,
          listPro,
          state.topPurchasedProduct,
          payload.recommendation,
        ),
        mapListProductAllByShop: convertArrayToMap(listPro),
        listMoneyOnline: listMoney,
        statusProductAllShop: Status.SUCCESS,
      };
    case NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_ERROR:
      return {
        ...state,
        statusProductAllShop: Status.ERROR,
      };
    case NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_RESET:
      return {
        ...state,
        statusProductAllShop: Status.DEFAULT,
      };
    case NEOCAFE.ADD_PRODUCT_SUCCESS:
      const tempListProductMenu = [...state.mapCategoryProduct];
      tempListProductMenu.map(cate => {
        if (cate && cate.products) {
          cate.products.map(product => {
            if (
              product &&
              product.prodid === payload.prodid &&
              (cate.name !== 'Dành Cho Bạn' || cate.name !== 'For You')
            ) {
              product.quantity += payload.quantity;
            }
          });
        }
      });
      return {...state, mapCategoryProduct: tempListProductMenu};
    // REMOVE QUANTITY AFTER RESET ORDER
    case NEOCAFE.CREATE_ORDER_RESET:
      const tempCate = [...state.mapCategoryProduct];
      tempCate.map(cate => {
        if (cate && cate.products.length > 0) {
          cate.products.map(product => {
            product.quantity = 0;
          });
        }
      });
      return {
        ...state,
        mapCategoryProduct: tempCate,
        statusGetProductMenu: Status.DEFAULT,
      };
    case NEOCAFE.GET_PRODUCT_MENU_ERROR:
      return {
        ...state,
        statusGetProductMenu: Status.ERROR,
      };
    case NEOCAFE.GET_PRODUCT_MENU_RESET:
      return {
        ...state,
        statusGetProductMenu: Status.DEFAULT,
      };
    // SET_CURRENT_PRODUCT
    case NEOCAFE.SET_CURRENT_PRODUCT_REQUEST:
      return {
        ...state,
        statusSetCurrentProduct: Status.LOADING,
      };
    case NEOCAFE.SET_CURRENT_PRODUCT_SUCCESS:
      return {
        ...state,
        currentSelectedProduct: payload.product,
        statusSetCurrentProduct: Status.SUCCESS,
      };
    case NEOCAFE.SET_CURRENT_PRODUCT_ERROR:
      return {
        ...state,
        statusSetCurrentProduct: Status.ERROR,
      };
    case NEOCAFE.SET_CURRENT_PRODUCT_RESET:
      return {
        ...state,
        statusSetCurrentProduct: Status.DEFAULT,
      };
    default:
      return state;
  }
};

const filterMoneyAllProduct = product =>
  product.filter(
    item => item?.prodid >= 1000000000 && item?.prodid < 1300000000,
  );

const filterDuplicateProduct = product => {
  let setAllProduct = new Map(
    product
      .filter(pro => pro.prodid < 1000000000)
      .map(item => {
        return [item.prodid, item];
      }),
  );
  return Array.from(setAllProduct, ([_, val]) => val);
};

const pushSixPurchased = (array1, array2) => {
  var listPurchased = [];
  if (array1 && array1.length > 0) {
    listPurchased = array1.filter(id => id < 1000000000);
  }
  // Lọc các phần tử duy nhất từ mảng 2
  const uniqueElementsArray2 = Array.from(new Set(array2));

  // Lấy các phần tử từ mảng 2 cho đến khi mảng 1 có 6 phần tử
  const resultArray = listPurchased.slice();
  for (const element of uniqueElementsArray2) {
    // if (resultArray.length >= 6) {
    //   break;
    // }

    // Nếu phần tử chưa có trong mảng 1, thêm vào
    if (!resultArray.includes(element)) {
      resultArray.push(element);
    }
  }

  return resultArray; // Đảm bảo mảng 1 chỉ có 6 phần tử
};

const convertArrayToMap = listProduct => {
  let mapListPro = new Map();
  listProduct.forEach(product => {
    mapListPro.set(`${product.prodid}`, product);
  });
  return mapListPro;
};

const checkExpiredProduct = (listProduct, listExpireProduct) => {
  if (listProduct.length > 0) {
    const mapCheckExpired = new Map(
      listExpireProduct.map(item => {
        return [parseInt(item.prod_id, 10), item];
      }),
    );
    listProduct.map(product => {
      if (mapCheckExpired.has(parseInt(product.prodid, 10))) {
        product.isExpired = true;
      }
    });
  }
  const result = listProduct || [];
  return result;
};
const mapCategoryProducts = (
  listCate,
  listProduct,
  topPurchased,
  recommendation,
) => {
  let tempTopPurchased = [];
  // if (topPurchased && topPurchased.length > 0) {
  //   const mapTopPurchased = new Map();
  //   [...new Set(listProduct)].forEach(item => {
  //     if (topPurchased.includes(item.prodid)) {
  //       mapTopPurchased.set(item.prodid, JSON.parse(JSON.stringify(item)));
  //     }
  //   });
  //   topPurchased.forEach((prod, index) => {
  //     if (mapTopPurchased.get(prod)) {
  //       tempTopPurchased.push(mapTopPurchased.get(prod));
  //     }
  //   });
  //   // tempTopPurchased = Array.from(mapTopPurchased.values());
  //   const {list1, list2, index_recommend} = recommendation;
  //   if (
  //     tempTopPurchased &&
  //     tempTopPurchased.length > 0 &&
  //     list1 &&
  //     list1.length > 0 &&
  //     list2 &&
  //     list2.length > 0 &&
  //     index_recommend
  //   ) {
  //     var temp1 = {};
  //     var temp2 = {};
  //     for (const index in list1) {
  //       if (index >= index_recommend - 1 && listProduct) {
  //         temp1 = listProduct.find(item => item.prodid === list1[index]);
  //         if (temp1 && temp1?.prodid) {
  //           break;
  //         }
  //       }
  //     }
  //     // console.log('RECOMMENDED PRODUCT 1:::::', index_recommend, temp1, list1);
  //     if (temp1 && temp1?.prodid) {
  //       var indexof1 = tempTopPurchased.findIndex(
  //         item => item.prodid === temp1.prodid,
  //       );
  //       if (indexof1 !== -1) {
  //         swapElements(tempTopPurchased, 1, indexof1);
  //       } else {
  //         tempTopPurchased = [
  //           ...tempTopPurchased.slice(0, 1),
  //           temp1,
  //           ...tempTopPurchased.slice(1),
  //         ];
  //       }
  //     }
  //     for (const index in list1) {
  //       if (index >= index_recommend - 1 && listProduct) {
  //         temp2 = listProduct.find(item => item.prodid === list2[index]);
  //         if (temp2 && temp2?.prodid) {
  //           break;
  //         }
  //       }
  //     }
  //     if (temp2 && temp2?.prodid) {
  //       var indexof2 = tempTopPurchased.findIndex(
  //         item => item.prodid === temp2.prodid,
  //       );
  //       if (indexof2 !== -1) {
  //         swapElements(tempTopPurchased, 3, indexof2);
  //       } else {
  //         tempTopPurchased = [
  //           ...tempTopPurchased.slice(0, 3),
  //           temp2,
  //           ...tempTopPurchased.slice(3),
  //         ];
  //       }
  //     }
  //     if (
  //       tempTopPurchased &&
  //       topPurchased &&
  //       tempTopPurchased.length > topPurchased.length
  //     ) {
  //       tempTopPurchased = tempTopPurchased.slice(0, topPurchased.length);
  //     }
  //   }
  // }
  let result = [];
  const mapCate = new Map(
    listCate.map(item => {
      return [
        item.id,
        {
          id: item.id,
          name: strings.getLanguage() === 'vi' ? item.name_vi : item.name_en,
          products: [],
        },
      ];
    }),
  );

  listProduct.map(product => {
    if (product && product?.categoryid && mapCate.has(product?.categoryid)) {
      const tempCate = mapCate.get(product?.categoryid);
      product.categoryname = tempCate.name ? tempCate.name.toUpperCase() : '';
      product.quantity = 0;
      tempCate.products.push(product);
    }
  });
  let tempResult = Array.from(mapCate.values());
  result = tempResult.filter(item => item.products.length > 0);
  if (tempTopPurchased && tempTopPurchased.length > 0) {
    tempTopPurchased.map(item => {
      item.categoryid = -1;
    });
    result.unshift({
      id: -1,
      name: strings.getLanguage() === 'en' ? 'For You' : 'Dành Cho Bạn',
      products: tempTopPurchased,
    });
  }
  return result;
};

const swapElements = (array, index1, index2) => {
  // Kiểm tra xem index1 và index2 có hợp lệ không
  if (
    index1 < 0 ||
    index1 >= array.length ||
    index2 < 0 ||
    index2 >= array.length
  ) {
    console.error('Index out of bounds');
    return;
  }

  // Lưu trữ giá trị của phần tử thứ nhất vào biến tạm thời
  var temp = array[index1];

  // Gán giá trị của phần tử thứ hai cho phần tử thứ nhất
  array[index1] = array[index2];

  // Gán giá trị từ biến tạm thời cho phần tử thứ hai
  array[index2] = temp;
};

const checkExpiredCateProduct = (listCate, listExpired) => {
  if (listCate.length > 0) {
    const mapCheckExpired = new Map(
      listExpired.map(item => {
        return [parseInt(item.prod_id, 10), item];
      }),
    );
    listCate.map(cate => {
      if (cate && cate?.products.length > 0) {
        cate.products.map(product => {
          if (mapCheckExpired.has(parseInt(product.prodid, 10))) {
            product.isExpired = true;
          }
        });
      }
    });
  }
  const result = listCate || [];
  return result;
};
// NEED TO FIX-----------------------------
const updateQuantityCateProduct = (listConvert, listCateProduct) => {
  const mapCheckProduct = new Map();
  listConvert.map(product => {
    if (mapCheckProduct.has(product.prodid) === false) {
      mapCheckProduct.set(product.prodid, product);
    } else {
      const temp = mapCheckProduct.get(product.prodid);
      temp.quantity += product.quantity;
      mapCheckProduct.set(product.prodid, temp);
    }
  });
  listCateProduct.map(cate => {
    if (cate.products && cate.products.length > 0) {
      cate.products.map(product => {
        if (mapCheckProduct.has(product.prodid)) {
          const tempProd = mapCheckProduct.get(product.prodid);
          product.quantity = tempProd.quantity;
        } else {
          product.quantity = 0;
        }
      });
    }
  });
  const result = [...listCateProduct];
  return result;
};
