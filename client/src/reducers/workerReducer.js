import * as actionType from '../actions/constants';

const initialState = {
  delegateItem: {
    workerList: null,
  },
  filterItem: {
    workerList: null,
  },
};

const getWorkerThatHasNoItemYetForDelegateLogic = (state, payload) => {
  const newState = {
    ...state,
    delegateItem: {
      workerList: payload,
    },
  };
  return newState;
};

const getWorkersWithoutAdminForFilterInTableItem = (state, payload) => {
  const newState = {
    ...state,
    filterItem: {
      workerList: payload,
    },
  };
  return newState;
};

const workerReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_WORKER_THAT_HAS_NO_ITEM_YET:
      return getWorkerThatHasNoItemYetForDelegateLogic(state, payload);
    case actionType.GET_WORKERS_WITHOUT_ADMIN_FOR_FILTER_IN_TABLE_ITEM:
      return getWorkersWithoutAdminForFilterInTableItem(state, payload);
    default:
      return state;
  }
};

export default workerReducer;
