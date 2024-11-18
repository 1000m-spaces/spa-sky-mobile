import axios from 'axios';
import {expectSaga} from 'redux-saga-test-plan';

import {NEOCAFE} from 'store/actionsTypes';
import {createOrder} from 'store/actions';
import orderController from 'store/order/orderController';
import {createNewOrder, setExtraForProduct} from 'store/order/orderSaga';
// const fakeGetListShop = jest.fn();

// Giả mạo HttpClient để kiểm thử
// jest.mock('axios');
// jest.mock('store/order/orderSaga');

test('should dispatch receiveDataAction after a successful API call', async () => {
  // setExtraForProduct.mockResolvedValue({});
  // Dữ liệu đầu vào mẫu
  const input = {};

  // Dữ liệu phản hồi mẫu
  const mockResult = {
    data: {
      status: 200,
    },
  };
  // Giả mạo phương thức HttpClient.post và dữ liệu phản hồi của nó
  axios.post.mockResolvedValue(mockResult);

  // Thực hiện kiểm thử thực tế
  const ReceivedResult = await orderController.createNewOrder(input);

  //  testttttt
  // await expectSaga(getListShop, {payload: input}) // Sử dụng tên saga và payload đúng cách
  // .put({
  //   type: NEOCAFE.GET_LIST_SHOP_SUCCESS,
  //   payload: [], // Thay thế bằng giá trị thực tế mong đợi
  // })
  // .dispatch({type: NEOCAFE.GET_LIST_SHOP_REQUEST, payload: input}) // Dispatch action đúng cách
  // .run();

  //action check xem action trong put có xảy ra hay không
  await expectSaga(createNewOrder, {payload: input})
    .put({
      type: NEOCAFE.CREATE_ORDER_SUCCESS,
      payload: {},
    })
    .dispatch(createOrder(input))
    .run();

  await expectSaga(createNewOrder, {payload: input})
    .put({
      type: 'NEOCAFE_CREATE_ORDER_ERROR',
      payload: {errorMsg: 'Đặt hàng thất bại. Vui lòng thử lại !'},
    })
    .dispatch(createOrder(input))
    .run();

  // Kiểm tra kết quả mong đợi
  // expect(ReceivedResult.data).toEqual(mockResult);
});
