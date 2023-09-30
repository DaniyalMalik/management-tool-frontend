import * as ACTIONS from '../types';

export const openSnackbar = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.OPEN_SNACKBAR,
      payload: { data },
    });
  } catch (error) {
    console.log(error);
  }
};

export const closeSnackbar = () => async (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.CLOSE_SNACKBAR,
    });
  } catch (error) {
    console.log(error);
  }
};
