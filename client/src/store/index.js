import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '../reducers';

const middlewares = applyMiddleware(thunk, logger);

const store = createStore(rootReducer, compose(
  middlewares,
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));

export default store;
