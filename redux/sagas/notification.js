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
  try {
    if (token) {
      yield put({ type: REGISTER_PUSH_NOTIFICATION_SUCCESS, payload: token });
    } else {
      yield put({
        type: REGISTER_PUSH_NOTIFICATION_ERROR,
        error: `Failed tok get token: ${token}`
      });
      console.log('Failed to get token', token);
    }
  } catch (e) {
    console.log(e);
  }
}

function* saga() {
  yield takeEvery(REGISTER_PUSH_NOTIFICATION, registerPushNotification);
}
export default saga;
