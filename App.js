import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { FFG_AUTH_STORAGE_KEY } from 'react-native-dotenv';
import { PersistGate } from 'redux-persist/integration/react';

import reducers from './redux/reducers';
import rootSaga from './redux/sagas';
import { navMiddleware } from './utils/navigationReduxUtil';
import AppContainer from './containers/App';
import { AlertProvider } from './containers/AlertContainer';
const sagaMiddleware = createSagaMiddleware();
let middleWares = [sagaMiddleware, navMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleWares = [...middleWares];
}
const persistConfig = {
  key: FFG_AUTH_STORAGE_KEY,
  storage: storage,
  version: 1,
  whitelist: ['auth', 'broadcast', 'region']
};

let rootReducers = persistCombineReducers(persistConfig, reducers);

const store = compose(
  applyMiddleware(...middleWares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducers);

let persistor = persistStore(store, null, () => {
  let s = store.getState();
  return s;
});

sagaMiddleware.run(rootSaga);

export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AlertProvider>
            <AppContainer />
          </AlertProvider>
        </PersistGate>
      </Provider>
    );
  }
}
