import * as actionType from '../actions/constants';

const initialState = {
  items: null,
};

const getItems = (state, payload) => {
  const newState = {
    items: payload,
  };
  return newState;
};

const addItemSuccess = (state, payload) => {
  // if (payload.ok) {
  const newItem = {
    id: payload.createdItem.id,
    name: payload.createdItem.name,
    createdBy: payload.createdItem.createdBy,
    Category: payload.createdItem.Category,
    Workers: payload.createdItem.Workers,
    msg: payload.msg,
  };
  const newState = {
    items: [
      ...state.items,
      newItem,
    ] };
  return newState;
  // } else {
  //   return state;
  // }
};

const itemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_ITEMS_RESULT:
      return getItems(state, payload);
    case actionType.ADD_ITEM_SUCCESS:
      return addItemSuccess(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

