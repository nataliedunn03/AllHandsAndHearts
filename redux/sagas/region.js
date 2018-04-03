import { takeEvery, call, put } from 'redux-saga/effects';
import {
  GET_REGION_DATA,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR
} from '../actions/actionTypes';
import { getRegionList } from '../../services/regions';

/**
 * Region saga
 */

const getRegionDataHelper = function* getRegionDataHelper() {
  let response;
  try {
    response = yield call(getRegionList);
    return response;
  } catch (error) {
    yield put({ type: GET_REGION_DATA_ERROR, error: error.message });
    return false;
  } finally {
    yield put({ type: GET_REGION_DATA_RECEIVED, sending: false });
  }
};

function* getRegion() {
  // This will now return undefined if no cards are retrieved from Salesforce.
  // Or if the connection was not successful.
  // i.e it will not dispatch a received action, thus no modal will pop up.
  const regionData = yield call(getRegionDataHelper);
  yield put({
    type: GET_REGION_DATA_RECEIVED,
    regionData
  });
}

function* saga() {
  yield takeEvery(GET_REGION_DATA, getRegion);
}
export default saga;
