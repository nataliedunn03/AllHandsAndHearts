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
  StyleSheet,
  View,
  Easing,
  TouchableOpacity,
  Modal,
  SafeAreaView
} from 'react-native';
import PropTypes from 'prop-types';
import { Feather as Icon } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MIDDLE_OF_THE_SCREEN = 0;
const TOP_OF_THE_SCREEN_POINT = { x: 0, y: 0 };
const MODAL_SHOWN_HALF = 'HALF';
const MODAL_SHOWN_FULL = 'FULL';

const SlidingHeader = ({ children, ...props }) => {
  return (
    <Animated.View {...props}>
      {!children && (
        <View style={{ alignSelf: 'center' }}>
          <Icon
            name="minus"
            color="#5d0e8b8f"
            size={32}
            style={{
              top: -3
            }}
          />
        </View>
      )}
      {children}
    </Animated.View>
  );
};

export default class SlidingModal extends PureComponent {
  static defaultProps = {
    show: false,
    closeCallback: () => {},
    top: null //top behaves like css top property
  };
  static propTypes = {
    show: PropTypes.bool.isRequired,
    children: PropTypes.node,
    closeCallback: PropTypes.func, //callback fires when clicking on backdrop, sliding down modal at `top` prop
    fullScreenCallback: PropTypes.func, //callback fires when modal is full screen
    halfScreenCallback: PropTypes.func, //callback fires when modal if half
    top: PropTypes.number, //if initially want to open the modal at a specific height
    showDefaultHeader: PropTypes.bool
  };
  static Header = SlidingHeader;
  constructor(props) {
    super(props);
    //initially we want to open the modal half way
    this.MIDDLE_OF_THE_SCREEN_OFFSET = this.props.top
      ? this.props.top
      : MIDDLE_OF_THE_SCREEN - 120;

    this.backdropOpacity = this.props.backdropOpacity
      ? this.props.backdropOpacity
      : 0.6;

    this.modalAnimation = new Animated.ValueXY({
      x: 0,
      y: SCREEN_HEIGHT
    });
    this.state = {
      show: false,
      modalState: MODAL_SHOWN_HALF
    };
    this.setupPanHandler();
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
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.show && !prevProps.show) {
      this.handleOpen();
    } else if (prevProps.show && !this.props.show) {
      this.slideModalDown();
    }
  }
  componentWillUnmount() {
    this.modalAnimation.y.removeAllListeners();
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  setupPanHandler = () => {
    this.modalPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        Math.abs(gestureState.dx) > 5,
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
        // close on drag when it goes below screen offset
        if (
          gestureState.vy >= 0.5 ||
          gestureState.moveY - 30 > this.MIDDLE_OF_THE_SCREEN_OFFSET
        ) {
          this.slideModalDown();
        } else {
          this.openModalToFullHeight();
        }
      }
    });
  };

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
      toValue: this.MIDDLE_OF_THE_SCREEN_OFFSET,
      duration: 300,
      easing: Easing.in(Easing.sin)
    }).start(() => {
      this.setState({
        modalState: MODAL_SHOWN_HALF
      });
    });
    this.modalAnimation.flattenOffset();
    if (this.props.halfScreenCallback) {
      this.props.halfScreenCallback();
    }
  };

  openModalToFullHeight = () => {
    //else open the modal to full
    this.modalAnimation.setOffset(TOP_OF_THE_SCREEN_POINT);
    Animated.spring(this.modalAnimation.y, {
      toValue: TOP_OF_THE_SCREEN_POINT.y,
      bounciness: 1
    }).start(() => {
      this.modalAnimation.flattenOffset();
      this.setState({
        modalState: MODAL_SHOWN_FULL
      });
    });
    if (this.props.fullScreenCallback) {
      this.props.fullScreenCallback();
    }
  };

  slideModalDown = () => {
    Animated.timing(this.modalAnimation.y, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      easing: Easing.out(Easing.quad)
    }).start(() => {
      this.modalAnimation.setValue({ x: 0, y: SCREEN_HEIGHT });
      this.modalAnimation.setOffset({ x: 0, y: SCREEN_HEIGHT });
      this.handleClose();
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
      inputRange: [this.MIDDLE_OF_THE_SCREEN_OFFSET / 2, SCREEN_HEIGHT],
      outputRange: [this.backdropOpacity, 0],
      extrapolate: 'clamp'
    });

    //we want to gradually increase the opacity of the view when we scroll it up
    // and decrease when we scroll it down
    const modalContentOpacity = this.modalAnimation.y.interpolate({
      inputRange: [this.MIDDLE_OF_THE_SCREEN_OFFSET, SCREEN_HEIGHT],
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

    let children = React.Children.toArray(this.props.children);
    let headerChildren = children.filter(child => child.type === SlidingHeader);
    let restChildren = children.filter(child => child.type !== SlidingHeader);

    return (
      <Modal
        visible={this.state.show}
        ref={modal => {
          this.modalRef = modal;
        }}
        transparent={true}
        onRequestClose={this.slideModalDown}
      >
        <SafeAreaView style={styles.container}>
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
            {this.props.showDefaultHeader && SlidingHeader({})}
            {headerChildren}
          </Animated.View>
          <Animated.View
            style={[
              styles.contentContainer,
              contentTransformedStyles,
              { ...this.props.style }
            ]}
          >
            {restChildren}
          </Animated.View>
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
    backgroundColor: '#FFFFFF'
  },
  headerStyle: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 0,
    backgroundColor: '#FFFFFF'
  }
});
