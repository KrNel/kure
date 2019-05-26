import { Client } from 'dsteem';

import { logger } from '../utils/fetchFunctions';
import SteemConnect from '../utils/auth/scAPI';

const client = new Client('https://hive.anyx.io/');

export const UPVOTE_START = 'UPVOTE_START';
export const UPVOTE_SUCCESS = 'UPVOTE_SUCCESS';
export const VOTE_FAILED = 'VOTE_FAILED';
export const DOWNVOTE_START = 'DOWNVOTE_START';
export const DOWNVOTE_SUCCESS = 'DOWNVOTE_SUCCESS';

/**
 *  Action creator for starting an upvote
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const upvoteStart = (author, permlink) => ({
  type: UPVOTE_START,
  payload: {
    author,
    permlink,
    post: {
      id: 0,
      active_votes: [],
    },
  }
});

/**
 *  Action creator for a successful upvote.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @param {object} post Post being voted on
 *  @return {object} The action data
 */
export const upvoteSuccess = (author, permlink, post) => ({
  type: UPVOTE_SUCCESS,
  payload: {
    author,
    permlink,
    post,
  }
});

/**
 *  Action creator for starting a downvote
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const downvoteStart = (author, permlink) => ({
  type: DOWNVOTE_START,
  payload: {
    author,
    permlink,
    post: {
      id: 0,
      active_votes: [],
    },
  }
});

/**
 *  Action creator for a successful downvote.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @param {object} post Post being voted on
 *  @return {object} The action data
 */
export const downvoteSuccess = (author, permlink, post) => ({
  type: DOWNVOTE_SUCCESS,
  payload: {
    author,
    permlink,
    post,
  }
});

/**
 *  Action creator for failed upvote.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @param {string} error Error message
 *  @return {object} The action data
 */
export const voteFailed = (author, permlink, post, error) => ({
  type: VOTE_FAILED,
  payload: {
    author,
    permlink,
    post,
    error,
  }
});

/**
 *  Uses SteemConnect to upvote a post by author and permlink with specified
 *  vote weight percentage.
 *
 *  @param {string} author Author to upvote
 *  @param {string} permlink Post permlink to upvote
 *  @param {number} weight Vote weight percentage to upvote with
 *  @returns {function} Dispatches returned action object
 */
export const upvotePost = (author, permlink, weight) => (dispatch, getState) => {
  dispatch(upvoteStart(author, permlink));

  const { user } = getState().auth;

  return SteemConnect.vote(user, author, permlink, weight)
    .then(res => {
      client.database.call('get_content', [author, permlink])
        .then(post => {
          dispatch(upvoteSuccess(author, permlink, post));
        })
    })
    .catch((err) => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});

      client.database.call('get_content', [author, permlink])
        .then(post => {
          dispatch(voteFailed(author, permlink, post, 'Error on upvote/unvote.'));
        })
    });
}

/**
 *  Uses SteemConnect to downvote a post by author and permlink with specified
 *  vote weight percentage.
 *
 *  @param {string} author Author to upvote
 *  @param {string} permlink Post permlink to upvote
 *  @param {number} weight Vote weight percentage to upvote with
 *  @returns {function} Dispatches returned action object
 */
export const downvotePost = (author, permlink, weight) => (dispatch, getState) => {
  dispatch(downvoteStart(author, permlink));

  const { user } = getState().auth;

  return SteemConnect.vote(user, author, permlink, weight)
    .then(res => {
      client.database.call('get_content', [author, permlink])
        .then(post => {
          dispatch(downvoteSuccess(author, permlink, post));
        })
    })
    .catch((err) => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});

      client.database.call('get_content', [author, permlink])
        .then(post => {
          dispatch(voteFailed(author, permlink, post, 'Error on upvote/unvote.'));
        })
    });
}

export default upvotePost;
