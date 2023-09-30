import * as ACTIONS from '../actions/types'

const initialState = {
  notifications: [],
}

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications,
      }
    case ACTIONS.PUT_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification._id === action.payload.notification._id
            ? action.payload.notification
            : notification,
        ),
      }
    case ACTIONS.POST_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.concat(action.payload.notification),
      }
    case ACTIONS.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) =>
            notification._id !== action.payload.notification._id,
        ),
      }
    default:
      return state
  }
}
