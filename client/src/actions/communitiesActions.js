import {
  getGroupDetails,
  requestToJoinGroup,
  logger } from '../utils/fetchFunctions';
import { hasLength } from '../utils/helpers';
import { cookieUser } from './authActions';

export const GET_COMMUNITY_START = 'GET_COMMUNITY_START';
export const GET_COMMUNITY_SUCCESS = 'GET_COMMUNITY_SUCCESS';
export const CLEAR_COMMUNITY = 'CLEAR_COMMUNITY';
export const JOIN_GROUP_START = 'JOIN_GROUP_START';
export const JOIN_GROUP_SUCCESS = 'JOIN_GROUP_SUCCESS';

/**
 *  Action creator to request group data.
 *
 *  @returns {object} The action data
 */
const getGroupStart = () => ({
  type: GET_COMMUNITY_START,
});

/**
 *  Action creator to receive group data.
 *
 *  @param {string} group Data returned from database
 *  @param {object} hasMore If there are more posts to grab
 *  @param {object} notExists If the group doesn't exist
 *  @returns {object} The action data
 */
const getGroupSuccess = (group, hasMore, notExists) => ({
  type: GET_COMMUNITY_SUCCESS,
  group,
  hasMore,
  notExists,
});

/**
 *  Action creator for successful retrieval of comments data.
 *
 *  @param {object} comments Post to display
 *  @return {object} The action data
 */
export const groupClear = () => ({
  type: CLEAR_COMMUNITY,
});

/**
 *  Action creator for starting to request a group join.
 *
 *  @param {object} groupRequested Post to display
 *  @return {object} The action data
 */
const joinGroupStart = groupRequested => ({
  type: JOIN_GROUP_START,
  groupRequested,
});

/**
 *  Action creator for starting to request a group join.
 *
 *  @param {object} groupRequested Post to display
 *  @return {object} The action data
 */
const joinGroupSuccess = kaccess => ({
  type: JOIN_GROUP_SUCCESS,
  kaccess,
});

/**
 *  Function to fetch the group's from the database.
 *
 *  @param {string} group Group to get data for
 *  @param {string} user User to get access for
 *  @param {object} limit Limit amount of results returned
 *  @param {object} nextId Fetch next page of results based on last ID
 *  @returns {function} Dispatches returned action object
 */
export const getGroupData = (group, limit, nextId) => (dispatch, getState) => {
  dispatch(getGroupStart());
  let hasMore = true;
  let notExists = false;

  let { auth: { user } } = getState();
  if (!user) user = cookieUser() || 'x';

  return getGroupDetails(group, user, limit, nextId)
    .then(result => {
      if (!hasLength(result.data)) {
        hasMore = false;
        notExists = true;
        return dispatch(getGroupSuccess([], hasMore, notExists));
      }

      if (result.data.group.kposts.length < limit)
        hasMore = false;

      return dispatch(getGroupSuccess(result.data.group, hasMore, notExists));
    }).catch(err => {
      logger('error', err);
    });
}

/**
 *  Function to add a user request to join group to the database.
 *
 *  @param {string} group Group to request join for
 *  @returns {function} Dispatches returned action object
 */
export const joinGroup = async group => (dispatch, getState) => {
  dispatch(joinGroupStart());

  const { state } = getState();
  const {
    auth: {
      user,
      csrf,
    }
  } = state;

  return requestToJoinGroup({group, user}, csrf)
  .then(result => {
    const { groupData } = state;
    let kaccess = groupData.kaccess;

    if (result.data.group) {
      kaccess[0] = { access: 100 };
    }

    return dispatch(joinGroupSuccess(kaccess));
  }).catch(err => {
    logger('error', err);
  });
}
