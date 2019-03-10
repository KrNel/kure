import { combineReducers } from 'redux';

import { recentActivity, selected } from './recentPostsReducer';
import { auth } from './authReducer';
import { steemContent } from './steemContentReducer';
import { upvotePost } from './upvoteReducer';

/**
 *  Combine imported reducers for the application.
 */
const rootReducer = combineReducers({
  recentActivity,
  selected,
  auth,
  steemContent,
  upvotePost,
});

export default rootReducer;
