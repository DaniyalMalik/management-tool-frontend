import * as ACTIONS from '../actions/types'

const initialState = {
  archive: '',
  archives: [],
}

export const archiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_ARCHIVES:
      return {
        ...state,
        archives: action.payload.archives,
      }
    case ACTIONS.GET_SINGLE_ARCHIVE:
      return {
        ...state,
        archive: action.payload.archive,
      }
    case ACTIONS.POST_ARCHIVE:
      return { ...state, archive: action.payload.archive }
    case ACTIONS.UPDATE_ARCHIVE:
      return {
        ...state,
        archive: action.payload.archive,
        archives: state.archives.map((archive) =>
          archive._id === action.payload.archive._id
            ? action.payload.archive
            : archive,
        ),
      }
    case ACTIONS.DELETE_ARCHIVE:
      return {
        ...state,
        archives: state.archives.filter(
          (archive) => archive._id !== action.payload.archive._id,
        ),
      }
    default:
      return state
  }
}
