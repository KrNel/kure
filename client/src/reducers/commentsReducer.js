import {
  GET_COMMENTS_START,
  GET_COMMENTS_SUCCESS,
  CLEAR_COMMENTS,
  DELETE_COMMENT_START,
  DELETE_COMMENT_SUCCESS,
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
    isDeleting: false,
    commentDeleting: {},
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
    case CLEAR_COMMENTS:
      return ({
        ...state,
        replies: [],
      });
    case DELETE_COMMENT_START:
      return ({
        ...state,
        isDeleting: true,
        commentDeleting: {
          author: action.author,
          permlink: action.permlink,
        }
      });
    case DELETE_COMMENT_SUCCESS:
      return ({
        ...state,
        isDeleting: false,
        replies: action.newReplies,

      });
    default:
      return state
  }
}

export default comments;
