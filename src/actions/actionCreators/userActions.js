import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/user/';

export const fetchUserInfo = (token) => async (dispatch) => {
  try {
    dispatch({ type: ACTIONS.USER_REQUEST });

    const res = await axios.get(BASE_URL, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_USER,
        payload: { user: res?.data?.user, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const getVerifyEmailToken = async (data, token) => {
  try {
    const res = await axios.post(BASE_URL + 'getverifyemailtoken', data, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const verifyEmailToken = async (verifyToken, token) => {
  try {
    // console.log(verifyToken, token, 'verifyToken token');
    const res = await axios.put(BASE_URL + 'verifyemailtoken/' + verifyToken, {
      headers: { 'x-auth-token': token },
    });
    // console.log(res?.data, 'res?.data');

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const getSingleUser = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_SINGLE_USER,
        payload: { user: res?.data?.user, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const checkTokenValidity = (token) => (dispatch) => {
  dispatch({ type: ACTIONS.TOKEN_REQUEST });
  axios
    .post(`${BASE_URL}tokenIsValid`, null, {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.TOKEN_RESPONSE,
        payload: { isTokenValid: res?.data, token },
      });
    })
    .catch((e) => {
      console.log(e);

      dispatch({
        type: ACTIONS.TOKEN_RESPONSE_ERROR,
        payload: { error: e.message },
      });
    });
};

export const loginUser = (params) => async (dispatch) => {
  try {
    dispatch({ type: ACTIONS.LOGIN_REQUEST });

    const res = await axios.post(`${BASE_URL}login`, params);

    if (res?.data?.success) {
      dispatch({
        type: ACTIONS.LOGIN_SUCCESS,
        payload: { user: res?.data?.user, token: res?.data?.token },
      });
    }

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const registerUser = (params) => async (dispatch) => {
  try {
    dispatch({ type: ACTIONS.REGISTER_REQUEST });

    const res = await axios.post(`${BASE_URL}register`, params);

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.REGISTER_SUCCESS,
        payload: { user: res?.data?.user },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({
      type: ACTIONS.REGISTER_FAILED,
      payload: { error: e.response.data.msg },
    });
  }
};

export const addUser = (params) => async (dispatch) => {
  try {
    const res = await axios.post(`${BASE_URL}register`, params);

    if (res?.data?.success) {
      dispatch({
        type: ACTIONS.ADD_USER,
        payload: { user: res?.data?.user },
      });
    }

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch({ type: ACTIONS.LOGOUT_USER });
};

export const getAllUsers = (token) => (dispatch) => {
  axios
    .get(BASE_URL + 'users', {
      headers: { 'x-auth-token': token },
    })
    .then((res) => {
      dispatch({
        type: ACTIONS.GET_USERS,
        payload: { users: res?.data?.users, token },
      });
    })
    .catch((e) => {
      console.log(e);

      dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
    });
};

export const getAllUsersByEmployId = (employId, token) => async (dispatch) => {
  try {
    const res = await axios.get(
      BASE_URL + `getbyemployid?employId=${employId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_USERS_BY_EMPLOY_ID,
        payload: { users: res?.data?.users, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const getcompanyuserscount = (employId, token) => async (dispatch) => {
  try {
    const res = await axios.get(
      BASE_URL + `getcompanyuserscount?employId=${employId}`,
      {
        headers: { 'x-auth-token': token },
      },
    );

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_USERS_COUNT,
        payload: { usersCount: res?.data?.usersCount },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const deleteUser = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.DELETE_USER,
        payload: { user: res?.data?.user, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const updateUser = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_USER,
        payload: { user: res?.data?.user, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const updateLoggedInUser = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_LOGGEDIN_USER,
        payload: { user: res?.data, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const updateUserPassword = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + 'updatepassword/' + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_USER_PASSWORD,
        payload: { user: res?.data?.user, token },
      });

    return res?.data;
  } catch (e) {
    console.log(e);

    dispatch({ type: ACTIONS.ERROR_USER, payload: { error: e.message } });
  }
};

export const forgotPasswordAction = (data) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL + 'forgotpassword', data);

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const resetPasswordAction =
  (data, forgotPasswordToken) => async (dispatch) => {
    try {
      const res = await axios.put(
        BASE_URL + 'resetpassword/' + forgotPasswordToken,
        data,
      );

      return res?.data;
    } catch (error) {
      console.log(error);
    }
  };
