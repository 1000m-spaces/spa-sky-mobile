import {NEOCAFE} from 'store/actionsTypes';

export const getProductExpired = id => ({
  type: NEOCAFE.GET_PRODUCT_EXPIRED_REQUEST,
  payload: {
    id,
  },
});
export const resetProductAllShop = () => ({
  type: NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_RESET,
});

// export const getProductMenu = data => {
//   console.log(data);
//   return {
//     type: NEOCAFE.GET_PRODUCT_MENU_REQUEST,
//     payload: {
//       restid: data.restid,
//       custid: data.custid,
//       categoryid: data.categoryid,
//     },
//   };
// };
export const getProducAllByShop = data => {
  return {
    type: NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_REQUEST,
    payload: {
      restid: data.restid,
      custid: data.custid,
      categoryid: data.categoryid,
      is_shipping_menu: data.is_shipping_menu,
    },
  };
};

export const setCurrentProduct = product => {
  return {
    type: NEOCAFE.SET_CURRENT_PRODUCT_REQUEST,
    payload: {
      product,
    },
  };
};

export const addFavorite = payload => ({
  type: NEOCAFE.ADD_FAVORITE_REQUEST,
  payload,
});
export const addFavoriteReset = () => ({
  type: NEOCAFE.ADD_FAVORITE_RESET,
});
export const resetGetFavorites = () => ({
  type: NEOCAFE.GET_FAVORITE_PRODUCT_RESET,
});

export const removeFavorite = payload => ({
  type: NEOCAFE.REMOVE_FAVORITE_REQUEST,
  payload,
});
export const resetExpired = () => ({
  type: NEOCAFE.GET_PRODUCT_EXPIRED_RESET,
});

export const getTopPurchasedProducts = payload => ({
  type: NEOCAFE.GET_TOP_PURCHASED_PRODUCT_REQUEST,
  payload,
});
export const resetTopPurchasedProducts = () => ({
  type: NEOCAFE.GET_TOP_PURCHASED_PRODUCT_RESET,
});

export const getRecommendedProduct = payload => ({
  type: NEOCAFE.GET_RECOMMENDED_PRODUCT_REQUEST,
  payload,
});
export const resetRecommendedProduct = () => ({
  type: NEOCAFE.GET_RECOMMENDED_PRODUCT_RESET,
});
