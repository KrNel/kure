import {
  UPVOTE_START,
  UPVOTE_SUCCESS,
  VOTE_FAILED,
  DOWNVOTE_START,
  DOWNVOTE_SUCCESS,
} from '../actions/upvoteActions';

/**
 *  Reducer function for upvoting posts and comments on Steem. Determines if
 *  a post is being upvoted, which author and permlink is voted, which post or
 *  comment is currently voted on, and the list of recent upvotes.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const upvote = (
  state = {
    upvotePayload: {
      isUpvoting: false,
      isDownvoting: false,
      author: '',
      permlink: '',
      votedPosts: [],
      post: {
        id: 0,
        active_votes: []
      },
      error: '',
    },
  },
  action) => {

  switch (action.type) {
    case UPVOTE_START:
      return ({
        ...state,
        upvotePayload: {
          isUpvoting: true,
          votedPosts: [...state.upvotePayload.votedPosts],
          ...action.payload,
          error: '',
        }
      });
    case VOTE_FAILED:
    case UPVOTE_SUCCESS:
      return ({
        ...state,
        upvotePayload: {
          isUpvoting: false,
          votedPosts: [
            ...state.upvotePayload.votedPosts,
            action.payload.post
          ],
          ...action.payload,
        }
      });
    case DOWNVOTE_START:
      return ({
        ...state,
        upvotePayload: {
          isDownvoting: true,
          votedPosts: [...state.upvotePayload.votedPosts],
          ...action.payload,
          error: '',
        }
      });
    case DOWNVOTE_SUCCESS:
      return ({
        ...state,
        upvotePayload: {
          isDownvoting: false,
          votedPosts: [
            ...state.upvotePayload.votedPosts,
            action.payload.post
          ],
          ...action.payload,
        }
      });
    default:
      return state
  }
}

export default upvote;
