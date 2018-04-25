import React from 'react';
import { StyleSheet, View } from 'react-native';
import { utilityFunctions } from '../../utils';

/**
 * A reusable card
 */
const Card = ({ style, children, ...props }) => {
  return (
    <View style={[styles.container, { ...style }]} {...props}>
      {utilityFunctions.synthesizeChildren(children, this.props)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderRadius: 10,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: 'hsla(0, 0%, 0%, 0.2)',
    shadowOffset: { width: 1, height: 1 },
    height: 150
  }
});

export default Card;
