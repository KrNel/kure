import { addPost, logger } from '../utils/fetchFunctions';

export const ADD_POST_EXISTS = 'ADD_POST_EXISTS';
export const ADD_POST_START = 'ADD_POST_START';
export const MODAL_SHOW = 'MODAL_SHOW';
export const MODAL_CLOSE = 'MODAL_CLOSE';
export const GROUP_SELECT = 'GROUP_SELECT';

/**
 *  Action creator for starting post add.
 *
 *  @return {object} The action data
 */
export const addPostStart = () => ({
  type: ADD_POST_START,
});


/**
 *  Action creator for requesting returning user athentication.
 *
 *  @param {boolean} postExists Post to display
 *  @return {object} The action data
 */
export const addPostExists = (postExists) => ({
  type: ADD_POST_EXISTS,
  postExists,
});

/**
 *  Shows the popup modal for user confirmation.
 *
 *  @param {event} event Event triggered by element to handle
 *  @param {string} type Type of modal being used
 *  @param {object} data Data from the modal to process
 *  @param {object} modalData Post and user data for the modal
 *  @return {object} The action data
 */
export const showModal = (event, type, data) => {
  event.preventDefault();
  return ({
    type: MODAL_SHOW,
    addPostData: data,
  });
}

/**
 *  Hides the popup modal.
 */
export const onModalCloseAddPost = () => ({
  type: MODAL_CLOSE,
});

/**
 *  Set state values for when group select changes.
 *  Reset post exists error flag.
 *
 *  @param {string} value Value of the element triggering the event
 *  @return {object} The action data
 */
export const handleGroupSelect = value => ({
  type: GROUP_SELECT,
  selectedGroup: value,
});

/**
 *  Handle the Yes or No confirmation from the modal.
 *  If Yes, proceed with deletion of post or user.
 *
 *  @param {event} e Event triggered by element to handle
 *  @returns {function} Dispatches returned action object
 */
export const handleModalClickAddPost = event => dispatch => {
  const confirm = event.target.dataset.confirm;
  if (confirm === 'true')
    dispatch(addPostFetch());
  else
    dispatch(onModalCloseAddPost());
}

/**
 *  Send new post to be added to the database.
 *  Reset the flags depending on errors or not, add new post to posts state.
 */
const addPostFetch = () => (dispatch, getState) => {
  const {
    auth: {
      user,
      csrf
    },
    addPost: {
      selectedGroup,
      addPostData
    }
  } = getState();

  addPost({group: selectedGroup, user, ...addPostData}, csrf)
  .then(res => {
    if (!res.data.invalidCSRF) {
      if (res.data.exists) {
        const postExists = true;
        dispatch(addPostExists(postExists));
      }else if (res.data.post) {
        dispatch(onModalCloseAddPost());
      }
    }
  }).catch((err) => {
    logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
  });
}

export default handleModalClickAddPost;
