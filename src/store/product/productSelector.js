export const isListProductExpired = state => state.product.listProductExpired;
// export const getListProductMenu = state => state.product.listProductMenu || [];
// export const getStatusListProduct = state => state.product.statusGetProductMenu;
export const getCurrentSelectedProduct = state =>
  state.product.currentSelectedProduct;
export const statusSetCurrentProduct = state =>
  state.product.statusSetCurrentProduct;
export const isListProductAllByShop = state =>
  state.product.listProductAllByShop;
export const isListMoneyOnline = state => state.product.listMoneyOnline;
export const statusProductAllShop = state => state.product.statusProductAllShop;
// export const getFavoriteProducts = state => state.product.listFavoriteProduct;
// export const statusGetFavoriteProducts = state =>
//   state.product.statusGetFavoriteProduct;
// export const statusAddFav = state => state.product.statusAddFavorite;
// export const isErrorAddFavorite = state => state.product.errorAddFavorite;
// export const statusRemoveFav = state => state.product.statusRemoveFavorite;
export const isMapListProductAllByShop = state =>
  state.product.mapListProductAllByShop;
export const listCateWithProduct = state => state.product.mapCategoryProduct;
export const getStatusExpiredProduct = state =>
  state.product.statusGetProductExpired;
export const getTopPurchasedProduct = state =>
  state.product.topPurchasedProduct;
export const getStatusTopPurchased = state =>
  state.product.statusGetTopPurchased;
export const getRecommendedProducts = state => state.product.recommendedProduct;

export const getStatusRecommendedProduct = state =>
  state.product.statusRecommendedProduct;
