import {
  GET_REGION_DATA,
  GET_REGION_DATA_LOADING,
  GET_REGION_DATA_RECEIVED,
  GET_REGION_DATA_ERROR,
  GET_PINS_BY_REGION,
  GET_PINS_BY_REGION_RECEIVED,
  GET_PINS_BY_REGION_LOADING,
  GET_PINS_BY_REGION_ERROR,
  SET_PINS_BY_REGION,
  DELETE_PIN_BY_ID,
  SET_PINS_BY_REGION_SUCCESS
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
    case SET_PINS_BY_REGION_SUCCESS: {
      const newPins = state.pinData.filter(
        item => item.Id !== action.pinData.Id
      );
      return {
        ...state,
        pinData: [...newPins, action.pinData]
      };
    }
    /*case SET_PINS_BY_REGION: {
      const addedPin = action.pinData;
      const currentPins = [...state.pinData, addedPin];
      console.log('Updated pin list:', currentPins);
      return {
        ...state,
        pinData: currentPins
      };
    }*/
    case DELETE_PIN_BY_ID: {
      let regionMarkerList = state.pinData.filter(
        marker => marker.Id !== action.pinId
      );
      return {
        ...state,
        pinData: regionMarkerList
      };
    }
    default:
      return state;
  }
};

export default region;
