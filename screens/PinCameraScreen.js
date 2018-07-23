import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { Camera, Permissions, Constants } from 'expo';
import { Feather as Icon } from '@expo/vector-icons';
import { MaterialIcons as Icon2 } from '@expo/vector-icons';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { StyledText } from '../components/StyledText';
const customConfig2 = {
  duration: 300,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: 1.0
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.7
  }
};

export default class PinCameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      depth: 0,
      whiteBalance: 'auto',
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      photos: []
    };
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({
        quality: 0,
        base64: true
      });
      LayoutAnimation.configureNext(customConfig2);
      this.setState(({ photos }) => ({
        photos: [photo, ...photos]
      }));
    }
  };
  renderBottomActions = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between'
        }}
      >
        <View style={{}}>
          {this.state.photos.length > 0 && (
            <TouchableOpacity
              style={{
                alignItems: 'center'
              }}
              onPress={() => {
                this.props.navigation.state.params.savePhoto(this.state.photos);
                this.props.navigation.goBack();
              }}
            >
              <Icon name="check" color="#EDEFF2" size={28} />
            </TouchableOpacity>
          )}
        </View>
        {this.state.photos.length < 3 && (
          <View style={{ alignItems: 'center' }}>
            <TouchableNativeFeedback onPress={this.snap}>
              <Icon name="circle" color="#EDEFF2" size={60} />
            </TouchableNativeFeedback>
          </View>
        )}
        <View>
          <TouchableOpacity
            style={{
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
            <Icon name="rotate-ccw" color="#EDEFF2" size={28} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTopActions = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}
      >
        <View style={{}}>
          <TouchableOpacity
            style={{
              alignItems: 'center'
            }}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          >
            <Icon name="chevron-left" color="#EDEFF2" size={28} />
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }} />
        <View>
          <TouchableOpacity
            style={{
              alignItems: 'center'
            }}
            onPress={() => {
              this.setState({
                flash: this.state.flash === 'on' ? 'off' : 'on'
              });
            }}
          >
            {this.state.flash === 'on' && (
              <Icon name="zap" color="#EDEFF2" size={28} />
            )}
            {this.state.flash === 'off' && (
              <Icon2 name="flash-off" color="#EDEFF2" size={28} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  renderCenterView = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          alignSelf: 'center'
        }}
      >
        <View style={{ opacity: 0.7 }}>
          <StyledText style={{ fontSize: 100, color: this.getRandomColor() }}>
            {this.state.photos.length}
          </StyledText>
          {this.state.photos.length >= 3 && (
            <StyledText style={{ fontSize: 18, backgroundColor: 'red' }}>
              You can only take maximum of 3 pictures
            </StyledText>
          )}
        </View>
      </View>
    );
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
            flashMode={this.state.flash}
            autoFocus={this.state.autoFocus}
            zoom={this.state.zoom}
            ratio={this.state.ratio}
          >
            <View
              style={{
                flex: 1,
                marginTop: Constants.statusBarHeight + 20,
                marginBottom: 40,
                paddingHorizontal: 10,
                justifyContent: 'center'
              }}
            >
              {this.renderTopActions()}
              {this.state.photos.length > 0 && this.renderCenterView()}
              {this.renderBottomActions()}
            </View>
          </Camera>
        </View>
      );
    }
  }
}
