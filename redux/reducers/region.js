import {
  GET_REGION_DATA,
  GET_REGION_DATA_LOADING,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR,
  GET_PINS_BY_REGION,
  GET_PINS_BY_REGION_RECEIVED,
  GET_PINS_BY_REGION_LOADING,
  GET_PINS_BY_REGION_ERROR
} from '../actions/actionTypes';

const INITIAL_STATE = {
  loading: false,
  regionModalVisible: false,
  regionData: [],
  pinData: []
};

export const region = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REGION_DATA:
    case GET_PINS_BY_REGION:
      return { ...state, loading: true };
    case GET_REGION_DATA_RECEIVED: {
      return {
        ...state,
        loading: false,
        regionData: action.regionData,
        regionModalVisible: true
      };
    }
    case GET_PINS_BY_REGION_RECEIVED: {
      return {
        ...state,
        pinData: action.pinData
      };
    }
    case GET_PINS_BY_REGION_ERROR: {
      return {
        ...state,
        pinError: action.pinError,
        pinData: []
      };
    }
    default:
      return state;
  }
};

export default region;
