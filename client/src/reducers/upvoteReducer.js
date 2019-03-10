import {
  UPVOTE_START,
  UPVOTE_SUCCESS,
} from '../actions/upvoteActions';


/**
 *  Reducer function for authentication data for logins or returning users.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const upvotePost = (
  state = {
    isUpvoting: false
  },
  action) => {

  switch (action.type) {
    case UPVOTE_START:
      return ({
        ...state,
        isUpvoting: true
      });
    case UPVOTE_SUCCESS:
      return ({
        ...state,
        isUpvoting: false,
        /*isAuthorizing: action.isAuthorizing,
        userData: action.userData,
        csrf: action.csrf || '',
        lastUpdated: action.authedAt*/
      });
    default:
      return state;
  }
}

export default upvotePost;
