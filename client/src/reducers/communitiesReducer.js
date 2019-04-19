import {
  GET_COMMUNITY_START,
  GET_COMMUNITY_SUCCESS,
} from '../actions/communitiesActions';

export const communities = (state = {
  isFetching: false,
  groups: [],
  groupData: {
    kposts: [],
    kusers: [],
    hasMore: true,
    notExists: false,
  },
  hasMoreGroups: true,
}, action) => {

  switch (action.type) {
    case GET_COMMUNITY_START:
      return {
        ...state,
        isFetching: true,
      }
    case GET_COMMUNITY_SUCCESS: {

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
    }
    default:
      return state
  }
}

export default communities;
