import { combineReducers } from 'redux';

import { recentActivity, selected } from './recentPostsReducer';
import { auth } from './authReducer';

const rootReducer = combineReducers({
  recentActivity,
  selected,
  auth
});

export default rootReducer;
