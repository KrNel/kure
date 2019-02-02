import {
  SELECT_SECTION, INVALIDATE_SECTION,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions/recentPostsActions'

export const selected = (state = 'recentPosts', action) => {
  switch (action.type) {
    case SELECT_SECTION:
      return action.section
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
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
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        //didInvalidate: true,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

export const recentActivity = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_SECTION:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.section]: posts(state[action.section], action)
      }
    default:
      return state
  }
}
