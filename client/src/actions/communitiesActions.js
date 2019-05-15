import {
  getGroupDetails,
  requestToJoinGroup,
  logger,
  getGroupsPage,
  getGroupsActive,
} from '../utils/fetchFunctions';
import { hasLength } from '../utils/helpers';
import { cookieUser } from './authActions';

export const GET_COMMUNITY_START = 'GET_COMMUNITY_START';
export const GET_COMMUNITY_SUCCESS = 'GET_COMMUNITY_SUCCESS';
export const CLEAR_COMMUNITY = 'CLEAR_COMMUNITY';
export const JOIN_GROUP_START = 'JOIN_GROUP_START';
export const JOIN_GROUP_SUCCESS = 'JOIN_GROUP_SUCCESS';
export const GET_COMMUNITIES_CREATED_START = 'GET_COMMUNITIES_CREATED_START';
export const GET_COMMUNITIES_ACTIVE_START = 'GET_COMMUNITIES_ACTIVE_START';
export const GET_COMMUNITIES_CREATED_SUCCESS = 'GET_COMMUNITIES_CREATED_SUCCESS';
export const GET_COMMUNITIES_ACTIVE_SUCCESS = 'GET_COMMUNITIES_ACTIVE_SUCCESS';

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
 *  Action creator to request created groups data.
 *
 *  @returns {object} The action data
 */
const getGroupsCreatedStart = () => ({
  type: GET_COMMUNITIES_CREATED_START,
});

/**
 *  Action creator to receive created groups data.
 *
 *  @param {string} group Data returned from database
 *  @param {object} hasMore If there are more groups to grab
 *  @returns {object} The action data
 */
const getGroupsCreatedSuccess = (groupsCreated, hasMore) => ({
  type: GET_COMMUNITIES_CREATED_SUCCESS,
  groupsCreated,
  hasMore,
});

/**
 *  Action creator to request active groups data.
 *
 *  @returns {object} The action data
 */
const getGroupsActiveStart = () => ({
  type: GET_COMMUNITIES_ACTIVE_START,
});

/**
 *  Action creator to receive active groups data.
 *
 *  @param {string} group Data returned from database
 *  @param {object} hasMore If there are more groups to grab
 *  @returns {object} The action data
 */
const getGroupsActiveSuccess = (groupsActivity, hasMore) => ({
  type: GET_COMMUNITIES_ACTIVE_SUCCESS,
  groupsActivity,
  hasMore,
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
        return dispatch(getGroupSuccess({}, hasMore, notExists));
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
export const joinGroup = group => (dispatch, getState) => {
  dispatch(joinGroupStart(group));

  const state = getState();
  const {
    auth: {
      user,
      csrf,
    }
  } = state;

  return requestToJoinGroup({group, user}, csrf)
  .then(result => {

    const { groupData } = state.communities;

    let kaccess = groupData.kaccess;

    if (result.data) {
      kaccess[0] = { access: 100 };
    }

    return dispatch(joinGroupSuccess(kaccess));
  }).catch(err => {
    logger('error', err);
  });
}

/**
 *  Function to fetch the groups from the database. Uses a limit and a
 *  nextId to restrict the amount of results returned and to fetch more
 *  data from where th previously data set left off.
 *
 *  @param {object} limit Limit amount of results returned
 *  @param {object} nextId Fetch next page of results based on last ID
 *  @returns {function} Dispatches returned action object
 */
export const getGroups = (limit, nextId) => (dispatch, getState) => {
  dispatch(getGroupsCreatedStart());
  let hasMore = true;

  let {
    auth: {
      user,
    },
    communities: {
      groups: {
        groupsActivity,
      }
    }
  } = getState();

  if (!user) user = cookieUser() || 'x';

  return getGroupsPage(user, nextId)
    .then(result => {
      if (!hasLength(result.data.groupsCreated)) {
        hasMore = false;
        return dispatch(getGroupsCreatedSuccess({}, hasMore));
      }

      if (result.data.groupsCreated.length < limit)
        hasMore = false;

      //send data for created groups
      dispatch(getGroupsCreatedSuccess(result.data.groupsCreated, hasMore));

      //check if we need to get the most recently active groups as well
      if (!groupsActivity.length) {
        dispatch(getGroupsActiveStart());
        getGroupsActive(user)
          .then(result => {
            dispatch(getGroupsActiveSuccess(result.data.groupsActivity, hasMore));
          })
      }
    }).catch(err => {
      logger('error', err);
    });
}
