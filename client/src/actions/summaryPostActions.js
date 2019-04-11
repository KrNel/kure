import { Client } from 'dsteem';

import { logger } from '../utils/fetchFunctions';
import { getUserGroupsFetch } from './userGroupsActions';

const client = new Client('https://hive.anyx.io/');

export const GET_SUMMARY_START = 'GET_SUMMARY_START';
export const GET_SUMMARY_SUCCESS = 'GET_SUMMARY_SUCCESS';

/**
 *  Action creator for starting retrieval of post summary data.
 *
 *  @return {object} The action data
 */
export const summaryStart = () => ({
  type: GET_SUMMARY_START,
});

/**
 *  Action creator for successful retrieval of post summary data.
 *
 *  @param {array} posts Posts to display
 *  @return {object} The action data
 */
export const summarySuccess = (posts, hasMore, prevPage) => ({
  type: GET_SUMMARY_SUCCESS,
  posts,
  hasMore,
  prevPage,
});


/**
 *  Fetch the post details from Steem.
 *
 *  @param {string} selectedFilter Filter sort order
 *  @param {object} query Steem query to fetch.
 *  @param {boolean} nextPost If there are preceeding posts
 *  @returns {function} Dispatches returned action object
 */
export const getSummaryContent = (selectedFilter, query, nextPost, page) => (dispatch, getState) => {
  dispatch(summaryStart());

  return client.database.getDiscussions(selectedFilter, query)
    .then(result => {
      let hasMore = true;
      let newPosts = null;

      const state = getState();

      if (result) {
        if (nextPost) {
          newPosts = [...state.summaryPost.posts, ...result.slice(1)];
        }else {
          newPosts = result;
        }
      }else {
        hasMore = false;
        newPosts = state.summaryPost.posts;
      }

      dispatch(getUserGroupsFetch());

      dispatch(summarySuccess(newPosts, hasMore, page));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

export default getSummaryContent;
