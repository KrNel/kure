import { combineReducers } from 'redux';

import { recentActivity, selected } from './recentPostsReducer';
import { auth } from './authReducer';

/**
 *  Combine imported reducers for the application.
 */
const rootReducer = combineReducers({
  recentActivity,
  selected,
  auth
});

export default rootReducer;
