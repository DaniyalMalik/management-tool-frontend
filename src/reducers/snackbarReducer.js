import * as ACTIONS from '../actions/types';

const initialState = {
  openSnackbar: false,
  message: '',
  severity: false,
};

export const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.OPEN_SNACKBAR:
      return {
        ...state,
        openSnackbar: action.payload.data.open,
        message: action.payload.data.message,
        severity: action.payload.data.severity,
      };
    case ACTIONS.CLOSE_SNACKBAR:
      return {
        ...state,
        openSnackbar: false,
        message: '',
        severity: '',
      };
    default:
      return state;
  }
};
