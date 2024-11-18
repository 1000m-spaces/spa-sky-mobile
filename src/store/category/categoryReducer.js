import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';
const filterListCategory = payload => {
  let completeList = [];
  if (payload && payload.listCategory) {
    const {listCategory} = payload;
    const filteredList = listCategory.filter(
      cate =>
        cate?.name_vi &&
        cate?.name_vi.toUpperCase() !== 'NẠP TIỀN' &&
        cate.name_vi !== 'Gói Vận Chuyển',
    );
    let result = [];
    const mapCate = new Map(
      filteredList.map(item => {
        const temp = {
          id: item.id,
          name: item.name_vi,
          products: [],
        };
        return [item.id, temp];
      }),
    );
    let listPro =
      (payload.listProductAllByShop &&
        payload.listProductAllByShop.filter(pro => pro.prodid < 1000000000)) ||
      [];

    listPro.map(product => {
      if (product && product.categoryid && mapCate.has(product.categoryid)) {
        const tempCate = mapCate.get(product.categoryid);
        if (tempCate.products.length >= 1) {
          return;
        } else {
          tempCate.products.push(product);
        }
      }
    });
    let tempResult = Array.from(mapCate.values());
    result = tempResult.filter(item => item.products.length > 0);
    const mapCategories = new Map(
      result.map(item => {
        return [item.name.toUpperCase(), item];
      }),
    );
    try {
      initialState.listCategory.forEach(initCate => {
        if (mapCategories.has(initCate?.name.toUpperCase())) {
          let tempCate = mapCategories.get(initCate?.name.toUpperCase()) || -1;
          tempCate.icon = initCate.icon;
          mapCategories.set(initCate?.name.toUpperCase(), tempCate);
        }
      });
      completeList = Array.from(mapCategories.values());
    } catch (error) {
      console.log(error);
    }
  }
  // console.log('complete list: ', completeList);
  return completeList;
};
const initialState = {
  // PRODUCT_MENU
  listCategory: [
    {name_dev: 'Yêu Thích', icon: 'icon_yeuthich1', id: 1032, name: 'GỢI Ý'},
    {name: 'TRÀ CÁC LOẠI', icon: 'icon_tra1', id: 1034, name_dev: ''},
    {id: 1035, name: 'ĐÁ XAY VÀ HOA QUẢ', icon: 'icon_hoaqua1', name_dev: ''},
    {
      id: 1136,
      name: 'GÓC SỨC KHOẺ',
      icon: 'icon_drink',
      name_dev: 'Healthy Corner',
    },
    {name: 'CAFE', icon: 'icon_cf1', id: 1045, name_dev: 'Cà Phê'},
    {
      name: 'CAFE TÁCH CAFFEINE',
      icon: 'icon_decaf1',
      id: 1121,
      name_dev: 'Cafe Decaf',
    },
    {
      name: 'CAFE THƯỢNG HẠNG',
      icon: 'icon_daubep',
      id: 1137,
      name_dev: 'Gourmet Corner',
    },
    {name: 'ĐỒ UỐNG NÓNG', icon: 'icon_uongnong1', id: 1036, name_dev: ''},
    // {name: 'Đá Xay & Hoa Quả', icon: 'icon_hoaqua1', name_dev: ''},
    {name: 'NEOCAFE CORNER', icon: 'icon_cornor1', id: 1044, name_dev: ''},
    {
      name: 'BÁNH NGỌT VÀ ĐỒ KHÁC',
      icon: 'icon_banhngot1',
      id: 1037,
      name_dev: 'Bánh Ngọt & Đồ Khác',
    },
  ],
  statusGetCategory: Status.DEFAULT,

  currentCategory: {},
  statusSetCategory: Status.DEFAULT,

  listBanner: [],
  statusGetBanner: Status.DEFAULT,
};
export default (state = initialState, {type, payload}) => {
  switch (type) {
    case NEOCAFE.GET_LIST_CATEGORY_REQUEST:
      return {
        ...state,
        statusGetCategory: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_CATEGORY_SUCCESS:
      const completeList = filterListCategory(payload);
      return {
        ...state,
        listCategory: completeList,
        currentCategory: completeList[0],
        statusGetCategory: Status.SUCCESS,
      };
    case NEOCAFE.GET_LIST_CATEGORY_ERROR:
      return {
        ...state,
        statusGetCategory: Status.ERROR,
      };
    case NEOCAFE.GET_LIST_CATEGORY_RESET:
      return {
        ...state,
        statusGetCategory: Status.DEFAULT,
      };
    // FILTER CATEGORY WITH PRODUCT
    case NEOCAFE.GET_PRODUCT_ALL_BY_SHOP_SUCCESS:
      const result = filterListCategory(payload);
      return {
        ...state,
        listCategory: result,
        currentCategory: result[0],
      };
    // SET CURRENT CATEGORY
    case NEOCAFE.SET_CURRENT_CATEGORY_REQUEST:
      return {
        ...state,
        statusSetCategory: Status.LOADING,
      };
    case NEOCAFE.SET_CURRENT_CATEGORY_SUCCESS:
      return {
        ...state,
        currentCategory: payload.currentCategory,
        statusSetCategory: Status.SUCCESS,
      };
    case NEOCAFE.SET_CURRENT_CATEGORY_ERROR:
      return {
        ...state,
        statusSetCategory: Status.ERROR,
      };
    case NEOCAFE.SET_CURRENT_CATEGORY_RESET:
      return {
        ...state,
        statusSetCategory: Status.DEFAULT,
      };
    // BANNER
    case NEOCAFE.GET_LIST_BANNER_REQUEST:
      return {
        ...state,
        statusGetBanner: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_BANNER_SUCCESS:
      return {
        ...state,
        listBanner: payload.listBanner,
        statusGetBanner: Status.SUCCESS,
      };
    case NEOCAFE.GET_LIST_BANNER_ERROR:
      return {
        ...state,
        statusGetBanner: Status.ERROR,
      };
    case NEOCAFE.GET_LIST_BANNER_RESET:
      return {
        ...state,
        listBanner: [],
        statusGetBanner: Status.DEFAULT,
      };
    default:
      return state;
  }
};
// const mapCategoryProduct = (listCate, listProduct) => {
//   if (
//     !listProduct ||
//     listProduct.length <= 0 ||
//     !listCate ||
//     listCate.length <= 0
//   ) {
//     return;
//   }
//   let result = [];
//   const mapCate = new Map(
//     listCate.map(item => {
//       return [item.id, {...item, products: []}];
//     }),
//   );
//   listProduct.map(product => {
//     if (product && product.categoryid && mapCate.has(product.categoryid)) {
//       const tempCate = mapCate.get(product.categoryid);
//       tempCate.products.push(product);
//     }
//   });
//   let tempResult = Array.from(mapCate.values());
//   result = tempResult.filter(item => item.products.length > 0);
//   result.map(cate => {
//     delete cate.products;
//   });
//   return result;
// };
