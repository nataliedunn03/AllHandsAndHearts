import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../../navigation/RootNavigation';

import { RESET_TO_MAIN, RESET_TO_SIGN_IN } from '../actions/actionTypes';

const INITIAL_STATE = AppNavigator.router.getStateForAction(
	AppNavigator.router.getActionForPathAndParams('LoginScreen')
);

export const nav = (state = INITIAL_STATE, action) => {
	let nextState;
	switch (action.type) {
	case RESET_TO_SIGN_IN: {
		const resetToSignInAction = NavigationActions.reset({
			index: 0,
			key: null,
			actions: [NavigationActions.navigate({ routeName: 'LoginScreen' })]
		});
		nextState = AppNavigator.router.getStateForAction(
			resetToSignInAction,
			state
		);
		break;
	}
	case RESET_TO_MAIN: {
		const resetToMainAction = NavigationActions.reset({
			index: 0,
			key: null,
			actions: [
				NavigationActions.navigate({ routeName: 'MainModalNavigator' })
			]
		});
		nextState = AppNavigator.router.getStateForAction(
			resetToMainAction,
			state
		);
		break;
	}
	default:
		nextState = AppNavigator.router.getStateForAction(action, state);
		break;
	}

	return nextState || state;
};

export default nav;
