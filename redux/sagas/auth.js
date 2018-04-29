import { takeEvery, call, put } from 'redux-saga/effects';
import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  LOGIN_REQUEST_LOADING,
  LOGIN_REQUEST_FAILED,
  REGISTER_REQUEST,
  REGISTER_REQUEST_FAILED,
  REGISTER_REQUEST_LOADING,
  SET_AUTH,
  LOGOUT_REQUEST,
  REQUEST_ERROR,
  INITIALIZE_APP_STATE,
  RESET_TO_MAIN,
  RESET_TO_SIGN_IN
} from '../actions/actionTypes';
import * as AuthService from '../../services/auth';
import ApiWrapper from '../../services/api';
const Api = new ApiWrapper();

const authorize = function* authorize({
  email,
  password,
  name,
  isRegistering = false
}) {
  try {
    const hash = yield call(AuthService.generatePasswordHash, email, password);
    let response;
    if (isRegistering) {
      response = yield call(Api.register, email, hash, name);
    } else {
      response = yield call(Api.login, email, hash);
    }
    return response;
  } catch (error) {
    console.log(error);
    yield put({ type: REQUEST_ERROR, error: error.message });
    return false;
  }
};

const logout = function* logout() {
  yield put({ type: SENDING_REQUEST, sending: true });
  try {
    //const response = yield call(AuthService.logout);
    yield put({ type: SENDING_REQUEST, sending: false });
    //return response;
    yield AuthService.removeCookie();
    yield put({ type: RESET_TO_SIGN_IN });
  } catch (error) {
    yield put({ type: REQUEST_ERROR, error: error.message });
    return false;
  }
};

function* loginFlow(action) {
  yield put({ type: LOGIN_REQUEST_LOADING, loading: true });
  try {
    const { email, password } = action.data;
    const auth = yield call(authorize, {
      email,
      password,
      isRegistering: false
    });
    if (auth && typeof auth === 'object' && auth.Id) {
      yield put({ type: SET_AUTH, newAuthState: true, currentUserId: auth.Id });
      yield AuthService.setCookie({
        ...auth,
        isLoggedIn: true
      });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: LOGIN_REQUEST_FAILED, error: 'Login failed.' });
    }
  } catch (e) {
    console.log(e);
    yield put({ type: LOGIN_REQUEST_FAILED, error: e });
  } finally {
    yield put({ type: LOGIN_REQUEST_LOADING, loading: false });
    yield put({ type: LOGIN_REQUEST_FAILED, error: null });
  }
}

function* logoutFlow() {
  yield put({ type: SET_AUTH, newAuthState: false });
  yield call(logout);
}

function* registerFlow(action) {
  const { email, password, name } = action.data;
  yield put({ type: REGISTER_REQUEST_LOADING, loading: true });
  try {
    // We call the `authorize` task with the data, telling it that we are registering a user
    // This returns `true` if the registering was successful, `false` if not
    const registerSuccess = yield call(authorize, {
      email,
      password,
      name,
      isRegistering: true
    });
    // If we could register a user, we send the appropiate actions
    console.log(registerSuccess);
    if (
      registerSuccess &&
      typeof registerSuccess === 'object' &&
      registerSuccess.Email__c
    ) {
      yield put({
        type: SET_AUTH,
        newAuthState: true,
        currentUserId: registerSuccess.Id
      });
      yield AuthService.setCookie({
        ...registerSuccess,
        isLoggedIn: true
      });
      yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
      yield put({ type: RESET_TO_SIGN_IN });
    }
  } catch (e) {
    yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
    yield put({ type: LOGIN_REQUEST_FAILED, error: null });
    yield put({ type: RESET_TO_SIGN_IN });
  }
}

function* initializeAppState(action) {
  try {
    const ffgCookies = yield AuthService.getFFGCookies();
    if (ffgCookies) {
      yield put({
        type: SET_AUTH,
        newAuthState: ffgCookies.isLoggedIn,
        currentUserId: ffgCookies.Id
      });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: RESET_TO_SIGN_IN });
    }
  } catch (e) {
    yield put({ type: RESET_TO_SIGN_IN });
  }
}

function* saga() {
  yield takeEvery(LOGIN_REQUEST, loginFlow);
  yield takeEvery(REGISTER_REQUEST, registerFlow);
  yield takeEvery(LOGOUT_REQUEST, logoutFlow);
  yield takeEvery(INITIALIZE_APP_STATE, initializeAppState);
}
export default saga;
