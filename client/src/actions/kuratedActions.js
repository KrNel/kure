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
 *  @param {string} section Section selected
 *  @param {object} data Data returned from database
 *  @returns {object} The action data
 */
export const receivePosts = (posts, hasMore) => ({
  type: RECEIVE_POSTS,
  posts,
  hasMore,
});

export const fetchPosts = (limit, nextId) => dispatch => {
  dispatch(requestPosts());

  let hasMore = true;

  return getPosts(limit, nextId)
    .then(data => {
      if (!data.data.posts.length)
        hasMore = false;
      dispatch(receivePosts(data.data.posts, hasMore));
    });
}
