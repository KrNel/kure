import {
  GET_FOLLOW_START,
  GET_FOLLOWCOUNT_SUCCESS,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
} from '../actions/followActions';

/**
 *  Reducer function for follow data. Will send back the follow data requested,
 *  such as follow counts or lists of followers or following users.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The follow data, or default state
 */
export const follow = (state = {
  isFetching: false,
  users: [],
  followers: {},
  following: {},
  followerCount: {},
  followingCount: {},
}, action) => {

  switch (action.type) {
    case GET_FOLLOW_START:
      return {
        ...state,
        isFetching: true,
      }
    case GET_FOLLOWCOUNT_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        users: [
          ...state.users,
          action.user,
        ],
        followerCount: {
          [action.user]: action.followerCount,
        },
        followingCount: {
          [action.user]: action.followingCount,
        },
      }
    }
    default:
      return state
  }
}

export default follow;
