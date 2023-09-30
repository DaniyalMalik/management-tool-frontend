import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/email/';

export const sendVerifyEmail = async (data, token) => {
  try {
    const res = await axios.post(BASE_URL + 'verifyemail', data, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const sendInviteEmail = async (data, token) => {
  try {
    const res = await axios.post(BASE_URL + 'invite', data, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const sendCustomEmail = async (data, token) => {
  try {
    const res = await axios.post(BASE_URL + 'customemail', data, {
      headers: { 'x-auth-token': token },
    });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};
