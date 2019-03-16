import React from 'react';
import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import { HideWithKeyboard } from 'react-native-hide-with-keyboard';
import LoginForm from '../components/Login/LoginForm';
import SignupForm from '../components/Login/SignupForm';
import ForgotPassword from '../components/Login/ForgotPassword';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Slogan from '../components/Login/Slogan';

export default class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shouldSloganAnimationDelay: true,
      switchForm: 'login'
    };
    this.keyboardHeight = new Animated.Value(0);
    this.imageDimension = new Animated.Value(1);
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
  }

  keyboardWillShow = e => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: e.duration,
        toValue: e.endCoordinates.height - 60
      }),
      Animated.timing(this.imageDimension, {
        duration: e.duration,
        toValue: 0.7
      })
    ]).start();
  };

  keyboardWillHide = e => {
    Animated.parallel([
      Animated.timing(this.keyboardHeight, {
        duration: e.duration,
        toValue: 0
      }),
      Animated.timing(this.imageDimension, {
        duration: e.duration,
        toValue: 1
      })
    ]).start();
  };

  hideKeyboard = () => {
    Keyboard.dismiss();
  };

  async componentDidMount() {
    this.setState({
      shouldSloganAnimationDelay: false
    });
  }
  _handleSwitchForm = () => {
    this.setState(prevState => ({
      switchForm: prevState.switchForm === 'login' ? 'signup' : 'login'
    }));
    console.log('form 1');
  };
  _handleSwitchForm2 = () => {
    this.setState(prevState => ({
      switchForm: prevState.switchForm === 'login' ? 'signup' : 'login'
    }));
    console.log('form 2');
  };
  render() {
    if (this.props.loggedIn === true) {
      return;
    }
    return (
      <Animated.View style={[styles.container]}>
        <TouchableWithoutFeedback
          pointerEvents="box-none"
          style={{
            flex: 1,
            flexDirection: 'column'
          }}
          transparent
          onPress={this.hideKeyboard}
        >
          <Animated.View
            style={[
              styles.logoContainer,
              { paddingBottom: Layout.isIPhoneX ? 10 : this.keyboardHeight }
            ]}
            animation={'fadeInUp'}
            duration={1200}
            delay={200}
            ref={ref => (this.logoRef = ref)}
          >
            <Animated.Image
              style={{
                height: 140,
                width: 140,
                transform: [{ scale: this.imageDimension }]
              }}
              source={require('../assets/images/logo.png')}
            />
            <HideWithKeyboard>
              <Slogan
                animation={'fadeIn'}
                duration={1200}
                delay={this.state.shouldSloganAnimationDelay ? 600 : 200}
              />
            </HideWithKeyboard>
          </Animated.View>
        </TouchableWithoutFeedback>
        <Animated.View
          delay={400}
          animation={'fadeIn'}
          duration={800}
          style={[
            styles.bottomContainer,
            { paddingBottom: this.keyboardHeight }
          ]}
        >
          {this.state.switchForm === 'login' && (
            <LoginForm
              animation={'fadeInUpBig'}
              duration={350}
              linkPress={this._handleSwitchForm}
              {...this.props}
            />
          )}
          {this.state.switchForm === 'signup' && (
            <SignupForm
              animation={'fadeInUpBig'}
              duration={350}
              linkPress={this._handleSwitchForm}
              {...this.props}
            />
          )}
          {this.state.switchForm === 'forgotPassword' && (
            <ForgotPassword
              animation={'fadeInUpBig'}
              duration={350}
              linkPress={this._handleSwitchForm2}
              {...this.props}
            />
          )}
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Layout.width,
    height: Layout.height,
    backgroundColor: Colors.defaultColor.PAPER_COLOR,
    justifyContent: 'space-between'
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1
  }
});
