import {
  REQUEST_KURATED, RECEIVE_KURATED
} from '../actions/kuratedActions';

/**
 *  Reducer function for kurated Redux state data. Determines if a fetch
 *  request for posts has more data to fetch.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
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
