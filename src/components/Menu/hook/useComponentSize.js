import {useCallback, useState} from 'react';
const itemCoordinates = [];
export const useComponentSize = () => {
  const [position, setSize] = useState([]);

  const onLayout = useCallback(index => event => {
    const {x, y, width, height} = event.nativeEvent.layout;
    itemCoordinates[index] = {x, y, width, height};
    const outputArray = itemCoordinates.reduce((accumulator, currentValue) => {
      if (accumulator.length === 0) {
        accumulator.push(currentValue.height);
      } else {
        const lastSum = accumulator[accumulator.length - 1];
        const newSum = lastSum + currentValue.height;
        accumulator.push(Math.floor(newSum));
      }
      return accumulator;
    }, []);
    outputArray.unshift(0);
    setSize(outputArray);
  });

  return [position, onLayout];
};
