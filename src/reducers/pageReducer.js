import * as ACTIONS from '../actions/types'

const initialState = {
  pageRef: null,
  panZoomRef: null,
  isPrintDialogOpen: null,
}

export const pageReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.SET_PAGE_REF:
      return {
        ...state,
        pageRef: action.payload.value,
      }
    case ACTIONS.SET_PAN_ZOOM_REF:
      return {
        ...state,
        panZoomRef: action.payload.value,
      }
    case ACTIONS.SET_PRINT_DIALOG_OPEN:
      return { ...state, isPrintDialogOpen: action.payload.value }
    default:
      return state
  }
}
