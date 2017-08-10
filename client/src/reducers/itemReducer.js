import * as actionType from '../actions/constants';
// import filterItemByItsMakerAndCategory from '../actions/filterItemActions';

const initialState = {
  items: null,
  isFilterByItsMakerAndCategoryTriggered: false,
  itemWithIdAndName: null,
  itemWithTargets: null,
  temporaryItemPropertiesPerId: null,
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

const resultFromGetItemProperties = (state, payload) => {
  const newItemWithProperties = {
    id: payload[0].id,
    name: payload[0].name,
    createdBy: payload[0].createdBy,
    Category: payload[0].Category,
    Workers: payload[0].Workers,
    description: payload[0].description,
    Targets: payload[0].Targets,
    Progresses: payload[0].Progresses,
    Statuses: payload[0].Statuses,
    Performances: payload[0].Performances,
  };
  const newState = {
    ...state,
    items: [
      newItemWithProperties,
      ...state.items,
    ],
  };
  return newState;
};

// const addItemSuccess = (state, payload) => {
//   const newItem = {
//     id: payload.createdItem.id,
//     name: payload.createdItem.name,
//     createdBy: payload.createdItem.createdBy,
//     Category: payload.createdItem.Category,
//     Workers: payload.createdItem.Workers,
//     msg: payload.msg,
//     description: payload.item.description,
//     // Targets: state.temporaryItemPropertiesPerId.Targets,
//     // Progresses: state.temporaryItemPropertiesPerId.Progresses,
//     // Statuses: state.temporaryItemPropertiesPerId.Statuses,
//     // Performances: state.temporaryItemPropertiesPerId.Performances,
//   };

//   const newState = {
//     ...state,
//     items: [
//       newItem,
//       ...state.items,
//     ] };
//   return newState;
// };


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
    //   return addItemSuccess(state, payload);
    // case actionType.TRIGGER_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return filterItemByItsMakerAndCategory(state);
    case actionType.TURN_OFF_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return turnOffFilterByItsMakerAndCategory(state);
    case actionType.GET_ITEM_WITH_ID_AND_NAME:
      return getItemWithIdAndName(state, payload);
    case actionType.GET_ITEM_WITH_TARGETS:
      return getItemWithTargets(state, payload);
    case actionType.RESULT_FROM_GET_ITEM_PROPERTIES:
      return resultFromGetItemProperties(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

