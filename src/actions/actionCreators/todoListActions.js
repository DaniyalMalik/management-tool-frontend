import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/todos/';

export const getManyFromTodoList = (userId, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + `?userId=${userId}`, {
    headers: { 'x-auth-token': token },
  });

  dispatch({
    type: ACTIONS.GET_TODO_ITEMS,
    payload: { todos: res?.data.todos },
  });

  return res?.data;
};

export const getSingleFromTodoList = (id, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  dispatch({
    type: ACTIONS.GET_TODO_ITEM,
    payload: { todo: res?.data.todo },
  });

  return res?.data;
};

export const updateTodoList = (id, data, token) => async (dispatch) => {
  const res = await axios.put(BASE_URL + id, data, {
    headers: { 'x-auth-token': token },
  });

  dispatch({
    type: ACTIONS.UPDATE_TODO_ITEM,
    payload: { todo: res?.data.todo },
  });

  return res?.data;
};

export const addTodoListItem = (data, token) => async (dispatch) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success) {
    dispatch({
      type: ACTIONS.CREATE_TODO_ITEM,
      payload: { todo: res?.data.todo },
    });
  }

  return res?.data;
};

export const deleteTodoListItem = (id, token) => async (dispatch) => {
  const res = await axios.delete(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  dispatch({
    type: ACTIONS.DELETE_TODO_ITEM,
    payload: { todo: res?.data.todo },
  });

  return res?.data;
};
