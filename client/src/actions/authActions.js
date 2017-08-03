import axios from 'axios';
import * as actionType from './constants';
import {
  openWelcomeMsgIfUserSuccessfullyLogin,
  setIsUserSuccessfullyLoginToFalse,
  removeSidebarWhenUserClickLogout,
} from './msgActions';

export const getUserDataAfterUserTryingToLogin = userData => ({
  type: actionType.GET_USER_DATA_AFTER_USER_TRYING_TO_LOGIN,
  payload: userData,
});

export const userTryingToLogin = loginData => (dispatch) => {
  axios.post('http://localhost:3000/api/worker/login', loginData)
    .then((res) => {
      if (res.data.ok) {
        const token = res.data.token;
        // const name = res.data.user.name;
        // const role = res.data.user.role;
        localStorage.setItem('token', token);
        // localStorage.setItem('name', name);
        // localStorage.setItem('role', role);
        dispatch(getUserDataAfterUserTryingToLogin(res.data)); // if login success welcome msg will be showed
        dispatch(openWelcomeMsgIfUserSuccessfullyLogin());
      } else {
        dispatch(getUserDataAfterUserTryingToLogin(res.data)); // if login not success err msg will be showed
      }
    });
};

export const clearUserDataAfterUserLogout = () => ({
  type: actionType.CLEAR_USER_DATA_AFTER_USER_LOGOUT,
});

export const logout = () => (dispatch) => {
  localStorage.clear();
  dispatch(clearUserDataAfterUserLogout());
  dispatch(setIsUserSuccessfullyLoginToFalse());
  dispatch(removeSidebarWhenUserClickLogout());
};
