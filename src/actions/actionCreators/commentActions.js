import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/comments/';

export const addComment = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.ADD_COMMENT,
        payload: { comment: res?.data.comment },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getComments = (cardId, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + `?cardId=${cardId}`, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_COMMENTS,
        payload: { comments: res?.data.comments },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};
