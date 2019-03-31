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
export const summarySuccess = (posts, noMore, prevPage) => ({
  type: GET_SUMMARY_SUCCESS,
  posts,
  noMore,
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
      let noMore = false;
      let newPosts = null;

      if (result) {
        if (nextPost) {
          newPosts = [...getState().summaryPost.posts, ...result.slice(1)];
        }else {
          newPosts = result;
        }
      }else {
        noMore = true;
        newPosts = getState().summaryPost.posts;
      }

      dispatch(getUserGroupsFetch());

      dispatch(summarySuccess(newPosts, noMore, page));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

export default getSummaryContent;
