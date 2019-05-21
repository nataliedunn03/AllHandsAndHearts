import React from 'react';
import propTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View, Text } from 'react-native-animatable';
import StyledInput from '../../components/StyledInput';
import { StyledButton2 } from '../StyledButton';
import Colors from '../../constants/Colors';
import { delayExec } from '../../utils/utils';
import { Linking, TouchableOpacity, Alert } from 'react-native';
import Dialog from 'react-native-dialog';
export default class LoginForm extends React.PureComponent {
  state = {
    email: '',
    password: '',
    dialogVisible: false,
    securityQuestion: ''
  };

  showDialog = () => {
    this.setState({ dialogVisible: true });
    this.setState({ password: '' });
  };

  handleCancel = () => {
    this.setState({ dialogVisible: false });
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
    let { email, password, securityQuestion } = this.state;
    email = email.trim();
    password = password.trim();
    securityQuestion = securityQuestion.trim();
    if (email.length > 0 && password.length > 0) {
      await this.props.login({
        email,
        password
      });
      this.props.auth.loggedIn &&
        this.styledButton2 &&
        this.styledButton2.success();
    } else if (email.length > 0 && securityQuestion.length > 0) {
      await this.props.login({
        email,
        securityQuestion
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

  resetPasswordClicked() {
    Linking.openURL(
      'mailto:disastercrowdsupport@allhandsandhearts.org?subject=Reset Password Request &body=The following user is requesting a password reset:\n\n' +
        this.state.email
    );
    Alert.alert('Someone from the AHAH team will get back with you shortly.');
  }

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
        //
        ****************************************************************************
        <TouchableNativeFeedback onPress={this.showDialog}>
          <Text style={styles.link}>Forgot Password?</Text>
        </TouchableNativeFeedback>
        <Dialog.Container visible={this.state.dialogVisible}>
          <Dialog.Title>Forgot Password</Dialog.Title>
          <StyledInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            returnKeyType="next"
            autoCapitalize="none"
            autoCorrect={false}
            enablesReturnKeyAutomatically
            onSubmitEditing={() => this.securityQuestionRef.focus()}
            onChangeText={value => this._handleOnChangeText('email', value)}
          />
          <StyledInput
            returnKeyType="done"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="What city were you born?"
            enablesReturnKeyAutomatically
            inputRef={element => (this.securityQuestionRef = element)}
            onChangeText={value =>
              this._handleOnChangeText('securityQuestion', value)
            }
            onSubmitEditing={this.handleLogin}
          />
          <TouchableNativeFeedback
            onPress={this.resetPasswordClicked.bind(this)}
          >
            <Text style={styles.link}>
              Still having issues? Please contact an administrator.
            </Text>
          </TouchableNativeFeedback>
          <Dialog.Button label="Cancel" onPress={this.handleCancel} />
          <Dialog.Button label="Submit" onPress={this.handleLogin} />
        </Dialog.Container>
        //
        ****************************************************************************
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
