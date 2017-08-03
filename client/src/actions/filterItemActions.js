import * as actionType from './constants';

export const filterItemByItsMakerAndCategory = properties => (dispatch, getState) => {
  const state = getState();
  const allItems = state.itemReducer.items;
  const filtered = allItems.filter(item =>
    item.createdBy === properties.worker &&
    item.CategoryId === properties.cat);
  dispatch({
    type: actionType.FILTER_ITEM_BY_ITS_MAKER_AND_CATEGORY,
    payload: filtered,
  });
  dispatch({
    type: actionType.TRIGGER_FILTER_BY_ITS_MAKER_AND_CATEGORY,
  });
};

export const turnOffFilterByItsMakerAndCategory = () => (dispatch) => {
  dispatch({
    type: actionType.TURN_OFF_FILTER_BY_ITS_MAKER_AND_CATEGORY,
  });
};
