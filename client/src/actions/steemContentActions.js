//import axios from 'axios';
import axios from 'axios';
import { Client } from 'dsteem';
import Cookies from 'js-cookie';

import { getUserGroups, addPost, logger, upvote } from '../utils/fetchFunctions';
import SteemConnect from '../utils/auth/scAPI';
import {SC_COOKIE} from '../settings';

const client = new Client('https://hive.anyx.io/');

export const GET_SUMMARY_START = 'GET_SUMMARY_START';
export const GET_SUMMARY_SUCCESS = 'GET_SUMMARY_SUCCESS';
export const GET_DETAILS_START = 'GET_DETAILS_START';
export const GET_DETAILS_SUCCESS = 'GET_DETAILS_SUCCESS';
export const GET_GROUPS_SUCCESS = 'GET_GROUPS_SUCCESS';
export const ADD_POST_EXISTS = 'ADD_POST_EXISTS';
export const ADD_POST_START = 'ADD_POST_START';
export const GROUP_SELECT = 'GROUP_SELECT';
export const MODAL_SHOW = 'MODAL_SHOW';
export const MODAL_CLOSE = 'MODAL_CLOSE';
export const UPVOTE_START = 'UPVOTE_START';
export const UPVOTE_SUCCESS = 'UPVOTE_SUCCESS';

/**
 *  Action creator for starting retrieval of post summary data.
 *
 *  @return {object} The action data
 */
export const summaryStart = () => ({
  type: GET_SUMMARY_START,
});

/**
 *  Action creator for successful retrieval of post summary data.
 *
 *  @param {array} posts Posts to display
 *  @param {boolean} noMore If there are more posts to fetch
 *  @return {object} The action data
 */
export const summarySuccess = (posts, noMore) => ({
  type: GET_SUMMARY_SUCCESS,
  posts,
  noMore,
});

/**
 *  Action creator for starting retrieval of post detail data.
 *
 *  @return {object} The action data
 */
export const detailsStart = () => ({
  type: GET_DETAILS_START,
});

/**
 *  Action creator for successful retrieval of post detail data.
 *
 *  @param {object} post Post to display
 *  @return {object} The action data
 */
export const detailsSuccess = (post) => ({
  type: GET_DETAILS_SUCCESS,
  post,
});

/**
 *  Action creator for successful retrieval of group data.
 *
 *  @param {array} groups Groups to select from
 *  @return {object} The action data
 */
export const groupsSuccess = (groups) => ({
  type: GET_GROUPS_SUCCESS,
  groups,
});

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
 *  Set state values for when group select changes.
 *  Reset post exists error flag.
 *
 *  @param {string} value Value of the element triggering the event
 *  @return {object} The action data
 */
export const handleGroupSelect = (value) => ({
  type: GROUP_SELECT,
  selectedGroup: value,
});

/**
 *  Shows the popup modal for user confirmation.
 *
 *  @param {event} e Event triggered by element to handle
 *  @param {string} type Type of modal being used
 *  @param {object} data Data from the modal to process
 *  @param {object} modalData Post and user data for the modal
 *  @return {object} The action data
 */
export const showModal = (e, type, data) => {
  e.preventDefault();
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
 *  Action creator for starting an upvote
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const upvoteStart = (author, permlink) => ({
  type: UPVOTE_START,
  payload: {
    author,
    permlink,
    voters: [],
  }
});

/**
 *  Action creator for successful upvote
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const upvoteSuccess = (author, permlink, voters) => ({
  type: UPVOTE_SUCCESS,
  payload: {
    author,
    permlink,
    voters,
  }
});

/**
 *  Fetch the post details from Steem.
 *
 *  @param {string} selectedFilter Filter sort order
 *  @param {object} query Steem query to fetch.
 *  @param {boolean} nextPost If there are preceeding posts
 *  @returns {function} Dispatches returned action object
 */
export const getSummaryContent = (selectedFilter, query, nextPost) => (dispatch, getState) => {
  dispatch(summaryStart());

  return client.database.getDiscussions(selectedFilter, query)
    .then(result => {
      let noMore = false;
      let newPosts = null;

      if (result) {
        if (nextPost) {
          newPosts = [...getState().steemContent.posts, ...result.slice(1)];
        }else {
          newPosts = result;
        }
      }else {
        noMore = true;
        newPosts = getState().posts;
      }

      const {user} = getState().auth;
      if (user)
        dispatch(getGroupsFetch(user));

      dispatch(summarySuccess(newPosts, noMore));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

/**
 *  Fetch the post details from Steem.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const getDetailsContent = (author, permlink) => (dispatch, getState) => {
  dispatch(detailsStart());
  return client.database.call('get_content', [author, permlink])
    .then(result => {

      const {user} = getState().auth;
      if (user)
        dispatch(getGroupsFetch(user));

      dispatch(detailsSuccess(result));
  })
}

/**
 *  Fetch the groups for groups selection when adding a post.
 *
 *  @param {string} user User to get groups for
 *  @returns {function} Dispatches returned action object
 */
const getGroupsFetch = (user) => (dispatch, getState) => {
  const {groups} = getState().steemContent;
  if (groups[0].text !== "No Groups") return;

  return getUserGroups(user, 'all')
    .then(res => {
      const groups = res.data.groups.map((g, i) => {
        return {key: i, value: g.name, text: g.display}
      })
      dispatch(groupsSuccess(groups));
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

/**
 *  Handle the Yes or No confirmation from the modal.
 *  If Yes, proceed with deletion of post or user.
 *
 *  @param {event} e Event triggered by element to handle
 *  @returns {function} Dispatches returned action object
 */
export const handleModalClickAddPost = (e) => dispatch => {
  const confirm = e.target.dataset.confirm;
  //const {addPost, onModalCloseAddPost} = this.props;
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
    steemContent: {
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

/**
 *  Uses SteemConnect to upvote a post by author and permlink with specified
 *  vote weight percentage.
 *
 *  @param {string} author Author to upvote
 *  @param {string} permlink Post permlink to upvote
 *  @param {number} weight Vote weight percentage to upvote with
 *  @returns {function} Dispatches returned action object
 */
export const upvotePost = (author, permlink, weight) => (dispatch, getState) => {
  dispatch(upvoteStart(author, permlink));

  const {
    auth: {
      user
    },
  } = getState();

  const accessToken = Cookies.get(SC_COOKIE)
  SteemConnect.setAccessToken(accessToken);

  return SteemConnect.vote(user, author, permlink, weight)
    .then(res => {
      client.database.call('get_active_votes', [author, permlink])
        .then(voters => {
          dispatch(upvoteSuccess(author, permlink, voters));
        })
    }).catch((err) => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });

}

export default getSummaryContent;
