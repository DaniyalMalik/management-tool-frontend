import * as ACTIONS from '../actions/types'

const initialState = {
  comments: [],
  recentComment: '',
}

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_COMMENTS:
      return {
        ...state,
        comments: action.payload.comments,
      }
    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        recentComment: action.payload.comment,
      }
    default:
      return state
  }
}
