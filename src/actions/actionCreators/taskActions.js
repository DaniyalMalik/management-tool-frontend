import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/tasks/';

export const createNewTask = (params, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL, params, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({ type: ACTIONS.ADD_TASK, payload: { task: res?.data?.task } });

    return res?.data;
  } catch (e) {
    console.log(e);

    if (e.message === 'Network Error')
      dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
    else if (e.response.status === 422)
      dispatch({ type: ACTIONS.VALIDATION_ERROR_TASK });
  }
};

export const updateTaskById = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_TASK,
        payload: { task: res?.data.task },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
  }
};

export const deleteTaskById = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.DELETE_TASK,
        payload: { task: res?.data.task },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
  }
};

export const getTasksByCardId = (cardId, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + 'byCardId/' + cardId, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_TASKS_BY_CARD_ID,
        payload: { tasks: res?.data.tasks },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
  }
};

export const getTasksByUserId = (token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + 'byUserId', {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_TASK_BY_USER_ID,
        payload: { tasks: res?.data?.tasks },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
  }
};

export const getTaskById = (id, token) => (dispatch) => {
  axios
    .get(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.GET_TASK_BY_ID, payload: { task: res?.data } });
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
    });
};

export const getTasks = (dispatch, token) => {
  axios
    .get(BASE_URL, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.GET_TASKS, payload: { tasks: res?.data } });
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_TASK, payload: { error: e.message } });
    });
};
