import { combineReducers } from 'redux';

import { auth } from './auth';
import { nav } from './nav';
import { broadcast } from './broadcast';

export default combineReducers({
	auth,
	nav,
	broadcast
});
