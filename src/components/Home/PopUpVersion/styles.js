import {widthDevice} from 'assets/constans';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  viewContent: {
    backgroundColor: 'white',
    padding: 10,
    height: 300,
    width: widthDevice - 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 12,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 12,
  },
  buttonUpdate: {
    padding: 10,
    height: 50,
    backgroundColor: 'blue',
  },
  textUpdate: {
    color: 'white',
  },
  textVerApp: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default styles;
