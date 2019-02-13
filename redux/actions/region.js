import { GET_REGION_DATA, GET_REGION_DATA_RECEIVED, SET_REGION_DATA } from './actionTypes';

export const getRegionData = () => ({
  type: GET_REGION_DATA
});

export const setRegionList = (name, coordinates_latitude, coordinates_longitude, location, start, end, type) => ({
  type: SET_REGION_DATA,
  name,
  coordinates_latitude,
  coordinates_longitude,
  start,
  end,
  type
});
