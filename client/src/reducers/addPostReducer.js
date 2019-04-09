import {
  ADD_POST_EXISTS,
  ADD_POST_START,
  MODAL_SHOW,
  MODAL_CLOSE,
  GROUP_SELECT,
} from '../actions/addPostActions';

/**
 *  Reducer function for Steem data.
 *
 *  @param {object} state Redux state, default values set
 *  @param {object} action Action dispatched
 *  @returns {object} The authentication data, or default state
 */
export const addPost = (
  state = {
    postExists: false,
    addPostLoading: false,
    modalOpenAddPost: false,
    addPostData: {},
    selectedGroup: '',
  },
  action) => {

  switch (action.type) {
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
    case GROUP_SELECT:
      return ({
        ...state,
        selectedGroup: action.selectedGroup,
        postExists: false,
      });
    default:
      return state
  }
}

export default addPost;
