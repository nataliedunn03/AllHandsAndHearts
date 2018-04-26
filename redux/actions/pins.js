import {
  GET_PINS_BY_REGION,
  SET_PINS_BY_REGION,
  DELETE_PIN_BY_ID
} from './actionTypes';

export const getPinsByRegion = regionId => ({
  type: GET_PINS_BY_REGION,
  regionId
});

export const setPinByRegion = (regionId, pinData) => ({
  type: SET_PINS_BY_REGION,
  isUpdate: !!pinData.id,
  regionId,
  pinData
});

export const deletePinById = (pinId, regionMarkerList) => ({
  type: DELETE_PIN_BY_ID,
  pinId,
  regionMarkerList
});
