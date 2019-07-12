import { all, fork } from 'redux-saga/effects';

import authFlow from './auth';
import broadcastSaga from './broadcast';
import activitySaga from './activity';
import regionSaga from './region';
import notification from './notification';
import pinLocationType from './pinLocationType';

const root = function* root() {
  yield all([
    yield fork(authFlow),
    yield fork(broadcastSaga),
    yield fork(pinLocationType),
    yield fork(activitySaga),
    yield fork(regionSaga),
    yield fork(notification)
  ]);
};

export default root;
