import {
  SELECT_SECTION, INVALIDATE_SECTION,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions/recentPostsActions';

/**
 *  Reducer function to return selected activity.
 *
 *  @param {object} state Redux state, defaults to recent posts selection
 *  @param {object} action Action dispatched
 *  @returns {object} The selection made, or default state
 */
export const selected = (state = 'recentPosts', action) => {
  switch (action.type) {
    case SELECT_SECTION:
      return action.section
    default:
      return state
  }
}

/**
 *  Reducer function to return recent posts data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The posts activity data, or default state
 */
const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  postItems: [],
  groupItems: [],
  myCommunities: [],
  mySubmissions: [],
  hasMore: true,
}, action) => {
  switch (action.type) {
    case INVALIDATE_SECTION:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POSTS: {

      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        postItems: [
          ...state.postItems,
          ...action.posts
        ],
        groupItems: action.groups,
        myCommunities: action.myComms,
        mySubmissions: action.mySubs,
        lastUpdated: action.receivedAt,
        hasMore: action.hasMore,
      }
    }
    default:
      return state
  }
}

/**
 *  Reducer function to return recent activity.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The recent activity data, or default state
 */
export const recentActivity = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_SECTION:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.section]: posts(state[action.section], action),
      }
    default:
      return state
  }
}
