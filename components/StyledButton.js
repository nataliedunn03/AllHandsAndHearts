import React, { Component } from 'react';
import propTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Text
} from 'react-native';
import { View } from 'react-native-animatable';
import Colors from '../constants/Colors';
export default class StyledButton extends Component {
  static defaultProps = {
    enabled: true,
    isLoading: false,
    text: 'Button',
    onPress: () => null,
    underlayColor: Colors.Buttons.BACKGROUND.SECONDARY_COLOR
  };
  render() {
    let {
      style,
      text,
      onPress,
      enabled,
      isLoading,
      textStyle,
      underlayColor,
      ...rest
    } = this.props;
    return (
      <View {...rest}>
        <TouchableOpacity
          onPress={onPress}
          style={[styles.button, style]}
          underlayColor={underlayColor}
        >
          {isLoading &&
            enabled && (
              <ActivityIndicator
                animating={isLoading}
                size="small"
                color="white"
              />
            )}
          {!isLoading && (
            <Text style={[styles.textStyle, textStyle]}>{text}</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}
StyledButton.propTypes = {
  enabled: propTypes.bool,
  isLoading: propTypes.bool,
  text: propTypes.string,
  textStyle: Text.propTypes.style,
  style: View.propTypes.style,
  underlayColor: propTypes.string,
  onPress: propTypes.func
};
const styles = StyleSheet.create({
  button: {
    borderColor: Colors.Input.BORDER.COLOR,
    borderRadius: Colors.Input.BORDER.RADIUS,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'stretch'
  },
  textStyle: {
    textAlign: 'center',
    color: Colors.Typography.TEXT.PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: 'bold'
  }
});
