import * as ACTIONS from '../actions/types';

const initialState = {
  token: undefined,
  usersCount: 0,
  user: {},
  users: [],
  companyUsers: [],
  isValid: false,
  successLogin: false,
  requestLogin: true,
  successRegister: false,
  requestRegister: true,
  userRequest: true,
  tokenRequest: true,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.TOKEN_REQUEST:
      return { ...state, tokenRequest: true };
    case ACTIONS.TOKEN_RESPONSE:
      return {
        ...state,
        isValid: action.payload.isTokenValid,
        token: action.payload.token,
        tokenRequest: false,
      };
    case ACTIONS.ADD_USER:
      return {
        ...state,
        companyUsers: state.companyUsers.concat(action.payload.user),
      };
    case ACTIONS.USER_REQUEST:
      return { ...state, userRequest: true };
    case ACTIONS.GET_USERS:
      return {
        ...state,
        token: action.payload.token,
        users: action.payload.users,
      };
    case ACTIONS.GET_USERS_BY_EMPLOY_ID:
      return {
        ...state,
        token: action.payload.token,
        companyUsers: action.payload.users,
      };
    case ACTIONS.GET_USERS_COUNT:
      return {
        ...state,
        usersCount: action.payload.usersCount,
      };
    case ACTIONS.GET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        userRequest: false,
      };
    case ACTIONS.GET_SINGLE_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case ACTIONS.LOGIN_REQUEST:
      return { ...state, requestLogin: true, successLogin: false };
    case ACTIONS.REGISTER_REQUEST:
      return { ...state, requestRegister: true, successRegister: false };
    case ACTIONS.LOGIN_FAILED:
      return {
        ...state,
        successLogin: false,
        requestLogin: false,
        loginError: action.payload.error,
      };
    case ACTIONS.REGISTER_FAILED:
      return {
        ...state,
        successRegister: false,
        requestRegister: false,
        registerError: action.payload.error,
      };
    case ACTIONS.DELETE_USER:
      return {
        ...state,
        token: action.payload.token,
        users: state.users.filter(
          (user) => user._id !== action.payload.user._id,
        ),
        companyUsers: state.companyUsers.filter(
          (companyUser) => companyUser._id !== action.payload.user._id,
        ),
      };
    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        companyUsers: state.companyUsers.map((user) =>
          user._id === action.payload.user._id ? action.payload.user : user,
        ),
      };
    case ACTIONS.UPDATE_LOGGEDIN_USER:
      return {
        ...state,
        user: action.payload.user.user,
      };
    case ACTIONS.UPDATE_USER_PASSWORD:
      return {
        ...state,
        token: action.payload.token,
      };
    case ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        requestLogin: false,
        successLogin: true,
        isValid: true,
      };
    case ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        requestRegister: false,
        successRegister: true,
      };
    case ACTIONS.ERROR_USER:
      return { ...state, error: action.payload.error };
    case ACTIONS.TOKEN_RESPONSE_ERROR:
      return { ...state, tokenError: action.payload.error };
    default:
      return state;
  }
};
