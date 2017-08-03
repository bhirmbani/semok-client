import * as actionType from '../actions/constants';
// import filterItemByItsMakerAndCategory from '../actions/filterItemActions';

const initialState = {
  items: null,
  isFilterByItsMakerAndCategoryTriggered: false,
};

const getItems = (state, payload) => {
  const newState = {
    ...state,
    items: payload,
  };
  return newState;
};

const addItemSuccess = (state, payload) => {
  const newItem = {
    id: payload.createdItem.id,
    name: payload.createdItem.name,
    createdBy: payload.createdItem.createdBy,
    Category: payload.createdItem.Category,
    Workers: payload.createdItem.Workers,
    msg: payload.msg,
  };
  const newState = {
    ...state,
    items: [
      ...state.items,
      newItem,
    ] };
  return newState;
};

const filterItemByItsMakerAndCategory = (state) => {
  const newState = {
    ...state,
    isFilterByItsMakerAndCategoryTriggered: true,
  };
  return newState;
};

const turnOffFilterByItsMakerAndCategory = (state) => {
  const newState = {
    ...state,
    isFilterByItsMakerAndCategoryTriggered: false,
  };
  return newState;
};

const itemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_ITEMS_RESULT:
      return getItems(state, payload);
    case actionType.ADD_ITEM_SUCCESS:
      return addItemSuccess(state, payload);
    case actionType.TRIGGER_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return filterItemByItsMakerAndCategory(state);
    case actionType.TURN_OFF_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return turnOffFilterByItsMakerAndCategory(state);
    default:
      return state;
  }
};

export default itemReducer;

