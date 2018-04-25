import React from 'react';
import { Text } from 'react-native';

export class StyledText extends React.PureComponent {
  render() {
    return <Text {...this.props} style={[this.props.style]} />;
  }
}
