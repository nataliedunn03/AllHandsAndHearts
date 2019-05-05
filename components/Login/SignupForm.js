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
    securityQuestion: ''
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.loginError && this.styledButton2) {
      this.props.alertWithType(
        'error',
        'Sign up',
        `${
          nextProps.auth.loginError
        } Check Name, Email, Password, and Security Question`
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
    let { email, password, name, securityQuestion } = this.state;
    email = email.trim();
    password = password.trim();
    if (
      email.length > 0 &&
      password.length > 0 &&
      name.length > 0 &&
      securityQuestion.length > 0
    ) {
      this.props.register({
        email,
        password,
        name,
        securityQuestion
      });
      this.props.auth.loggedIn &&
        this.styledButton2 &&
        this.styledButton2.success();
    } else {
      this.props.alertWithType(
        'error',
        'Sign up',
        'Name, Email, Password, and Security Question are all required'
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
          placeholder="First and Last Name"
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
          style={styles.input}
          clearTextOnFocus
          placeholder="Password"
          returnKeyType="next"
          enablesReturnKeyAutomatically
          inputRef={element => (this.passwordRef = element)}
          onSubmitEditing={() => this.securityQuestionRef.focus()}
          onChangeText={value => this._handleOnChangeText('password', value)}
        />
        <StyledInput
          style={styles.input}
          placeholder="In what city was your high school?"
          returnKeyType="done"
          autoCapitalize="none"
          autoCorrect={false}
          enablesReturnKeyAutomatically
          inputRef={element => (this.securityQuestionRef = element)}
          onSubmitEditing={this.handleRegister}
          onChangeText={value =>
            this._handleOnChangeText('securityQuestion', value)
          }
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

//test push
