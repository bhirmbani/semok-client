import axios from 'axios';
import * as actionType from './constants';
import { loginTrue, loginFalse, openWelcome } from './msgActions';

export const loginResult = (userData) => ({
  type: actionType.LOGIN_RESULT,
  payload: userData,
});

export const login = (loginData) => {
  return (dispatch) => {
    axios.post('http://localhost:3000/api/worker/login', loginData)
      .then((res) => {
        if (res.data.ok) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('name', res.data.user.name);
          dispatch(loginResult(res.data));
          dispatch(loginTrue());
        } else {
          dispatch(loginResult(res.data));
        }
      });
  };
};

export const logoutResult = () => ({
  type: actionType.LOGOUT_RESULT,
});

export const logout = () => {
  return (dispatch) => {
    dispatch(logoutResult());
    dispatch(loginFalse());
    dispatch(openWelcome());
    localStorage.clear();
  };
};
