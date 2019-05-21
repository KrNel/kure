import { Client } from 'dsteem';
import SteemConnect from '../utils/auth/scAPI';

import { cookieUser } from './authActions';

export const GET_FOLLOW_START = 'GET_FOLLOW_START';
export const GET_FOLLOWCOUNT_SUCCESS = 'GET_FOLLOWCOUNT_SUCCESS';
export const GET_FOLLOWERS_SUCCESS = 'GET_FOLLOWERS_SUCCESS';
export const GET_FOLLOWING_SUCCESS = 'GET_FOLLOWS_SUCCESS';
export const CLEAR_FOLLOW = 'CLEAR_FOLLOW';
export const GET_ALL_FOLLOWING_SUCCESS = 'GET_ALL_FOLLOWING_SUCCESS';
export const SEND_FOLLOW_START = 'SEND_FOLLOW_START';
export const SEND_FOLLOW_SUCCESS = 'SEND_FOLLOW_SUCCESS';
export const SEND_UNFOLLOW_START = 'SEND_UNFOLLOW_START';
export const SEND_UNFOLLOW_SUCCESS = 'SEND_UNFOLLOW_SUCCESS';

const client = new Client('https://hive.anyx.io/');

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
 *  @param {boolean} hasMore If there are more users
 *  @return {object} The action data
 */
export const followersSuccess = (followers, hasMore) => ({
  type: GET_FOLLOWERS_SUCCESS,
  followers,
  hasMore,
});

/**
 *  Action creator for successful retrieval of following.
 *
 *  @param {array} following Following users
 *  @param {boolean} hasMore If there are more users
 *  @return {object} The action data
 */
export const followingSuccess = (following, hasMore) => ({
  type: GET_FOLLOWING_SUCCESS,
  following,
  hasMore,
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
 *  Action creator for successful retrieval of all following users.
 *
 *  @param {array} followingList All following users
 *  @return {object} The action data
 */
export const followingListSuccess = followingList => ({
  type: GET_ALL_FOLLOWING_SUCCESS,
  followingList,
});

/**
 *  Action creator for starting to follow a user.
 *
 *  @param {string} user User to follow
 *  @return {object} The action data
 */
export const sendFollowStart = user => ({
  type: SEND_FOLLOW_START,
  user,
});

/**
 *  Action creator for successfully following a user.
 *
 *  @param {string} user User to follow
 *  @return {object} The action data
 */
export const sendFollowSuccess = user => ({
  type: SEND_FOLLOW_SUCCESS,
  user,
});

/**
 *  Action creator for starting to unfollow a user.
 *
 *  @param {string} user User to unfollow
 *  @return {object} The action data
 */
export const sendUnfollowStart = user => ({
  type: SEND_UNFOLLOW_START,
  user,
});

/**
 *  Action creator for successfully unfollowing a user.
 *
 *  @param {string} user User to unfollow
 *  @return {object} The action data
 */
export const sendUnfollowSuccess = user => ({
  type: SEND_UNFOLLOW_SUCCESS,
  user,
});

/**
 *  Get the follow count for a user.
 *
 *  @param {string} user User to get data for
 *  @returns {function} Dispatches returned action object
 */
export const getFollowCount = user => (dispatch, getState) => {
  let { user: userLogged } = getState().auth;
  if (!userLogged) userLogged = cookieUser();

  return client.call('follow_api', 'get_follow_count', [user])
    .then(followCount => {
      dispatch(followCountSuccess(followCount.follower_count, followCount.following_count));
      dispatch(getAllFollowing(userLogged));
    })
}

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
      let hasMore = true;
      if (followers.length < limit)
        hasMore = false;

      if (more)
        followers = followers.slice(1);

      dispatch(followersSuccess(followers, hasMore));
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
      let hasMore = true;
      if (following.length < limit)
        hasMore = false;

      if (more)
        following = following.slice(1);

      dispatch(followingSuccess(following, hasMore));
    })
}

/**
 *  Get the full list of following users.
 *
 *  @param {string} user User to get data for
 *  @returns {function} Dispatches returned action object
 */
export const getAllFollowing = user => async (dispatch, getState) => {
  const count = await client.call('follow_api', 'get_follow_count', [user])
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

/**
 *  Send a follow request to Steem.
 *
 *  @param {string} userToFollow User to follow
 *  @returns {function} Dispatches returned action object
 */
export const sendFollowUser = (userToFollow, pageOwner) => (dispatch, getState) => {
  dispatch(sendFollowStart(userToFollow));
  const { auth: { user }} = getState();

  return SteemConnect.follow(user, userToFollow)
    .then(result => {   
      dispatch(sendFollowSuccess(userToFollow));
      if (pageOwner === userToFollow)
        dispatch(getFollowCount(pageOwner));
    });
};

/**
 *  Send an unfollow request to Steem.
 *
 *  @param {string} userToUnfollow User to unfollow
 *  @returns {function} Dispatches returned action object
 */
export const sendUnfollowUser = (userToUnfollow, pageOwner) => (dispatch, getState) => {
  dispatch(sendUnfollowStart(userToUnfollow));
  const { auth: { user }} = getState();

  return SteemConnect.unfollow(user, userToUnfollow)
    .then(result => {
      dispatch(sendUnfollowSuccess(userToUnfollow));
      if (pageOwner === userToUnfollow)
        dispatch(getFollowCount(pageOwner));
    });
};

export default getFollowCount;
