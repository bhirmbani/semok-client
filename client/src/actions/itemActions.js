import axios from 'axios';
import firebase from 'firebase';
import * as actionType from './constants';
import { msgFromAddItemError, msgFromAddItemSuccess } from './msgActions';
import { getCategoriesForFilteringItem } from './categoryActions';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyDZXfoPHN4qUNMSoWg3y85gV6ZCui6s3KU',
  databaseURL: 'https://bhirmbani.firebaseio.com',
};
firebase.initializeApp(config);

const targets = firebase.database().ref('target');
const progresses = firebase.database().ref('progress');
const addItemRef = firebase.database().ref('item');
const editItemRef = firebase.database().ref('edit');

export const getItemsSuccess = items => ({
  type: actionType.GET_ITEMS_RESULT,
  payload: items,
});

export const getItems = () => (dispatch, getState) => {
  axios.get('http://localhost:3000/api/item', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch(getItemsSuccess(res.data.items));
      const originalItems = getState();
      dispatch({
        type: actionType.FETCH_ORIGINAL_ITEMS,
        payload: originalItems.itemReducer.items,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getMyItems = workerId => (dispatch) => {
  axios.get(`http://localhost:3000/api/item/worker/${workerId}`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch({
        type: actionType.GET_MY_ITEMS,
        payload: res.data.items,
      });
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
        axios.get(`http://localhost:3000/api/worker/all/item/${delegateData.itemId}`, {
          headers: { token: localStorage.getItem('token') },
        })
          .then((resp) => {
            dispatch({
              type: actionType.GET_WORKERS_DATA_FOR_DELEGATE_ITEM,
              payload: {
                data: resp.data.workerRef.Workers,
                info: res.data.itemRef,
              },
            });
            dispatch({
              type: actionType.OPEN_SUCCESS_MSG_IN_DELEGATING_ITEM,
              payload: res.data.msg,
            });
            dispatch({
              type: actionType.CLOSE_MSG_IN_DELEGATING_ITEM,
            });
          });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_DELEGATING_ITEM,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_DELEGATING_ITEM,
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
      axios.get(`http://localhost:3000/api/worker/all/item/${targetFormProperties.itemId}`, {
        headers: { token: localStorage.getItem('token') },
      })
        .then((resp) => {
          if (res.data.ok && res.data.ref === 910) {
            targets.set({
              data: {
                casualData: res.data,
                realWorker: resp.data.workerRef,
              },
              itemIdx,
              targetIdx,
              targetPeriod: period,
              ref: res.data.ref,
            });
          } else if (res.data.ok && res.data.ref === 1048) {
            targets.set({
              data: {
                casualData: res.data,
                realWorker: resp.data.workerRef,
              },
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
    });
};

export const addValueInProgressItem = (progressFormProperties, positionData) => (dispatch) => {
  axios.post('http://localhost:3000/api/item/progress', progressFormProperties, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if ((res.data.ref === 1335) ||
          (res.data.ref === 1299) ||
          (res.data.ref === 1383)) {
        axios.get(`http://localhost:3000/api/worker/all/item/${progressFormProperties.itemId}`, {
          headers: { token: localStorage.getItem('token') },
        })
          .then((resp) => {
            progresses.set({
              msg: res.data.msg,
              progressData: {
                realWorker: resp.data.workerRef,
                casualData: res.data,
              },
              positionData,
              ref: res.data.ref,
            });
          });
      } else if (res.data.ref === 1367 || res.data.ref === 1382) {
        axios.get(`http://localhost:3000/api/worker/all/item/${progressFormProperties.itemId}`, {
          headers: { token: localStorage.getItem('token') },
        })
          .then((resp) => {
            progresses.set({
              msg: res.data.msg,
              progressData: {
                realWorker: resp.data.workerRef,
                casualData: res.data,
              },
              positionData,
              ref: res.data.ref,
            });
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

export const updateUnitName = unitData => (dispatch) => {
  axios.post('http://localhost:3000/api/item/unit', unitData, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.UPDATE_UNIT_NAME,
          payload: res.data,
        });
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_UPDATE_UNIT_NAME,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_UPDATE_UNIT_NAME,
        });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_UPDATE_UNIT_NAME,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_UPDATE_UNIT_NAME,
        });
      }
    });
};

export const addDescription = addDescForm => (dispatch) => {
  axios.post('http://localhost:3000/api/item/description', addDescForm, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.ADD_DESCRIPTION,
          payload: res.data.desc,
        });
      } else {
        dispatch({
          type: actionType.MSG_FROM_ADD_DESC_ERR,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_FROM_ADD_DESC,
        });
      }
    });
};

export const getPerformancesByItemAndWorker = (itemId, workerId) => (dispatch) => {
  axios.get(`http://localhost:3000/api/item/performances/${itemId}/${workerId}`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.GET_PERFORMANCES_BY_ITEM_AND_WORKER_ID,
          payload: {
            perfData: res.data,
            meta: {
              itemId,
              workerId,
            },
          },
        });
      }
    });
};

