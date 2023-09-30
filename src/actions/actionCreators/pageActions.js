import * as ACTIONS from '../types'

export const changePageRef = (value) => (dispatch) => {
  try {
    dispatch({ type: ACTIONS.SET_PAGE_REF, payload: value })
  } catch (error) {
    console.log(error)
  }
}

export const changePanZoomRef = (value) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.SET_PAN_ZOOM_REF,
      payload: value,
    })
  } catch (error) {
    console.log(error)
  }
}

export const changePrintDialogOpen = (value) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.SET_PRINT_DIALOG_OPEN,
      payload: value,
    })
  } catch (error) {
    console.log(error)
  }
}
