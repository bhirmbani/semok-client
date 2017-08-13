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

export const getItemWithIdAndNameResult = items => ({
  type: actionType.GET_ITEM_WITH_ID_AND_NAME,
  payload: items,
});

export const getItemWithIdAndName = () => (dispatch) => {
  axios.get('http://localhost:3000/api/item/name-and-id', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch(getItemWithIdAndNameResult(res.data.items));
    });
};

const resultFromGetItemProperties = properties => ({
  type: actionType.RESULT_FROM_GET_ITEM_PROPERTIES,
  payload: properties,
});

const getItemPropertiesForAddItemLogic = itemId => (dispatch) => {
  axios.get(`http://localhost:3000/api/item/${itemId}`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch(resultFromGetItemProperties(res.data.items));
      }
    });
};

// export const addItemSuccess = itemData => ({
//   type: actionType.ADD_ITEM_SUCCESS,
//   payload: itemData,
// });

export const addItem = itemData => (dispatch) => {
  axios.post('http://localhost:3000/api/item', itemData, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch(getItemPropertiesForAddItemLogic(res.data.createdItem.id));
        dispatch(msgFromAddItemSuccess(res.data.msg));
        dispatch({
          type: actionType.CLOSE_ADD_ITEM_SUCCESS_MSG,
        });
        dispatch(getItemWithIdAndName());
      } else {
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

export const getItemWithTargets = itemId => (dispatch) => {
  axios.get(`http://localhost:3000/api/item/${itemId}/target/`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch({
        type: actionType.GET_ITEM_WITH_TARGETS,
        payload: res.data.itemWithTargets,
      });
    });
};

export const addItemBaseAndStretchInTarget = (
  targetFormProperties, itemIdx, targetIdx, period) => (dispatch) => {
  axios.post('http://localhost:3000/api/item/target', targetFormProperties, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok && res.data.ref === 910) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_SUCCESS,
          payload: res.data,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
        dispatch({
          type: actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET,
          payload: {
            targetData: res.data,
            itemIdx,
            targetIdx,
            targetPeriod: period,
          },
        });
      } else if (res.data.ok && res.data.ref === 1048) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_SUCCESS,
          payload: res.data,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
        dispatch({
          type: actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET,
          payload: {
            targetData: res.data,
            itemIdx,
            targetIdx,
            targetPeriod: period,
          },
        });
      } else if (!res.data.ok) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_ERR,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
      }
    });
};

export const addValueInProgressItem = (progressFormProperties, positionData) => (dispatch) => {
  axios.post('http://localhost:3000/api/item/progress', progressFormProperties, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if ((res.data.ok && res.data.ref === 1137) ||
        (res.data.ok && res.data.ref === 1130)) {
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
        });
        dispatch({
          type: actionType.ADD_VALUE_IN_PROGRESS_ITEM,
          payload: {
            progressData: res.data,
            positionData,
          },
        });
      } else if (res.data.ok && res.data.ref === 1146) {
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
        });
        dispatch({
          type: actionType.UPDATE_VALUE_IN_PROGRESS_ITEM,
          payload: {
            progressData: res.data,
            positionData,
          },
        });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_ADD_PROGRESS_VALUE,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_ERR_MSG_IN_ADD_PROGRESS_VALUE,
        });
      }
    });
};

// export const resultOfGetItemDeviation = deviation => ({
//   type: actionType.GET_ITEM_DEVIATION_IN_CERTAIN_PERIOD,
//   payload: deviation,
// });

// export const getItemDeviationInCertainPeriod = (itemId, period) => (dispatch) => {
//   axios.get(`http://localhost:3000/api/item/deviation/${itemId}/${period}`, {
//     headers: { token: localStorage.getItem('token') },
//   })
//     .then((res) => {
//       dispatch(resultOfGetItemDeviation(res.data.deviation));
//     });
// };
