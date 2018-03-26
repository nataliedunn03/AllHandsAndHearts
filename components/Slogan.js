import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'react-native-animatable';
import Colors from '../constants/Colors';
const Slogan = props => {
  return (
    <View style={styles.container} {...props}>
      <Text style={styles.first}>All Hands and Hearts</Text>
      <Text style={styles.second}>Smart Response</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  first: {
    color: Colors.defaultColor.PRIMARY_COLOR,
    fontSize: Colors.Typography.HEADING.FONT_SIZE - 4
  },
  second: {
    color: Colors.defaultColor.PRIMARY_COLOR,
    fontSize: Colors.Typography.SUB_TITLE.FONT_SIZE
  }
});

export default Slogan;
