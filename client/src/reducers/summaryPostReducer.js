import {
  GET_SUMMARY_START,
  GET_SUMMARY_SUCCESS,
  SUMMARY_CANCEL,
} from '../actions/summaryPostActions';

/**
 *  Reducer function for post summaries from Steem. Determinse if posts are
 *  being fetched, what the previous page was, is there are more posts to get,
 *  and the last authors and permlink to start to fetch new data from.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const summaryPost = (
  state = {
    isFetching: false,
    prevPage: '',
    posts: [],
    hasMore: true,
    startAuthor: undefined,
    startPermlink: undefined,
  },
  action) => {

  switch (action.type) {
    case GET_SUMMARY_START:
      return ({
        ...state,
        isFetching: true,
      });
    case GET_SUMMARY_SUCCESS:
      return ({
        ...state,
        isFetching: false,
        posts: action.posts,
        hasMore: action.hasMore,
        prevPage: action.prevPage,
        startAuthor: action.startAuthor,
        startPermlink: action.startPermlink,
      });
    case SUMMARY_CANCEL:
      return ({
        ...state,
        isFetching: false,
        prevPage: action.prevPage,
      });
    default:
      return state
  }
}

export default summaryPost;
