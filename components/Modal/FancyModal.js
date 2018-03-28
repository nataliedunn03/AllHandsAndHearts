/**
 * Modal that uses gesture:
 * 1. To expand on scroll up
 * 2. To close on scroll down
 * Note: Initially it will open half of the screen
 * Further scrolling will make the modal full
 */
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
import Modal from 'react-native-modal';
import { Feather as Icon } from '@expo/vector-icons';

const { width, height: screenHeight } = Dimensions.get('window');
const height = width * 0.5625;

export default class FancyModal extends Component {
  state = {
    openModal: false
  };
  componentWillMount() {
    //the y axis of the screen
    this.yAxis = 0;
    //initially we want to open the modal half way
    this.modalAnimation = new Animated.Value(50);
    //whenever our animationc changes set the yAxis to that value
    this.modalAnimation.addListener(({ value }) => {
      this.yAxis = value;
    });

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.modalAnimation
        }
      ]),
      onPanResponderRelease: (e, gestureState) => {
        // top of the screen starts at 0 {X, Y}
        // so when we hit 90y on drag close the modal
        if (gestureState.dy > 90) {
          this.modalAnimation.setOffset(300);
          Animated.timing(this.modalAnimation, {
            toValue: 300,
            duration: 300
          }).start(this.handleClose); //when the animation is complete close the modal
        } else {
          //else open the modal to full
          this.modalAnimation.setOffset(0);
          Animated.timing(this.modalAnimation, {
            toValue: 0,
            duration: 300
          }).start(() => {
            console.log('ON TOP OF THE PAGE');
          });
        }
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      this.handleOpen();
    }
  }

  handleOpen = () => {
    this.setState({
      show: true
    });
    this.modalAnimation.setOffset(50);
    Animated.timing(this.modalAnimation, {
      toValue: 50,
      duration: 300
    }).start();
  };
  //Close the modal
  //But also trigger the callback
  handleClose = () => {
    this.setState({
      show: false
    });
    if (this.props.closeCallback) {
      this.props.closeCallback();
    }
  };
  render() {
    //turn the back of the screen dark to focus on modal content
    const backdropOpacityInterpolate = this.modalAnimation.interpolate({
      inputRange: [0, 300],
      outputRange: [0.7, 0],
      extrapolate: 'clamp'
    });

    //we want to gradually increase the opacity of the view when we scroll it up
    // and decrease when we scroll it down
    const opacityInterpolate = this.modalAnimation.interpolate({
      inputRange: [100, 500],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    //we want to gradually increase the view when we scroll it up
    // and decrease when we scroll it down
    const translateYInterpolate = this.modalAnimation.interpolate({
      inputRange: [0, 300],
      outputRange: [0, screenHeight],
      extrapolate: 'clamp'
    });

    const scrollStyles = {
      opacity: opacityInterpolate,
      transform: [
        {
          translateY: translateYInterpolate
        }
      ]
    };
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.show}
          backdropOpacity={backdropOpacityInterpolate}
          ref={modal => {
            this.modal = modal;
          }}
          style={{
            margin: 0,
            overflow: 'hidden'
          }}
          onModalShow={() => {
            console.log('Im now shown');
          }}
          onModalHide={this.props.closeCallback}
          avoidKeyboard={true}
          useNativeDriver
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
                  flex: 1,
                  backgroundColor: '#ffffffff'
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
