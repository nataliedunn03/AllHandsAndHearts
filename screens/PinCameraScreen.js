import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';

export default class PinCameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: 40,
                paddingHorizontal: 10,
                justifyContent: 'center'
              }}
            >
              <View style={{ alignItems: 'center' }}>
                <Icon name="circle" color="#EDEFF2" size={70} />
              </View>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
