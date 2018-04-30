import {
  SET_AUTH,
  SENDING_REQUEST,
  LOGIN_REQUEST,
  REGISTER_REQUEST,
  LOGOUT_REQUEST,
  LOGIN_REQUEST_LOADING,
  LOGIN_REQUEST_SUCCESS,
  LOGIN_REQUEST_FAILED,
  INITIALIZE_APP_STATE,
  RESET_TO_MAIN,
  RESET_TO_SIGN_IN
} from './actionTypes';

//will check if the user is already logged in
//if so we'll bypass login
//if not we'll redirect to login screen
//^ see sagas for the implementation
export const initializeAppState = () => ({
  type: INITIALIZE_APP_STATE
});

export const resetToMainScreen = () => ({
  type: RESET_TO_MAIN
});

export const resetToLoginScreen = () => ({
  type: RESET_TO_SIGN_IN
});

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

export const loginRequestFailed = error => ({
  type: LOGIN_REQUEST_FAILED,
  error
});

export const setAuth = newAuthState => ({
  type: SET_AUTH,
  newAuthState,
  currentUserId
});

export const logout = () => ({
  type: LOGOUT_REQUEST
});

export const registerRequest = data => ({
  type: REGISTER_REQUEST,
  data
});
