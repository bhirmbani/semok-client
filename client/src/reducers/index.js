import { combineReducers } from 'redux';

import authReducer from './authReducer';
import msgReducer from './msgReducer';

const rootReducer = combineReducers({
  authReducer,
  msgReducer,
});

export default rootReducer;
