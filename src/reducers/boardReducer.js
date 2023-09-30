import * as ACTIONS from '../actions/types';

const initialState = {
  loading: true,
  boards: [],
  currBoard: {},
  boardsCount: 0,
};

export const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST_BOARD:
      return { ...state, loading: true, newBoard: undefined };
    case ACTIONS.GET_BOARDS:
      return {
        ...state,
        loading: false,
        boards: action.payload.boards,
        newBoard: undefined,
      };
    case ACTIONS.GET_BOARDS_COUNT:
      return {
        ...state,
        boardsCount: action.payload.boardsCount,
      };
    case ACTIONS.GET_BOARD_BY_ID:
      return {
        ...state,
        loading: false,
        currBoard: action.payload.currBoard,
        newBoard: undefined,
      };
    case ACTIONS.ERROR_BOARD:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        boards: [],
        newBoard: undefined,
      };
    case ACTIONS.ADD_BOARD:
      return {
        ...state,
        loading: false,
        boards: [...state.boards, action.payload.board],
        newBoard: action.payload.board,
      };
    case ACTIONS.UPDATE_BOARD_PATCH: {
      const boardsCopy = [...state.boards];
      const targetIndex = boardsCopy.findIndex(
        (board) => board._id === action.payload.board._id,
      );
      boardsCopy[targetIndex] = action.payload.board;
      return {
        ...state,
        boards: boardsCopy,
        currBoard: action.payload.board,
        loading: false,
        newBoard: undefined,
      };
    }
    case ACTIONS.DELETE_BOARD: {
      return {
        ...state,
        boards: state.boards.filter(
          (board) => board._id !== action.payload.board._id,
        ),
        loading: false,
        newBoard: undefined,
      };
    }
    default:
      return state;
  }
};
