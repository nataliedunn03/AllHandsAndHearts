import { takeEvery, call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import {
  GET_PIN_LOCATION_TYPES,
  GET_PIN_LOCATION_TYPES_RECEIVED,
  SENDING_REQUEST,
  REQUEST_ERROR
} from '../actions/actionTypes';
import { getPinLocationTypes } from '../../services/pinLocationType';

const getState = state => state;

/**
 * Pin location type saga
 */

const getPinLocationTypeHelper = function* getPinLocationTypeHelper() {
  yield put({ type: SENDING_REQUEST, sending: true });
  try {
    const pinTypes = yield call(getPinLocationTypes, '');
    //yield call(delay, 1000, true); // simulate network events
    yield put({ type: SENDING_REQUEST, sending: false });
    return pinTypes;
  } catch (error) {
    yield put({ type: REQUEST_ERROR, error: error.message });
    return false;
  }
};

function* getPinTypes() {
  const pinTypes = yield call(getPinLocationTypeHelper);
  if (pinTypes) {
    yield put({
      type: GET_PIN_LOCATION_TYPES_RECEIVED
    });
  }
}

function* saga() {
  yield takeEvery(GET_PIN_LOCATION_TYPES, getPinTypes);
}
export default saga;
