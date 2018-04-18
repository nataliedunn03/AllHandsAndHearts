import React from 'react';
import { Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import {
  NavigationActions,
  StackNavigator,
  addNavigationHelpers
} from 'react-navigation';
import MainModalNavigator from './MainModalTabNavigator';
import LoginScreen from '../containers/LoginScreenContainer';
import { addListener } from '../utils/navigationReduxUtil';
export const AppNavigator = StackNavigator(
  {
    LoginScreen: {
      screen: LoginScreen
    },
    MainModalNavigator: {
      screen: MainModalNavigator
    }
  },
  {
    initialRouteName: LoginScreen,
    headerMode: 'none',
    mode: 'screen'
  }
);
class RootNavigator extends React.Component {
  async componentWillMount() {
    if (Platform.OS !== 'android') {
      return;
    }
    BackHandler.addEventListener('hardwareBackPress', () => {
      const { dispatch, nav } = this.props;

      // This assumes that we always want to clsoe the app when you are at the first screen
      // of the top most navigator or at the first screen of the first level of nested navigators
      if (nav.index === 0) {
        if (!nav.routes[0].index) {
          return false;
        } else if (nav.routes[0].index === 0) {
          return false;
        }
      }

      dispatch(NavigationActions.back());

      return true;
    });
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

  render() {
    const { dispatch, nav } = this.props;
    const navigation = addNavigationHelpers({
      dispatch,
      state: nav,
      addListener
    });
    return <AppNavigator navigation={navigation} />;
  }
}

const mapStateToProps = state => {
  return {
    nav: state.nav
  };
};

export default connect(mapStateToProps)(RootNavigator);
