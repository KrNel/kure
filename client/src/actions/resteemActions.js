import SteemConnect from '../utils/auth/scAPI';

export const RESTEEM_START = 'RESTEEM_START';
export const RESTEEM_SUCCESS = 'RESTEEM_SUCCESS';

/**
 *  Action creator to request recent post activity.
 *
 *  @returns {object} The action data
 */
const resteemStart = pid => ({
  type: RESTEEM_START,
  pid,
});

/**
 *  Action creator to receive recent post activity.
 *
 *  @param {string} posts Data returned from database
 *  @param {object} hasMore If there are more posts to grab
 *  @returns {object} The action data
 */
const resteemSuccess = pid => ({
  type: RESTEEM_SUCCESS,
  pid,
});

/**
 *  Function to fetch the recent activity from the database.
 *
 *  @param {string} limit Limit of posts to return
 *  @param {function} nextId The next Id to use for querying posts
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
