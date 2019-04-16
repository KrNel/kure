import {
  GET_COMMENTS_START,
  GET_COMMENTS_SUCCESS,
} from '../actions/commentsActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const comments = (
  state = {
    isFetchingComments: false,
    replies: [],
  },
  action) => {

  switch (action.type) {
    case GET_COMMENTS_START:
      return ({
        ...state,
        isFetchingComments: true,
      });
    case GET_COMMENTS_SUCCESS:
      return ({
        ...state,
        isFetchingComments: false,
        replies: action.comments,
      });
    default:
      return state
  }
}

export default comments;
