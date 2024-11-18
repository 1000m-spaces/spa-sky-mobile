import shopController from 'store/shop/shopController';
import axios from 'axios';
import {expectSaga} from 'redux-saga-test-plan';
import {runSaga} from 'redux-saga';

import {getListShop} from 'store/shop/shopSaga';
import {NEOCAFE} from 'store/actionsTypes';
import {getListShop as getListShopAction} from 'store/actions';

describe('Shop Test store', () => {
  it('check data, action call Shop Success', async () => {
    // Dữ liệu đầu vào mẫu
    const input = {};

    // Dữ liệu phản hồi mẫu
    const mockResult = {
      data: {
        status: 200,
        data: {
          custid: 0,
          lat: 0,
          long: 0,
          partnerid: 100,
        },
      },
    };
    // Giả mạo phương thức HttpClient.post và dữ liệu phản hồi của nó
    axios.post.mockResolvedValue(mockResult);

    // Thực hiện kiểm thử thực tế
    const ReceivedResult = await shopController.getListShop(input);

    //action check xem action trong put có xảy ra hay không
    const mockApiResponse = {status: true, data: {data: 123}};
    await expectSaga(getListShop, {payload: input})
      .put({
        type: NEOCAFE.GET_LIST_SHOP_SUCCESS,
        payload: [],
      })
      .dispatch(getListShopAction(input))
      .run();

    // Kiểm tra kết quả mong đợi
    expect(ReceivedResult.data).toEqual(mockResult);
  });

  it('check data, action call Shop Error', async () => {
    // Dữ liệu đầu vào mẫu
    const input = {};

    // Dữ liệu phản hồi mẫu
    const mockResult = {
      status: false,
      error: 'wrong params',
    };
    // Giả mạo phương thức HttpClient.post và dữ liệu phản hồi của nó
    axios.post.mockResolvedValue(mockResult);

    // Thực hiện kiểm thử thực tế
    const ReceivedResult = await shopController.getListShop(input);
    //action check xem action trong put có xảy ra hay không
    const mockApiResponse = {status: true, data: {data: 123}};
    await expectSaga(getListShop, {payload: input})
      .put({
        type: NEOCAFE.GET_LIST_SHOP_ERROR,
        payload: {errorMsg: 'Lỗi trong quá trình lấy thông tin cửa hàng'},
      })
      .dispatch(getListShopAction(input))
      .run();

    // Kiểm tra kết quả mong đợi
    // expect(ReceivedResult).toEqual(mockResult);
  });
});
