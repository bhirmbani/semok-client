import * as actionType from './constants';

export const openWelcomeSuccess = () => ({
  type: actionType.OPEN_WELCOME,
});

export const openWelcome = () => (dispatch) => {
  dispatch(openWelcomeSuccess());
};

export const closeWelcomeSuccess = () => ({
  type: actionType.CLOSE_WELCOME,
});

export const closeWelcome = () => (dispatch) => {
  dispatch(closeWelcomeSuccess());
};

export const loginTrueResult = () => ({
  type: actionType.LOGIN_TRUE,
});

export const loginTrue = () => (dispatch) => {
  dispatch(loginTrueResult());
};

export const loginFalseResult = () => ({
  type: actionType.LOGIN_FALSE,
});

export const loginFalse = () => (dispatch) => {
  dispatch(loginFalseResult());
};
