import axios from 'axios';
import * as actionType from './constants';

export const loginResult = (userData) => ({
  type: actionType.LOGIN_RESULT,
  payload: userData,
});

export const login = (loginData) => {
  return (dispatch) => {
    axios.post('http://localhost:3000/api/worker/login', loginData)
      .then((res) => {
        dispatch(loginResult(res.data));
      });
  };
};

