import { combineReducers } from 'redux';

import { auth } from './auth';
import { nav } from './nav';
import { broadcast } from './broadcast';
import { activity } from './activity';
export default combineReducers({
	auth,
	nav,
	broadcast,
	activity
});
