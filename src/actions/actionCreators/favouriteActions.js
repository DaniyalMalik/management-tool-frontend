import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/favourites/';

export const getManyFromFavourite = (userId, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + `?userId=${userId}`, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.GET_MANY_FROM_FAVOURITE,
      payload: { favourites: res?.data?.favourites },
    });

  return res?.data;
};

export const getSingleFromFavourite = (id, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.GET_SINGLE_FROM_FAVOURITE,
      payload: { favourite: res?.data?.favourite },
    });

  return res?.data;
};

export const addToFavourite = (data, token) => async (dispatch) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.ADD_TO_FAVOURITE,
      payload: { favourite: res?.data?.favourite },
    });

  return res?.data;
};

export const removeFromFavourite = (id, token) => async (dispatch) => {
  const res = await axios.delete(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.REMOVE_FROM_FAVOURITE,
      payload: { favourite: res?.data?.favourite },
    });

  return res?.data;
};
