import axios from 'axios';
import * as ACTIONS from '../types';

const BASE_URL = process.env.REACT_APP_BASE_URL_BACKEND + 'api/pieChart/';

// export const createPieChart = (data, token) => async (dispatch) => {
//   try {
//     const res = await axios.post(BASE_URL, data, {
//       headers: { 'x-auth-token': token },
//     })

// if (res?.data?.success)
//     dispatch({ type: ACTIONS.CREATE_PIE_CHART, payload: res?.data })

//     return res?.data
//   } catch (error) {
//     console.log(error)
//   }
// }

export const updatePieChart = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.post(BASE_URL + `?cardId=${id}`, data, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({ type: ACTIONS.UPDATE_PIE_CHART, payload: res?.data });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePieChart = (id, token) => async (dispatch) => {
  try {
    const res = await axios.delete(BASE_URL, id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({ type: ACTIONS.DELETE_PIE_CHART, payload: res?.data });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPieChart = (id, token) => async (dispatch) => {
  try {
    const res = await axios.get(BASE_URL + id, {
      headers: { 'x-auth-token': token },
    });

    if (res?.data?.success)
      dispatch({ type: ACTIONS.GET_PIE_CHART, payload: res?.data });
    else
      dispatch({
        type: ACTIONS.GET_PIE_CHART,
        payload: { pieChartData: null },
      });

    return res?.data;
  } catch (error) {
    console.log(error);
  }
};
