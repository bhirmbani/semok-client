import { combineReducers } from 'redux';

import authReducer from './authReducer';
import msgReducer from './msgReducer';
import itemReducer from './itemReducer';

const rootReducer = combineReducers({
  authReducer,
  msgReducer,
  itemReducer,
});

export default rootReducer;
