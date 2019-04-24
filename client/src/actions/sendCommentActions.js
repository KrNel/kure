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
export const SEND_COMMENT_CLEAR = 'SEND_COMMENT_CLEAR';
export const DELETE_PAYLOAD_SUCCESS = 'DELETE_PAYLOAD_SUCCESS';

/**
 *  Action creator for starting to send a comment.
 *
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
const sendCommentStart = (parentId) => ({
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
const sendCommentSuccess = (comment, parentId) => ({
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
const editCommentStart = id => ({
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
const editCommentSuccess = comment => ({
  type: EDIT_COMMENT_SUCCESS,
  comment,
});

/**
 *  Action creator for clearing the send comment variables.
 *
 *  @return {object} The action data
 */
export const sendCommentClear = () => ({
  type: SEND_COMMENT_CLEAR,
});

/**
 *  Action creator for successfully deleting a comment recently submitted.
 *
 *  @param {string} newReplies New replies object filtered
 *  @return {object} The action data
 */
export const deletePayloadSuccess = newCommentPayload => ({
  type: DELETE_PAYLOAD_SUCCESS,
  newCommentPayload,
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

/**
 *  Editing a comment is done with the body from the form which will replace
 *  the previous comment body. The data from the comment is extracted and
 *  used to upadte the comment in question, and also to fetch it anew once
 *  the comment is updated.
 *
 *  @param {string} body Body of comment to update
 *  @param {string} comment Comment being updated
 *  @returns {function} Dispatches returned action object
 */
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

export default sendComment;
