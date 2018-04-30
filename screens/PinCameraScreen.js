import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';

export default class PinCameraScreen extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    photos: []
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.setState(({ photos }) => ({
        photos: [photo.uri, ...photos]
      }));
      console.log(this.state.photos);
    }
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={ref => {
              this.camera = ref;
            }}
          >
            {/*<View>
            <TouchableOpacity
                style={{
                  flex: 0.2,
                  alignSelf: 'flex-end',
                  alignItems: 'center'
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                  });
                }}
              >
                <Text
                  style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
                >
                  Flip
                </Text>
              </TouchableOpacity>
            </View>*/}
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
              <View>
                <TouchableOpacity
                  style={{
                    flex: 0.2,
                    alignSelf: 'flex-end',
                    alignItems: 'center'
                  }}
                  onPress={() => {
                    this.props.navigation.state.params.savePhoto(
                      this.state.photos
                    );
                    this.props.navigation.goBack();
                  }}
                >
                  <Text
                    style={{ fontSize: 18, marginBottom: 10, color: 'white' }}
                  >
                    SAVE PHOTO
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableNativeFeedback onPress={this.snap}>
                <View style={{ alignItems: 'center' }}>
                  <Icon name="circle" color="#EDEFF2" size={70} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </Camera>
        </View>
      );
    }
  }
}
