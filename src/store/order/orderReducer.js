import {initOrder} from 'assets/constans';
import Status from 'common/Status/Status';
import {NEOCAFE} from 'store/actionsTypes';
import { queryZalopay } from './orderAction';

const initialState = {
  // History orders
  listHistoryOrder: [],
  statusGetListHistoryOrder: Status.DEFAULT,
  errorGetListHistoryOrder: '',
  selectedHistoryOrder: {},
  statusSetDetailOrder: Status.DEFAULT,
  //Revert Order
  statusRevertOrder: Status.DEFAULT,
  errorRevertOrder: '',
  // Current order
  currentOrder: initOrder,
  statusRefundPayment: Status.DEFAULT,
  messageRefundPayment: '',
  statusSetCurrentOrder: Status.DEFAULT,
  mapCheckProduct: new Map(),
  statusAddProductToOrder: Status.DEFAULT,
  statusSubtractProductFromOrder: Status.DEFAULT,
  statusCreateOrder: Status.DEFAULT,
  messageCreateOrder: '',
  statusCancelOrder: Status.DEFAULT,
  //Info Order
  infoOrder: null,
  statusGetInfoOrder: Status.DEFAULT,
  // zalo
  zaloPayment: null,
  statusZaloPayment: Status.DEFAULT,

  queryZalopay: null,
  statusQueryZalo: Status.DEFAULT,
};
const handleCheckProduct = (list, payload) => {
  let resultProducts = [];
  let tempMapCheck = new Map();
  if (list.length === 0) {
    tempMapCheck.set(
      `${payload.prodid}_${payload.option_item.id}_${payload.extraIds}`,
      payload,
    );
  } else {
    tempMapCheck = new Map(
      list.map(item => {
        return [`${item.prodid}_${item.option_item.id}_${item.extraIds}`, item];
      }),
    );
    if (
      tempMapCheck.has(
        `${payload.prodid}_${payload.option_item.id}_${payload.extraIds}`,
      ) === true
    ) {
      const existingProduct = tempMapCheck.get(
        `${payload.prodid}_${payload.option_item.id}_${payload.extraIds}`,
      );

      tempMapCheck.set(
        `${payload.prodid}_${payload.option_item.id}_${payload.extraIds}`,
        {
          ...existingProduct,
          quantity: existingProduct.quantity + payload.quantity,
        },
      );
    } else {
      tempMapCheck.set(
        `${payload.prodid}_${payload.option_item.id}_${payload.extraIds}`,
        payload,
      );
    }
  }
  resultProducts = Array.from(tempMapCheck.values());
  return [resultProducts, tempMapCheck];
};

