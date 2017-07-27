import * as actionType from '../actions/constants';

const initialState = {
  status: {
    welcome: true,
    login: false,
  },
};

const openWelcome = () => {
  const newState = {
    status: {
      welcome: true,
      login: false,
    },
  };
  return newState;
};

const closeWelcome = () => {
  const newState = {
    status: {
      welcome: false,
      login: true,
    },
  };
  return newState;
};

const loginStatusTrue = () => {
  const newState = {
    status: {
      login: true,
      welcome: true,
    },
  };
  return newState;
};

const loginStatusFalse = () => {
  const newState = {
    status: {
      login: false,
      welcome: false,
    },
  };
  return newState;
};

const msgReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.OPEN_WELCOME_SUCCESS:
      return openWelcome(state);
    case actionType.CLOSE_WELCOME_SUCCESS:
      return closeWelcome(state);
    case actionType.LOGIN_TRUE:
      return loginStatusTrue(state);
    case actionType.LOGIN_FALSE:
      return loginStatusFalse(state);
    default:
      return state;
  }
};

export default msgReducer;
