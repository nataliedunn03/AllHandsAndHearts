import { takeEvery, call, put, fork, select } from 'redux-saga/effects';
import {
  GET_REGION_DATA,
  GET_REGION_DATA_LOADING,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR,
  GET_PINS_BY_REGION,
  GET_PINS_IMAGE_BY_ID,
  GET_PINS_BY_REGION_RECEIVED,
  GET_PINS_IMAGE_BY_ID_SUCCESS,
  SET_PINS_BY_REGION,
  SET_PINS_BY_REGION_SUCCESS,
  DELETE_PIN_BY_ID,
  GET_PINS_BY_REGION_ERROR,
  GET_PINS_IMAGE_ERROR,
  GET_USER_DATA_LOADING,
  GET_USER_DATA_RECEIVED,
  GET_USER_DATA_ERROR,
  GET_USER_DATA
} from '../actions/actionTypes';

import ApiWrapper from '../../services/api';
const Api = new ApiWrapper();
const getState = state => state;
/**
 * Region saga
 */

const getRegionDataHelper = function* getRegionDataHelper() {
  yield put({ type: GET_REGION_DATA_LOADING, loading: true });
  let response;
  try {
    response = yield call(Api.getRegionList);
    return response;
  } catch (error) {
    yield put({ type: GET_REGION_DATA_ERROR, error: error.message });
    return false;
  } finally {
    yield put({ type: GET_REGION_DATA_LOADING, loading: false });
  }
};

const getUserDetailsHelper = function* getUserDetailsHelper() {
  yield put({ type: GET_USER_DATA_LOADING, loading: true });
  let response;
  try {
    response = yield call(Api.getUserDetails);
    return response;
  } catch (error) {
    yield put({ type: GET_USER_DATA_ERROR, error: error.message });
    return false;
  } finally {
    yield put({ type: GET_USER_DATA_LOADING, loading: false });
  }
};

const getPinsDataHelper = function* getPinsDataHelper(regionId) {
  try {
    return yield call(Api.getPinsListByRegion, regionId);
  } catch (error) {
    console.log(error);
    return false;
  }
};

function* getRegion() {
  // This will now return undefined if no cards are retrieved from Salesforce.
  // Or if the connection was not successful.
  // i.e it will not dispatch a received action, thus no modal will pop up.
  const regionData = yield call(getRegionDataHelper);
  if (regionData && regionData.length > 0) {
    yield put({
      type: GET_REGION_DATA_RECEIVED,
      regionData
    });
  } else {
    yield put({ type: GET_REGION_DATA_ERROR });
  }
}

function* getUser() {
  // This will now return undefined if no cards are retrieved from Salesforce.
  // Or if the connection was not successful.
  // i.e it will not dispatch a received action, thus no modal will pop up.
  const userData = yield call(getUserDetailsHelper());
  if (userData && userData.length > 0) {
    yield put({
      type: GET_USER_DATA_RECEIVED,
      userData
    });
  } else {
    yield put({ type: GET_USER_DATA_ERROR });
  }
}

function* getPinsByRegion(action) {
  const pinData = yield call(getPinsDataHelper, action.regionId);
  if (pinData && pinData[0] && pinData[0].RegionId__c) {
    yield put({
      type: GET_PINS_BY_REGION_RECEIVED,
      pinData: pinData,
      regionId: action.regionId
    });
  } else {
    yield put({
      type: GET_PINS_BY_REGION_ERROR,
      regionId: action.regionId
    });
  }
}

function* setPinDataByRegion(action) {
  const state = yield select(getState);
  const newPin = yield call(
    Api.setPinByRegion,
    action.regionId,
    action.pinData,
    state.auth.user.Id
  );

  if (newPin && newPin.Id && action.pinData.photos.length > 0) {
    for (let photo of action.pinData.photos) {
      if (photo.uri) {
        yield fork(Api.setPinPhotosById, newPin.Id, photo);
      }
    }
  }
  if (action.pinData.photos.length > 0) {
    newPin['photos'] = [...action.pinData.photos];
  }
  yield put({
    type: SET_PINS_BY_REGION_SUCCESS,
    regionId: action.regionId,
    pinData: newPin
  });
}

function* getPinImageById(action) {
  const photos = yield call(Api.getPhotos, action.pinId);
  if (photos && photos[0] && photos[0].Description) {
    yield put({
      type: GET_PINS_IMAGE_BY_ID_SUCCESS,
      pinId: action.pinId,
      photos
    });
  }
}

function* deletePinDataById(action) {
  yield call(Api.deletePinById, action.pinId);
}

function* saga() {
  yield takeEvery(GET_REGION_DATA, getRegion);
  yield takeEvery(GET_PINS_BY_REGION, getPinsByRegion);
  yield takeEvery(SET_PINS_BY_REGION, setPinDataByRegion);
  yield takeEvery(DELETE_PIN_BY_ID, deletePinDataById);
  yield takeEvery(GET_PINS_IMAGE_BY_ID, getPinImageById);
  yield takeEvery(GET_USER_DATA, getUser);
}
export default saga;
