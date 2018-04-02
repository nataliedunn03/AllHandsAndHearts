import React from 'react';
import { StyleSheet, Animated, RefreshControl } from 'react-native';
import Card from './Card';
import { utilityFunctions } from '../../utils';

/**
 * Wraps given children and returns of type Card
 */
const wrappChildrenWithCard = children => {
  return React.Children.map(children, (child, index) => {
    return (
      <Card key={index} {...child.props}>
        {child}
      </Card>
    );
  });
};

/**
 * A reusable scrollview where each element will be wrapped with Card
 */

const ScrollCard = ({ style, children, onRefreshCallback, ...others }) => {
  return (
    <Animated.ScrollView
      style={[styles.container, { ...style }]}
      refreshControl={
        <RefreshControl
          refreshing={onRefreshCallback ? true : false}
          onRefresh={() => (onRefreshCallback ? onRefreshCallback() : {})}
        />
      }
      scrollEventThrottle={16}
      {...others}
    >
      {wrappChildrenWithCard(
        utilityFunctions.synthesizeChildren(children, others)
      )}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    borderColor: '#EDEDED',
    borderRadius: 3,
    shadowOpacity: 0.8,
    shadowRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 1, height: 1 }
  }
});

export default ScrollCard;
