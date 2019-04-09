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
});

export default rootReducer;
