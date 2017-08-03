import * as actionType from './constants';

export const openWelcomeMsgIfUserSuccessfullyLogin = () => (dispatch) => {
  dispatch({
    type: actionType.OPEN_WELCOME_MSG_IF_USER_SUCCESSFULLY_LOGIN,
  });
};

export const closeWelcomeMsg = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_WELCOME_MSG,
  });
};

export const closeErrMsgInAddItemForm = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_ERR_MSG_IN_ADD_ITEM_FORM,
  });
};

export const loginTrueResult = () => ({
  type: actionType.LOGIN_TRUE,
});

export const loginTrue = () => (dispatch) => {
  dispatch(loginTrueResult());
};

export const setIsUserSuccessfullyLoginToFalse = () => (dispatch) => {
  dispatch({
    type: actionType.SET_IS_USER_SUCCESSFULLY_LOGIN_TO_FALSE,
  });
};

export const closeSuccessMsgInDelegatingItem = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_SUCCESS_MSG_IN_DELEGATING_ITEM,
  });
};

export const closeErrMsgInDelegatingItem = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_ERR_MSG_IN_DELEGATING_ITEM,
  });
};

export const msgFromAddItemError = errMsg => ({
  type: actionType.SHOW_MSG_FROM_ADD_ITEM_ERROR,
  payload: errMsg,
});

export const msgFromAddItemSuccess = successMsg => ({
  type: actionType.MSG_FROM_ADD_ITEM_SUCCESS,
  payload: successMsg,
});

export const closeAddItemFormModal = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_ADD_ITEM_FORM_MODAL,
  });
};

export const openModal = () => (dispatch) => {
  dispatch({
    type: actionType.OPEN_MODAL,
  });
};

export const closeSuccessAddItemMsgInBelowNavbar = () => (dispatch) => {
  dispatch({
    type: actionType.CLOSE_SUCCESS_ADD_ITEM_MSG_IN_BELOW_NAVBAR,
  });
};

export const removeSidebarWhenUserClickLogout = () => (dispatch) => {
  dispatch({
    type: actionType.REMOVE_SIDEBAR_WHEN_USER_CLICK_LOGOUT,
  });
};
