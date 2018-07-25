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
  SET_PINS_BY_REGION_SUCCESS,
  DELETE_PIN_BY_ID,
  GET_PINS_IMAGE_BY_ID_SUCCESS,
  GET_PINS_IMAGE_ERROR
} from '../actions/actionTypes';
import { REHYDRATE } from 'redux-persist';

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
    case REHYDRATE: {
      if (action.payload) {
        const { region } = action.payload;
        if (region) {
          return {
            ...state,
            loading: false,
            regionData: region.regionData,
            regionModalVisible: true
          };
        }
        return {
          ...state,
          loading: false,
          regionData: [],
          regionModalVisible: true
        };
      }
    }
    case GET_REGION_DATA_RECEIVED: {
      return {
        ...state,
        loading: false,
        regionData: action.regionData,
        regionModalVisible: true
      };
    }
    case GET_REGION_DATA_ERROR: {
      return {
        ...state,
        loading: false,
        regionData: state.regionData
      };
    }

    case GET_PINS_BY_REGION_RECEIVED: {
      const restRegion = state.regionData.map(item => {
        if (item.Id === action.regionId) {
          return {
            ...item,
            pinData: action.pinData
          };
        }
        return item;
      });
      return {
        ...state,
        pinData: action.pinData,
        regionData: restRegion
      };
    }
    case GET_PINS_BY_REGION_ERROR: {
      const currentRegion = state.regionData.find(
        item => item.Id === action.regionId
      );
      if (currentRegion) {
        return {
          ...state,
          pinData: currentRegion.pinData
        };
      }
      return {
        ...state,
        pinData: [],
        pinError: 'Not avilable for offline'
      };
    }
    case SET_PINS_BY_REGION_SUCCESS: {
      const restPins = state.pinData.filter(
        item => item.Id !== action.pinData.Id
      );
      const pinData = [...restPins, action.pinData];
      const regionData = state.regionData.map(item => {
        if (item.Id === action.regionId) {
          return {
            ...item,
            pinData
          };
        }
        return item;
      });

      return {
        ...state,
        pinData,
        regionData
      };
    }

    case GET_PINS_IMAGE_BY_ID_SUCCESS: {
      let pin = state.pinData.filter(item => item.Id === action.pinId)[0];
      const restPins = state.pinData.filter(item => item.Id !== action.pinId);
      if (action.photos && action.photos.length > 0) {
        pin['photos'] = [...action.photos];
      } else {
        pin['photos'] = [...pin.photos];
      }
      const pinData = [...restPins, pin];
      const regionData = state.regionData.map(item => {
        if (item.Id === pin.RegionId__c) {
          return {
            ...item,
            pinData
          };
        }
        return item;
      });
      return {
        ...state,
        pinData,
        regionData
      };
    }

    /*case SET_PINS_BY_REGION: {
      const addedPin = action.pinData;
      const currentPins = [...state.pinData, addedPin];
      console.log('Updated pin list:', currentPins);
      return {
        ...state,
        pinData: currentPins
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
