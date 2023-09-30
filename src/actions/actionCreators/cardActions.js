import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/cards/';

export const createNewCard = (params, token) => (dispatch) => {
  dispatch({ type: ACTIONS.POST_REQUEST_CARD });
  axios
    .post(BASE_URL, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({ type: ACTIONS.ADD_CARD, payload: { card: res?.data } });
    })
    .catch((e) => {
      if (e.message === 'Network Error')
        dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } });
      else if (e.response.status === 422)
        dispatch({ type: ACTIONS.VALIDATION_ERROR_CARD });
    });
};

export const removeCardAccess = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'removeAccess/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } });
  }
};

export const updateCardByIdPatch = (id, params, token) => (dispatch) => {
  axios
    .patch(BASE_URL + id, params, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.UPDATE_CARD_PATCH,
        payload: { card: res?.data },
      });
    })
    .catch((e) => {
      dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } });
    });
};

export const bulkUpdateCard = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'bulkUpdate/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const bulkRemoveCard = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'bulkRemove/' + id, params, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_LIST, payload: { error: e } });
  }
};

export const updateCardByIdPut = (id, params, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, params, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({ type: ACTIONS.UPDATE_CARD_PUT, payload: { card: res?.data } });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } });
  }
};

export const deleteCardById = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.DELETE_CARD,
      payload: { card: res?.data?.card },
    });

    return res?.data;
  } catch (e) {
    dispatch({ type: ACTIONS.ERROR_CARD, payload: { error: e.message } });
  }
};
