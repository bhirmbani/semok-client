import axios from 'axios';
import * as actionType from './constants';
import { msgFromAddItemError, msgFromAddItemSuccess } from './msgActions';

export const getItemsSuccess = items => ({
  type: actionType.GET_ITEMS_RESULT,
  payload: items,
});

export const getItems = () => (dispatch) => {
  axios.get('http://localhost:3000/api/item', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch(getItemsSuccess(res.data.items));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const addItemSuccess = itemData => ({
  type: actionType.ADD_ITEM_SUCCESS,
  payload: itemData,
});

export const addItem = itemData => (dispatch) => {
  axios.post('http://localhost:3000/api/item', itemData, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch(msgFromAddItemSuccess(res.data.msg));
        dispatch(addItemSuccess(res.data));
      } else {
        // dispatch(addItemResult(res.data));
        dispatch(msgFromAddItemError(res.data.msg));
      }
    });
};

export const delegateItem = delegateData => (dispatch) => {
  axios.post('http://localhost:3000/api/item/delegate', delegateData, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_DELEGATING_ITEM,
          payload: res.data.msg,
        });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_DELEGATING_ITEM,
          payload: res.data.msg,
        });
      }
    });
};
