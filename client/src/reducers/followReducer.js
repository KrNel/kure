import {
  GET_FOLLOW_START,
  GET_FOLLOWCOUNT_SUCCESS,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
  CLEAR_FOLLOW
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
  followers: [],
  following: [],
  followerCount: 0,
  followingCount: 0,
}, action) => {

  switch (action.type) {
    case GET_FOLLOW_START:
      return {
        ...state,
        isFetching: true,
      }
    case CLEAR_FOLLOW:
      return {
        ...state,
        isFetching: false,
        followers: [],
        following: [],
        followerCount: 0,
        followingCount: 0,
      }
    case GET_FOLLOWCOUNT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        followerCount: action.followerCount,
        followingCount: action.followingCount,
      }
    case GET_FOLLOWERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        followers: action.followers,
      }
    case GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        following: action.following,
      }
    default:
      return state
  }
}

export default follow;
