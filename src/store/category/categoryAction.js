import {NEOCAFE} from 'store/actionsTypes';

export const getListCategory = data => ({
  type: NEOCAFE.GET_LIST_CATEGORY_REQUEST,
  payload: {
    userid: data.userid,
    shopid: data.shopid,
  },
});
export const setCurrentCategory = data => ({
  type: NEOCAFE.SET_CURRENT_CATEGORY_REQUEST,
  payload: {
    category: data,
  },
});

export const resetGetListCategory = () => ({
  type: NEOCAFE.GET_LIST_CATEGORY_RESET,
  payload: {},
});

export const getListBanner = data => ({
  type: NEOCAFE.GET_LIST_BANNER_REQUEST,
  payload: data,
});
