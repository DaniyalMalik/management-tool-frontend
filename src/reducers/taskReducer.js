import * as ACTIONS from '../actions/types';

const initialState = {
  taskLoading: true,
  tasks: [],
};

export const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TASK:
      return { ...state, tasks: state.tasks.concat(action.payload.task) };
    case ACTIONS.MAKE_REQUEST_TASK:
      return { ...state, taskLoading: true };
    case ACTIONS.GET_TASKS:
      return { ...state, taskLoading: false, tasks: action.payload.tasks };
    case ACTIONS.GET_TASK_BY_USER_ID:
      return { ...state, taskLoading: false, tasks: action.payload.tasks };
    case ACTIONS.GET_TASKS_BY_CARD_ID:
      return { ...state, taskLoading: false, tasks: action.payload.tasks };
    case ACTIONS.UPDATE_TASK:
      return {
        tasks: state.tasks.map((task) =>
          task._id === action.payload.task._id ? action.payload.task : task,
        ),
      };
    case ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task._id !== action.payload.task._id,
        ),
      };
    case ACTIONS.ERROR_TASK:
      return { ...state, taskLoading: false, taskError: action.payload.error };
    default:
      return state;
  }
};
