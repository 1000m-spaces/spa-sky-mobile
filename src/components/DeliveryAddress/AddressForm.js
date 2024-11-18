import {
  TextNormal,
  TextNormalSemiBold,
  TextSmallMedium,
} from 'common/Text/TextFont';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {ScrollView, TextInput, TouchableOpacity, View} from 'react-native';
import Colors from 'theme/Colors';
import {styles} from './DeliveryAddress';
import CustomCheckbox from 'common/Checkbox/CustomCheckbox';
import Icons from 'common/Icons/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {
  createDeliverySelector,
  statusRemoveDeliSelector,
  statusUpdateDeliAddress,
} from 'store/selectors';
import Status from 'common/Status/Status';
import {
  createDeliAddress,
  listDeliAddres,
  removeDeliveryAddress,
  resetCreateDelivery,
  resetRemovingDelivery,
  resetUpdateDelivery,
  selectDeliveryAction,
  updateDelivery,
} from 'store/actions';
import ConfirmationModal from 'common/ConfirmationModal/ConfirmationModal';
import Titles from 'common/Titles/Titles';
import {asyncStorage} from 'store/index';
import Loading from 'common/Loading/Loading';

const AddressForm = ({
  onSearch,
  newAddress,
  name,
  setName,
  onDone,
  typeScreen, // 2-EDIT 4-CREATE
  phone,
  selectedDelivery,
  setPhone,
  defaultDelivery,
  onBack,
  item,
  address,
}) => {
  const [isDisbaled, setIsDisbaled] = useState(true);
  // 1-REMOVE  2-CANT REMOVE 3-CATCH CHANGED
  const [modal, setModal] = useState({val: 0});
  const [error, setError] = useState({1: null, 2: null, 3: null});
  const [loading, setLoading] = useState(false);
  const currentUser = useRef(null);

  const dispatch = useDispatch();
  const statusCreateDelivery = useSelector(state =>
    createDeliverySelector(state),
  );
  const statusRemoveDelivery = useSelector(state =>
    statusRemoveDeliSelector(state),
  );
  const statusUpdateDelivery = useSelector(state =>
    statusUpdateDeliAddress(state),
  );

  useEffect(() => {
    initUser();
    return () => {
      setModal(null);
      currentUser.current = null;
      setError(null);
    };
  }, []);
  const initUser = async () => {
    const tempUser = await asyncStorage.getUser();
    currentUser.current = tempUser ? tempUser : null;
  };

  useEffect(() => {
    if (newAddress && newAddress?.name) {
      isDisbaled && setIsDisbaled(false);
    }
  }, [newAddress]);
  const checkValid = () => {
    if (
      !name ||
      !phone ||
      phone.length < 10 ||
      (typeScreen === 4 && !newAddress)
    ) {
      setError({
        ...error,
        1: !name ? '*Họ và tên không đuợc để trống' : null,
        2: !phone
          ? '*Số điện thoại không đuợc để trống'
          : phone.length < 10
          ? '*Số điện thoại chưa hợp lệ'
          : null,
        3: !newAddress ? '*Địa chỉ không đuợc để trống' : null,
      });
      return false;
    }
    return true;
  };
  const onSave = () => {
    const valid = checkValid();
    if (!valid) {
      return;
    }
    setLoading(true);

    const body = {
      address: newAddress ? newAddress.name : '',
      default: false,
      description: '',
      distance: 1.0,
      created_by: currentUser.current ? currentUser.current.custid : '',
      lat: newAddress ? parseFloat(newAddress.latitude) : 0,
      lng: newAddress ? parseFloat(newAddress.longitude) : 0,
      recipient_name: name,
      recipient_phone: phone,
    };
    if (typeScreen === 4) {
      console.log('body create::', body);
      dispatch(createDeliAddress(body));
      return;
    }
    if (typeScreen === 2) {
      const tempAddress = {
        ...body,
        id: item.id,
        lat: newAddress ? newAddress.latitude : item.lat,
        lng: newAddress ? newAddress.longitude : item.lng,
        address: newAddress ? newAddress.name : item.address,
      };
      selectedDelivery &&
        selectedDelivery.id === item.id &&
        dispatch(selectDeliveryAction(tempAddress));
      console.log('tempAddress update body:::', tempAddress, newAddress);
      dispatch(updateDelivery(tempAddress));
      return;
    }
  };
  useEffect(() => {
    if (
      statusCreateDelivery === Status.SUCCESS ||
      statusUpdateDelivery === Status.SUCCESS ||
      statusRemoveDelivery === Status.SUCCESS
    ) {
      onSuccess();
    }
    if (
      statusCreateDelivery === Status.ERROR ||
      statusUpdateDelivery === Status.ERROR ||
      statusRemoveDelivery === Status.ERROR
    ) {
      setLoading(false);
      setModal({
        val: 4,
        title: 'Thông báo',
        isConfirm: true,
        content: 'Cập nhật thất bại.Vui lòng thử lại sau!',
        confirmText: 'Trở về',
      });
    }
  }, [statusCreateDelivery, statusUpdateDelivery, statusRemoveDelivery]);
  const onSuccess = () => {
    currentUser.current &&
      dispatch(listDeliAddres({user_id: currentUser.current.custid}));
    statusCreateDelivery !== Status.DEFAULT && dispatch(resetCreateDelivery());
    statusUpdateDelivery !== Status.DEFAULT && dispatch(resetUpdateDelivery());
    statusRemoveDelivery !== Status.DEFAULT &&
      dispatch(resetRemovingDelivery());
    statusRemoveDelivery === Status.SUCCESS &&
      selectedDelivery &&
      item.id === selectedDelivery.id &&
      dispatch(selectDeliveryAction(defaultDelivery));

    let timeout = setTimeout(() => {
      setLoading(false);
      onDone();
      clearTimeout(timeout);
      timeout = 0;
    }, 1000);
  };
  const isEditted = () => {
    isDisbaled && setIsDisbaled(false);
  };
  const onRemove = () => {
    // Address is not default -> Ask to remove
    setModal({
      val: 1,
      title: 'Xoá địa chỉ',
      content: 'Bạn chắc chắn muốn xoá địa chỉ này?',
      confirmText: 'Xoá',
    });
    return;
  };
  const handleConfirmModal = () => {
    // address is default -> can not remove -> close modal
    if (modal.val === 2 || modal.val === 4) {
      setModal({val: 0});
      return;
    }
    // confirm remove address
    if (modal.val === 1 && item) {
      setLoading(true);
      dispatch(
        removeDeliveryAddress({
          user_id: currentUser.current ? currentUser.current.custid : '',
          id: item.id,
        }),
      );
      setModal({val: 0});
      return;
    }
    // confirm return back and dont update after change
    if (modal.val === 3) {
      onBack();
      return;
    }
  };
  const handleBack = () => {
    // Address changed -> Ask to continue update or Back
    if (typeScreen === 2 && isDisbaled === false) {
      setModal({
        val: 3,
        title: 'Bạn chưa lưu thông tin',
        content:
          'Thông tin thay đổi chưa được lưu. Bạn có chắc chắn muốn huỷ thay đổi?',
        confirmText: 'Huỷ',
        cancelText: 'Tiếp tục sửa',
      });
      return;
    } else {
      onBack();
    }
  };
  const onCloseModal = useCallback(() => setModal({val: 0}));
  return (
    <ScrollView style={styles.wrapperScrollView}>
      <Titles iconBack={true} onPressBack={handleBack} title={'Địa chỉ mới'} />
      <View style={styles.wrapperFormAddress}>
        <TextNormalSemiBold style={{paddingVertical: 4}}>
          {'Người liên hệ'}
        </TextNormalSemiBold>
        <TextInput
          value={name || ''}
          placeholder={'*Họ và tên'}
          placeholderTextColor={Colors.secondary}
          onChangeText={setName}
          onChange={isEditted}
          style={[
            styles.wrapperInput,
            error && error[1] && !name && styles.errorInput,
          ]}
        />
        {error && error[1] && !name && (
          <TextSmallMedium style={styles.warningText}>
            {error[1]}
          </TextSmallMedium>
        )}
        <TextInput
          value={phone || ''}
          placeholder={'*Số điện thoại'}
          placeholderTextColor={Colors.secondary}
          onChangeText={setPhone}
          keyboardType="number-pad"
          returnKeyType={'done'}
          onChange={isEditted}
          style={[styles.wrapperInput, error[2] && styles.errorInput]}
        />
        {error && error[2] && (
          <TextSmallMedium style={styles.warningText}>
            {error[2]}
          </TextSmallMedium>
        )}
        <TextNormalSemiBold style={styles.titleText}>
          {'Địa chỉ'}
        </TextNormalSemiBold>
        <TouchableOpacity
          onPress={onSearch}
          style={[
            styles.wrapperInput,
            styles.wrapperButtonLocation,
            error &&
              error[3] &&
              typeScreen === 4 &&
              !newAddress &&
              styles.errorInput,
          ]}>
          <TextNormal
            style={{color: address || newAddress ? 'black' : Colors.secondary}}>
            {newAddress ? newAddress?.name : address || '*Điạ chỉ nhận hàng'}
          </TextNormal>
          <Icons
            name={'right'}
            type={'AntDesign'}
            size={15}
            color={'gray'}
            style={styles.iconNavigate}
          />
        </TouchableOpacity>
        {error && error[3] && !newAddress && typeScreen === 4 && (
          <TextSmallMedium style={styles.warningText}>
            {error[3]}
          </TextSmallMedium>
        )}
        {/* <TextNormalSemiBold style={styles.titleText}>
          {'Cài đặt'}
        </TextNormalSemiBold>
        <View style={[styles.wrapperInput, styles.rowBetween]}>
          <TextNormal>{'Đặt làm địa chỉ mặc định'}</TextNormal>
          <CustomCheckbox
            value={isDefault}
            isDisabled={typeScreen === 2 && item.default === true}
            setValue={onCheckboxChange}
          />
        </View> */}
        {typeScreen === 2 && (
          <TouchableOpacity
            onPress={onRemove}
            style={[styles.removeAddressBtn]}>
            <TextNormal
              style={{
                color: Colors.hot,
              }}>
              {'Xoá địa chỉ'}
            </TextNormal>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onSave}
          style={[
            styles.createAddressBtn,
            {
              backgroundColor: isDisbaled ? Colors.disbaled : Colors.primary,
              marginTop: 40,
            },
          ]}
          disabled={isDisbaled}>
          <TextNormalSemiBold
            style={{
              color: isDisbaled ? 'gray' : 'white',
            }}>
            {'Hoàn thành'}
          </TextNormalSemiBold>
        </TouchableOpacity>
        <ConfirmationModal
          isOpen={modal.val > 0}
          onCancel={onCloseModal}
          isConfriming={modal.val > 0 && modal?.isConfirm}
          textConfrimBtn={
            modal.val > 0 && modal.confirmText ? modal.confirmText : ''
          }
          cancelText={
            modal.val > 0 && modal.val === 3 ? modal.cancelText : null
          }
          onConfirm={handleConfirmModal}
          textContent={modal.val > 0 ? modal?.content : ''}
          title={modal.val > 0 && modal.val !== 2 ? modal?.title : ' Thông báo'}
        />
        <Loading isHidden={loading} />
      </View>
    </ScrollView>
  );
};

export default memo(AddressForm);
