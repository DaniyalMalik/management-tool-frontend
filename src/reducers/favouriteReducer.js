import * as ACTIONS from '../actions/types'

const initialState = {
  favourite: '',
  favourites: [],
}

export const favouriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_MANY_FROM_FAVOURITE:
      return {
        ...state,
        favourites: action.payload.favourites,
      }
    case ACTIONS.GET_SINGLE_FROM_FAVOURITE:
      return {
        ...state,
        favourite: action.payload.favourite,
      }
    case ACTIONS.ADD_TO_FAVOURITE:
      return { ...state, favourite: action.payload.favourite }
    case ACTIONS.REMOVE_FROM_FAVOURITE:
      return {
        ...state,
        favourites: state.favourites.filter(
          (favourite) => favourite._id !== action.payload.favourite._id,
        ),
      }
    default:
      return state
  }
}
