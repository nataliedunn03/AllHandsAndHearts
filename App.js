import React from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';

import reducers from './redux/reducers';
import rootSaga from './redux/sagas';
import { navMiddleware } from './utils/navigationReduxUtil';
import AppContainer from './containers/App';

const sagaMiddleware = createSagaMiddleware();
let middleWares = [sagaMiddleware, navMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleWares = [...middleWares, logger];
}

const store = compose(
  applyMiddleware(...middleWares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(reducers);

sagaMiddleware.run(rootSaga);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
