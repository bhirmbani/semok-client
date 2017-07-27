import * as actionType from '../actions/constants';

const initialState = {
  userData: '',
};

const loginResult = (state, payload) => {
  const newState = {
    userData: payload,
  };
  return newState;
};

const logoutResult = (state) => {
  const newState = {
    ...initialState,
  };
  return newState;
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.LOGIN_RESULT:
      return loginResult(state, payload);
    case actionType.LOGOUT_RESULT:
      return logoutResult(state);
    default:
      return state;
  }
};

export default authReducer;
