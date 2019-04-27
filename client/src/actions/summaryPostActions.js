import { api } from 'steem';

import { logger } from '../utils/fetchFunctions';
import { getUserGroupsFetch } from './userGroupsActions';

export const GET_SUMMARY_START = 'GET_SUMMARY_START';
export const GET_SUMMARY_SUCCESS = 'GET_SUMMARY_SUCCESS';
export const SUMMARY_CANCEL = 'SUMMARY_CANCEL';

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
export const summarySuccess = (posts, hasMore, prevPage, startAuthor, startPermlink) => ({
  type: GET_SUMMARY_SUCCESS,
  posts,
  hasMore,
  prevPage,
  startAuthor,
  startPermlink,
});

/**
 *  Action creator for starting retrieval of post summary data.
 *
 *  @return {object} The action data
 */
export const summaryCancel = (prevPage) => ({
  type: SUMMARY_CANCEL,
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
export const getSummaryContent = (selectedFilter, query, page, action) => (dispatch, getState) => {
  dispatch(summaryStart());

  const state = getState();
  const { summaryPost } = state;
  const { posts, prevPage } = summaryPost;

  let startAuthor = undefined;
  let startPermlink = undefined;

  if (posts.length && action === 'more') {
    startAuthor = summaryPost.startAuthor;
    startPermlink = summaryPost.startPermlink;
  }

  let nextPost = false;

  if (page !== prevPage) {
    startAuthor = undefined;
    startPermlink = undefined;
  }

  if (startAuthor !== undefined && startPermlink !== undefined) {
    nextPost = true;
  }

  query.start_author = startAuthor;
  query.start_permlink =  startPermlink;

  return api[steemCall(selectedFilter)](query)
    .then(result => {

      let hasMore = true;
      let newPosts = null;

      if (!result.length && !posts.length) {
        return dispatch(summaryCancel(page));
      }

      if (result) {
        if (nextPost) {
          newPosts = [...posts, ...result.slice(1)];
        }else {
          newPosts = result;
        }
      }else {
        hasMore = false;
        newPosts = posts;
      }

      const lastPost = newPosts[newPosts.length - 1];
      startAuthor = lastPost.author;
      startPermlink = lastPost.permlink;

      dispatch(getUserGroupsFetch());

      dispatch(summarySuccess(newPosts, hasMore, page, startAuthor, startPermlink));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

const steemCall = (selectedFilter) => {
  switch (selectedFilter) {
    case 'blog':
      return 'getDiscussionsByBlogAsync';
    case 'feed':
      return 'getDiscussionsByFeedAsync';
    case 'created':
      return 'getDiscussionsByCreatedAsync';
    case 'hot':
      return 'getDiscussionsByHotAsync';
    case 'promoted':
      return 'getDiscussionsByPromotedAsync';
    case 'trending':
      return 'getDiscussionsByTrendingAsync';
    default:
      return 'getDiscussionsByCreatedAsync';
  }
}

export default getSummaryContent;
