import {
  GET_SUMMARY_START,
  GET_SUMMARY_SUCCESS,
} from '../actions/summaryPostActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const summaryPost = (
  state = {
    isFetchingSummary: false,
    prevPage: '',
    posts: [],
    noMore: false,
  },
  action) => {

  switch (action.type) {
    case GET_SUMMARY_START:
      return ({
        ...state,
        isFetchingSummary: true,
      });
    case GET_SUMMARY_SUCCESS:
      return ({
        ...state,
        isFetchingSummary: false,
        posts: action.posts,
        noMore: action.noMore,
        prevPage: action.prevPage,
      });
    default:
      return state
  }
}

export default summaryPost;
