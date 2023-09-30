import * as ACTIONS from '../actions/types';

const initialState = {
  openLoader: false,
};

export const loaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.OPEN_LOADER:
      return {
        ...state,
        openLoader: action.payload.data.open,
      };
    case ACTIONS.CLOSE_LOADER:
      return {
        ...state,
        openLoader: false,
      };
    default:
      return state;
  }
};
