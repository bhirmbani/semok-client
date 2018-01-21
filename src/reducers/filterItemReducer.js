import * as actionType from '../actions/constants';

const initialState = {
  filteredItems: null,
};

const filterItemByItsMakerAndCategory = (state, payload) => {
  const newState = {
    filteredItems: payload,
  };
  return newState;
};

const filterItemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.FILTER_ITEM_BY_ITS_MAKER_AND_CATEGORY:
      return filterItemByItsMakerAndCategory(state, payload);
    default:
      return state;
  }
};

export default filterItemReducer;
