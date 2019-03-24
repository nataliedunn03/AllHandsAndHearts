import React from 'react';
import propTypes from 'prop-types';
import {
  StyleSheet,
  Button,
  TouchableHighlight,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import TouchableNativeFeedback from '@expo/react-native-touchable-native-feedback-safe';
import { View, Text } from 'react-native-animatable';
import StyledInput from '../../components/StyledInput';
import { StyledButton2 } from '../StyledButton';
import Colors from '../../constants/Colors';
import { delayExec } from '../../utils/utils';
import Modal from 'react-native-modal';
export default class LoginForm extends React.PureComponent {
  state = {
    modalVisible: false,
    email: '',
    submitText: 'Send',
    placeHolderText: 'Email Address',
    backgroundColor: 'white',
    close: 'Close',
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  btnSubmitPress() {
    var val = Math.floor(1000 + Math.random() * 9000);
    alert('Your password has been reset to ' + val + '.');
  }
  closeModal() {
    this.setState({ modalVisible: false });
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
  handleEmail = text => {
    this.setState({ email: text });
  };

  _renderModalContent = () => (
    <View style={styles.containerModal}>
      <StyledInput
        secureTextEntry
        clearTextOnFocus
        returnKeyType="done"
        style={styles.input}
        placeholder="Email"
        enablesReturnKeyAutomatically
        inputRef={element => (this.passwordRef = element)}
        onChangeText={value => this._handleOnChangeText('email', value)}
        onSubmitEditing={this.handleEmail}
      />
      <StyledButton2
        label="Reset Password"
        onPress={() => this.btnSubmitPress()}
      />
      <StyledButton2
        buttonRef={ref => (this.styledButton2 = ref)}
        label="Close"
        onPress={() => this.setState({ modalVisible: false })}
      />
    </View>
  );

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
        <View>
          <Modal isVisible={this.state.modalVisible} style={styles.bottomModal}>
            {this._renderModalContent()}
          </Modal>
        </View>
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.link}>Forgot Password</Text>
        </TouchableHighlight>
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
  halfHeight: {
    height: 50,
    width: 50
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  innerContainer: {
    flex: 0,
    alignItems: 'center'
  },
  inputText: {
    paddingVertical: 5,
    color: 'black',
    marginLeft: 10,
    fontSize: 14,
    textAlign: 'left'
  },
  inputView: {
    backgroundColor: 'white',
    borderRadius: 5,
    justifyContent: 'flex-start',
    borderWidth: 1,
    marginHorizontal: 10,
    marginVertical: 10,
    borderColor: '#3c3c3c',
    overflow: 'hidden'
  },
  btnCancel: {
    backgroundColor: '#6A6A6A',
    justifyContent: 'center',
    borderRadius: 15,
    marginTop: 10,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: 20
  },
  buttonRow: {
    flexDirection: 'row'
  },

  textCancel: {
    color: 'white',
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 10
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)'
  },
  bottomModal: {
    justifyContent: 'flex-end',
    marginBottom: 150,
    margin: 0
  },
  containerModal: {
    paddingTop: 23,
    marginBottom: 100,
    backgroundColor: 'white'
  },

  submitButton: {
    backgroundColor: Colors.defaultColor.PRIMARY_COLOR,
    padding: 10,
    margin: 15,
    height: 40
  },
  submitButtonText: {
    color: 'white'
  },
  link: {
    color: '#9999a3',
    alignSelf: 'center',
    padding: 20
  }
});
