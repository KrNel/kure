import {
  SEND_POST_START,
  SEND_POST_SUCCESS,
  SEND_POST_ERROR,
  CLEAR_NEW_POST,
  SHOW_EDIT_POST,
  CANCEL_EDIT_POST,
} from '../actions/sendPostActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const sendPost = (
  state = {
    isPosting: false,
    newPost: '',
    error: '',
    isUpdating: false,
    draft: {},
  },
  action) => {

  switch (action.type) {
    case SEND_POST_START:
      return ({
        ...state,
        isPosting: true,
        newPost: '',
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
        newPost: action.newPost,
      });
    case CLEAR_NEW_POST:
      return ({
        ...state,
        isPosting: false,
        newPost: '',
        error: '',
        draft: {},
      });
    case SHOW_EDIT_POST:
      return ({
        ...state,
        isUpdating: true,
        draft: action.draft,
      });
    case CANCEL_EDIT_POST:
      return ({
        ...state,
        isUpdating: false,
        draft: {},
      });
    default:
      return state
  }
}

export default sendPost;
