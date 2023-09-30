import * as ACTIONS from '../types';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/notifications/';

export const getNotifications =
  (companyId, userId, token) => async (dispatch) => {
    try {
      const res = await axios.get(
        BASE_URL + `?companyId=${companyId}&userId=${userId}`,
        {
          headers: { 'x-auth-token': token },
        },
      );

      if (res?.data?.success)
        dispatch({
          type: ACTIONS.GET_NOTIFICATIONS,
          payload: { notifications: res?.data?.notifications },
        });

      return res?.data;
    } catch (error) {
      console.log(error);
    }
  };

export const postNotification = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.POST_NOTIFICATION,
        payload: { notification: res?.data?.notification },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateNotification = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.PUT_NOTIFICATION,
        payload: { notification: res?.data?.notification },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteNotification = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.DELETE_NOTIFICATION,
        payload: { notification: res?.data?.notification },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};
