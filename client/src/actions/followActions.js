import { Client } from 'dsteem';

const client = new Client('https://hive.anyx.io/');

export const GET_FOLLOW_START = 'GET_FOLLOW_START';
export const GET_FOLLOWCOUNT_SUCCESS = 'GET_FOLLOWCOUNT_SUCCESS';
export const GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWS_SUCCESS';
export const CLEAR_FOLLOW = 'CLEAR_FOLLOW';
export const GET_ALL_FOLLOWING_SUCCESS = 'GET_ALL_FOLLOWING_SUCCESS';

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
 *  @param {number} followerCount Follwer count
 *  @param {number} followingCount Following count
 *  @return {object} The action data
 */
export const followCountSuccess = (followerCount, followingCount) => ({
  type: GET_FOLLOWCOUNT_SUCCESS,
  followerCount,
  followingCount,
});

/**
 *  Action creator for successful retrieval of followers.
 *
 *  @param {array} followers Followers
 *  @return {object} The action data
 */
export const followersSuccess = followers => ({
  type: GET_FOLLOWERS_SUCCESS,
  followers,
});

/**
 *  Action creator for successful retrieval of following.
 *
 *  @param {array} following Following users
 *  @return {object} The action data
 */
export const followingSuccess = following => ({
  type: GET_FOLLOWING_SUCCESS,
  following,
});

/**
 *  Action creator for clearing post data.
 *
 *  @return {object} The action data
 */
export const clearFollow = () => ({
  type: CLEAR_FOLLOW,
});

/**
 *  Action creator for successful retrieval of all following list.
 *
 *  @param {array} followingList All following users
 *  @return {object} The action data
 */
export const followingListSuccess = followingList => ({
  type: GET_ALL_FOLLOWING_SUCCESS,
  followingList,
});

/**
 *  Get the follow count for a user.
 *
 *  @param {string} user User to get data for
 *  @returns {function} Dispatches returned action object
 */
export const getFollowCount = user => (dispatch, getState) => (
  client.call('follow_api', 'get_follow_count', [user])
    .then(followCount => {
      dispatch(followCountSuccess(followCount.follower_count, followCount.following_count));
      dispatch(getAllFollowing(user));
    })
)

/**
 *  Get the user's followers list.
 *
 *  @param {string} user User to get data for
 *  @param {string} startFrom Previous user to start from
 *  @param {string} type Blog type by default
 *  @param {number} limit Number of users to get
 *  @returns {function} Dispatches returned action object
 */
export const getFollowers = (user, startFrom = '', limit = 100, more = false, type = 'blog', ) => (dispatch, getState) => {
  dispatch(followStart());

  if (more)
    limit = limit + 1;

  return client.call('follow_api', 'get_followers', [
      user,
      startFrom,
      type,
      limit,
    ])
    .then(followers => {
      if (more)
        followers = followers.slice(1);

      dispatch(followersSuccess(followers));
    })
}

/**
 *  Get the user's following list.
 *
 *  @param {string} user User to get data for
 *  @param {string} startFrom Previous user to start from
 *  @param {string} type Blog type by default
 *  @param {number} limit Number of users to get
 *  @returns {function} Dispatches returned action object
 */
export const getFollowing = (user, startFrom = '', limit = 100, more = false, type = 'blog') => (dispatch, getState) => {
  dispatch(followStart());

  if (more)
    limit = limit + 1;

  return client.call('follow_api', 'get_following', [
      user,
      startFrom,
      type,
      limit,
    ])
    .then(following => {
      if (more)
        following = following.slice(1);

      dispatch(followingSuccess(following));
    })
}

export const getAllFollowing = user => async (dispatch, getState) => {
  const { followingCount } = getState().follow;

  let count = followingCount;

  if (followingCount === 0)
    count = await client.call('follow_api', 'get_follow_count', [user])
    .then(followCount => {
       return followCount.following_count;
    })

  return await client.call('follow_api', 'get_following', [
      user,
      '',
      'blog',
      count,
    ])
    .then(following => {
      const users = following.map(follows => follows.following)
      dispatch(followingListSuccess(users));
    })
}

export default getFollowCount;
