import {
  GET_USERGROUPS_START,
  GET_USERGROUPS_SUCCESS,
  GET_USERGROUPS_ERROR,
} from '../actions/userGroupsActions';

/**
 *  Reducer function for getting a user's group data from KURE.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const userGroups = (
  state = {
    groups: [{key: 0, text: 'No Groups', value: '0'}],
  },
  action) => {

  switch (action.type) {
    case GET_USERGROUPS_START:
      return ({
        ...state,
        isFetchingUserGroups: true,
      });
    case GET_USERGROUPS_ERROR:
      return ({
        ...state,
        isFetchingUserGroups: false,
        groups: [],
      });
    case GET_USERGROUPS_SUCCESS:
      return ({
        ...state,
        isFetchingUserGroups: false,
        groups: action.groups,
      });
    default:
      return state
  }
}

export default userGroups;
