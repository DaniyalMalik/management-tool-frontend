import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/lists/';

export const createNewList = (params, token) => (dispatch) => {
  dispatch({ type: ACTIONS.POST_REQUEST_LIST });
  axios
    .post(BASE_URL, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.ADD_LIST, payload: { list: res?.data } });
    })
    .catch((e) => {
      if (e.message === 'Network Error')
        dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
      else if (e.response.status === 422)
        dispatch({ type: ACTIONS.VALIDATION_ERROR_LIST });
    });
};

export const updateListById = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.patch(BASE_URL + id, params, {
      headers: { 'x-auth-token': token },
    });

    dispatch({ type: ACTIONS.UPDATE_LIST, payload: { list: res?.data?.list } });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const updateListByIdPut = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const removeListAccess = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'removeAccess/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e.message } });
  }
};

export const bulkUpdateList = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'bulkUpdate/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const bulkRemoveList = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'bulkRemove/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const deleteListById = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.DELETE_LIST,
      payload: { list: res?.data?.list },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e.message } });
  }
};
