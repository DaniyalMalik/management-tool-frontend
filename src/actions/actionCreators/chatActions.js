import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/messages/';

export const getGroupConversations = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + 'group/query/?participantId=' + id, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.GET_GROUP_CONVERSATIONS,
      payload: { groups: res?.data.groups },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateGroup = (id, token) => async (dispatch) => {
  try {
    const res = await axios.put(
      BASE_URL + 'group/' + id,
      { read: true, newMessagesCount: 0 },
      {
        headers: { 'x-auth-token': token },
      },
    );

    dispatch({
      type: ACTIONS.UPDATE_GROUP_CONVERSATION,
      payload: { group: res?.data.group },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const createGroup = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL + 'group/', data, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.POST_GROUP,
      payload: { group: res?.data.group },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const postGroupMessage =
  (groupId, data, reset, token) => async (dispatch) => {
    try {
      const res = await axios.post(
        BASE_URL + 'group/query?groupId=' + groupId + '&reset=' + reset,
        data,
        {
          headers: { 'x-auth-token': token },
        },
      );

      dispatch({
        type: ACTIONS.POST_GROUP_MESSAGE,
        payload: { message: res?.data.groupMessage },
      });

      return res?.data;
    } catch (error) {
      console.log(error);
    }
  };

export const getGroupMessages = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + 'group/messages/' + id, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.GET_GROUP_MESSAGES,
      payload: { messages: res?.data.groupMessages },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getConversations = (recipientId, token) => async (dispatch) => {
  try {
    const res = await axios.get(
      BASE_URL + 'conversations?recipientId=' + recipientId,
      {
        headers: { 'x-auth-token': token },
      },
    );

    dispatch({
      type: ACTIONS.GET_CONVERSATIONS,
      payload: { conversations: res?.data.conversations },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateConversation = (id, token) => async (dispatch) => {
  try {
    const res = await axios.put(
      BASE_URL + 'conversations/' + id,
      { read: true, newMessagesCount: 0 },
      {
        headers: { 'x-auth-token': token },
      },
    );

    dispatch({
      type: ACTIONS.UPDATE_CONVERSATION,
      payload: { conversation: res?.data.conversation },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const postConversationMessage = async (convoId, reset, data, token) => {
  try {
    const res = await axios.post(
      BASE_URL + '?convoId=' + convoId + '&reset=' + reset,
      data,
      {
        headers: { 'x-auth-token': token },
      },
    );

    // dispatch({
    //   type: ACTIONS.POST_MESSAGE,
    //   payload: { message: res?.data.message },
    // });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getConversationMessages = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + 'conversations/query?userId=' + id, {
      headers: { 'x-auth-token': token },
    });

    dispatch({
      type: ACTIONS.GET_MESSAGES,
      payload: { messages: res?.data },
    });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};
