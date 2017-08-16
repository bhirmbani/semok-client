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

const addItemBaseAndStretchInTarget = (state, payload) => {
  let itemWithUpdatedTarget = null;
  const pickedItem = state.items[payload.itemIdx];
  const stateItems = state.items;
  if (payload.targetData.ref === 910) {
    const updatedTarget = {
      base: payload.targetData.updatedTarget.base,
      stretch: payload.targetData.updatedTarget.stretch,
      TargetItem: state.items[payload.itemIdx].Targets[payload.targetIdx].TargetItem,
      createdAt: state.items[payload.itemIdx].Targets[payload.targetIdx].createdAt,
      id: state.items[payload.itemIdx].Targets[payload.targetIdx].id,
      period: state.items[payload.itemIdx].Targets[payload.targetIdx].period,
      updatedAt: payload.targetData.updatedTarget.updatedAt,
    };
    stateItems.splice(payload.itemIdx, 1, pickedItem);
    stateItems[payload.itemIdx].Targets.splice(payload.targetIdx, 1, updatedTarget);

    itemWithUpdatedTarget = {
      ...state,
      items: stateItems,
    };
  } else if (payload.targetData.ref === 1048) {
    const arrOfTargets = pickedItem.Targets.map((target) => {
      if (target.period === payload.targetData.updatedTarget.period) {
        return payload.targetData.updatedTarget;
      }
      return target;
    });

    const arrOfStatuses = pickedItem.Statuses.map((status) => {
      if (status.period === payload.targetData.statusResult.period) {
        return payload.targetData.statusResult;
      }
      return status;
    });
    const arrOfPerformances = pickedItem.Performances.map((perf) => {
      if (perf.period === payload.targetData.performanceResult.period) {
        return payload.targetData.performanceResult;
      }
      return perf;
    });

    pickedItem.Targets = arrOfTargets;
    pickedItem.Statuses = arrOfStatuses;
    pickedItem.Performances = arrOfPerformances;

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
  const statusResult = payload.progressData.statusResult;
  const performanceResult = payload.progressData.performanceResult;
  pickedItem.Statuses.push(statusResult);
  pickedItem.Performances.push(performanceResult);
  pickedItem.Statuses.sort((a, b) => a.period - b.period);
  pickedItem.Performances.sort((a, b) => a.period - b.period);

  const updatedProgress = {
    ProgressItem: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].ProgressItem,
    createdAt: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].createdAt,
    id: state.items[payload.positionData.itemIdx]
      .Progresses[payload.positionData.progressIdx].id,
    period,
    updatedAt: payload.progressData.progressResult.updatedAt,
    value: payload.progressData.progressResult.value,
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
    const updatedProgress = payload.progressData.progressResult;
    const updatedStatus = payload.progressData.statusResult;
    const updatedPerformance = payload.progressData.performanceResult;

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
    const arrOfPerformance = pickedItem.Performances.map((each) => {
      if (each.period === period) {
        return updatedPerformance;
      }
      return each;
    });

    pickedItem.Progresses = arrOfProgress;
    pickedItem.Statuses = arrOfStatus;
    pickedItem.Performances = arrOfPerformance;

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
  return state;
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
    case actionType.ADD_ITEM_BASE_AND_STRETCH_IN_TARGET:
      return addItemBaseAndStretchInTarget(state, payload);
    case actionType.ADD_VALUE_IN_PROGRESS_ITEM:
      return addValueInProgressItem(state, payload);
    case actionType.UPDATE_VALUE_IN_PROGRESS_ITEM:
      return updateValueInProgressItem(state, payload);
    default:
      return state;
  }
};

export default itemReducer;

