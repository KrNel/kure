import SteemConnect from '../utils/auth/scAPI';

export const RESTEEM_START = 'RESTEEM_START';
export const RESTEEM_SUCCESS = 'RESTEEM_SUCCESS';

/**
 *  Action creator to request recent post activity.
 *
 *  @param {number} pid Post id
 *  @returns {object} The action data
 */
const resteemStart = pid => ({
  type: RESTEEM_START,
  pid,
});

/**
 *  Action creator to receive recent post activity.
 *
 *  @param {number} pid Post id
 *  @returns {object} The action data
 */
const resteemSuccess = pid => ({
  type: RESTEEM_SUCCESS,
  pid,
});

/**
 *  Sends a resteem to Steem based on the author and permlink.
 *
 *  @param {number} pid Post id
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const resteem = (pid, author, permlink) => (dispatch, getState) => {
  dispatch(resteemStart(pid));

  const { user } = getState().auth;

  return SteemConnect.reblog(user, author, permlink)
    .then(result => {
      dispatch(resteemSuccess(pid));
    });
}
