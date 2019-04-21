import { Client } from 'dsteem';

import SteemConnect from '../utils/auth/scAPI';
import { createPostMetadata, createCommentPermlink } from '../components/pages/Steem/helpers/postHelpers';

const client = new Client('https://hive.anyx.io/');

export const SEND_COMMENT_START = 'SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
export const GET_COMMENT_START = 'GET_COMMENT_START';
export const GET_COMMENT_SUCCESS = 'GET_COMMENT_START';
export const EDIT_COMMENT_START = 'EDIT_COMMENT_START';
export const EDIT_COMMENT_SUCCESS = 'EDIT_COMMENT_SUCCESS';
export const DELETE_COMMENT_START = 'DELETE_COMMENT_START';

/**
 *  Action creator for starting to send a comment.
 *
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const sendCommentStart = (parentId) => ({
  type: SEND_COMMENT_START,
  parentId,
});

/**
 *  Action creator for successfully sending a comment.
 *
 *  @param {string} comment Comment added to post
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const sendCommentSuccess = (comment, parentId) => ({
  type: SEND_COMMENT_SUCCESS,
  comment,
  parentId,
});

/**
 *  Action creator for starting to edit a comment.
 *
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const editCommentStart = id => ({
  type: EDIT_COMMENT_START,
  id,
});

/**
 *  Action creator for successfully editing a comment.
 *
 *  @param {string} comment Comment added to post
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const editCommentSuccess = comment => ({
  type: EDIT_COMMENT_SUCCESS,
  comment,
});

/**
 *  Action creator for starting to delete a comment.
 *
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const deleteCommentStart = () => ({
  type: DELETE_COMMENT_START,
});

/**
 *  Uses SteemConnect to send a comment to the Steem blockchain.
 *
 *  @param {string} parentPost Parent being commented on
 *  @param {string} body Comment body
 *  @returns {function} Dispatches returned action object
 */
export const sendComment = (body, parentPost) => (dispatch, getState) => {
  const { category, id, permlink: parentPermlink, author: parentAuthor } = parentPost;

  const {
    auth: {
      user
    },
  } = getState();

  dispatch(sendCommentStart(id));

  const author = user;
  const permlink = createCommentPermlink(parentAuthor, parentPermlink)

  const jsonMetadata = createPostMetadata(
    body,
    [category],
  );

  return SteemConnect
    .comment(parentAuthor, parentPermlink, author, permlink, '', body, jsonMetadata)
    .then(res => {
      if (res.result.block_num) {
        getComment(author, permlink)
          .then(comment => {
            dispatch(sendCommentSuccess(comment, id));
          })
      }
    });
}

export const editComment = (body, comment) => dispatch => {
  dispatch(editCommentStart(comment.id));

  const { category, permlink, author, parent_permlink, parent_author } = comment;

  const jsonMetadata = createPostMetadata(body, [category]);

  return SteemConnect
    .comment(parent_author, parent_permlink, author, permlink, '', body, jsonMetadata)
    .then(res => {
      if (res.result.block_num) {
        getComment(author, permlink)
          .then(comment => {
            dispatch(editCommentSuccess(comment));
          })
      }
    });
}

/**
 *  Get a single comment.
 *
 *  @param {string} author Author of comment
 *  @param {string} permlink Permlink of comment
 *  @returns {function} Dispatches returned action object
 */
export const getComment = (author, permlink) => {
  return new Promise((resolve, reject) => {
    client.database.call('get_content', [author, permlink])
    .then(comment => {
      resolve(comment);
    });
  });
}

export const deleteComment = (author, permlink) => dispatch => {
  dispatch(deleteCommentStart());

  return SteemConnect
    .deleteComment(author, permlink)
    .then(res => {
console.log('res',res)
      //dispatch(deleteCommentSuccess());

      /*if (res.result.block_num) {
        getComment(author, permlink)
          .then(comment => {
            dispatch(editCommentSuccess(comment));
          })
      }*/
    });
}

export default sendComment;
