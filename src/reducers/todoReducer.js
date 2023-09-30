import * as ACTIONS from '../actions/types';

const initialState = {
  todo: '',
  todos: [],
};

export const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_TODO_ITEMS:
      return {
        ...state,
        todos: action.payload.todos,
      };
    case ACTIONS.GET_TODO_ITEM:
      return {
        ...state,
        todo: action.payload.todo,
      };
    case ACTIONS.CREATE_TODO_ITEM:
      return { ...state, todos: state.todos.concat(action.payload.todo) };
    case ACTIONS.UPDATE_TODO_ITEM:
      return {
        ...state,
        todo: action.payload.todo,
        todos: state.todos.map((todo) =>
          todo._id === action.payload.todo._id ? action.payload.todo : todo,
        ),
      };
    case ACTIONS.DELETE_TODO_ITEM:
      return {
        ...state,
        todos: state.todos.filter(
          (todo) => todo._id !== action.payload.todo._id,
        ),
      };
    default:
      return state;
  }
};
