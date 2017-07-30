import * as actionType from '../actions/constants';

const initialState = {
  loginStatus: {
    isWelcomeMsgShowed: false,
    isUserSuccessfullyLogin: false,
  },
  addItem: {
    msg: {
      context: null,
      content: null,
      ok: false,
      isErrMsgShowed: false,
      isModalOpened: false,
      isSuccessMsgShowed: false,
    },
  },
};

const openModal = (state) => {
  const newState = {
    ...state,
    addItem: {
      msg: {
        context: null,
        content: null,
        ok: false,
        isErrMsgShowed: false,
        isSuccessMsgShowed: false,
        isModalOpened: true,
      },
    },
  };
  return newState;
};

const openWelcomeMsgIfUserSuccessfullyLogin = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isWelcomeMsgShowed: true,
      isUserSuccessfullyLogin: true,
    },
  };
  return newState;
};

const closeWelcomeMsg = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isWelcomeMsgShowed: false,
      isUserSuccessfullyLogin: true,
    },
  };
  return newState;
};

const loginStatusTrue = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isWelcomeMsgShowed: true,
      isUserSuccessfullyLogin: true,
    },
  };
  return newState;
};

const loginStatusFalse = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isWelcomeMsgShowed: false,
      isUserSuccessfullyLogin: false,
    },
  };
  return newState;
};

const showErrMsgIfAddItemError = (state, payload) => {
  const newState = {
    ...state,
    addItem: {
      msg: {
        content: payload.content,
        context: payload.context,
        ok: false,
        isErrMsgShowed: true,
        isModalOpened: true,
        isSuccessMsgShowed: false,
      },
    },
  };
  return newState;
};

const closeSuccessAddItemMsgInBelowNavbar = (state) => {
  const newState = {
    ...state,
    addItem: {
      msg: {
        content: state.addItem.msg.content,
        context: state.addItem.msg.context,
        ok: true,
        isErrMsgShowed: false,
        isModalOpened: false,
        isSuccessMsgShowed: false,
      },
    },
  };
  return newState;
};

const closeAddItemFormModal = (state) => {
  const newState = {
    ...state,
    addItem: {
      msg: {
        context: state.addItem.msg.context,
        content: state.addItem.msg.content,
        isErrMsgShowed: false,
        isModalOpened: false,
        isSuccessMsgShowed: false,
        ok: false,
      },
    },
  };
  return newState;
};

const msgFromAddItemSuccess = (state, payload) => {
  const newState = {
    loginStatus: {
      isUserSuccessfullyLogin: true,
      isWelcomeMsgShowed: false,
    },
    addItem: {
      msg: {
        context: payload.context,
        content: payload.content,
        isErrMsgShowed: false,
        isSuccessMsgShowed: true,
        isModalOpened: false,
        ok: true,
      },
    },
  };
  return newState;
};

const closeErrMsgInAddItemForm = (state) => {
  const newState = {
    ...state,
    addItem: {
      msg: {
        content: state.addItem.msg.content,
        context: state.addItem.msg.context,
        isErrMsgShowed: false,
        isSuccessMsgShowed: false,
        isModalOpened: true,
        ok: false,
      },
    },
  };
  return newState;
};

const msgReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.OPEN_WELCOME_MSG_IF_USER_SUCCESSFULLY_LOGIN:
      return openWelcomeMsgIfUserSuccessfullyLogin(state);

    case actionType.CLOSE_WELCOME_MSG:
      return closeWelcomeMsg(state);

    case actionType.LOGIN_TRUE:
      return loginStatusTrue(state);

    case actionType.LOGIN_FALSE:
      return loginStatusFalse(state);

    case actionType.SHOW_MSG_FROM_ADD_ITEM_ERROR:
      return showErrMsgIfAddItemError(state, payload);

    case actionType.CLOSE_ADD_ITEM_FORM_MODAL:
      return closeAddItemFormModal(state, payload);

    case actionType.MSG_FROM_ADD_ITEM_SUCCESS:
      return msgFromAddItemSuccess(state, payload);

    case actionType.OPEN_MODAL:
      return openModal(state);

    case actionType.CLOSE_SUCCESS_ADD_ITEM_MSG_IN_BELOW_NAVBAR:
      return closeSuccessAddItemMsgInBelowNavbar(state);

    case actionType.CLOSE_ERR_MSG_IN_ADD_ITEM_FORM:
      return closeErrMsgInAddItemForm(state);

    default:
      return state;
  }
};

export default msgReducer;
