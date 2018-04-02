/**
 * Just a Modal that opens up on top of the view
 * Takes the entire screens (unless you set the styles)
 */
import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { utilityFunctions } from '../../utils';
import MModal from 'react-native-modal';

const WithSimpleModal = Component => {
  const Wrapper = props => <Component {...props} />;
  Wrapper.displayName = `withSimpleModal(${Component.displayName ||
    Component.name})`;
  return Wrapper;
};

const SimpleModalHeader = ({ children }) => {
  return children && <Animated.View />;
};
const SimpleModalFooter = ({ children }) => {};
const SimpleModal = ({ show, closeCallback, style, children, ...props }) => {
  return (
    <MModal
      isVisible={show}
      onBackdropPress={closeCallback}
      onBackButtonPress={closeCallback}
      onSwipe={closeCallback}
      swipeDirection="down"
      animationIn="slideInUp"
      avoidKeyboard={true}
      style={[styles.container, style]}
      backdropOpacity={0.3}
    >
      <Animated.View>
        {utilityFunctions.synthesizeChildren(children, props)}
      </Animated.View>
    </MModal>
  );
};

SimpleModal.Header = WithSimpleModal(SimpleModalHeader);
SimpleModal.Footer = WithSimpleModal(SimpleModalFooter);

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end'
  }
});

export default SimpleModal;
