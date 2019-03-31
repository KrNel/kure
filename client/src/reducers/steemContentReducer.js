import {
  GET_SUMMARY_START,
  GET_SUMMARY_SUCCESS,
  GET_DETAILS_START,
  GET_DETAILS_SUCCESS,
  GET_GROUPS_SUCCESS,
  ADD_POST_EXISTS,
  ADD_POST_START,
  GROUP_SELECT,
  MODAL_SHOW,
  MODAL_CLOSE,
  UPVOTE_START,
  UPVOTE_SUCCESS,
  GET_COMMENTS_START,
  GET_COMMENTS_SUCCESS,
  SEND_COMMENT_START,
  SEND_COMMENT_SUCCESS,
} from '../actions/steemContentActions';

/**
 *  Reducer function for authentication data for logins or returning users.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const steemContent = (
  state = {
    isFetchingSummary: false,
    isFetchingDetails: false,
    isFetchingComments: false,
    prevPage: '',
    posts: [],
    noMore: false,
    groups: [{key: 0, text: 'No Groups', value: '0'}],
    postExists: false,
    addPostLoading: false,
    modalOpenAddPost: false,
    selectedGroup: '',
    addPostData: {},
    post: {},
    isUpvoting: false,
    upvotePayload: {
      author: '',
      permlink: '',
      votedPosts: [],
      post: {
        id: 0,
        active_votes: []
      }
    },
    isCommenting: false,
    commentedId: 0,
    commentPayload: {},
  },
  action) => {

  switch (action.type) {
    case GET_SUMMARY_START:
      return ({
        ...state,
        isFetchingSummary: true,
      });
    case GET_DETAILS_START:
      return ({
        ...state,
        isFetchingDetails: true,
      });
    case GET_COMMENTS_START:
      return ({
        ...state,
        isFetchingComments: true,
      });
    case GET_SUMMARY_SUCCESS:
      return ({
        ...state,
        isFetchingSummary: false,
        posts: action.posts,
        noMore: action.noMore,
        prevPage: action.prevPage,
      });
    case GET_DETAILS_SUCCESS:
      return ({
        ...state,
        isFetchingDetails: false,
        post: action.post,
      });
    case GET_COMMENTS_SUCCESS:
      return ({
        ...state,
        isFetchingComments: false,
        post: {
          ...state.post,
          replies: action.comments,
        }
      });
    case GET_GROUPS_SUCCESS:
      return ({
        ...state,
        groups: action.groups,
      });
    case ADD_POST_START:
      return ({
        ...state,
        addPostLoading: true,
      });
    case ADD_POST_EXISTS:
      return ({
        ...state,
        addPostLoading: false,
        postExists: action.postExists,
      });
    case GROUP_SELECT:
      return ({
        ...state,
        selectedGroup: action.selectedGroup,
        postExists: false,
      });
    case MODAL_SHOW:
      return ({
        ...state,
        addPostData: action.addPostData,
        modalOpenAddPost: true,
      });
    case MODAL_CLOSE:
      return ({
        ...state,
        modalOpenAddPost: false,
        addPostLoading: false,
        postExists: false,
      });
    case UPVOTE_START:
      return ({
        ...state,
        upvotePayload: {
          isUpvoting: true,
          votedPosts: [...state.upvotePayload.votedPosts],
          ...action.payload,
        }
      });
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
    default:
      return state
  }
}

export default steemContent;
