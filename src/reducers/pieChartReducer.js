import * as ACTIONS from '../actions/types';

const initialState = {
  pieCharts: [],
  pieChart: {},
};

export const pieChartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_PIE_CHART:
      return {
        ...state,
        pieChart: action.payload.pieChartData,
      };
    case ACTIONS.CREATE_PIE_CHART:
      return {
        ...state,
        pieCharts: state.pieCharts.concat(action.payload.pieChartData),
      };
    case ACTIONS.DELETE_PIE_CHART:
      return {
        ...state,
        pieCharts: state.pieCharts.filter(
          (pieChart) =>
            state.pieCharts[action.payload.pieChartData] != pieChart,
        ),
      };
    case ACTIONS.UPDATE_PIE_CHART:
      return {
        ...state,
        pieCharts: state.pieCharts.filter(
          (pieChart) =>
            state.pieCharts[action.payload.pieChartData] != pieChart,
        ),
      };
    default:
      return state;
  }
};
