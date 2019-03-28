import React from 'react';
import propTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View, Text } from 'react-native-animatable';
import StyledInput from '../../components/StyledInput';
import { StyledButton2 } from '../../components/StyledButton';
import Colors from '../../constants/Colors';
import { delayExec } from '../../utils/utils';
export default class SignupForm extends React.PureComponent {
  state = {
    name: '',
    email: '',
    password: '',
    password_verification: ''
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.loginError && this.styledButton2) {
      this.props.alertWithType(
        'error',
        'Sign up',
        `${nextProps.auth.loginError} Check Name, Email, and Password`
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

  handleRegister = () => {
    this.styledButton2.load();
    let { email, password, name, password_verification } = this.state;
    email = email.trim();
    password = password.trim();
    if (
      email.length > 0 &&
      password.length > 0 &&
      name.length > 0 &&
      password === password_verification
    ) {
      this.props.register({
        email,
        password,
        name
      });
      this.props.auth.loggedIn &&
        this.styledButton2 &&
        this.styledButton2.success();
    } else if (
      password !== password_verification &&
      password.length > 0 &&
      password_verification.length > 0
    ) {
      this.props.alertWithType(
        'error',
        'Password',
        'Passwords entered do not match'
      );
      this.styledButton2 && this.styledButton2.error();
      delayExec(2000, this.styledButton2.reset);
    } else {
      this.props.alertWithType(
        'error',
        'Sign up',
        'Name, Email, and Password are all required'
      );
      this.styledButton2 && this.styledButton2.error();
      delayExec(2000, this.styledButton2.reset);
    }
  };

  render() {
    return (
      <View style={styles.container} {...this.props}>
        <StyledInput
          style={styles.input}
          placeholder="Name"
          returnKeyType="next"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          onSubmitEditing={() => this.emailRef.focus()}
          onChangeText={value => this._handleOnChangeText('name', value)}
        />
        <StyledInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="next"
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          inputRef={element => (this.emailRef = element)}
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
          onSubmitEditing={this.handleRegister}
        />
        <StyledInput
          secureTextEntry
          clearTextOnFocus
          returnKeyType="done"
          style={styles.input}
          placeholder="Re-enter Password"
          enablesReturnKeyAutomatically
          inputRef={element => (this.passwordRef = element)}
          onChangeText={value =>
            this._handleOnChangeText('password_verification', value)
          }
          onSubmitEditing={this.handleRegister}
        />
        <StyledButton2
          buttonRef={ref => (this.styledButton2 = ref)}
          label="Sign up"
          onPress={this.handleRegister}
          onSecondaryPress={() => this.styledButton2.reset()}
        />
        <TouchableNativeFeedback onPress={() => this.props.linkPress()}>
          <Text style={styles.link}>Already have an account?</Text>
        </TouchableNativeFeedback>
      </View>
    );
  }
}
SignupForm.propTypes = {
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
    margin: 20
  }
});
