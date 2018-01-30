import { all, fork } from 'redux-saga/effects';

import authFlow from './auth';
import broadcastSaga from './broadcast';
const root = function* root() {
	yield all([yield fork(authFlow), yield fork(broadcastSaga)]);
};

export default root;
