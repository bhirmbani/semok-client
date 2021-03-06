import * as actionType from '../actions/constants';

const initialState = {
  loginStatus: {
    isWelcomeMsgShowed: false,
    isUserSuccessfullyLogin: false,
    isSidebar: true,
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
  delegateItem: {
    msg: {
      context: null,
      content: null,
      ok: null,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  addTarget: {
    msg: {
      context: null,
      content: null,
      ok: null,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  addProgress: {
    msg: {
      context: null,
      content: null,
      ok: null,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  editItemName: {
    msg: {
      context: null,
      content: null,
      ok: null,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  deleteItem: {
    msg: {
      context: null,
      content: null,
      ok: null,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  updateUnitName: {
    msg: {
      context: null,
      content: null,
      ok: false,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
    },
  },
  editBobot: {
    msg: {
      context: null,
      content: null,
      ok: true,
      isSuccessMsgShowed: false,
      isErrMsgShowed: false,
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
      isSidebar: state.loginStatus.isSidebar,
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
      isSidebar: state.loginStatus.isSidebar,
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
      isSidebar: state.loginStatus.isSidebar,
    },
  };
  return newState;
};

const setIsUserSuccessfullyLoginToFalse = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isWelcomeMsgShowed: false,
      isUserSuccessfullyLogin: false,
      isSidebar: false,
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

const closeAddItemSuccessMsg = (state) => {
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
    ...state,
    loginStatus: {
      isUserSuccessfullyLogin: true,
      isWelcomeMsgShowed: false,
      isSidebar: state.loginStatus.isSidebar,
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

const msgFromAddTargetSuccess = (state, payload) => {
  const newState = {
    ...state,
    addTarget: {
      msg: {
        context: 'Terimakasih',
        content: payload.msg,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const msgFromAddTargetErr = (state, payload) => {
  const newState = {
    ...state,
    addTarget: {
      msg: {
        context: 'Gagal memperbarui nilai target',
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

const removeMsgFromAddTarget = (state) => {
  const newState = {
    ...state,
    addTarget: {
      msg: {
        context: 'null',
        content: null,
        ok: null,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
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

const removeSidebarwhenUserClickLogout = (state) => {
  const newState = {
    ...state,
    loginStatus: {
      isSidebar: false,
      isUserSuccessfullyLogin: false,
      isWelcomeMsgShowed: false,
    },
  };
  return newState;
};

const openSuccessMsgInDelegatingItem = (state, payload) => {
  const newState = {
    ...state,
    delegateItem: {
      msg: {
        context: 'Berhasil Delegasikan Item',
        content: payload,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openErrMsgInDelegatingItem = (state, payload) => {
  const newState = {
    ...state,
    delegateItem: {
      msg: {
        context: 'Gagal Delegasikan Item',
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

// const closeSuccessMsgInDelegatingItem = (state) => {
//   const newState = {
//     ...state,
//     delegateItem: {
//       msg: {
//         context: null,
//         content: null,
//         ok: null,
//         isSuccessMsgShowed: false,
//         isErrMsgShowed: false,
//       },
//     },
//   };
//   return newState;
// };

const closeMsgInDelegatingItem = (state) => {
  const newState = {
    ...state,
    delegateItem: {
      msg: {
        context: null,
        content: null,
        ok: null,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

// const closeErrMsgInDelegatingItem = (state) => {
//   const newState = {
//     ...state,
//     delegateItem: {
//       msg: {
//         context: null,
//         content: null,
//         ok: null,
//         isSuccessMsgShowed: false,
//         isErrMsgShowed: false,
//       },
//     },
//   };
//   return newState;
// };

const openErrMsgInAddProgressValue = (state, payload) => {
  const newState = {
    ...state,
    addProgress: {
      msg: {
        context: null,
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

const closeMsgInAddProgressValue = (state) => {
  const newState = {
    ...state,
    addProgress: {
      msg: {
        context: null,
        content: null,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openSuccessMsgInAddProgressValue = (state, payload) => {
  const newState = {
    ...state,
    addProgress: {
      msg: {
        context: null,
        content: payload,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const msgFromEditItemNameSuccess = (state, payload) => {
  const newState = {
    ...state,
    editItemName: {
      msg: {
        context: null,
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

const msgFromEditItemNameErr = (state, payload) => {
  const newState = {
    ...state,
    editItemName: {
      msg: {
        context: null,
        content: payload,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const removeMsgFromEditItemName = (state) => {
  const newState = {
    ...state,
    editItemName: {
      msg: {
        context: null,
        content: null,
        ok: null,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const msgFromDeleteItemSuccess = (state, payload) => {
  const newState = {
    ...state,
    deleteItem: {
      msg: {
        context: null,
        content: payload,
        ok: null,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const removeMsgFromDeleteItem = (state) => {
  const newState = {
    ...state,
    deleteItem: {
      msg: {
        context: null,
        content: null,
        ok: null,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openSuccessMsgInUpdateUnitName = (state, payload) => {
  const newState = {
    ...state,
    updateUnitName: {
      msg: {
        context: null,
        content: payload,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openErrMsgInUpdateUnitName = (state, payload) => {
  const newState = {
    ...state,
    updateUnitName: {
      msg: {
        context: null,
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

const closeMsgInUpdateUnitName = (state) => {
  const newState = {
    ...state,
    updateUnitName: {
      msg: {
        context: null,
        content: null,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openSuccessMsgInEditBobot = (state, payload) => {
  const newState = {
    ...state,
    editBobot: {
      msg: {
        context: null,
        content: payload,
        ok: true,
        isSuccessMsgShowed: true,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

const openErrMsgInEditBobot = (state, payload) => {
  const newState = {
    ...state,
    editBobot: {
      msg: {
        context: null,
        content: payload,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: true,
      },
    },
  };
  return newState;
};

const closeMsgInEditBobot = (state) => {
  const newState = {
    ...state,
    editBobot: {
      msg: {
        context: null,
        content: null,
        ok: false,
        isSuccessMsgShowed: false,
        isErrMsgShowed: false,
      },
    },
  };
  return newState;
};

// const closeSuccessMsgInAddProgressValue = (state) => {
//   const newState = {
//     ...state,
//     addProgress: {
//       msg: {
//         context: null,
//         content: null,
//         ok: false,
//         isSuccessMsgShowed: false,
//         isErrMsgShowed: false,
//       },
//     },
//   };
//   return newState;
// };

const msgReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.OPEN_WELCOME_MSG_IF_USER_SUCCESSFULLY_LOGIN:
      return openWelcomeMsgIfUserSuccessfullyLogin(state);

    case actionType.CLOSE_WELCOME_MSG:
      return closeWelcomeMsg(state);

    case actionType.LOGIN_TRUE:
      return loginStatusTrue(state);

    case actionType.SET_IS_USER_SUCCESSFULLY_LOGIN_TO_FALSE:
      return setIsUserSuccessfullyLoginToFalse(state);

    case actionType.REMOVE_SIDEBAR_WHEN_USER_CLICK_LOGOUT:
      return removeSidebarwhenUserClickLogout(state);

    case actionType.SHOW_MSG_FROM_ADD_ITEM_ERROR:
      return showErrMsgIfAddItemError(state, payload);

    case actionType.CLOSE_ADD_ITEM_FORM_MODAL:
      return closeAddItemFormModal(state, payload);

    case actionType.MSG_FROM_ADD_ITEM_SUCCESS:
      return msgFromAddItemSuccess(state, payload);

    case actionType.OPEN_MODAL:
      return openModal(state);

    case actionType.CLOSE_ADD_ITEM_SUCCESS_MSG:
      return closeAddItemSuccessMsg(state);

    case actionType.CLOSE_ERR_MSG_IN_ADD_ITEM_FORM:
      return closeErrMsgInAddItemForm(state);

    case actionType.OPEN_SUCCESS_MSG_IN_DELEGATING_ITEM:
      return openSuccessMsgInDelegatingItem(state, payload);

    case actionType.OPEN_ERR_MSG_IN_DELEGATING_ITEM:
      return openErrMsgInDelegatingItem(state, payload);

    // case actionType.CLOSE_SUCCESS_MSG_IN_DELEGATING_ITEM:
    //   return closeSuccessMsgInDelegatingItem(state);

    // case actionType.CLOSE_ERR_MSG_IN_DELEGATING_ITEM:
    //   return closeErrMsgInDelegatingItem(state);

    case actionType.CLOSE_MSG_IN_DELEGATING_ITEM:
      return closeMsgInDelegatingItem(state);

    case actionType.MSG_FROM_ADD_TARGET_SUCCESS:
      return msgFromAddTargetSuccess(state, payload);

    case actionType.MSG_FROM_ADD_TARGET_ERR:
      return msgFromAddTargetErr(state, payload);

    case actionType.REMOVE_MSG_FROM_ADD_TARGET:
      return removeMsgFromAddTarget(state);

    case actionType.OPEN_ERR_MSG_IN_ADD_PROGRESS_VALUE:
      return openErrMsgInAddProgressValue(state, payload);

    // case actionType.CLOSE_ERR_MSG_IN_ADD_PROGRESS_VALUE:
    //   return closeErrMsgInAddProgressValue(state);

    case actionType.OPEN_SUCCESS_MSG_IN_ADD_PROGRESS_VALUE:
      return openSuccessMsgInAddProgressValue(state, payload);

    case actionType.CLOSE_MSG_IN_ADD_PROGRESS_VALUE:
      return closeMsgInAddProgressValue(state);

    case actionType.MSG_FROM_EDIT_ITEM_NAME_SUCCESS:
      return msgFromEditItemNameSuccess(state, payload);

    case actionType.MSG_FROM_EDIT_ITEM_NAME_ERR:
      return msgFromEditItemNameErr(state, payload);

    case actionType.REMOVE_MSG_FROM_EDIT_ITEM_NAME:
      return removeMsgFromEditItemName(state);

    case actionType.MSG_FROM_DELETE_ITEM_SUCCESS:
      return msgFromDeleteItemSuccess(state, payload);

    case actionType.REMOVE_MSG_FROM_DELETE_ITEM:
      return removeMsgFromDeleteItem(state, payload);

    case actionType.OPEN_SUCCESS_MSG_IN_UPDATE_UNIT_NAME:
      return openSuccessMsgInUpdateUnitName(state, payload);

    case actionType.OPEN_ERR_MSG_IN_UPDATE_UNIT_NAME:
      return openErrMsgInUpdateUnitName(state, payload);

    case actionType.CLOSE_MSG_IN_UPDATE_UNIT_NAME:
      return closeMsgInUpdateUnitName(state);

    case actionType.OPEN_SUCCESS_MSG_IN_EDIT_BOBOT:
      return openSuccessMsgInEditBobot(state, payload);

    case actionType.OPEN_ERR_MSG_IN_EDIT_BOBOT:
      return openErrMsgInEditBobot(state, payload);

    case actionType.CLOSE_MSG_IN_EDIT_BOBOT:
      return closeMsgInEditBobot(state);

    default:
      return state;
  }
};

export default msgReducer;
