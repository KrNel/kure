import {
  REQUEST_KURATED, RECEIVE_KURATED
} from '../actions/kuratedActions';

export const kurated = (state = {
  isFetching: false,
  posts: [],
  hasMore: true,
}, action) => {

  switch (action.type) {
    case REQUEST_KURATED:
      return {
        ...state,
        isFetching: true,
      }
    case RECEIVE_KURATED: {

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
