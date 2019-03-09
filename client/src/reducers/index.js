import { combineReducers } from 'redux';

import { recentActivity, selected } from './recentPostsReducer';
import { auth } from './authReducer';
import { steemContent } from './steemContentReducer';

/**
 *  Combine imported reducers for the application.
 */
const rootReducer = combineReducers({
  recentActivity,
  selected,
  auth,
  steemContent,
});

export default rootReducer;
