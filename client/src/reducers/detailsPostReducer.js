import {
  GET_DETAILS_START,
  GET_DETAILS_SUCCESS,
  CLEAR_POST,
  DELETE_POST_START,
  DELETE_POST_SUCCESS,
} from '../actions/detailsPostActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const detailsPost = (
  state = {
    isFetchingDetails: false,
    post: {},
    isDeleting: false,
    redirect: '',
  },
  action) => {

  switch (action.type) {
    case GET_DETAILS_START:
      return ({
        ...state,
        isFetchingDetails: true,
      });
    case GET_DETAILS_SUCCESS:
      return ({
        ...state,
        isFetchingDetails: false,
        post: action.post,
      });
    case CLEAR_POST:
      return ({
        ...state,
        isFetchingDetails: false,
        post: {},
        redirect: '',
        isDeleting: false,
      });
    case DELETE_POST_START:
      return ({
        ...state,
        isDeleting: true,
      });
    case DELETE_POST_SUCCESS:
      return ({
        ...state,
        isDeleting: false,
        redirect: action.redirect,
      });
    default:
      return state
  }
}

export default detailsPost;
