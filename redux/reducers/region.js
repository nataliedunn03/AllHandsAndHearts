import {
  GET_REGION_DATA,
  GET_REGION_DATA_LOADING,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR
} from '../actions/actionTypes';

const INITIAL_STATE = {
  refreshing: false,
  regionModalVisible: false,
  regionData: []
};

export const region = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REGION_DATA:
      return { ...state, refreshing: action.sending };
    case GET_REGION_DATA_RECEIVED: {
      return {
        ...state,
        regionData: action.regionData,
        regionModalVisible: true
      };
    }
    default:
      return state;
  }
};

export default region;
