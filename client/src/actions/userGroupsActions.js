import { getUserGroups, logger } from '../utils/fetchFunctions';
import {handleReturning} from './authActions';

export const GET_USERGROUPS_START = 'GET_USERGROUPS_START';
export const GET_USERGROUPS_SUCCESS = 'GET_USERGROUPS_SUCCESS';

/**
 *  Action creator for starting retrieval of user's groups data.
 *
 *  @return {object} The action data
 */
export const userGroupsStart = () => ({
  type: GET_USERGROUPS_START,
});

/**
 *  Action creator for successful retrieval of group data.
 *
 *  @param {array} groups Groups to select from
 *  @return {object} The action data
 */
export const userGroupsSuccess = (groups) => ({
  type: GET_USERGROUPS_SUCCESS,
  groups,
});

/**
 *  Fetch the groups for groups selection when adding a post.
 *
 *  @param {string} user User to get groups for
 *  @returns {function} Dispatches returned action object
 */
export const getUserGroupsFetch = () => async (dispatch, getState) => {
  dispatch(userGroupsStart());

  //on first page load authenticate before proceeding
  let { user } = getState().auth;
  const cont = await user === '' ? handleReturning() : '';//eslint-disable-line

  const { groups } = getState().userGroups;
  if (groups[0].text !== "No Groups") return;

  return getUserGroups(user, 'all')
    .then(res => {
      const groups = res.data.groups.map((g, i) => {
        return {key: i, value: g.name, text: g.display}
      })
      dispatch(userGroupsSuccess(groups));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

export default getUserGroupsFetch;
