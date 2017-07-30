import * as actionType from '../actions/constants';

const initialState = {
  userData: '',
};

const getUserDataAfterUserTryingToLogin = (state, payload) => {
  const newState = {
    userData: payload,
  };
  return newState;
};

const logoutResult = () => {
  const newState = {
    ...initialState,
  };
  return newState;
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_USER_DATA_AFTER_USER_TRYING_TO_LOGIN:
      return getUserDataAfterUserTryingToLogin(state, payload);
    case actionType.LOGOUT_RESULT:
      return logoutResult(state);
    default:
      return state;
  }
};

export default authReducer;
