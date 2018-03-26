import { takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  GET_ACTIVITY_CARDS,
  SENDING_REQUEST,
  GET_ACTIVITY_CARDS_RECEIVED,
  GET_ACTIVITY_CARDS_ON_LOGIN,
  REQUEST_ERROR
} from '../actions/actionTypes';
import { getActivities } from '../../services/activity';

/**
 * Activity saga
 */

const getActivitiesHelper = function* getActivitiesHelper() {
  yield put({ type: SENDING_REQUEST, sending: true });
  try {
    const activities = yield call(getActivities, '');
    //yield call(delay, 1000, true); // simulate network events
    yield put({ type: SENDING_REQUEST, sending: false });
    return activities;
  } catch (error) {
    yield put({ type: REQUEST_ERROR, error: error.message });
    return false;
  }
};

function* getActivityCards() {
  const activities = yield call(getActivitiesHelper);
  if (activities) {
    yield put({
      type: GET_ACTIVITY_CARDS_RECEIVED,
      activityCards: activities
    });
  }
}

function* saga() {
  yield takeEvery(GET_ACTIVITY_CARDS_ON_LOGIN, getActivityCards);
  yield takeEvery(GET_ACTIVITY_CARDS, getActivityCards);
}
export default saga;
