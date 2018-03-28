/**
 * Just a Modal that opens up on top of the view
 * Takes the entire screens (unless you set the styles)
 */
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import utils from '../../utils';
import MModal from 'react-native-modal';

const WithModal = Component => {
  const Wrapper = props => <Component {...props} />;
  Wrapper.displayName = `withModal(${Component.displayName || Component.name})`;
  return Wrapper;
};

const ModalHeader = ({ children }) => {
  return children && <Animated.View />;
};
const ModalFooter = ({ children }) => {};
const Modal = ({ show, closeCallback, style, children, ...props }) => {
  const localStyle = style ? { ...style } : {};
  return (
    <MModal
      isVisible={show}
      onBackdropPress={closeCallback}
      onBackButtonPress={closeCallback}
      onSwipe={closeCallback}
      swipeDirection="down"
      animationIn="slideInUp"
      avoidKeyboard={true}
      style={[styles.container, ...localStyle]}
      backdropOpacity={0.3}
    >
      <Animated.View>
        {utils.utils.synthesizeChildren(children, props)}
      </Animated.View>
    </MModal>
  );
};

Modal.Header = WithModal(ModalHeader);
Modal.Footer = WithModal(ModalFooter);

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end'
  }
});

export default Modal;
