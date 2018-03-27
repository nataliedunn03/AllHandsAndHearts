import {
  SET_AUTH,
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  LOGIN_REQUEST_LOADING,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILED
} from './actionTypes';

export const sendingRequest = sending => ({
  type: SENDING_REQUEST,
  sending
});
export const loginRequest = data => ({
  type: LOGIN_REQUEST,
  data
});

export const loginRequestLoading = loading => ({
  type: LOGIN_REQUEST_LOADING,
  loading
});

export const loginRequestSuccess = newAuthState => ({
  type: LOGIN_REQUEST_SUCCESS,
  newAuthState
});

export const setAuth = newAuthState => ({
  type: SET_AUTH,
  newAuthState
});

export const loginRequestFailed = error => ({
  type: LOGIN_REQUEST_FAILED,
  error
});

export const logout = () => ({
  type: LOGOUT_REQUEST
});

export const registerRequest = data => ({
  type: REGISTER_REQUEST,
  data
});
