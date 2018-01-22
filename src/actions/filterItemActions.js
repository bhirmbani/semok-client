import * as actionType from './constants';

// export const filterItemByItsMakerAndCategory = properties => (dispatch, getState) => {
//   const state = getState();
//   const allItems = state.itemReducer.originalItems;
//   let filtered = [];
//   if (properties.worker === 'semua' && properties.cat === 'semua') {
//     // filtered = allItems.filter(item => item.CategoryId === properties.cat);
//     console.log('A');
//     filtered = allItems;
//   } else if (properties.worker && properties.cat === 'semua') {
//     console.log('B');
//     filtered = [];
//     allItems.forEach(each => each.Workers.forEach((b) => {
//       if (b.name === properties.worker) {
//         filtered.push(each);
//       }
//     }));
//   } else if (properties.worker === 'semua' && !properties.cat) {
//     console.log('C');
//     filtered = allItems.filter(item => item.CategoryId === properties.cat);
//   } else if (properties.cat === 'semua' && !properties.worker) {
//     console.log('D');
//     // filtered = allItems.filter(item => item.createdBy === properties.worker);
//     filtered = allItems;
//   } else if (!properties.worker && !properties.cat) {
//     console.log('E');
//     filtered = allItems.filter(item => item.CategoryId === properties.cat);
//   } else if (!properties.worker && properties.cat) {
//     console.log('F');
//     filtered = allItems.filter(item => item.CategoryId === properties.cat);
//   } else if (properties.worker === 'semua' && properties.cat) {
//     console.log('G');
//     //   filtered = allItems.filter(item =>
//     //     item.createdBy === properties.worker &&
//     //     item.CategoryId === properties.cat);
//     // console.log('SINSISNI');
//     filtered = allItems.filter(item => item.CategoryId === properties.cat);
//   } else if (properties.worker && properties.cat) {
//     console.log('H');
//     const byWorker = [];
//     allItems.forEach(each => each.Workers.forEach((b) => {
//       if (b.name === properties.worker) {
//         byWorker.push(each);
//       }
//     }));
//     filtered = byWorker.filter(each => each.CategoryId === properties.cat);
//   } else if (properties.worker && !properties.cat) {
//     console.log('I');
//     const byWorker = [];
//     allItems.forEach(each => each.Workers.forEach((b) => {
//       if (b.name === properties.worker) {
//         byWorker.push(each);
//       }
//     }));
//     filtered = byWorker.filter(each => each.CategoryId === properties.cat);
//   }
//   console.log('STATE', state.itemReducer.items);
//   console.log('PROPERTIES', properties);
//   console.log('filtered', filtered);
//   dispatch({
//     type: actionType.FILTER_ITEM_RESULT,
//     payload: filtered,
//   });
//   dispatch({
//     type: actionType.TRIGGER_FILTER_BY_ITS_MAKER_AND_CATEGORY,
//   });
// };

// export const turnOffFilterByItsMakerAndCategory = () => (dispatch) => {
//   dispatch({
//     type: actionType.TURN_OFF_FILTER_BY_ITS_MAKER_AND_CATEGORY,
//   });
// };

export const filterItemByName = properties => (dispatch, getState) => {
  const state = getState();
  const allItems = state.itemReducer.originalItems;
  let filtered = [];
  filtered = allItems.filter(item => item.name === properties.name);
  // dispatch({
  //   type: actionType.FILTER_ITEM_BY_NAME,
  //   payload: filtered,
  // });
  dispatch({ type: actionType.FILTER_ITEM_RESULT, payload: filtered });
  dispatch({ type: actionType.TRIGGER_FILTER_BY_NAME });
};

export const turnOffFilterByName = () => (dispatch, getState) => {
  const state = getState();
  const allItems = state.itemReducer.originalItems;
  dispatch({
    type: actionType.CHANGE_ITEMS_STATE_TO_ORIGINAL,
    payload: allItems,
  });
  dispatch({ type: actionType.TURN_OFF_FILTER_BY_NAME });
};