export const updateBobotValue = bobotData => (dispatch) => {
  axios.post('http://localhost:3000/api/item/bobot', bobotData, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.UPDATE_BOBOT_VALUE,
          payload: res.data.updatedBobot,
        });
        dispatch({
          type: actionType.OPEN_SUCCESS_MSG_IN_EDIT_BOBOT,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_EDIT_BOBOT,
        });
      } else {
        dispatch({
          type: actionType.OPEN_ERR_MSG_IN_EDIT_BOBOT,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_EDIT_BOBOT,
        });
      }
    });
};

export const getAllCategory = chosenCat => (dispatch) => {
  axios.get('http://localhost:3000/api/category', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        let forDropdown = null;
        if (!chosenCat) {
          forDropdown = res.data.categories.map(each => ({
            key: each.id,
            text: each.name,
            value: each.id,
          }));
        } else {
          const rawDropdown = res.data.categories.map(each => ({
            key: each.id,
            text: each.name,
            value: each.id,
          }));
          forDropdown = rawDropdown.filter(each => each.text !== chosenCat);
        }
        dispatch({
          type: actionType.GET_ALL_CATEGORIES,
          payload: forDropdown,
        });
      }
    });
};

export const createNewCategory = categoryName => (dispatch) => {
  axios.post('http://localhost:3000/api/category/', categoryName, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.CREATE_NEW_CATEGORY,
          payload: res.data.uniqCategory,
        });
        dispatch(getCategoriesForFilteringItem());
        // dispatch({
        //   type: actionType.MSG_FROM_ADD_CAT_SUCCESS,
        //   payload: res.data.msg,
        // });
        // dispatch({
        //   type: actionType.CLOSE_MSG_FROM_ADD_CAT,
        // });
      } else {
        dispatch({
          type: actionType.MSG_FROM_ADD_CAT_ERR,
          payload: res.data.msg,
        });
        // dispatch({
        //   type: actionType.CLOSE_MSG_FROM_ADD_CAT,
        // });
      }
    });
};

export const assignCatToItem = assignCatForm => (dispatch) => {
  axios.post('http://localhost:3000/api/category/item', assignCatForm, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.ASSIGN_CAT_TO_ITEM,
          payload: {
            data: res.data.filteredCategory[0],
            meta: assignCatForm,
          },
        });
        dispatch({
          type: actionType.MSG_FROM_ASSIGN_CAT_SUCCESS,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.CLOSE_MSG_IN_ASSIGN_CAT,
        });
      } else {
        // dispatch({
        //   type: actionType.MSG_FROM_ASSIGN_CAT_ERR,
        //   payload: res.data.msg,
        // });
        // dispatch({
        //   type: actionType.CLOSE_MSG_IN_ASSIGN_CAT,
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
          payload: data.val().data.casualData,
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
          payload: data.val().data.casualData,
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
      if (data.val().ref === 1335
        || data.val().ref === 1299
        || data.val().ref === 1383) {
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
      } else if (data.val().ref === 1367 || data.val().ref === 1382) {
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

export const getEditItemFromFirebase = () => (dispatch) => {
  editItemRef.on('value', (data) => {
    if (data.val() !== null) {
      if (data.val().ok) {
        dispatch({
          type: actionType.MSG_FROM_EDIT_ITEM_NAME_SUCCESS,
          payload: data.val().msg,
        });
        dispatch({
          type: actionType.EDIT_ITEM_NAME,
          payload: { data: data.val().data, itemIdx: data.val().itemIdx },
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_EDIT_ITEM_NAME,
        });
      }
    }
  });
  editItemRef.remove();
};

export const editItemName = (itemId, name, itemIdx) => (dispatch) => {
  axios.post(`http://localhost:3000/api/item/edit/${itemId}`, { name }, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        editItemRef.set({
          data: res.data,
          msg: res.data.msg,
          itemIdx,
          ok: res.data.ok,
        });
      } else if (!res.data.ok) {
        dispatch({
          type: actionType.MSG_FROM_EDIT_ITEM_NAME_ERR,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_EDIT_ITEM_NAME,
        });
      }
    });
};

export const deleteItem = (itemId, itemIdx) => (dispatch) => {
  axios.delete(`http://localhost:3000/api/item/${itemId}`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      if (res.data.ok) {
        dispatch({
          type: actionType.DELETE_ITEM_RESULT,
          payload: itemIdx,
        });
        dispatch({
          type: actionType.MSG_FROM_DELETE_ITEM_SUCCESS,
          payload: res.data.msg,
        });
        dispatch({
          type: actionType.REMOVE_MSG_FROM_DELETE_ITEM,
        });
      }
    });
};
