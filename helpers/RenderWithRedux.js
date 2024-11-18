import React from 'react';
import renderer from 'react-test-renderer';
import {store} from 'store/index';
import {Provider} from 'react-redux';

export const renderWithRedux = renderedComponent => {
  return renderer.create(
    <Provider store={store}>{renderedComponent}</Provider>,
  );
};
