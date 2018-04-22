import React, { PureComponent } from 'react';
import propTypes from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
export default class StyledInput extends PureComponent {
  static defaultProps = {
    keyboardType: 'default',
    placeholder: 'Type here',
    placeholderTextColor: '#666665',
    returnKeyType: 'done',
    inputRef: null
  };
  render() {
    let {
      style,
      keyboardType,
      placeholder,
      returnKeyType,
      placeholderTextColor,
      inputRef,
      ...rest
    } = this.props;
    return (
      <TextInput
        ref={inputRef}
        style={[styles.input, style]}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        returnKeyType={returnKeyType}
        selectionColor={Colors.defaultColor.PRIMARY_COLOR}
        underlineColorAndroid="transparent"
        {...rest}
      />
    );
  }
}
StyledInput.propTypes = {
  keyboardType: propTypes.string,
  placeholder: propTypes.string,
  placeholderTextColor: propTypes.string,
  returnKeyType: propTypes.string,
  onSubmitEditing: propTypes.func
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: Colors.Input.BACKGROUND.COLOR,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingHorizontal: 10
  }
});
