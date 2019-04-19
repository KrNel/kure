import { getGroupDetails, logger } from '../utils/fetchFunctions';
import { hasLength } from '../utils/helpers';

export const GET_COMMUNITY_START = 'GET_COMMUNITY_START';
export const GET_COMMUNITY_SUCCESS = 'GET_COMMUNITY_SUCCESS';

/**
 *  Action creator to request group data.
 *
 *  @param {string} section Section selected
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
 *  @returns {object} The action data
 */
const getGroupSuccess = (group, hasMore, notExists) => ({
  type: GET_COMMUNITY_SUCCESS,
  group,
  hasMore,
  notExists,
});

/**
 *  Function to fetch the group's from the database.
 *
 *  @returns {function} Dispatches returned action object
 */
export const getGroupData = (group, user, limit, nextId) => dispatch => {
  dispatch(getGroupStart());
  let hasMore = true;
  let notExists = false;

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
