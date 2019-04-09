import {
  SEND_COMMENT_START,
  SEND_COMMENT_SUCCESS,
} from '../actions/sendCommentActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const sendComment = (
  state = {
    isCommenting: false,
    commentedId: 0,
    commentPayload: {},
  },
  action) => {

  switch (action.type) {
    case SEND_COMMENT_START:
      return ({
        ...state,
        isCommenting: true,
      });
    case SEND_COMMENT_SUCCESS:
      return ({
        ...state,
        isCommenting: false,
        commentedId: action.parentId,
        commentPayload: {
          ...state.commentPayload,
          [action.parentId]: [
            action.comment
          ],
        },
      });
    default:
      return state
  }
}

export default sendComment;
