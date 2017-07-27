import * as actionType from '../actions/constants';

const initialState = {
  items: '',
};

const getItems = (state, payload) => {
  const newState = {
    items: payload,
  };
  return newState;
};

const itemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_ITEMS_RESULT:
      return getItems(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

