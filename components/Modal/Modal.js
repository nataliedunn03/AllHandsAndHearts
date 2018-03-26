import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import utils from '../../utils';
import MModal from 'react-native-modal';
import { Height } from '../../constants/Layout';

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
  return (
    <MModal
      isVisible={show}
      onBackdropPress={closeCallback}
      onBackButtonPress={closeCallback}
      onSwipe={closeCallback}
      swipeDirection="down"
      animationIn="slideInUp"
      avoidKeyboard={true}
      style={[styles.container, ...style]}
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
