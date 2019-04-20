import { Client } from 'dsteem';

import { getUserGroupsFetch } from './userGroupsActions';
import { getPostComments } from './commentsActions';
import { clearNewPost } from './sendPostActions';

const client = new Client('https://hive.anyx.io/');

export const GET_DETAILS_START = 'GET_DETAILS_START';
export const GET_DETAILS_SUCCESS = 'GET_DETAILS_SUCCESS';
export const CLEAR_POST = 'CLEAR_POST';

/**
 *  Action creator for starting retrieval of post detail data.
 *
 *  @return {object} The action data
 */
export const detailsStart = () => ({
  type: GET_DETAILS_START,
});

/**
 *  Action creator for successful retrieval of post detail data.
 *
 *  @param {object} post Post to display
 *  @return {object} The action data
 */
export const detailsSuccess = (post) => ({
  type: GET_DETAILS_SUCCESS,
  post,
});

/**
 *  Action creator for clearing post data.
 *
 *  @return {object} The action data
 */
export const clearPost = () => ({
  type: CLEAR_POST,
});

/**
 *  Fetch the post details from Steem.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const getDetailsContent = (author, permlink) => (dispatch, getState) => {
  dispatch(detailsStart());
  return client.database.call('get_content', [author, permlink])
    .then(post => {
      if (post.created === '1970-01-01T00:00:00') {
        dispatch(detailsSuccess({}));
      }
      else {
        dispatch(getUserGroupsFetch());
        dispatch(detailsSuccess(post));
      }

      if (post.children > 0) {
        dispatch(getPostComments(post.author, post.permlink));
      }
    })
}

export default getDetailsContent;
