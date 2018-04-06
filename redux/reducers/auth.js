import {
  SENDING_REQUEST,
  SET_AUTH,
  LOGIN_REQUEST_LOADING,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILED,
  LOGOUT_REQUEST_LOADING,
  LOGOUT_REQUEST_SUCCESS,
  LOGOUT_REQUEST_FAILED,
  REGISTER_REQUEST_LOADING,
  REGISTER_REQUEST_SUCCESS,
  REGISTER_REQUEST_FAILED
} from '../actions/actionTypes';

const INITIAL_STATE = {
  loggedIn: false
};

export const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH:
      return { ...state, loggedIn: action.newAuthState };
    case LOGIN_REQUEST_LOADING:
      return { ...state, loading: action.loading };
    case LOGIN_REQUEST_SUCCESS:
      return { ...state, loggedIn: action.newAuthState };
    case LOGIN_REQUEST_FAILED:
      return { ...state, loginError: action.error };

    case REGISTER_REQUEST_LOADING:
      return { ...state, loading: action.loading };
    case REGISTER_REQUEST_SUCCESS:
      return { ...state, loggedIn: action.newAuthState };
    case REGISTER_REQUEST_FAILED:
      return { ...state, loginError: action.error };

    default:
      return state;
  }
};

export default auth;