const checkListConvert = (listProConvert, listMapAllPro, listExpired) => {
  let listConvert = [];
  let mapConvert = new Map();
  var error = '';
  const mapCheckExpire = new Set(listExpired.map(item => item.prod_id));
  const mainProduct = listProConvert
    .filter(prod => prod.parent_prod_id === null)
    .filter(prod => mapCheckExpire.has(`${prod.prod_id}`) === false);

  const extraList = listProConvert.filter(prod => prod.parent_prod_id !== null);
  mainProduct.map(proConvert => {
    if (listMapAllPro.has(`${proConvert.prod_id}`)) {
      const existingValue = listMapAllPro.get(`${proConvert.prod_id}`);
      if (
        existingValue?.options !== false &&
        existingValue.options.length > 0
      ) {
        const tempOption =
          existingValue.options[0].filter(
            item => item.id === proConvert.opt_id1,
          ) || [];
        existingValue.option_item =
          tempOption && tempOption.length > 0 ? tempOption[0] : {id: -1};
      }
      const checkExtraSelected = extraList.findIndex(
        item => item.parent_prod_id === proConvert.id,
      );
      if (checkExtraSelected !== -1) {
        existingValue.extra_items = Array.from(extraList, item => {
          if (item?.parent_prod_id === proConvert?.id) {
            return {
              id: item?.prod_id,
              name_vn: item?.prodname,
              price: item?.oldprice,
            };
          }
        }).filter(item => item);
        existingValue.extraIds = Array.from(extraList, item => {
          if (item?.parent_prod_id === proConvert?.id) {
            return item?.prod_id;
          }
        }).filter(item => item);
      }
      existingValue.quantity = proConvert?.quantity;
      const tempProd = JSON.parse(JSON.stringify(existingValue));
      mapConvert.set(
        `${tempProd?.prodid}_${tempProd?.option_item.id}_${tempProd?.extraIds}`,
        tempProd,
      );
    } else {
      error += `${proConvert.prodname}, `;
    }
  });
  listConvert = Array.from(mapConvert.values());
  return [listConvert, error];
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    // -------------------- QUERY ZALOPAY -----------------
    case NEOCAFE.QUERY_ZALOPAY_REQUEST:
      return {
        ...state,
        statusQueryZalo: Status.LOADING,
      };
    case NEOCAFE.QUERY_ZALOPAY_SUCCESS:
      return {
        ...state,
        queryZalopay: payload,
        statusQueryZalo: Status.SUCCESS,
      };
    case NEOCAFE.QUERY_ZALOPAY_ERROR:
      return {
        ...state,
        statusQueryZalo: Status.ERROR,
      };
    case NEOCAFE.QUERY_ZALOPAY_RESET:
      return {
        ...state,
        statusQueryZalo: Status.DEFAULT,
        queryZalopay: null,
      };
    // ----------------- ZALO PAYMENT
    case NEOCAFE.ZALO_PAYMENT_REQUEST:
      return {
        ...state,
        statusZaloPayment: Status.LOADING,
      };
    case NEOCAFE.ZALO_PAYMENT_SUCCESS:
      return {
        ...state,
        zaloPayment: payload,
        statusZaloPayment: Status.SUCCESS,
      };
    case NEOCAFE.ZALO_PAYMENT_ERROR:
      return {
        ...state,
        statusZaloPayment: Status.ERROR,
        zaloPayment: null,
      };
    case NEOCAFE.ZALO_PAYMENT_RESET:
      return {
        ...state,
        statusZaloPayment: Status.DEFAULT,
        zaloPayment: null,
      };
    // REFUND PAYMENT ONLINE
    case NEOCAFE.REFUND_PAYMENT_ONLINE_REQUEST:
      return {
        ...state,
        statusRefundPayment: Status.LOADING,
      };
    case NEOCAFE.REFUND_PAYMENT_ONLINE_SUCCESS:
      return {
        ...state,
        messageRefundPayment: payload,
        statusRefundPayment: Status.SUCCESS,
      };
    case NEOCAFE.REFUND_PAYMENT_ONLINE_ERROR:
      return {
        ...state,
        statusRefundPayment: Status.ERROR,
        messageRefundPayment: payload,
      };
    case NEOCAFE.REFUND_PAYMENT_ONLINE_RESET:
      return {
        ...state,
        statusRefundPayment: Status.DEFAULT,
        messageRefundPayment: '',
      };
    //INFOMATION ORDER
    case NEOCAFE.GET_ORDER_INFO_REQUEST:
      return {
        ...state,
        statusGetInfoOrder: Status.LOADING,
      };
    case NEOCAFE.GET_ORDER_INFO_SUCCESS:
      return {
        ...state,
        infoOrder: payload.data,
        statusGetInfoOrder: Status.SUCCESS,
      };
    case NEOCAFE.GET_ORDER_INFO_ERROR:
      return {
        ...state,
        statusGetInfoOrder: Status.ERROR,
      };
    case NEOCAFE.GET_ORDER_INFO_RESET:
      return {
        ...state,
        infoOrder: null,
        statusGetInfoOrder: Status.DEFAULT,
      };
    // LIST HISTORY ORDER
    case NEOCAFE.GET_LIST_HISTORY_ORDER_REQUEST:
      return {
        ...state,
        statusGetListHistoryOrder: Status.LOADING,
      };
    case NEOCAFE.GET_LIST_HISTORY_ORDER_SUCCESS:
      return {
        ...state,
        listHistoryOrder: payload.listHistoryOrder,
        statusGetListHistoryOrder: Status.SUCCESS,
      };
    case NEOCAFE.GET_LIST_HISTORY_ORDER_ERROR:
      return {
        ...state,
        statusGetListHistoryOrder: Status.ERROR,
        errorGetListHistoryOrder: payload?.errorMsg,
      };
    case NEOCAFE.GET_LIST_HISTORY_ORDER_RESET:
      return {
        ...state,
        statusGetListHistoryOrder: Status.DEFAULT,
        errorGetListHistoryOrder: '',
      };
    // DETAIL HISTORY ORDER
    case NEOCAFE.SET_DETAIL_ORDER_REQUEST:
      return {
        ...state,
        statusSetDetailOrder: Status.LOADING,
      };
    case NEOCAFE.SET_DETAIL_ORDER_SUCCESS:
      return {
        ...state,
        selectedHistoryOrder: payload.detailHistoryOrder,
        statusSetDetailOrder: Status.SUCCESS,
      };
    case NEOCAFE.SET_DETAIL_ORDER_ERROR:
      return {
        ...state,
        statusSetDetailOrder: Status.ERROR,
      };
    // CURRENT ORDER
    case NEOCAFE.SET_CURRENT_ORDER_REQUEST:
      return {
        ...state,
        statusSetCurrentOrder: Status.LOADING,
      };
    case NEOCAFE.SET_CURRENT_ORDER_SUCCESS:
      return {
        ...state,
        currentOrder: payload.currentOrder,
        statusSetCurrentOrder: Status.SUCCESS,
      };
    case NEOCAFE.SET_CURRENT_ORDER_ERROR:
      return {
        ...state,
        statusSetCurrentOrder: Status.ERROR,
      };

    // ADD PRODUCT TO ORDER
    case NEOCAFE.ADD_PRODUCT_REQUEST:
      return {
        ...state,
        statusAddProductToOrder: Status.LOADING,
      };
    case NEOCAFE.ADD_PRODUCT_SUCCESS:
      const [listProduct, mapProduct] = handleCheckProduct(
        state.currentOrder.products,
        payload,
      );
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          products: listProduct,
          applied_products: listProduct,
        },
        mapCheckProduct: mapProduct,
        statusAddProductToOrder: Status.SUCCESS,
      };
    case NEOCAFE.ADD_PRODUCT_ERROR:
      return {
        ...state,
        statusAddProductToOrder: Status.ERROR,
      };
    case NEOCAFE.ADD_PRODUCT_RESET:
      return {
        ...state,
        statusAddProductToOrder: Status.DEFAULT,
      };
    //REVERT ORDOR
    case NEOCAFE.REVERT_ORDER_REQUEST:
      return {
        ...state,
        statusRevertOrder: Status.LOADING,
      };
    case NEOCAFE.REVERT_ORDER_SUCCESS:
      let listProductOrder = state.currentOrder.products;
      let errorEmptyPro = '';
      let status = Status.DEFAULT;
      const [listAddCart, error] = checkListConvert(
        JSON.parse(JSON.stringify(payload.listProConvert)),
        payload.listMapAllPro,
        JSON.parse(JSON.stringify(payload.expiredProducts)),
      );
      if (error) {
        errorEmptyPro = error.replace(/,[\s]*$/, '');
        status = Status.ERROR;
      } else {
        status = Status.SUCCESS;
      }
      //Check should add to Cart
      if (payload.addCart || !error) {
        listProductOrder = listAddCart;
        status = Status.SUCCESS;
      }
      return {
        ...state,
        currentOrder: {
          ...state.currentOrder,
          products: listProductOrder,
        },
        errorRevertOrder: errorEmptyPro,
        statusRevertOrder: status,
      };
    case NEOCAFE.REVERT_ORDER_RESET:
      return {
        ...state,
        errorRevertOrder: '',
        statusRevertOrder: Status.DEFAULT,
      };
    // CREATE ORDER
    case NEOCAFE.CREATE_ORDER_REQUEST:
      return {
        ...state,
        statusCreateOrder: Status.LOADING,
      };
    case NEOCAFE.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        statusCreateOrder: Status.SUCCESS,
        messageCreateOrder: payload,
      };
    case NEOCAFE.CREATE_ORDER_ERROR:
      let listProductCart = state.currentOrder.products;

      let mapListProductCart = new Map(listProductCart.map(i => [i.prodid, i]));
      payload.listExpired && payload.listExpired.length > 0 &&
        payload.listExpired.map(expired => {
          if (mapListProductCart.has(expired)) {
            mapListProductCart.delete(expired);
          }
        });
      return {
        ...state,
        messageCreateOrder: payload.errorMsg,
        currentOrder: {
          ...state.currentOrder,
          products: Array.from(mapListProductCart.values()),
        },
        statusCreateOrder: Status.ERROR,
      };
    case NEOCAFE.CREATE_ORDER_RESET:
      return {
        ...state,
        statusCreateOrder: Status.DEFAULT,
        mapCheckProduct: new Map(),
        messageCreateOrder: '',
        currentOrder: initOrder,
      };
    case 'RESET_ERROR_ORDER':
      return {
        ...state,
        statusCreateOrder: Status.DEFAULT,
        messageCreateOrder: '',
      };

    // CANCEL ORDER ACTION
    case NEOCAFE.CANCEL_ORDER_REQUEST:
      return {
        ...state,
        statusCancelOrder: Status.LOADING,
      };
    case NEOCAFE.CANCEL_ORDER_SUCCESS:
      return {
        ...state,
        statusCancelOrder: Status.SUCCESS,
      };
    case NEOCAFE.CANCEL_ORDER_ERROR:
      return {
        ...state,
        statusCancelOrder: Status.ERROR,
      };
    case NEOCAFE.CANCEL_ORDER_RESET:
      return {
        ...state,
        statusCancelOrder: Status.DEFAULT,
      };
    default:
      return state;
  }
};
