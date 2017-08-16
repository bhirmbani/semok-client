import axios from 'axios';
import firebase from 'firebase';
import * as actionType from './constants';
import { msgFromAddItemError, msgFromAddItemSuccess, closeErrMsgInAddItemForm } from './msgActions';


// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDZXfoPHN4qUNMSoWg3y85gV6ZCui6s3KU',
  databaseURL: 'https://bhirmbani.firebaseio.com',
};
firebase.initializeApp(config);

const targets = firebase.database().ref('target');
const progresses = firebase.database().ref('progress');
const addItemRef = firebase.database().ref('item');

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
        addItemRef.set({
          itemId: res.data.createdItem.id,
          msg: res.data.msg,
          ok: res.data.ok,
        });
      } else {
        dispatch(msgFromAddItemError(res.data.msg));
        // dispatch(closeErrMsgInAddItemForm());
        // addItemRef.set({
        //   msg: res.data.msg,
        // });
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
        targets.set({
          data: res.data,
          itemIdx,
          targetIdx,
          targetPeriod: period,
          ref: res.data.ref,
        });
      } else if (res.data.ok && res.data.ref === 1048) {
        targets.set({
          data: res.data,
          itemIdx,
          targetIdx,
          targetPeriod: period,
          ref: res.data.ref,
        });
      } else if (!res.data.ok) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_ERR,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
        // targets.set({
        //   ok: res.data.ok,
        //   msg: res.data.msg,
        // });
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
        progresses.set({
          msg: res.data.msg,
          progressData: res.data,
          positionData,
          ref: res.data.ref,
        });
      } else if (res.data.ok && res.data.ref === 1146) {
        progresses.set({
          msg: res.data.msg,
          progressData: res.data,
          positionData,
          ref: res.data.ref,
        });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_ADD_PROGRESS_VALUE,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_ADD_PROGRESS_VALUE,
        });
        // progresses.set({
        //   msg: res.data.msg,
        // });
      }
    });
};

export const getTargetsFromFirebase = () => (dispatch) => {
  targets.on('value', (data) => {
    if (data.val() !== null) {
      if (data.val().ref === 910) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_SUCCESS,
          payload: data.val().data,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
        dispatch({
          type: actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET,
          payload: {
            targetData: data.val().data,
            itemIdx: data.val().itemIdx,
            targetIdx: data.val().targetIdx,
            targetPeriod: data.val().targetPeriod,
          },
        });
      } else if (data.val().ref === 1048) {
        dispatch({
          type: actionType.MSG_FROM_ADD_TARGET_SUCCESS,
          payload: data.val().data,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_ADD_TARGET,
        });
        dispatch({
          type: actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET,
          payload: {
            targetData: data.val().data,
            itemIdx: data.val().itemIdx,
            targetIdx: data.val().targetIdx,
            targetPeriod: data.val().targetPeriod,
          },
        });
      }
    }
  });
  targets.remove();
};

export const getProgressesFromFirebase = () => (dispatch) => {
  progresses.on('value', (data) => {
    if (data.val() !== null) {
      if (data.val().ref === 1137 || data.val().ref === 1130) {
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
          payload: data.val().msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_ADD_PROGRESS_VALUE,
        });
        dispatch({
          type: actionType.ADD_VALUE_IN_PROGRESS_ITEM,
          payload: {
            progressData: data.val().progressData,
            positionData: data.val().positionData,
          },
        });
      } else if (data.val().ref === 1146) {
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE,
          payload: data.val().msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_ADD_PROGRESS_VALUE,
        });
        dispatch({
          type: actionType.UPDATE_VALUE_IN_PROGRESS_ITEM,
          payload: {
            progressData: data.val().progressData,
            positionData: data.val().positionData,
          },
        });
      }
    }
  });
  progresses.remove();
};

export const getAddItemFromFirebase = () => (dispatch) => {
  addItemRef.on('value', (data) => {
    if (data.val() !== null) {
      if (data.val().ok === true) {
        dispatch(getItemPropertiesForAddItemLogic(data.val().itemId));
        dispatch(msgFromAddItemSuccess(data.val().msg));
        dispatch({
          type: actionType.CLOSE_ADD_ITEM_SUCCESS_MSG,
        });
        dispatch(getItemWithIdAndName());
      }
    }
  });
  addItemRef.remove();
};
