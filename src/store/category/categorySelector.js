export const getListCategory = state => state.category.listCategory || [];
export const statusGetListCategory = state => state.category.statusGetCategory;
export const getCurrentSelectedCategory = state =>
  state.category.currentCategory;
export const statusSelectedCategory = state => state.category.statusSetCategory;
export const listBannerSelector = state => state.category.listBanner;
