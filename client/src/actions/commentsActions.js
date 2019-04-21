import { Client } from 'dsteem';

import SteemConnect from '../utils/auth/scAPI';
import { deletePayloadSuccess } from './sendCommentActions';

const client = new Client('https://hive.anyx.io/');

export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const CLEAR_COMMENTS = 'CLEAR_COMMENTS';
export const DELETE_COMMENT_START = 'DELETE_COMMENT_START';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';

/**
 *  Action creator for starting retrieval of comments data.
 *
 *  @return {object} The action data
 */
export const commentsStart = () => ({
  type: GET_COMMENTS_START,
});

/**
 *  Action creator for successful retrieval of comments data.
 *
 *  @param {object} comments Post to display
 *  @return {object} The action data
 */
export const commentsSuccess = comments => ({
  type: GET_COMMENTS_SUCCESS,
  comments,
});

/**
 *  Action creator for clearning comments data.
 *
 *  @return {object} The action data
 */
export const commentsClear = () => ({
  type: CLEAR_COMMENTS,
});

/**
 *  Action creator for starting to delete a comment.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const deleteCommentStart = (author, permlink) => ({
  type: DELETE_COMMENT_START,
  author,
  permlink,
});

/**
 *  Action creator for successfully deleting a comment.
 *
 *  @param {object} newReplies New replies object filtered
 *  @return {object} The action data
 */
export const deleteCommentSuccess = newReplies => ({
  type: DELETE_COMMENT_SUCCESS,
  newReplies,
});

/**
 *  Fetch the post's comment from Steem. Send start and success dispatches
 *  after the recursive comment fetch is done.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const getPostComments = (author, permlink) => (dispatch, getState) => {
  dispatch(commentsStart());

  return postCommentsRecursive(author, permlink)
    .then(comments => {
      dispatch(commentsSuccess(comments))
    });
}

/**
 *  Recursively get the post's comments, looping through until no more
 *  children replies are found. As each comment is found, get the active votes
 *  and add it to the comment object. Otherwise, there 'active_votes' fetch
 *  from content replies is empty.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
const postCommentsRecursive = (author, permlink) => {
  return client.database.call('get_content_replies', [author, permlink])
    .then(replies => Promise.all(replies.map(r => {
      client.database
        .call('get_active_votes', [r.author, r.permlink])
        .then(av => {
          r.active_votes = av;
          return r;
        });
      if (r.children > 0) {
        return postCommentsRecursive(r.author, r.permlink)
          .then(children => {
            r.replies = children;
            return r;
          })
      }else {
        return r;
      }
    })))
}

/**
 *  Delete a comment from a post by using author and permlink to refrence it.
 *  Once deleted, remove from the existing data to exclude it from the view.
 *
 *  @param {string} author Author of comment
 *  @param {string} permlink Permlink of comment
 *  @returns {function} Dispatches returned action object
 */
export const deleteComment = (author, permlink, commentPayload = {}) => (dispatch, getState) => {
  dispatch(deleteCommentStart(author, permlink));

  const { replies } = getState().comments;

  return SteemConnect
    .deleteComment(author, permlink)
    .then(res => {
      if (res.result.block_num) {

        let newCommentPayload = {...commentPayload};

        // first, if new comments were added, check those for the comment
        // to delete
        for (let key in commentPayload) {
          newCommentPayload[key] = commentPayload[key].filter(c => c.permlink !== permlink);
        }

        // if no new comment was deleted, then interate over the existing
        // comments to find and remove the comment
        if (JSON.stringify(newCommentPayload) === JSON.stringify(commentPayload)) {
          deleteRecursive(permlink, replies)
            .then(newReplies => dispatch(deleteCommentSuccess(newReplies)));
        }else {
          dispatch(deletePayloadSuccess(newCommentPayload));
        }
      }
    });
}

/**
 *  Recursively iterate through the replies and return all the replies,
 *  including children replies, that aren't the comment being deleted.
 *
 *  @param {string} permlink Permlink of comment
 *  @param {object} replies Permlink of comment
 *  @returns {function} Dispatches returned action object
 */
const deleteRecursive = (permlink, replies = {}) => {
  return Promise.all(replies.filter(r => {
    if (r.children > 0) {
      return deleteRecursive(permlink, r.replies)
        .then(children => {
          r.replies = children;
          return r;
        })
    }else {
      return r.permlink !== permlink;
    }
  }))
}

export default getPostComments;
