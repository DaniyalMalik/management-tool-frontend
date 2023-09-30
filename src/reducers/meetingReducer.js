import * as ACTIONS from '../actions/types'

const initialState = {
  meeting: '',
  meetings: [],
}

export const meetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_MEETINGS:
      return {
        ...state,
        meetings: action.payload.meetings,
      }
    case ACTIONS.GET_SINGLE_MEETING:
      return {
        ...state,
        meeting: action.payload.meeting,
      }
    case ACTIONS.POST_MEETING:
      return { ...state, meeting: action.payload.meeting }
    case ACTIONS.UPDATE_MEETING:
      return {
        ...state,
        meeting: action.payload.meeting,
        meetings: state.meetings.map((meeting) =>
          meeting._id === action.payload.meeting._id
            ? action.payload.meeting
            : meeting,
        ),
      }
    case ACTIONS.DELETE_MEETING:
      return {
        ...state,
        meetings: state.meetings.filter(
          (meeting) => meeting._id !== action.payload.meeting._id,
        ),
      }
    default:
      return state
  }
}
