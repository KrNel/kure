import {
  GET_COMMUNITY_START,
  GET_COMMUNITY_SUCCESS,
  CLEAR_COMMUNITY,
  JOIN_GROUP_START,
  JOIN_GROUP_SUCCESS,
} from '../actions/communitiesActions';

/**
 *  Reducer function for communities Redux state data. Determines if a fetch
 *  request for groups/communities has more data to fetch and which group is being
 *  requested to join.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const communities = (state = {
  isFetching: false,
  groups: [],
  groupData: {
    kposts: [],
    kusers: [],
    kaccess: [],
    hasMore: true,
    notExists: false,
  },
  hasMoreGroups: true,
  groupRequested: '',
  isJoining: false,
}, action) => {

  switch (action.type) {
    case GET_COMMUNITY_START:
      return {
        ...state,
        isFetching: true,
      }
    case GET_COMMUNITY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        groupData: {
          ...state.groupData,
          ...action.group,
          kposts: [
            ...state.groupData.kposts,
            ...action.group.kposts,
          ],
          hasMore: action.hasMore,
          notExists: action.notExists,
        },
      }
    case CLEAR_COMMUNITY:
      return {
        ...state,
        groupData: {
          kposts: [],
          kusers: [],
          hasMore: true,
          notExists: false,
        },
        isFetching: false,
      };
    case JOIN_GROUP_START:
      return {
        ...state,
        isJoining: true,
        groupRequested: action.groupRequested,
      }
    case JOIN_GROUP_SUCCESS:
      return {
        ...state,
        isJoining: false,
        groupRequested: '',
        groupData: {
          ...state.groupData,
          kaccess: action.kaccess,
        },
      }
    default:
      return state
  }
}

export default communities;
