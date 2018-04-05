import 'react-native';
import React from 'react';
import { StyledText } from '../StyledText';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  const tree = renderer
    .create(<StyledText>Snapshot test!</StyledText>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});
