import {
  SEND_COMMENT_START,
  SEND_COMMENT_SUCCESS,
  EDIT_COMMENT_START,
  EDIT_COMMENT_SUCCESS,
  SEND_COMMENT_CLEAR,
  DELETE_PAYLOAD_SUCCESS,
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
    editingComment: 0,
    isUpdating: false,
    updatedId: 0,
    updatedComment: {},
  },
  action) => {

  switch (action.type) {
    case SEND_COMMENT_START:
      return ({
        ...state,
        isCommenting: true,
        commentedId: action.parentId,
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
    case EDIT_COMMENT_START:
      return ({
        ...state,
        isUpdating: true,
        editingComment: action.id,
      });
    case EDIT_COMMENT_SUCCESS:
      return ({
        ...state,
        isUpdating: false,
        editingComment: 0,
        updatedComment: action.comment,
        updatedId: action.comment.id,
      });
    case SEND_COMMENT_CLEAR:
      return ({
        ...state,
        isCommenting: false,
        commentedId: 0,
        commentPayload: {},
        isUpdating: false,
        editingComment: 0,
        updatedComment: {},
        updatedId: 0,
      });
    case DELETE_PAYLOAD_SUCCESS:
      return ({
        ...state,
        commentPayload: action.newCommentPayload,
      });
    default:
      return state
  }
}

export default sendComment;
