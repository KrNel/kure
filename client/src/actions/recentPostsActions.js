import axios from 'axios';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const SELECT_SECTION = 'SELECT_SECTION';
export const INVALIDATE_SECTION = 'INVALIDATE_SECTION';

/**
 *  Action creator for selecting recent activity.
 *
 *  @param {string} section - Section selected
 *  @returns {object} - The action data
 */
export const selectSection = section => ({
  type: SELECT_SECTION,
  section
});

/**
 *  Action creator to invalidate the data for recent activity, forcing an update
 *
 *  @param {string} section - Section selected
 *  @returns {object} - The action data
 */
export const invalidateSection = section => ({
  type: INVALIDATE_SECTION,
  section
});

/**
 *  Action creator to request recent post activity.
 *
 *  @param {string} section - Section selected
 *  @returns {object} - The action data
 */
export const requestPosts = section => ({
  type: REQUEST_POSTS,
  section
});

/**
 *  Action creator to receive recent post activity.
 *
 *  @param {string} section - Section selected
 *  @param {object} data - Data returned from database
 *  @returns {object} - The action data
 */
export const receivePosts = (section, data) => ({
  type: RECEIVE_POSTS,
  section,
  posts: data.posts.map(post => post),
  receivedAt: Date.now()
});

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {string} section - Section selected
 *  @param {function} dispatch - Redux dispatch function
 *  @returns {function} - Dispatches returned action object
 */
const fetchPosts = section => dispatch => {
  dispatch(requestPosts(section))
  return axios.get('/api/recentposts')
    .then(data => {
      dispatch(receivePosts(section, data.data));
    });
}

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {object} state - Redux state
 *  @param {string} section - Section selected
 *  @returns {bool} - Determines if a fetch should be done
 */
const shouldFetchPosts = (state, section) => {
  const posts = state.recentActivity[section];
  if (!posts) {
    return true;
  }
  if (posts.isFetching) {
    return false;
  }
  return posts.didInvalidate;
}

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {function} dispatch - Redux dispatch function
 *  @param {function} getState - Redux funtion to get the store state
 *  @returns {function} - Dispatches returned action object
 */
export const fetchPostsIfNeeded = section => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), section)) {
    return dispatch(fetchPosts(section));
  }
}