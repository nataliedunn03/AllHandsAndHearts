import React from 'react';
import { connect } from 'react-redux';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigator from '../navigation/RootNavigation';
import Colors from '../constants/Colors';
import {
  initializeAppState,
  resetToMainScreen,
  resetToLoginScreen
} from '../redux/actions/auth';
class AppContainer extends React.Component {
  state = {
    isLoadingComplete: false
  };
  componentDidMount() {
    this.props.initializeAppState();
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          {Platform.OS === 'android' && (
            <View style={styles.statusBarUnderlay} />
          )}
          <RootNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('../assets/images/robot-dev.png'),
        require('../assets/images/robot-prod.png'),
        require('../assets/images/logo.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include Rubik Regular because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'rubik-regular': require('../assets/fonts/Rubik-Regular.ttf')
      })
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.defaultColor.PAGE_BACKGROUND
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});

const mapStateToProps = ({ auth }) => {
  return {
    auth
  };
};
const mapDispatchToProps = dispatch => {
  return {
    resetToMainScreen: () => {
      dispatch(resetToMainScreen());
    },
    resetToLoginScreen: () => {
      dispatch(resetToLoginScreen());
    },
    initializeAppState: () => {
      dispatch(initializeAppState());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
