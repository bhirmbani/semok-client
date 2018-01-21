import * as actionType from '../actions/constants';
// import filterItemByItsMakerAndCategory from '../actions/filterItemActions';
import helpers from '../helpers';

const whoami = helpers.decode(localStorage.getItem('token'));

const initialState = {
  items: null,
  originalItems: null,
  myItems: null,
  isFilterByItsMakerAndCategoryTriggered: false,
  itemWithIdAndName: null,
  itemWithTargets: null,
  categories: null,
};

const getItems = (state, payload) => {
  const newState = {
    ...state,
    items: payload,
  };
  return newState;
};

const getMyItems = (state, payload) => {
  const newState = {
    ...state,
    myItems: payload,
  };
  return newState;
};

const getAllCategories = (state, payload) => {
  const newState = {
    ...state,
    categories: payload,
  };
  return newState;
};

const createNewCategory = (state, payload) => {
  const newCat = {
    key: payload.id,
    text: payload.name,
    value: payload.id,
  };
  const newState = {
    ...state,
    categories: [
      ...state.categories,
      newCat,
    ],
  };
  return newState;
};

const assignCatToItem = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.meta.itemId);
  const pickedItem = itemState[itemIdx];
  pickedItem.Category = {
    TopCategories: pickedItem.Category ? pickedItem.Category.TopCategories : [],
    ...payload.data,
  };
  pickedItem.CategoryId = payload.data.id;
  itemState.splice(itemIdx, 1, pickedItem);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
};

const addDescription = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.id);
  const pickedItem = itemState[itemIdx];
  pickedItem.description = payload.description;
  itemState.splice(itemIdx, 1, pickedItem);
  const newState = {
    ...state,
    items: itemState,
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
    Units: payload[0].Units,
  };
  const sortedItems = [
    ...state.items,
    newItemWithProperties,
  ];
  sortedItems.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // names must be equal
    return 0;
  });
  const newState = {
    ...state,
    items: sortedItems,
  };
  return newState;
};

const addItemBaseAndStretchInTarget = (state, payload) => {
  console.log(payload);
  let itemWithUpdatedTarget = null;
  const pickedItem = state.items[payload.itemIdx];
  const stateItems = state.items;
  if (payload.targetData.casualData.ref === 910) {
    const updatedTarget = {
      base: payload.targetData.casualData.updatedTarget.base,
      stretch: payload.targetData.casualData.updatedTarget.stretch,
      TargetItem: state.items[payload.itemIdx].Targets[payload.targetIdx].TargetItem,
      createdAt: state.items[payload.itemIdx].Targets[payload.targetIdx].createdAt,
      id: state.items[payload.itemIdx].Targets[payload.targetIdx].id,
      period: state.items[payload.itemIdx].Targets[payload.targetIdx].period,
      updatedAt: payload.targetData.casualData.updatedTarget.updatedAt,
    };
    stateItems.splice(payload.itemIdx, 1, pickedItem);
    stateItems[payload.itemIdx].Targets.splice(payload.targetIdx, 1, updatedTarget);

    itemWithUpdatedTarget = {
      ...state,
      items: stateItems,
    };
  } else if (payload.targetData.casualData.ref === 1048) {
    const arrOfTargets = pickedItem.Targets.map((target) => {
      if (target.period === payload.targetData.casualData.updatedTarget.period) {
        return payload.targetData.casualData.updatedTarget;
      }
      return target;
    });

    const arrOfStatuses = pickedItem.Statuses.map((status) => {
      if (status.period === payload.targetData.casualData.statusResult.period) {
        return payload.targetData.casualData.statusResult;
      }
      return status;
    });
    // const arrOfPerformances = pickedItem.Performances.map((perf) => {
    //   if (perf.period === payload.targetData.casualData.performanceResult.period) {
    //     return payload.targetData.casualData.performanceResult;
    //   }
    //   return perf;
    // });

    pickedItem.Targets = arrOfTargets;
    pickedItem.Statuses = arrOfStatuses;
    pickedItem.Workers = payload.targetData.realWorker.Workers;
    // pickedItem.Performances = arrOfPerformances;

    stateItems.splice(payload.itemIdx, 1, pickedItem);

    itemWithUpdatedTarget = {
      ...state,
      items: stateItems,
    };
  }

  return itemWithUpdatedTarget;
};

