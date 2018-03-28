import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  PanResponder,
  Animated,
  SafeAreaView
} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Modal from 'react-native-modal';
import { Feather as Icon } from '@expo/vector-icons';

const { width, height: screenHeight } = Dimensions.get('window');
const height = width * 0.5625;

export default class StyledModal extends Component {
  state = {
    openModal: false
  };
  componentWillMount() {
    this._y = 0;
    this._animation = new Animated.Value(0);
    this._animation.addListener(({ value }) => {
      this._y = value;
    });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this._animation
        }
      ]),
      onPanResponderRelease: (e, gestureState) => {
        console.log(gestureState.dy);
        if (gestureState.dy > 170) {
          Animated.timing(this._animation, {
            toValue: 300,
            duration: 200
          }).start();
          this._animation.setOffset(300);
          this.setState({
            openModal: false
          });
        } else {
          this._animation.setOffset(0);
          Animated.timing(this._animation, {
            toValue: 0,
            duration: 200
          }).start();
        }
      }
    });
  }
  handleOpen = () => {
    this.setState({
      openModal: true
    });
    this._animation.setOffset(0);
    Animated.timing(this._animation, {
      toValue: 0,
      duration: 200
    }).start();
  };
  render() {
    const backdropOpacityInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0.7, 0],
      extrapolate: 'clamp'
    });

    const opacityInterpolate = this._animation.interpolate({
      inputRange: [0, screenHeight - height + 40],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    const translateYInterpolate = this._animation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, screenHeight],
      extrapolate: 'clamp'
    });
    const scrollStyles = {
      // opacity: opacityInterpolate,
      transform: [
        {
          translateY: translateYInterpolate
        }
      ]
    };
    return (
      <View style={styles.container}>
        <Touchable
          onPress={this.handleOpen}
          style={{
            backgroundColor: '#ffffffff',
            paddingVertical: 30,
            paddingHorizontal: 80
          }}
          background={Touchable.Ripple('blue')}
        >
          <Text>Let's come back to this!</Text>
        </Touchable>
        <Modal
          isVisible={this.state.openModal}
          transparent={true}
          backdropOpacity={backdropOpacityInterpolate}
          ref={modal => {
            this.modal = modal;
          }}
          style={{
            margin: 0,
            overflow: 'hidden'
          }}
        >
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[
                {
                  width,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  overflow: 'hidden'
                },
                scrollStyles
              ]}
              {...this._panResponder.panHandlers}
            >
              <View
                style={[
                  ...StyleSheet.absoluteFill,
                  {
                    height: 20,
                    backgroundColor: '#ffffffff',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }
                ]}
                pointerEvents="box-none"
              >
                <Icon name="minus" color="#d0c9d499" size={32} />
              </View>
            </Animated.View>
            <Animated.View
              style={[
                {
                  flex: 1
                },
                scrollStyles
              ]}
            >
              {this.props.children}
            </Animated.View>
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
