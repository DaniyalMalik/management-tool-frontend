import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { boardReducer } from '../reducers/boardReducer';
import { listsReducer } from '../reducers/listsReducer';
import { cardReducer } from '../reducers/cardReducer';
import { taskReducer } from '../reducers/taskReducer';
import { activityReducer } from '../reducers/activityReducer';
import { userReducer } from '../reducers/userReducer';
import { notificationReducer } from '../reducers/notificationReducer';
import { cvBuilderReducer } from '../reducers/cvBuilderReducer';
import { pageReducer } from '../reducers/pageReducer';
import { commentReducer } from '../reducers/commentReducer';
import { pieChartReducer } from '../reducers/pieChartReducer';
import { companyReducer } from '../reducers/companyReducer';
import { archiveReducer } from '../reducers/archiveReducer';
import { meetingReducer } from '../reducers/meetingReducer';
import { favouriteReducer } from '../reducers/favouriteReducer';
import { todoReducer } from '../reducers/todoReducer';
import { loaderReducer } from '../reducers/loaderReducer';
import { snackbarReducer } from '../reducers/snackbarReducer';
import { chatReducer } from '../reducers/chatReducer';
import * as ACTIONS from '../actions/types';

const composeEnhancers = composeWithDevTools({});

const appReducer = combineReducers({
  boards: boardReducer,
  lists: listsReducer,
  cards: cardReducer,
  activities: activityReducer,
  user: userReducer,
  tasks: taskReducer,
  notifications: notificationReducer,
  cvBuilder: cvBuilderReducer,
  page: pageReducer,
  pieCharts: pieChartReducer,
  comments: commentReducer,
  companies: companyReducer,
  archives: archiveReducer,
  meetings: meetingReducer,
  favourites: favouriteReducer,
  todos: todoReducer,
  snackbar: snackbarReducer,
  loader: loaderReducer,
  chat: chatReducer,
});

const rootReducer = (state, action) => {
  if (action.type === ACTIONS.LOGOUT_USER) {
    // eslint-disable-next-line no-param-reassign
    state = undefined;
  }
  return appReducer(state, action);
};

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);
