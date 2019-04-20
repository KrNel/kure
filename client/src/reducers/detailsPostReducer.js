import {
  GET_DETAILS_START,
  GET_DETAILS_SUCCESS,
  CLEAR_POST,
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
      });
    default:
      return state
  }
}

export default detailsPost;
