import { Client } from 'dsteem';

const client = new Client('https://hive.anyx.io/');

export const GET_FOLLOW_START = 'GET_FOLLOW_START';
export const GET_FOLLOWCOUNT_SUCCESS = 'GET_FOLLOWCOUNT_SUCCESS';
export const GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWS_SUCCESS';

/**
 *  Action creator for starting retrieval of follow data.
 *
 *  @return {object} The action data
 */
export const followStart = () => ({
  type: GET_FOLLOW_START,
});

/**
 *  Action creator for successful retrieval of follow counts.
 *
 *  @param {string} user Page user
 *  @param {number} followerCount Follwer count
 *  @param {number} followingCount Following count
 *  @return {object} The action data
 */
export const followCountSuccess = (user, followerCount, followingCount) => ({
  type: GET_FOLLOWCOUNT_SUCCESS,
  user,
  followerCount,
  followingCount,
});

/**
 *  Action creator for successful retrieval of followers.
 *
 *  @param {string} user Page user
 *  @param {array} followers Followers
 *  @return {object} The action data
 */
export const followersSuccess = (user, followers) => ({
  type: GET_FOLLOWERS_SUCCESS,
  user,
  followers,
});

/**
 *  Action creator for successful retrieval of following.
 *
 *  @param {string} user Page user
 *  @param {array} following Following users
 *  @return {object} The action data
 */
export const followingSuccess = (user, following) => ({
  type: GET_FOLLOWING_SUCCESS,
  user,
  following,
});

/**
 *  Get the follow count for a user.
 *
 *  @param {string} user User to get data for
 *  @returns {function} Dispatches returned action object
 */
export const getFollowCount = user => (dispatch, getState) => {
  dispatch(followStart());

  return client.call('follow_api', 'get_follow_count', [user])
    .then(followCount => {
      dispatch(followCountSuccess(user, followCount.follower_count, followCount.following_count));
    })
}

export default getFollowCount;
