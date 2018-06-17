import {
  GET_BROADCAST_CARDS_RECEIVED,
  SENDING_REQUEST,
  REMOVE_BROADCAST_CARD_SUCCESS
} from '../actions/actionTypes';
import { REHYDRATE } from 'redux-persist';

const INITIAL_STATE = {
  refreshing: false,
  broadcastCards: []
};

export const broadcast = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_REQUEST:
      return { ...state, refreshing: action.sending };
    case REMOVE_BROADCAST_CARD_SUCCESS: {
      let { broadcastCards } = state;
      broadcastCards = broadcastCards.filter(
        (card, index) => index != action.cardKey
      );
      return { ...state, broadcastCards: broadcastCards };
    }
    case 'REHYDRATE': {
      return { ...state, broadcastCards: action.broadcast.broadcastCards };
    }
    case GET_BROADCAST_CARDS_RECEIVED: {
      return { ...state, broadcastCards: action.broadcastCards };
    }
    default:
      return state;
  }
};

export default broadcast;
