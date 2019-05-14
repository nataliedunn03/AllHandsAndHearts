import {
  SENDING_REQUEST,
  GET_ACTIVITY_CARDS_RECEIVED,
  SET_ACTIVITY_CARD_VOTE_SUCCESS,
  GET_VOTED_ACTIVITIES_RECEIVED
} from '../actions/actionTypes';

const INITIAL_STATE = {
  refreshing: false,
  activityCards: [],
  votedPins: ''
};

export const activity = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, refreshing: action.sending };
    case GET_ACTIVITY_CARDS_RECEIVED: {
      return { ...state, activityCards: action.activityCards };
    }
    case SET_ACTIVITY_CARD_VOTE_SUCCESS: {
      return { ...state, votedPins: action.votedPins };
    }
    case GET_VOTED_ACTIVITIES_RECEIVED: {
      return { ...state, votedPins: action.votedPins };
    }
    default:
      return state;
  }
};

export default activity;
