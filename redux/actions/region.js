import { GET_REGION_DATA, GET_REGION_DATA_RECEIVED } from './actionTypes';
import { GET_USER_DATA, GET_USER_DATA_RECEIVED } from './actionTypes';
 
export const getRegionData = () => ({
  type: GET_REGION_DATA
});

export const getUserDetailData = () => ({
  type: GET_USER_DATA
});
