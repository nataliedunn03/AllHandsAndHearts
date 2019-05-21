import {
  SENDING_REQUEST,
  GET_PIN_LOCATION_TYPES_RECEIVED
} from '../actions/actionTypes';

const INITIAL_STATE = {
  refreshing: false
};

export const pinLocationType = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, refreshing: action.sending };
    case GET_PIN_LOCATION_TYPES_RECEIVED: {
      return { ...state, refreshing: action.sending };
    }
    default:
      return state;
  }
};

export default pinLocationType;
