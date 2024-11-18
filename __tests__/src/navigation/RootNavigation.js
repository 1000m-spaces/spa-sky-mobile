import React from 'react';
import renderer from 'react-test-renderer';
import RootNavigation from 'navigation/RootNavigation';

it('create RootNavigation', () => {
  const tree = renderer.create(<RootNavigation />).toJSON();
  expect(tree).toMatchSnapshot();
});
