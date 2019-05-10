import {
  SEND_POST_START,
  SEND_POST_SUCCESS,
  SEND_POST_ERROR,
  CLEAR_NEW_POST,
  SHOW_EDIT_POST,
} from '../actions/sendPostActions';

/**
 *  Reducer function for sending a post to Steem. Determines if a post is being
 *  sent, updated, and which one it is. A draft object is kept for writing or
 *  updating a post.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const sendPost = (
  state = {
    isPosting: false,
    newPostRedirect: '',
    error: '',
    isUpdating: false,
    draft: {},
    updatedId: 0,
  },
  action) => {

  switch (action.type) {
    case SEND_POST_START:
      return ({
        ...state,
        isPosting: true,
        newPostRedirect: '',
        error: '',
      });
    case SEND_POST_ERROR:
      return ({
        ...state,
        isPosting: false,
        error: action.error,
      });
    case SEND_POST_SUCCESS:
      return ({
        ...state,
        isPosting: false,
        isUpdating: false,
        newPostRedirect: action.redirect,
      });
    case CLEAR_NEW_POST:
      return ({
        ...state,
        isPosting: false,
        isUpdating: false,
        newPostRedirect: '',
        error: '',
        draft: {},
      });
    case SHOW_EDIT_POST:
      return ({
        ...state,
        isUpdating: true,
        draft: action.draft,
      });
    default:
      return state
  }
}

export default sendPost;
