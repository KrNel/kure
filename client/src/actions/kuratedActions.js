import { getPosts } from '../utils/fetchFunctions';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';

/**
 *  Action creator to request recent post activity.
 *
 *  @param {string} section Section selected
 *  @returns {object} The action data
 */
export const requestPosts = () => ({
  type: REQUEST_POSTS,
});

/**
 *  Action creator to receive recent post activity.
 *
 *  @param {string} posts Data returned from database
 *  @param {object} hasMore If there are more posts to grab
 *  @returns {object} The action data
 */
export const receivePosts = (posts, hasMore) => ({
  type: RECEIVE_POSTS,
  posts,
  hasMore,
});

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {string} limit Limit of posts to return
 *  @param {function} nextId The next Id to use for querying posts
 *  @returns {function} Dispatches returned action object
 */
export const fetchPosts = (limit, nextId) => dispatch => {
  dispatch(requestPosts());

  let hasMore = true;

  return getPosts(limit, nextId)
    .then(data => {
      if (data.data.posts.length < limit)
        hasMore = false;
      dispatch(receivePosts(data.data.posts, hasMore));
    });
}
