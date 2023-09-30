import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/file/';

export const uploadProfilePicture = async (formData, token) => {
  try {
    const res = await axios.post(BASE_URL + 'uploadprofilepicture', formData, {
      headers: { 'x-auth-token': token, 'content-type': 'multipart/form-data' },
    });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadGroupProfilePicture = async (groupId, formData, token) => {
  try {
    const res = await axios.post(
      BASE_URL + 'uploadgroupprofilepicture/?groupId=' + groupId,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadCardAttachment = async (id, boardId, formData, token) => {
  try {
    const res = await axios.post(
      BASE_URL + 'uploadcardattachment/?cardId=' + id + '&boardId=' + boardId,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadSubmissionAttachment = async (taskId, formData, token) => {
  try {
    const res = await axios.post(
      BASE_URL + 'uploadtasksubmissionattachment/?taskId=' + taskId,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadTaskAttachment = async (taskId, formData, token) => {
  try {
    const res = await axios.post(
      BASE_URL + 'uploadtaskattachment/?taskId=' + taskId,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadTodoAttachment = async (todoId, formData, token) => {
  try {
    const res = await axios.post(
      BASE_URL + 'uploadtodolistattachment/?todoId=' + todoId,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const removeCardAttachment = async (id, url, type, token) => {
  try {
    const res = await axios.delete(
      BASE_URL + 'removecardattachment/' + id + `?url=${url}&type=${type}`,
      {
        headers: { 'x-auth-token': token },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteArchivedAttachment = (url, cardId, token) => {
  try {
    axios.delete(
      BASE_URL + 'deletearchivedattachment/' + `?url=${url}&cardId=${cardId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const deleteCardAttachment = (type, cardId, boardId, token) => {
  try {
    axios.delete(
      BASE_URL +
        'deletecardattachment/' +
        `?type=${type}&cardId=${cardId}&boardId=${boardId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const deleteCompanyAttachment = (companyId, token) => {
  try {
    axios.delete(
      BASE_URL + 'deletecompanyattachment/' + `?companyId=${companyId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const deleteBoardAttachment = (boardId, token) => {
  try {
    axios.delete(BASE_URL + 'deleteboardattachment/' + `?boardId=${boardId}`, {
      headers: { 'x-auth-token': token },
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteTodoAttachment = (todoId, token) => {
  try {
    axios.delete(BASE_URL + 'deletetodoattachment/' + `?todoId=${todoId}`, {
      headers: { 'x-auth-token': token },
    });
  } catch (e) {
    console.log(e);
  }
};

export const deleteTaskAttachment = (taskId, boardId, cardId, token) => {
  try {
    axios.delete(
      BASE_URL +
        'deletetaskattachment/' +
        `?taskId=${taskId}&boardId=${boardId}&cardId=${cardId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const deleteUserAttachment = (userId, companyId, token) => {
  try {
    axios.delete(
      BASE_URL +
        'deleteuserattachment/' +
        `?userId=${userId}&companyId=${companyId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );
  } catch (e) {
    console.log(e);
  }
};

export const uploadBoardAttachment = async (id, formData, token) => {
  try {
    const res = await axios.put(
      BASE_URL + 'uploadboardpicture/' + id,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
      },
    );

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const uploadMessageAttachment = async (
  formData,
  convoId,
  reset,
  to,
  body,
  from,
  fileType,
  type,
  token,
) => {
  try {
    const res = await axios.post(
      BASE_URL +
        'uploadchatattachment/?convoId=' +
        convoId +
        '&reset=' +
        reset +
        '&type=' +
        type +
        '&fileType=' +
        fileType +
        '&to=' +
        to +
        '&body=' +
        body +
        '&from=' +
        from,
      formData,
      {
        headers: {
          'x-auth-token': token,
          'content-type': 'multipart/form-data',
        },
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

export const sendGroupAttachment =
  (formData, groupId, from, body, reset, fileType, type, token) =>
  async (dispatch) => {
    try {
      const res = await axios.post(
        BASE_URL +
          'uploadchatattachment/?convoId=' +
          groupId +
          '&reset=' +
          reset +
          '&type=' +
          type +
          '&fileType=' +
          fileType +
          '&from=' +
          from +
          '&body=' +
          body,
        formData,
        {
          headers: {
            'x-auth-token': token,
            'content-type': 'multipart/form-data',
          },
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
