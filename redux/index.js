import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import reducers from './reducers';
import rootSaga from './sagas';
import { navMiddleware } from '../utils/navigationReduxUtil';
import persistConfig from './persistConfig';
export default () => {
  const sagaMiddleware = createSagaMiddleware();
  let middleWares = [sagaMiddleware, navMiddleware];
  if (process.env.NODE_ENV !== 'production') {
    middleWares = [...middleWares];
  }

  let rootReducers = persistCombineReducers(persistConfig(), reducers);
  const appReducer = (state, action) => {
    if (action.type === 'LOGOUT_REQUEST_SUCCESS') {
      state = undefined;
    }
    return rootReducers(state, action);
  };

  const store = compose(
    applyMiddleware(...middleWares),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore)(appReducer);

  let persistor = persistStore(store, null, () => {
    let s = store.getState();
    return s;
  });

  sagaMiddleware.run(rootSaga);

  return { store, persistor };
};
