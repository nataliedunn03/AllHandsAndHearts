import { takeEvery, call, put } from 'redux-saga/effects';
import {
  REGISTER_PUSH_NOTIFICATION,
  REGISTER_PUSH_NOTIFICATION_SUCCESS,
  REGISTER_PUSH_NOTIFICATION_ERROR
} from '../actions/actionTypes';
import registerForPushNotification from '../../services/registerForPushNotificationsAsync';
function* registerPushNotification() {
  //returns a token that we need to save in salesforce
  //salesforce will then publish to expo server
  //expo server will push to GCM or APN
  const token = yield call(registerForPushNotification);
  if (token) {
    const data = yield token.json();
    if (data.status === 'ok') {
      yield put({ type: REGISTER_PUSH_NOTIFICATION_SUCCESS, payload: data });
    } else {
      yield put({
        type: REGISTER_PUSH_NOTIFICATION_ERROR,
        error: data.message
      });
    }
  } else {
    console.log('failed to get token', token);
  }
}

function* saga() {
  yield takeEvery(REGISTER_PUSH_NOTIFICATION, registerPushNotification);
}
export default saga;
