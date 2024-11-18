import React, {memo, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';
import {TextMoneyBold, TextNormal, TextSemiBold} from 'common/Text/TextFont';
import {detail_product, formatMoney, IMAGE_URL} from 'assets/constans';
import SeparatorLine from 'common/SeparatorLine/SeparatorLine';
import ModalDetailProduct from 'common/ModalDetailProduct/ModalDetailProduct';
import Colors from 'theme/Colors';
import Images from 'common/Images/Images';

const Description = ({currentProduct}) => {
  const [modal, setModal] = useState(false);

  const handleModal = () => setModal(prev => (prev = !prev));
  return (
    <View>
      <View style={[styles.imageProduct]}>
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
      </View>
      <View style={[styles.content]}>
        <View style={styles.viewNameProduct}>
          <TextMoneyBold numberOfLines={2} style={styles.nameProduct}>
            {currentProduct?.prodname}
          </TextMoneyBold>
        </View>
        <View style={styles.containerMoneyProduct}>
          <View style={styles.viewMoneyProduct}>
            <TextSemiBold style={styles.moneyProduct}>
              {formatMoney(
                currentProduct?.priceBySize
                  ? currentProduct?.priceBySize
                  : currentProduct.order_price,
              ) + 'đ'}
            </TextSemiBold>
          </View>
          <TouchableOpacity onPress={handleModal} style={styles.buttonInfo}>
            <TextNormal
              style={{
                color: Colors.secondary,
                textDecorationLine: 'underline',
              }}>
              {'Xem thêm'}
            </TextNormal>
          </TouchableOpacity>
        </View>
        {currentProduct?.proddest && (
          <TextNormal numberOfLines={2} style={styles.textDetail}>
            {currentProduct?.proddest}
          </TextNormal>
        )}
        <SeparatorLine
          separatorLine={styles.separatorLine}
          pointSeparatorLine={styles.pointSeparator}
        />
      </View>
      <ModalDetailProduct
        data={currentProduct}
        openModal={modal}
        onClose={() => setModal(false)}
        onPressOutSide={() => setModal(false)}
      />
    </View>
  );
};

export default memo(Description);
