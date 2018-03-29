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
  View,
  Dimensions,
  PanResponder,
  Animated,
  SafeAreaView,
  Keyboard
} from 'react-native';
import Modal from 'react-native-modal';
import { Feather as Icon } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIDDLE_OF_THE_SCREEN = SCREEN_HEIGHT * 0.5;
const MIDDLE_OF_THE_SCREEN_OFFSET = MIDDLE_OF_THE_SCREEN - 120;
const TOP_OF_THE_SCREEN_POINT = { x: 0, y: 0 };
const MODAL_SHOWN_HALF = 'HALF';
const MODAL_SHOWN_FULL = 'FULL';
export default class FancyModal extends Component {
  constructor(props) {
    super(props);
    //initially we want to open the modal half way
    this.modalAnimation = new Animated.ValueXY({
      x: 0,
      y: MIDDLE_OF_THE_SCREEN_OFFSET
    });
    this.state = {
      openModal: false,
      modalState: MODAL_SHOWN_HALF
    };
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
    this.modalPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: () => {
        this.modalAnimation.extractOffset();
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.modalAnimation.y
        }
      ]),
      onPanResponderRelease: (e, gestureState) => {
        // vy = how fast dragged in y axis (- is up + down)
        // so when we swipe down fast or drag half the screen close the modal
        if (
          gestureState.vy >= 0.5 ||
          gestureState.dy >= MIDDLE_OF_THE_SCREEN_OFFSET
        ) {
          Animated.timing(this.modalAnimation.y, {
            toValue: gestureState.dy > 0 ? SCREEN_HEIGHT : -SCREEN_HEIGHT,
            duration: 300
          }).start(this.handleClose);
        } else {
          this.openModalToFullHeight();
        }
      }
    });
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      this.handleOpen();
    }
  }
  componentWillUnmount() {
    this.modalAnimation.y.removeAllListeners();
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  /**
   * just a hack to expand modal on keyboard show and hide when keyboard is hidden
   * I'm sure there's a better way :p
   */
  keyboardWillShow = () => {
    if (this.state.modalState === MODAL_SHOWN_HALF) {
      this.openModalToFullHeight();
      this.setState({
        triggeredByKeyboard: true
      });
    }
  };
  keyboardWillHide = () => {
    if (
      this.state.modalState === MODAL_SHOWN_FULL &&
      this.state.triggeredByKeyboard
    ) {
      this.openModalHalfway();
      this.setState({
        triggeredByKeyboard: false
      });
    }
  };

  openModalHalfway = () => {
    this.modalAnimation.setOffset(TOP_OF_THE_SCREEN_POINT);
    Animated.timing(this.modalAnimation.y, {
      toValue: MIDDLE_OF_THE_SCREEN_OFFSET,
      duration: 300
    }).start();
    this.setState({
      modalState: MODAL_SHOWN_HALF
    });
  };
  openModalToFullHeight = () => {
    //else open the modal to full
    this.modalAnimation.setOffset(TOP_OF_THE_SCREEN_POINT);
    Animated.spring(this.modalAnimation.y, {
      toValue: 0,
      duration: 300,
      bounciness: 9
    }).start(() => {});
    this.setState({
      modalState: MODAL_SHOWN_FULL
    });
  };
  handleOpen = () => {
    this.setState({
      show: true
    });
    this.openModalHalfway();
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
    const backdropOpacity = this.modalAnimation.y.interpolate({
      inputRange: [MIDDLE_OF_THE_SCREEN_OFFSET, SCREEN_HEIGHT],
      outputRange: [0.7, 0],
      extrapolate: 'clamp'
    });

    //we want to gradually increase the opacity of the view when we scroll it up
    // and decrease when we scroll it down
    const modalContentOpacity = this.modalAnimation.y.interpolate({
      inputRange: [MIDDLE_OF_THE_SCREEN_OFFSET, SCREEN_HEIGHT],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    //we want to gradually increase the view when we scroll it up
    // and decrease when we scroll it down
    const contentTranslateOnY = this.modalAnimation.y.interpolate({
      inputRange: [0, SCREEN_HEIGHT],
      outputRange: [0, SCREEN_HEIGHT],
      extrapolate: 'clamp'
    });

    const scrollStyles = {
      opacity: modalContentOpacity,
      transform: [
        {
          translateY: contentTranslateOnY
        }
      ]
    };
    return (
      <View style={styles.container}>
        <Modal
          isVisible={this.state.show}
          backdropOpacity={backdropOpacity}
          ref={modal => {
            this.modal = modal;
          }}
          style={{
            margin: 0,
            overflow: 'hidden'
          }}
          onModalShow={() => {}}
          onModalHide={this.props.closeCallback}
          avoidKeyboard={true}
          useNativeDriver
        >
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <Animated.View
              style={[
                {
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  borderBottomWidth: 0,
                  overflow: 'hidden'
                },
                scrollStyles
              ]}
              {...this.modalPanResponder.panHandlers}
            >
              <View
                style={[
                  ...StyleSheet.absoluteFill,
                  {
                    height: 30,
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
