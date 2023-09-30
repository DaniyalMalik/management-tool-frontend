import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/company/';

export const getCompany = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_COMPANY,
        payload: { company: res?.data.company },
      });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const checkCompanyOwner =
  (companyId, companyOwner, token) => async (dispatch) => {
    try {
      const res = await axios.get(
        BASE_URL + `/checkOwner/${companyId}?companyOwner=${companyOwner}`,
        {
          headers: { 'x-auth-token': token },
        },
      );

      return res?.data;
    } catch (e) {
      console.log(e);
    }
  };

export const getCompaniesByOwner =
  (companyOwner, token) => async (dispatch) => {
    try {
      const res = await axios.get(
        BASE_URL + `companyowner?companyOwner=${companyOwner}`,
        {
          headers: { 'x-auth-token': token },
        },
      );

      if (res?.data?.success)
        dispatch({
          type: ACTIONS.GET_COMPANIES_BY_OWNER,
          payload: { companies: res?.data.companies },
        });

      return res?.data;
    } catch (e) {
      console.log(e);
    }
  };

export const createCompany = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.CREATE_COMPANY,
        payload: { company: res?.data.company },
      });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const getCompanies = (token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.GET_COMPANIES,
        payload: { companies: res?.data.companies },
      });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const deleteCompany = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.DELETE_COMPANY,
        payload: { company: res?.data.company },
      });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};

export const updateCompany = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.put(BASE_URL + id, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({
        type: ACTIONS.UPDATE_COMPANY,
        payload: { company: res?.data.company },
      });

    return res?.data;
  } catch (e) {
    console.log(e);
  }
};
