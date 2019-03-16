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
    isFetching: false,
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
      post: {
        id: 0,
        active_votes: []
      }
    }
  },
  action) => {
  switch (action.type) {
    case GET_SUMMARY_START:
    case GET_DETAILS_START:
      return ({
        ...state,
        isFetching: true,
      });
    case GET_SUMMARY_SUCCESS:
      return ({
        ...state,
        isFetching: false,
        posts: action.posts,
        noMore: action.noMore,
      });
    case GET_DETAILS_SUCCESS:
      return ({
        ...state,
        isFetching: false,
        post: action.post,
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
          ...action.payload,
        }
      });
    case UPVOTE_SUCCESS:
      return ({
        ...state,
        upvotePayload: {
          isUpvoting: false,
          ...action.payload,
        }
      });
    default:
      return state
  }
}

export default steemContent;
