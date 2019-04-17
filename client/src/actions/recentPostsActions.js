import { getRecentActivity } from '../utils/fetchFunctions';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SECTION = 'SELECT_SECTION';
export const INVALIDATE_SECTION = 'INVALIDATE_SECTION';

/**
 *  Action creator for selecting recent activity.
 *
 *  @param {string} section Section selected
 *  @returns {object} The action data
 */
export const selectSection = section => ({
  type: SELECT_SECTION,
  section
});

/**
 *  Action creator to invalidate the data for recent activity, forcing an update
 *
 *  @param {string} section Section selected
 *  @returns {object} The action data
 */
export const invalidateSection = section => ({
  type: INVALIDATE_SECTION,
  section
});

/**
 *  Action creator to request recent post activity.
 *
 *  @param {string} section Section selected
 *  @returns {object} The action data
 */
export const requestPosts = section => ({
  type: REQUEST_POSTS,
  section
});

/**
 *  Action creator to receive recent post activity.
 *
 *  @param {string} section Section selected
 *  @param {object} data Data returned from database
 *  @returns {object} The action data
 */
export const receivePosts = (section, data, hasMore) => ({
  type: RECEIVE_POSTS,
  section,
  posts: data.posts,
  groups: data.groups,
  myComms: data.myComms,
  mySubs: data.mySubs,
  receivedAt: Date.now(),
  hasMore,
});

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {string} section Section selected
 *  @param {function} dispatch Redux dispatch function
 *  @returns {function} Dispatches returned action object
 */
export const fetchPosts = (section, user, limit, nextId) => dispatch => {
  dispatch(requestPosts(section));

  let hasMore = true;

  return getRecentActivity(user, limit, nextId)
    .then(data => {
      if (data.data.posts.length < limit)
        hasMore = false;
      dispatch(receivePosts(section, data.data, hasMore));
    });
}
