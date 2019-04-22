import { Client } from 'dsteem';

import SteemConnect from '../utils/auth/scAPI';
import { getUserGroupsFetch } from './userGroupsActions';
import { getPostComments } from './commentsActions';

const client = new Client('https://hive.anyx.io/');

export const GET_DETAILS_START = 'GET_DETAILS_START';
export const GET_DETAILS_SUCCESS = 'GET_DETAILS_SUCCESS';
export const CLEAR_POST = 'CLEAR_POST';
export const DELETE_POST_START = 'DELETE_POST_START';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';

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
 *  Action creator for starting to delete a post.
 *
 *  @return {object} The action data
 */
export const deletePostStart = () => ({
  type: DELETE_POST_START,
});

/**
 *  Action creator for successfully deleting a post.
 *
 *  @return {object} The action data
 */
export const deletePostSuccess = (redirect) => ({
  type: DELETE_POST_SUCCESS,
  redirect,
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

/**
 *  Delete a post by using author and permlink to refrence it.
 *
 *  @param {string} author Author of comment
 *  @param {string} permlink Permlink of comment
 *  @returns {function} Dispatches returned action object
 */
export const deletePost = (author, permlink) => (dispatch, getState) => {
  dispatch(deletePostStart());

  return SteemConnect
    .deleteComment(author, permlink)
    .then(res => {
console.log('res',res)
      if (res.result.block_num) {
        const { user } = getState().auth;
        const redirect = `/@${user}/`;
        dispatch(deletePostSuccess(redirect));
      }
    });
}

export default getDetailsContent;
