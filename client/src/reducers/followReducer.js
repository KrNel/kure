import {
  GET_FOLLOW_START,
  GET_FOLLOWCOUNT_SUCCESS,
  GET_FOLLOWERS_SUCCESS,
  GET_FOLLOWING_SUCCESS,
  CLEAR_FOLLOW,
  GET_ALL_FOLLOWING_SUCCESS,
  SEND_FOLLOW_START,
  SEND_FOLLOW_SUCCESS,
  SEND_UNFOLLOW_START,
  SEND_UNFOLLOW_SUCCESS,
  SEARCH_START,
} from '../actions/followActions';

/**
 *  Reducer function for follow data. Will send back the follow data requested,
 *  such as follow counts, lists of followers or following users, and following
 *  or unfollowing of users.
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
  followingList: [],
  hasMore: true,
  followPayload: {
    userFollowing: '',
  },
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
        followingList: [],
        hasMore: true,
        followPayload: {},
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
        followers: [
          ...state.followers,
          ...action.followers,
        ],
        hasMore: action.hasMore,
        searchFollowLoading: false,
      }
    case GET_FOLLOWING_SUCCESS:
      return {
        ...state,
        isFetching: false,
        following: [
          ...state.following,
          ...action.following,
        ],
        hasMore: action.hasMore,
        searchFollowLoading: false,
      }
    case GET_ALL_FOLLOWING_SUCCESS:
      return {
        ...state,
        followingList: action.followingList,
      }
    case SEND_FOLLOW_START:
    case SEND_UNFOLLOW_START:
      return {
        ...state,
        followPayload: {
          userFollowing: action.user,
        }
      }
    case SEND_FOLLOW_SUCCESS:
      return {
        ...state,
        followingList: [
          ...state.followingList,
          action.user,
        ],
        followPayload: {
          userFollowing: '',
        }
      }
    case SEND_UNFOLLOW_SUCCESS:
      return {
        ...state,
        followingList: [
          ...state.followingList.filter(user => user !== action.user)
        ],
        followPayload: {
          userFollowing: '',
        }
      }
    case SEARCH_START:
      return {
        ...state,
        [action.page]: [],
        searchFollowLoading: true,
      }
    default:
      return state
  }
}

export default follow;
