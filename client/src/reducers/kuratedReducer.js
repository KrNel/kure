import {
  REQUEST_POSTS, RECEIVE_POSTS
} from '../actions/kuratedActions';

export const kurated = (state = {
  isFetching: false,
  posts: [],
  hasMore: true,
}, action) => {

  switch (action.type) {
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
      }
    case RECEIVE_POSTS: {

      return {
        ...state,
        isFetching: false,
        posts: [
          ...state.posts,
          ...action.posts
        ],
        hasMore: action.hasMore,
      }
    }
    default:
      return state
  }
}

export default kurated;
