import * as ACTIONS from '../actions/types'

const initialState = {
  companies: [],
  company: {},
}

export const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_COMPANIES:
      return {
        ...state,
        companies: action.payload.companies,
      }
    case ACTIONS.GET_COMPANIES_BY_OWNER:
      return {
        ...state,
        companies: action.payload.companies,
      }
    case ACTIONS.GET_COMPANY:
      return {
        ...state,
        company: action.payload.company,
      }
    case ACTIONS.CREATE_COMPANY:
      return {
        ...state,
        companies: state.companies.concat(action.payload.company),
      }
    case ACTIONS.DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          (company) => action.payload.company._id != company._id,
        ),
      }
    case ACTIONS.UPDATE_COMPANY:
      return {
        ...state,
        companies: state.companies.map((company) =>
          company._id === action.payload.company._id
            ? action.payload.company
            : company,
        ),
      }
    default:
      return state
  }
}
