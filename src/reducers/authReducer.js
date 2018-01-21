import * as actionType from '../actions/constants';

const initialState = {
  userData: {
    msg: {
      context: null,
      content: null,
    },
    user: {
      name: null,
    },
  },
};

const getUserDataAfterUserTryingToLogin = (state, payload) => {
  let newState = {};
  if (payload.ok) {
    newState = {
      userData: {
        msg: {
          context: payload.msg.context,
          content: payload.msg.content,
        },
        user: {
          name: payload.user.name,
          role: payload.user.role,
        },
      },
    };
  } else {
    newState = {
      userData: {
        msg: {
          context: payload.msg.context,
          content: payload.msg.content,
        },
        user: {
          name: null,
        },
      },
    };
  }
  return newState;
};

const clearUserDataAfterUserLogout = () => {
  const newState = {
    ...initialState,
  };
  return newState;
};

const authReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_USER_DATA_AFTER_USER_TRYING_TO_LOGIN:
      return getUserDataAfterUserTryingToLogin(state, payload);
    case actionType.CLEAR_USER_DATA_AFTER_USER_LOGOUT:
      return clearUserDataAfterUserLogout(state);
    default:
      return state;
  }
};

export default authReducer;
