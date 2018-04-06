import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from 'react-native';
import { Location } from 'expo';
import Colors from '../../constants/Colors';
import { SlidingModal } from '../Modal';
export default class CreatePinModal extends React.PureComponent {
  state = {
    coordInfo: null,
    error: ''
  };

  render() {
    return (
      <SlidingModal
        show={this.props.show}
        closeCallback={this.props.closeCallback}
      >
        <View>
          <Text>Placeholdre text</Text>
        </View>
      </SlidingModal>
    );
  }
}
