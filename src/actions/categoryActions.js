import axios from 'axios';
import * as actionType from './constants';


export const getCategoriesForFilterItemSuccess = (categories) => ({
  type: actionType.GET_CATEGORIES_FOR_FILTERING_ITEM,
  payload: categories,
});

export const getCategoriesForFilteringItem = () => (dispatch) => {
  axios.get('http://localhost:3000/api/category/for-filtering-item', {
    headers: { token: localStorage.getItem('token') },
  })
    .then((res) => {
      dispatch(getCategoriesForFilterItemSuccess(res.data.categories));
    });
};

export const test = () => (dispatch) => {

};
