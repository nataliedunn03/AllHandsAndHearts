import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, Text } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View } from 'react-native-animatable';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import StyledButtonAnimated from 'react-native-micro-animated-button';
export const StyledButton2 = ({ label, onPress, buttonRef }) => {
  return (
    <StyledButtonAnimated
      style={styles.styledButton2}
      labelStyle={styles.textStyle}
      foregroundColor={Colors.defaultColor.PAPER_COLOR}
      label={label}
      noFill
      onPress={() => onPress()}
      ref={buttonRef}
      successBackgroundColor={Colors.defaultColor.PRIMARY_COLOR}
      successIcon="check"
      expandOnFinish
      noRadius
    />
  );
};
export default class StyledButton extends PureComponent {
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
        <TouchableNativeFeedback
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
        </TouchableNativeFeedback>
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
  },
  styledButton2: {
    height: 42,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    width: Layout.width - 40
  }
});
