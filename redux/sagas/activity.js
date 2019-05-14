import { takeEvery, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  GET_ACTIVITY_CARDS,
  SENDING_REQUEST,
  GET_ACTIVITY_CARDS_RECEIVED,
  GET_ACTIVITY_CARDS_ON_LOGIN,
  REQUEST_ERROR,
  SET_ACTIVITY_CARD_VOTE,
  SET_ACTIVITY_CARD_VOTE_SUCCESS,
  GET_VOTED_ACTIVITIES_ON_LOGIN,
  GET_VOTED_ACTIVITIES_RECEIVED
} from '../actions/actionTypes';
import { getActivities, setVote, getVotedPins } from '../../services/activity';

const getState = state => state;

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

function* setActivityVote(action) {
  const state = yield select(getState);
  const newVotedPins = yield call(
    setVote,
    action.pinId,
    action.vote,
    state.auth.user.Id
  );

  if (newVotedPins) {
    yield put({
      type: SET_ACTIVITY_CARD_VOTE_SUCCESS,
      votedPins: newVotedPins
    });
  }
}

function* getVotedActivities() {
  const state = yield select(getState);
  const votedPins = yield call(getVotedPins, state.auth.user.Id);

  if (votedPins) {
    yield put({
      type: GET_VOTED_ACTIVITIES_RECEIVED,
      votedPins: votedPins
    });
  }
}

function* saga() {
  yield takeEvery(GET_ACTIVITY_CARDS_ON_LOGIN, getActivityCards);
  yield takeEvery(GET_ACTIVITY_CARDS, getActivityCards);
  yield takeEvery(SET_ACTIVITY_CARD_VOTE, setActivityVote);
  yield takeEvery(GET_VOTED_ACTIVITIES_ON_LOGIN, getVotedActivities);
}
export default saga;
