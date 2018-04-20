import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View, Text } from 'react-native-animatable';
import StyledInput from '../../components/StyledInput';
import StyledButton from '../../components/StyledButton';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
export default class LoginForm extends React.Component {
  state = {
    email: '',
    password: ''
  };
  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  handleLogin = () => {
    let { email, password } = this.state;
    email = email.trim();
    password = password.trim();
    if (email.length > 0 && password.length > 0) {
      this.props.login({
        email,
        password
      });
    } else {
      console.log('\n\n You must enter creds to login \n\n');
    }
  };
  render() {
    return (
      <View style={styles.container} {...this.props}>
        <StyledInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onSubmitEditing={() => this.passwordRef.focus()}
          onChangeText={value => this._handleOnChangeText('email', value)}
        />
        <StyledInput
          secureTextEntry
          clearTextOnFocus
          returnKeyType="done"
          style={styles.input}
          placeholder="Password"
          enablesReturnKeyAutomatically
          inputRef={element => (this.passwordRef = element)}
          onChangeText={value => this._handleOnChangeText('password', value)}
          onSubmitEditing={this.handleLogin}
        />
        <StyledButton
          style={styles.loginButton}
          textStyle={styles.textStyle}
          text="Log in"
          onPress={this.handleLogin}
          isLoading={this.props.auth.loading}
        />
        <TouchableNativeFeedback onPress={() => this.props.linkPress()}>
          <Text style={styles.link}>Don't have an account?</Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
}
LoginForm.propTypes = {
  linkPress: propTypes.func.isRequired
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  loginButton: {
    height: 42,
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR
  },
  textStyle: {
    color: Colors.defaultColor.PAPER_COLOR
  },
  input: {
    height: 42,
    color: Colors.defaultColor.PRIMARY_COLOR,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    borderColor: '#BFBFC0',
    borderWidth: 0.3,
    borderRadius: Colors.Input.BORDER.RADIUS
  },
  link: {
    color: '#9999a3',
    alignSelf: 'center',
    padding: 20
  }
});
