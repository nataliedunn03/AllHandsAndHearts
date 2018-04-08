import React from 'react';
import { StyleSheet, KeyboardAvoidingView } from 'react-native';
import { View, Image } from 'react-native-animatable';
import { HideWithKeyboard } from 'react-native-hide-with-keyboard';
import LoginForm from '../components/Login/LoginForm';
import SignupForm from '../components/Login/SignupForm';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Slogan from '../components/Login/Slogan';
//import * as AuthService from '../services/auth';
export default class Login extends React.Component {
  state = {
    shouldSloganAnimationDelay: true,
    switchForm: 'login'
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
  };
  render() {
    if (this.props.loggedIn === true) {
      return;
    }
    return (
      <View style={styles.container}>
        <View
          style={styles.logoContainer}
          animation={'fadeInUp'}
          duration={1200}
          delay={200}
          ref={ref => (this.logoRef = ref)}
        >
          <Image
            style={styles.logo}
            source={require('../assets/images/logo.png')}
          />
          <HideWithKeyboard>
            <Slogan
              animation={'fadeIn'}
              duration={1200}
              delay={this.state.shouldSloganAnimationDelay ? 1210 : 200}
            />
          </HideWithKeyboard>
        </View>

        <KeyboardAvoidingView behavior="padding" style={styles.bottomContainer}>
          <View delay={400} animation={'fadeIn'} duration={800}>
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
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    width: Layout.width,
    height: Layout.height,
    backgroundColor: Colors.defaultColor.PAPER_COLOR
  },
  bottomContainer: {
    flex: 1,
    flexGrow: 1
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain'
  },
  logoContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