const addValueInProgressItem = (state, payload) => {
  const period = state.items[payload.positionData.itemIdx]
    .Progresses[payload.positionData.progressIdx].period;
  const pickedItem = state.items[payload.positionData.itemIdx];
  const statusResult = payload.progressData.casualData.statusResult;
  const workerResult = payload.progressData.realWorker.Workers;
  pickedItem.Statuses.push(statusResult);
  pickedItem.Workers = workerResult;
  pickedItem.Statuses.sort((a, b) => a.period - b.period);
  // pickedItem.Performances.sort((a, b) => a.period - b.period);

  const updatedProgress = {
    ProgressItem: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].ProgressItem,
    createdAt: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].createdAt,
    id: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].id,
    period,
    updatedAt: payload.progressData.casualData.progressResult.updatedAt,
    value: payload.progressData.casualData.progressResult.value,
  };
  const stateItems = state.items;
  stateItems.splice(payload.positionData.itemIdx, 1, pickedItem);
  stateItems[payload.positionData.itemIdx].Progresses.splice(
    payload.positionData.progressIdx, 1, updatedProgress);
  const itemWithUpdatedProgress = {
    ...state,
    items: stateItems,
  };
  return itemWithUpdatedProgress;
};

const updateValueInProgressItem = (state, payload) => {
  if (state.items) {
    const period = state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].period;
    const pickedItem = state.items[payload.positionData.itemIdx];
    const updatedProgress = payload.progressData.casualData.progressResult;
    const updatedStatus = payload.progressData.casualData.statusResult;
    // const updatedPerformance = payload.progressData.casualData.performanceResult;

    const arrOfProgress = pickedItem.Progresses.map((each) => {
      if (each.period === period) {
        return updatedProgress;
      }
      return each;
    });
    const arrOfStatus = pickedItem.Statuses.map((each) => {
      if (each.period === period) {
        return updatedStatus;
      }
      return each;
    });
    // const arrOfPerformance = pickedItem.Performances.map((each) => {
    //   if (each.period === period) {
    //     return updatedPerformance;
    //   }
    //   return each;
    // });

    pickedItem.Progresses = arrOfProgress;
    pickedItem.Statuses = arrOfStatus;
    // pickedItem.Performances = arrOfPerformance;
    pickedItem.Workers = payload.progressData.realWorker.Workers;

    const stateItems = state.items;
    stateItems.splice(payload.positionData.itemIdx, 1, pickedItem);

    const updatedItem = {
      ...state,
      items: stateItems,
    };

    return updatedItem;
    // };

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
  }
  // return state;
};

const filterItemResult = (state, payload) => {
  const newState = {
    ...state,
    items: payload,
  };
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

const editItemName = (state, payload) => {
  const itemState = state.items;
  const pickedItem = itemState[payload.itemIdx];
  pickedItem.name = payload.data.updatedItem.name;
  itemState.splice(payload.itemIdx, 1, pickedItem);
  const newState = {
    ...state,
    items: itemState,
  };

  return newState;
};

const deleteItem = (state, payload) => {
  const itemState = state.items;
  itemState.splice(payload, 1);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
};

const getOriginalItems = (state, payload) => {
  const newState = {
    ...state,
    originalItems: payload,
  };
  return newState;
};

const getWorkersDataForDelegateItem = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.info.id);
  const pickedItem = itemState[itemIdx];
  console.log('PAYLOAD', payload);
  pickedItem.Workers = [];
  pickedItem.Workers = payload.data;
  itemState.splice(itemIdx, 1, pickedItem);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
};

