import AsyncStorage from '@react-native-async-storage/async-storage';

const setVersionChplayPrevious = async ver => {
  try {
    await AsyncStorage.setItem('previousVersion', ver);
  } catch (e) {
    console.log(e);
  }
};

const getVersionChplayPrevious = async () => {
  try {
    const value = await AsyncStorage.getItem('previousVersion');
    if (value) {
      return value;
    } else {
      return '0.0.0';
    }
  } catch (e) {
    console.log(e);
  }
};

const setExtraProducts = async listProduct => {
  try {
    await AsyncStorage.setItem('extraProduct', JSON.stringify(listProduct));
  } catch (error) {
    console.log(error);
  }
};
const getExtraProducts = async () => {
  try {
    const value = await AsyncStorage.getItem('extraProduct');
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
const setLastOrder = async lastOrder => {
  console.log('set last order local: ', lastOrder);
  try {
    await AsyncStorage.setItem('theLastOrder', JSON.stringify(lastOrder));
  } catch (error) {
    console.log(error);
  }
};
const getLastOrder = async () => {
  try {
    const value = await AsyncStorage.getItem('theLastOrder');
    if (value) {
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

const setUser = async user => {
  try {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (e) {
    console.log(e);
  }
};

const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      // console.log(value);
      return JSON.parse(value);
    }
  } catch (error) {
    console.log(error);
  }
  return null;
};

const setSkipForceUpdate = async skip => {
  try {
    await AsyncStorage.setItem('skipForceUpdate', skip);
  } catch (e) {
    console.log(e);
  }
};

const getSkipForceUpdate = async () => {
  try {
    const value = await AsyncStorage.getItem('skipForceUpdate');
    if (value == 'true') {
      return 'true';
    } else {
      console.log('SKIP_FORCE_UPDTE:', value);
      return 'false';
    }
  } catch (e) {
    console.log(e);
  }
};

const setTheFirstLogin = async theFirst => {
  try {
    await AsyncStorage.setItem('theFirstLogin', theFirst ? '1' : '0');
  } catch (e) {
    console.log(e);
  }
};

const getTheFirstLogin = async () => {
  try {
    const value = await AsyncStorage.getItem('theFirstLogin');
    return value === '1' || !value ? true : false;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const clearStorage = async () => {
  // AsyncStorage.clear();
  try {
    await AsyncStorage.removeItem('user');
    // await AsyncStorage.removeItem('recommendedProducts');
  } catch (e) {
    console.log(e);
  }
};

const getListRecommned = async () => {
  try {
    const value = await AsyncStorage.getItem('recommendedProducts');
    if (value) {
      return JSON.parse(value);
    } else {
      return {
        list1: [],
        list2: [],
        created_at: '',
        index_recommend: 0,
      };
    }
  } catch (error) {
    return {
      list1: [],
      list2: [],
      created_at: new Date().toString(),
      index_recommend: 0,
    };
  }
};
const setListRecommned = async listProduct => {
  try {
    await AsyncStorage.setItem(
      'recommendedProducts',
      JSON.stringify(listProduct),
    );
  } catch (error) {
    console.log(error);
  }
};
const setCart = async cart => {
  try {
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.log('set cart local error:', error);
  }
};
const getCart = async () => {
  try {
    const cart = await AsyncStorage.getItem('cart');
    return JSON.parse(cart);
  } catch (error) {
    console.log('get cart error::', error);
  }
};
const getPaymentGateway = async () => {
  try {
    const r = await AsyncStorage.getItem('payment_gateway');
    return JSON.parse(r);
  } catch (error) {
    console.log('get cart error::', error);
  }
};
const setPaymentGateway = async v => {
  try {
    await AsyncStorage.setItem('payment_gateway', JSON.stringify(v));
  } catch (error) {
    console.log('set payment  error:', error);
  }
};

export default {
  setListRecommned,
  getCart,
  getPaymentGateway,
  setPaymentGateway,
  setCart,
  getListRecommned,
  setLastOrder,
  getLastOrder,
  getExtraProducts,
  setExtraProducts,
  setUser,
  getUser,
  setSkipForceUpdate,
  getSkipForceUpdate,
  setTheFirstLogin,
  getTheFirstLogin,
  clearStorage,
  setVersionChplayPrevious,
  getVersionChplayPrevious,
};
