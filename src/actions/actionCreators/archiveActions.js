import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/archives/';

export const getManyFromArchive = (companyId, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + `?companyId=${companyId}`, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.GET_ARCHIVES,
      payload: { archives: res?.data.archives },
    });

  return res?.data;
};

export const getSingleFromArchive = (id, token) => async (dispatch) => {
  const res = await axios.get(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.GET_SINGLE_ARCHIVE,
      payload: { archive: res?.data.archive },
    });

  return res?.data;
};

export const updateSingleFromArchive =
  (id, data, token) => async (dispatch) => {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_ARCHIVE,
        payload: { archive: res?.data.archive },
      });

    return res?.data;
  };

export const addToArchive = (data, token) => async (dispatch) => {
  const res = await axios.post(BASE_URL, data, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.POST_ARCHIVE,
      payload: { archive: res?.data.archive },
    });

  return res?.data;
};

export const deleteFromArchive = (id, token) => async (dispatch) => {
  const res = await axios.delete(BASE_URL + id, {
    headers: { 'x-auth-token': token },
  });

  if (res?.data?.success)
    dispatch({
      type: ACTIONS.DELETE_ARCHIVE,
      payload: { archive: res?.data.archive },
    });

  return res?.data;
};
