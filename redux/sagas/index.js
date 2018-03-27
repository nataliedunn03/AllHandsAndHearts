import { all, fork } from 'redux-saga/effects';

import authFlow from './auth';
import broadcastSaga from './broadcast';
import activitySaga from './activity';
const root = function* root() {
  yield all([
    yield fork(authFlow),
    yield fork(broadcastSaga),
    yield fork(activitySaga)
  ]);
};

export default root;
