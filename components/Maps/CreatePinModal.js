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

  _getLocationName = async () => {
    try {
      console.log(this.props.coord);
      if (this.props.coord) {
        Location.setApiKey('AIzaSyChIWVSK41LTxJuDDYJECnBsAbMkzy13Fk');
        const decodedLocation = await Location.reverseGeocodeAsync(
          this.props.coord
        );
        this.setState({
          coordInfo: decodedLocation[0].name
        });
      }
    } catch (e) {
      this.setState({
        error: e
      });
    }
  };

  render() {
    console.log(this.props);
    return (
      <SlidingModal
        show={this.props.show}
        closeCallback={this.props.closeCallback}
      >
        <View>
          <Text>Bitch lol</Text>
        </View>
      </SlidingModal>
    );
  }
}
