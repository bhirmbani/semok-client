import axios from 'axios';
import * as actionType from './constants';

export const getWorkerThatHasNoItemYetForDelegateLogic = itemId => (dispatch) => {
  axios.get(`http://localhost:3000/api/worker/no-item/${itemId}`, {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch({
        type: actionType.GET_WORKER_THAT_HAS_NO_ITEM_YET,
        payload: res.data.filteredWorker,
      });
    });
};

export const getWorkersWithoutAdminForFilterInTableItem = () => (dispatch) => {
  axios.get('http://localhost:3000/api/worker/no-admin', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch({
        type: actionType.GET_WORKERS_WITHOUT_ADMIN_FOR_FILTER_IN_TABLE_ITEM,
        payload: res.data.workers,
      });
    });
};
