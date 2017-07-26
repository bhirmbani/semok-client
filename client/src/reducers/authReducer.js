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

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.LOGIN_RESULT:
      return loginResult(state, payload);
    default:
      return state;
  }
};

export default authReducer;
