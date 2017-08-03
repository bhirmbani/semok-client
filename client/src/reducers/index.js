import { combineReducers } from 'redux';

import authReducer from './authReducer';
import msgReducer from './msgReducer';
import itemReducer from './itemReducer';
import workerReducer from './workerReducer';
import categoryReducer from './categoryReducer';
import filterItemReducer from './filterItemReducer';

const rootReducer = combineReducers({
  authReducer,
  msgReducer,
  itemReducer,
  workerReducer,
  categoryReducer,
  filterItemReducer,
});

export default rootReducer;
