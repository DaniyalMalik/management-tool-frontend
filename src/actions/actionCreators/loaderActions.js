import * as ACTIONS from '../types';

export const openLoader = (data) => async (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.OPEN_LOADER,
      payload: { data },
    });
  } catch (error) {
    console.log(error);
  }
};

export const closeLoader = () => async (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.CLOSE_LOADER,
    });
  } catch (error) {
    console.log(error);
  }
};