const updateUnitName = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.itemId);
  const pickedUnit = itemState[itemIdx].Units[0];
  pickedUnit.name = payload.updatedName;
  itemState[itemIdx].Units.splice(0, 1, pickedUnit);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
};

const getPerformancesByItemAndWorkerId = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.meta.itemId);
  const workerIdx = itemState[itemIdx].Workers.findIndex(each => each.id === payload.meta.workerId);
  const pickedWorker = itemState[itemIdx].Workers[workerIdx];
  pickedWorker.Performances = payload.perfData.performances;
  itemState[itemIdx].Workers.splice(workerIdx, 1, pickedWorker);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
  // return state;
};

const updateBobotValue = (state, payload) => {
  const itemState = state.items;
  const itemIdx = itemState.findIndex(each => each.id === payload.ItemId);
  const workerIdx = itemState[itemIdx].Workers.findIndex(each => each.id === payload.WorkerId);
  const pickedWorker = itemState[itemIdx].Workers[workerIdx];
  const bobotIdx = pickedWorker.Bobots.findIndex(each => each.ItemId === payload.ItemId);
  const pickedBobot = pickedWorker.Bobots[bobotIdx];
  // update
  pickedBobot.value = payload.value;
  itemState[itemIdx].Workers[workerIdx].Bobots.splice(bobotIdx, 1, pickedBobot);
  const newState = {
    ...state,
    items: itemState,
  };
  return newState;
};


const itemReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actionType.GET_ITEMS_RESULT:
      return getItems(state, payload);
    // case actionType.ADD_ITEM_SUCCESS:
    //   return addItemSuccess(state, payload);
    case actionType.TRIGGER_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return filterItemByItsMakerAndCategory(state);
    case actionType.TURN_OFF_FILTER_BY_ITS_MAKER_AND_CATEGORY:
      return turnOffFilterByItsMakerAndCategory(state);
    case actionType.GET_ITEM_WITH_ID_AND_NAME:
      return getItemWithIdAndName(state, payload);
    case actionType.GET_ITEM_WITH_TARGETS:
      return getItemWithTargets(state, payload);
    case actionType.RESULT_FROM_GET_ITEM_PROPERTIES:
      return resultFromGetItemProperties(state, payload);
    case actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET:
      return addItemBaseAndStretchInTarget(state, payload);
    case actionType.ADD_VALUE_IN_PROGRESS_ITEM:
      return addValueInProgressItem(state, payload);
    case actionType.UPDATE_VALUE_IN_PROGRESS_ITEM:
      return updateValueInProgressItem(state, payload);
    case actionType.EDIT_ITEM_NAME:
      return editItemName(state, payload);
    case actionType.DELETE_ITEM_RESULT:
      return deleteItem(state, payload);
    case actionType.FILTER_ITEM_RESULT:
      return filterItemResult(state, payload);
    case actionType.FETCH_ORIGINAL_ITEMS:
      return getOriginalItems(state, payload);
    case actionType.GET_WORKERS_DATA_FOR_DELEGATE_ITEM:
      return getWorkersDataForDelegateItem(state, payload);
    case actionType.UPDATE_UNIT_NAME:
      return updateUnitName(state, payload);
    case actionType.GET_PERFORMANCES_BY_ITEM_AND_WORKER_ID:
      return getPerformancesByItemAndWorkerId(state, payload);
    case actionType.UPDATE_BOBOT_VALUE:
      return updateBobotValue(state, payload);
    case actionType.GET_ALL_CATEGORIES:
      return getAllCategories(state, payload);
    case actionType.CREATE_NEW_CATEGORY:
      return createNewCategory(state, payload);
    case actionType.ASSIGN_CAT_TO_ITEM:
      return assignCatToItem(state, payload);
    case actionType.ADD_DESCRIPTION:
      return addDescription(state, payload);
    case actionType.GET_MY_ITEMS:
      return getMyItems(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

