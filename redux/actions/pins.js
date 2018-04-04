import { GET_PINS_BY_REGION } from './actionTypes';

export const getPinsByRegion = regionId => ({
  type: GET_PINS_BY_REGION,
  regionId
});
