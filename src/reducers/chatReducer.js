import * as ACTIONS from '../actions/types';

const initialState = {
  groupMessages: [],
  messages: [],
  groups: [],
  conversations: [],
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.GET_GROUP_CONVERSATIONS:
      return {
        ...state,
        groups: action.payload.groups,
      };
    case ACTIONS.UPDATE_GROUP_CONVERSATION:
      return {
        ...state,
        groups: state.groups.map((group) =>
          group._id === action.payload.group._id ? action.payload.group : group,
        ),
      };
    case ACTIONS.POST_GROUP:
      return {
        ...state,
        groups: state.groups.concat(action.payload.group),
      };
    case ACTIONS.POST_GROUP_MESSAGE:
      return {
        ...state,
        groupMessages: state.groupMessages.concat(action.payload.message),
      };
    case ACTIONS.GET_GROUP_MESSAGES:
      return {
        ...state,
        messages: [],
        groupMessages: action.payload.messages,
      };
    case ACTIONS.GET_CONVERSATIONS:
      return {
        ...state,
        conversations: action.payload.conversations,
      };
    case ACTIONS.UPDATE_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation._id === action.payload.conversation._id
            ? action.payload.conversation
            : conversation,
        ),
      };
    case ACTIONS.POST_MESSAGE:
      return {
        ...state,
        messages: state.messages.concat(action.payload.message),
      };
    case ACTIONS.GET_MESSAGES:
      return {
        ...state,
        groupMessages: [],
        messages: action.payload.messages,
      };
    default:
      return state;
  }
};
