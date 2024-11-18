import Svg from 'common/Svg/Svg';
import {TextNormal} from 'common/Text/TextFont';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {getCurrentSelectedProduct} from 'store/selectors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  detail_product,
  IMAGE_URL,
  isAndroid,
  widthDevice,
} from 'assets/constans';
import Images from 'common/Images/Images';
import Colors from 'theme/Colors';
import {NAVIGATION_HOME, NAVIGATION_MENU} from 'navigation/routes';
const colors = {
  7966: '#866428',
  7967: '#568879',
  7968: '#58512F',
};
const story = {
  7966: '1000M Dạo Rừng - Dạo bước dưới những tán cây Cổ Thụ huyền bí',
  7967: '1000M Săn Mây - Hành trình săn mây trên đỉnh Ngàn thước',
  7968: '1000M Đổ Đèo - Băng qua những cung đường thơm mùi Kiều Mạch',
};

const ProductStory = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const currentProduct = useSelector(
    state => getCurrentSelectedProduct(state) || {},
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors[currentProduct.prodid],
        padding: isAndroid ? 0 : insets.top,
      }}>
      <View style={styles.wrapperContent}>
        {/* CLOSE BUTTON */}
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATION_HOME)}
          style={[styles.btnBack]}>
          <Svg name={'back_icon'} size={28} />
        </TouchableOpacity>
        {currentProduct && currentProduct?.prodimg && (
          <Images
            source={
              currentProduct?.prodimg
                ? {
                    uri: currentProduct.prodimg.includes('https')
                      ? `${currentProduct.prodimg}`
                      : `${IMAGE_URL}${currentProduct.prodimg}`,
                  }
                : detail_product
            }
            style={[styles.imageProduct]}
            resizeMode={'cover'}
          />
        )}
        <TextNormal style={styles.prodTitle}>
          {currentProduct.prodname}
        </TextNormal>
        <TextNormal
          style={{fontSize: 14, color: Colors.whiteColor, textAlign: 'center'}}>
          {'Trà sữa ' + currentProduct.prodname.split('-')[0] + '1000M'}
        </TextNormal>
        <TouchableOpacity
          onPress={() => navigation.navigate(NAVIGATION_MENU)}
          style={styles.btnOrder}>
          <TextNormal style={styles.btnOrderText}>{'Đặt hàng ngay'}</TextNormal>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.wrapperDes}>
        <TextNormal style={styles.titleStory}>
          {story[currentProduct.prodid]}
        </TextNormal>
        <TextNormal>{currentProduct.proddest.replaceAll('"', '')}</TextNormal>
      </ScrollView>
    </View>
  );
};

export default ProductStory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapperContent: {alignItems: 'center', paddingTop: 16},
  titleStory: {
    fontFamily: 'SVN-Poppins-SemiBold',
    fontSize: 18,
    lineHeight: 25,
    paddingBottom: 8,
    paddingTop: 16,
  },
  wrapperDes: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 24,
    padding: 16,
    borderTopRightRadius: 24,
  },
  btnBack: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  btnOrder: {
    height: 48,
    width: widthDevice - 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    opacity: 0.6,
    marginTop: 24,
    marginBottom: 28,
  },
  btnOrderText: {
    fontFamily: 'SVN-Poppins-SemiBold',
    color: Colors.whiteColor,
    opacity: 1,
    zIndex: 100,
  },
  prodTitle: {
    fontSize: 20,
    width: '70%',
    textAlign: 'center',
    fontFamily: 'SVN-Poppins-SemiBold',
    fontWeight: '600',
    color: Colors.whiteColor,
    lineHeight: 28,
    marginTop: 24,
    marginBottom: 8,
  },
  imageProduct: {
    width: 175,
    height: 235,
    borderRadius: 16,
  },
});
