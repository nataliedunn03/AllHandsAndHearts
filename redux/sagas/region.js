import { takeEvery, call, put } from 'redux-saga/effects';
import {
  GET_REGION_DATA,
  GET_REGION_DATA_LOADING,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR,
  GET_PINS_BY_REGION,
  GET_PINS_BY_REGION_RECEIVED,
  GET_PINS_BY_REGION_ERROR,
  SET_PINS_BY_REGION
} from '../actions/actionTypes';
import {
  getRegionList,
  getPinsListByRegion,
  setPinByRegion
} from '../../services/regions';

/**
 * Region saga
 */

const getRegionDataHelper = function* getRegionDataHelper() {
  yield put({ type: GET_REGION_DATA_LOADING, loading: true });
  let response;
  try {
    response = yield call(getRegionList);
    return response;
  } catch (error) {
    yield put({ type: GET_REGION_DATA_ERROR, error: error.message });
    return false;
  } finally {
    yield put({ type: GET_REGION_DATA_LOADING, loading: false });
  }
};

const getPinsDataHelper = function* getPinsDataHelper(regionId) {
  let response;
  try {
    response = yield call(getPinsListByRegion, regionId);
    return response;
  } catch (error) {
    yield put({ type: GET_REGION_DATA_ERROR, pinError: error.message });
    return false;
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

function* getPinsByRegion(action) {
  const pinData = yield call(getPinsDataHelper, action.regionId);
  yield put({
    type: GET_PINS_BY_REGION_RECEIVED,
    pinData
  });
}

function* setPinDataByRegion(action) {
  const newPin = yield call(setPinByRegion, action.regionId, action.pinData);
  console.log('New Pin Added::');
  console.log(newPin);
  yield put({
    type: GET_PINS_BY_REGION,
    regionId: action.regionId
  });
}

function* saga() {
  yield takeEvery(GET_REGION_DATA, getRegion);
  yield takeEvery(GET_PINS_BY_REGION, getPinsByRegion);
  yield takeEvery(SET_PINS_BY_REGION, setPinDataByRegion);
}
export default saga;
