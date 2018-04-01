/**
 * Just a React Native Modal Component that uses gesture:
 * 1. To expand on scroll up
 * 2. To close on scroll down
 * Note: Initially it will fill half of the screen
 * Further scrolling will make the modal take full screen
 */
import React, { PureComponent } from 'react';
import {
  Animated,
  Dimensions,
  Keyboard,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  View,
  Easing,
  TouchableOpacity,
  Modal
} from 'react-native';
import PropTypes from 'prop-types';
import { Feather as Icon } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIDDLE_OF_THE_SCREEN = SCREEN_HEIGHT * 0.5;
const MIDDLE_OF_THE_SCREEN_OFFSET = MIDDLE_OF_THE_SCREEN - 120;
const TOP_OF_THE_SCREEN_POINT = { x: 0, y: 0 };
const MODAL_SHOWN_HALF = 'HALF';
const MODAL_SHOWN_FULL = 'FULL';

export default class SlidingModal extends PureComponent {
  static defaultProps = {
    show: false,
    closeCallback: () => {}
  };
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node,
    closeCallback: PropTypes.func
  };
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

  componentDidMount() {
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
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
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
          gestureState.moveY - 30 > MIDDLE_OF_THE_SCREEN_OFFSET
        ) {
          this.slideModalDown();
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
    Animated.timing(this.modalAnimation.y, {
      toValue: MIDDLE_OF_THE_SCREEN_OFFSET,
      duration: 300,
      easing: Easing.in(Easing.sin)
    }).start(() => {
      this.setState({
        modalState: MODAL_SHOWN_HALF
      });
    });
    this.modalAnimation.flattenOffset();
  };

  openModalToFullHeight = () => {
    //else open the modal to full
    this.modalAnimation.setOffset(TOP_OF_THE_SCREEN_POINT);
    Animated.timing(this.modalAnimation.y, {
      toValue: TOP_OF_THE_SCREEN_POINT.y,
      duration: 750,
      easing: Easing.out(Easing.poly(4))
    }).start(() => {
      this.modalAnimation.flattenOffset();
      this.setState({
        modalState: MODAL_SHOWN_FULL
      });
    });
  };

  slideModalDown = () => {
    Animated.timing(this.modalAnimation.y, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      easing: Easing.out(Easing.quad)
    }).start(() => {
      this.handleClose();
      this.modalAnimation.y.setOffset(SCREEN_HEIGHT);
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
      inputRange: [MIDDLE_OF_THE_SCREEN_OFFSET / 2, SCREEN_HEIGHT],
      outputRange: [0.8, 0],
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

    const contentTransformedStyles = {
      opacity: modalContentOpacity,
      transform: [
        {
          translateY: contentTranslateOnY
        }
      ]
    };
    return (
      <Modal
        visible={this.state.show}
        ref={modal => {
          this.modal = modal;
        }}
        transparent={true}
        onRequestClose={this.slideModalDown}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View style={styles.container}>
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: '#000000ff',
                opacity: backdropOpacity
              }}
            >
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={this.slideModalDown}
              />
            </Animated.View>
            <Animated.View
              style={[styles.headerStyle, contentTransformedStyles]}
              {...this.modalPanResponder.panHandlers}
            >
              <View pointerEvents="box-none">
                <Icon name="minus" color="#d0c9d499" size={32} />
              </View>
            </Animated.View>
            <Animated.View
              style={[styles.contentContainer, contentTransformedStyles]}
            >
              {this.props.children}
            </Animated.View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffffff'
  },
  headerStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: 20,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
});
