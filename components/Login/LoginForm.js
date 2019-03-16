import React from 'react';
import propTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View, Text } from 'react-native-animatable';
import StyledInput from '../../components/StyledInput';
import { StyledButton2 } from '../StyledButton';
import Colors from '../../constants/Colors';
import { delayExec } from '../../utils/utils';
export default class LoginForm extends React.PureComponent {
  state = {
    email: '',
    password: ''
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.auth.loginError && this.styledButton2) {
      this.props.alertWithType(
        'error',
        'Log in',
        `${nextProps.auth.loginError} Check Email and Password`
      );
      this.styledButton2.error();
      delayExec(2000, this.styledButton2.reset);
    }
  }

  _handleOnChangeText = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  handleLogin = async () => {
    this.styledButton2.load();
    let { email, password } = this.state;
    email = email.trim();
    password = password.trim();
    if (email.length > 0 && password.length > 0) {
      await this.props.login({
        email,
        password
      });
      this.props.auth.loggedIn &&
        this.styledButton2 &&
        this.styledButton2.success();
    } else {
      this.styledButton2 && this.styledButton2.error();
      this.props.alertWithType(
        'error',
        'Log in',
        'Both Email and Password are required'
      );
      delayExec(2000, this.styledButton2.reset);
    }
  };

  goToForgotPassword = () => {
    this.props.navigation.navigate('ForgotPassword');
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
        <StyledButton2
          buttonRef={ref => (this.styledButton2 = ref)}
          label="Log in"
          onPress={this.handleLogin}
          onSecondaryPress={() => this.styledButton2.reset()}
        />
        <TouchableNativeFeedback onPress={() => this.props.linkPress()}>
          <Text style={styles.link}>Don't have an account?</Text>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => this.props.linkPress()}>
          <Text style={styles.link}>Forgot Password</Text>
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
