import { combineReducers } from 'redux';

import { recentActivity, selected } from './recentPostsReducer';
import { auth } from './authReducer';
import { summaryPost } from './summaryPostReducer';
import { userGroups } from './userGroupsReducer';
import { detailsPost } from './detailsPostReducer';
import { addPost } from './addPostReducer';
import { comments } from './commentsReducer';
import { upvote } from './upvoteReducer';
import { sendComment } from './sendCommentReducer';
import { sendPost } from './sendPostReducer';
import { kurated } from './kuratedReducer';
import { communities } from './communitiesReducer';
import { resteem } from './resteemReducer';
import { settings } from './settingsReducer';
import { follow } from './followReducer';

/**
 *  Combine imported reducers for the application.
 */
const rootReducer = combineReducers({
  recentActivity,
  selected,
  auth,
  summaryPost,
  userGroups,
  detailsPost,
  addPost,
  comments,
  upvote,
  sendComment,
  sendPost,
  kurated,
  communities,
  resteem,
  settings,
  follow,
});

export default rootReducer;
