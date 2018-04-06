import { GET_PINS_BY_REGION, SET_PINS_BY_REGION } from './actionTypes';

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
