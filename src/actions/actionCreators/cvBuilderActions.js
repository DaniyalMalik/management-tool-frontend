import * as ACTIONS from '../types'

export const cvImportData = (data) => (dispatch) => {
  try {
    dispatch({ type: ACTIONS.IMPORT_DATA, payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const cvOnInput = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.ON_INPUT,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvSaveData = () => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.SAVE_DATA,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvMigrateSection = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.MIGRATE_SECTION,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvAddItem = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.ADD_ITEM,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvDeleteItem = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.DELETE_ITEM,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvMoveItemUp = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.MOVE_ITEM_UP,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvMoveItemDown = (data) => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.MOVE_ITEM_DOWN,
      payload: data,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvLoadDemoData = () => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.LOAD_DEMO_DATA,
    })
  } catch (error) {
    console.log(error)
  }
}

export const cvReset = () => (dispatch) => {
  try {
    dispatch({
      type: ACTIONS.RESET,
    })
  } catch (error) {
    console.log(error)
  }
}
