import { takeEvery, call, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import {
  SENDING_REQUEST,
  LOGIN_REQUEST,
  LOGIN_REQUEST_LOADING,
  LOGIN_REQUEST_FAILED,
  REGISTER_REQUEST,
  SET_AUTH,
  LOGOUT_REQUEST,
  REQUEST_ERROR,
  RESET_TO_MAIN,
  GET_BROADCAST_CARDS_ON_LOGIN,
  GET_ACTIVITY_CARDS_ON_LOGIN
} from "../actions/actionTypes";
import * as AuthService from "../../services/auth";
import { getBroadcastCards } from "../../services/broadcast";

const authorize = function* authorize({
  username,
  password,
  isRegistering = false
}) {
  yield put({ type: LOGIN_REQUEST_LOADING, loading: true });
  yield call(delay, 1000, true);
  try {
    const salt = null; // TODO: genSalt(username)
    const hash = ""; // TODO: hashSync(password, salt)
    let response;

    // For either log in or registering, we call the proper function in the `auth`
    // module, which is asynchronous. Because we're using generators, we can work
    // as if it's synchronous because we pause execution until the call is done
    // with `yield`!
    if (isRegistering) {
      response = yield call(AuthService.register, username, hash);
    } else {
      response = yield AuthService.getAuthToken;
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
    const response = yield call(AuthService.logout);
    yield put({ type: SENDING_REQUEST, sending: false });
    return response;
  } catch (error) {
    yield put({ type: REQUEST_ERROR, error: error.message });
    return false;
  }
};

function* loginFlow(action) {
  yield put({ type: LOGIN_REQUEST_LOADING, loading: true });
  try {
    const { username, password } = action.data;
    const auth = yield call(authorize, {
      username,
      password,
      isRegistering: false
    });
    console.log(auth);
    if (auth) {
      yield put({
        type: GET_BROADCAST_CARDS_ON_LOGIN
      });
      yield put({
        type: GET_ACTIVITY_CARDS_ON_LOGIN
      });
      yield put({ type: SET_AUTH, newAuthState: true });
      yield put({ type: RESET_TO_MAIN });
    } else {
      yield put({ type: LOGIN_REQUEST_FAILED, error: "Login failed." });
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
  const { username, password } = action.data;

  // We call the `authorize` task with the data, telling it that we are registering a user
  // This returns `true` if the registering was successful, `false` if not
  const wasSuccessful = yield call(authorize, {
    username,
    password,
    isRegistering: true
  });

  // If we could register a user, we send the appropiate actions
  if (wasSuccessful) {
    yield put({ type: SET_AUTH, newAuthState: true });

    // TODO: clear the login form
    // yield put({ type: CHANGE_FORM, newFormState: { username: '', password: '' } });

    // User react-navigation to redirect back to the appropriate place
  }
}

function* saga() {
  yield takeEvery(LOGIN_REQUEST, loginFlow);
  yield takeEvery(REGISTER_REQUEST, registerFlow);
  yield takeEvery(LOGOUT_REQUEST, logoutFlow);
}
export default saga;
