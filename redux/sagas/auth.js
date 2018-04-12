import { takeEvery, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
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

const authorize = function* authorize({
  email,
  password,
  name,
  isRegistering = false
}) {
  yield call(delay, 1000, true);
  try {
    const salt = null; // TODO: genSalt(username)
    const hash = password; // TODO: hashSync(password, salt)
    let response;

    // For either log in or registering, we call the proper function in the `auth`
    // module, which is asynchronous. Because we're using generators, we can work
    // as if it's synchronous because we pause execution until the call is done
    // with `yield`!
    if (isRegistering) {
      response = yield call(AuthService.register, email, hash, name);
    } else {
      response = yield call(AuthService.login, email, hash);
    }
    return response;
  } catch (error) {
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
    if (auth) {
      /* yield put({
        type: GET_BROADCAST_CARDS_ON_LOGIN
      });
      yield put({
        type: GET_ACTIVITY_CARDS_ON_LOGIN
      });*/
      yield put({ type: SET_AUTH, newAuthState: true });
      yield AuthService.setCookie({
        isLoggedIn: true
      });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: LOGIN_REQUEST_FAILED, error: 'Login failed.' });
    }
  } catch (e) {
    yield put({ type: LOGIN_REQUEST_FAILED, error: e });
  } finally {
    yield put({ type: LOGIN_REQUEST_LOADING, loading: false });
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
    const wasSuccessful = yield call(authorize, {
      email,
      password,
      name,
      isRegistering: true
    });
    // If we could register a user, we send the appropiate actions
    if (wasSuccessful) {
      yield put({ type: SET_AUTH, newAuthState: true });
      yield AuthService.setCookie({ isLoggedIn: true });
      yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
      yield put({ type: RESET_TO_SIGN_IN });
    }
  } catch (e) {
    yield put({ type: REGISTER_REQUEST_LOADING, loading: false });
    yield put({ type: RESET_TO_SIGN_IN });
  }
}

function* initializeAppState(action) {
  try {
    const isLoggedIn = yield AuthService.isLoggedIn();
    if (isLoggedIn) {
      yield put({ type: SET_AUTH, newAuthState: isLoggedIn });
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
