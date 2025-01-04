import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

//Xử lý task khi có mạng, ko thì show alert
export const handleTaskRequireNetwork = callback => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      console.log('#####connect:', state);
      callback();
    } else {
      console.log('######disconnect:', state);
      Alert.alert(
        'Spa Sky',
        'Kết nối mạng không ổn định. Vui lòng thử lại',
        [
          {
            text: 'OK',
            onPress: () => {
              //console.log("Ask me later pressed")
            },
          },
        ],
        { cancelable: false },
      );
    }
  });
};
