import * as actionType from '../actions/constants';

const initialState = {
  filterItem: {
    categoryList: null,
  },
};

const getCategoriesForFilteringItem = (state, payload) => {
  const newState = {
    ...state,
    filterItem: {
      categoryList: payload,
    },
  };
  return newState;
};

const categoryReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_CATEGORIES_FOR_FILTERING_ITEM:
      return getCategoriesForFilteringItem(state, payload);
    default:
      return state;
  }
};

export default categoryReducer;
