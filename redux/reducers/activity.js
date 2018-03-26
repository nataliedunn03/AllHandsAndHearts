import {
  SENDING_REQUEST,
  GET_ACTIVITY_CARDS_RECEIVED
} from '../actions/actionTypes';

const INITIAL_STATE = {
  refreshing: false,
  activityCards: []
};

export const activity = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, refreshing: action.sending };
    case GET_ACTIVITY_CARDS_RECEIVED: {
      return { ...state, activityCards: action.activityCards };
    }
    default:
      return state;
  }
};

export default activity;
