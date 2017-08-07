import * as actionType from '../actions/constants';
// import filterItemByItsMakerAndCategory from '../actions/filterItemActions';

const initialState = {
  items: null,
  isFilterByItsMakerAndCategoryTriggered: false,
  itemWithIdAndName: null,
  itemWithTargets: null,
};

const getItems = (state, payload) => {
  const newState = {
    ...state,
    items: payload,
  };
  return newState;
};

const getItemWithIdAndName = (state, payload) => {
  const newState = {
    ...state,
    itemWithIdAndName: payload,
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
    description: payload.item.description,
  };
  const newState = {
    ...state,
    items: [
      newItem,
      ...state.items,
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

const getItemWithTargets = (state, payload) => {
  const newState = {
    ...state,
    itemWithTargets: payload,
  };
  return newState;
};

// const getItemDeviationInCertainPeriod = (state, payload) => {

// }

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
    case actionType.GET_ITEM_WITH_ID_AND_NAME:
      return getItemWithIdAndName(state, payload);
    case actionType.GET_ITEM_WITH_TARGETS:
      return getItemWithTargets(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

