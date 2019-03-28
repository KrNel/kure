import { Client } from 'dsteem';

import { getUserGroups, addPost, logger } from '../utils/fetchFunctions';
import SteemConnect from '../utils/auth/scAPI';
import { createPostMetadata, createCommentPermlink } from '../components/pages/Steem/helpers/postHelpers';
import {handleReturning} from './authActions';

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
export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';
export const SEND_COMMENT_START = 'SEND_COMMENT_START';
export const SEND_COMMENT_SUCCESS = 'SEND_COMMENT_SUCCESS';
export const GET_COMMENT_START = 'GET_COMMENT_START';
export const GET_COMMENT_SUCCESS = 'GET_COMMENT_START';

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
 *  @return {object} The action data
 */
export const summarySuccess = (posts, noMore, prevPage) => ({
  type: GET_SUMMARY_SUCCESS,
  posts,
  noMore,
  prevPage,
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
 *  Action creator for starting retrieval of comments data.
 *
 *  @return {object} The action data
 */
export const commentsStart = () => ({
  type: GET_COMMENTS_START,
});

/**
 *  Action creator for successful retrieval of comments data.
 *
 *  @param {object} comments Post to display
 *  @return {object} The action data
 */
export const commentsSuccess = (comments) => ({
  type: GET_COMMENTS_SUCCESS,
  comments,
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
    post: {
      id: 0,
      active_votes: [],
    },
  }
});

/**
 *  Action creator for successful upvote
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @return {object} The action data
 */
export const upvoteSuccess = (author, permlink, post) => ({
  type: UPVOTE_SUCCESS,
  payload: {
    author,
    permlink,
    post,
  }
});

/**
 *  Action creator for starting to send a comment.
 *
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const sendCommentStart = parentId => ({
  type: SEND_COMMENT_START,
  parentId,
});

/**
 *  Action creator for successfully sending a comment.
 *
 *  @param {string} comment Comment added to post
 *  @param {string} parentId Id of parent post being commented on
 *  @return {object} The action data
 */
export const sendCommentSuccess = (comment, parentId) => ({
  type: SEND_COMMENT_SUCCESS,
  comment,
  parentId,
});

/**
 *  Fetch the post details from Steem.
 *
 *  @param {string} selectedFilter Filter sort order
 *  @param {object} query Steem query to fetch.
 *  @param {boolean} nextPost If there are preceeding posts
 *  @returns {function} Dispatches returned action object
 */
export const getSummaryContent = (selectedFilter, query, nextPost, page) => (dispatch, getState) => {
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

      dispatch(getGroupsFetch());

      dispatch(summarySuccess(newPosts, noMore, page));
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
    .then(post => {
      dispatch(getGroupsFetch());

      dispatch(detailsSuccess(post));
      if (post.children > 0) {
        dispatch(getPostComments(post.author, post.permlink));
      }
    })
}

/**
 *  Fetch the post's comment from Steem. Send start and success dispatches
 *  after the recursive comment fetch is done.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const getPostComments = (author, permlink) => (dispatch, getState) => {
  dispatch(commentsStart());

  return postCommentsRecursive(author, permlink)
    .then(comments => {
      dispatch(commentsSuccess(comments))
    });
}

/**
 *  Recursively get the post's comments, looping through until no more
 *  children replies are found. As each comment is found, get the active votes
 *  and add it to the comment object. Otherwise, there 'active_votes' fetch
 *  from content replies is empty.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
const postCommentsRecursive = (author, permlink) => {
  return client.database.call('get_content_replies', [author, permlink])
    .then(replies => Promise.all(replies.map(r => {
      client.database
        .call('get_active_votes', [r.author, r.permlink])
        .then(av => {
          r.active_votes = av;
          return r;
        });
      if (r.children > 0) {
        return postCommentsRecursive(r.author, r.permlink)
          .then(children => {
            r.replies = children;
            return r;
          })
      }else {
        return r;
      }
    })))
}

/**
 *  Get a single comment.
 *
 *  @param {string} author Author of comment
 *  @param {string} permlink Permlink of comment
 *  @returns {function} Dispatches returned action object
 */
export const getComment = (author, permlink) => {
  return new Promise((resolve, reject) => {
    client.database.call('get_content', [author, permlink])
    .then(comment => {
      resolve(comment);
    });
  });
}

/**
 *  Fetch the comments for a user from Steem.
 *
 *  @param {string} author Author of post
 *  @param {string} permlink Permlink of post
 *  @returns {function} Dispatches returned action object
 */
export const getUserComments = (author, permlink) => (dispatch, getState) => {
  dispatch(detailsStart());
  return client.database.getDiscussions('comments', {tag: 'krnel'})
    .then(result => {
      dispatch(detailsSuccess(result));
  })
}

/**
 *  Fetch the groups for groups selection when adding a post.
 *
 *  @param {string} user User to get groups for
 *  @returns {function} Dispatches returned action object
 */
const getGroupsFetch = () => async (dispatch, getState) => {
  //on first page load authenticate before proceeding
  const { user } = getState().auth;
  const cont = await user === '' ? handleReturning() : '';

  const { groups } = getState().steemContent;
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

  return SteemConnect.vote(user, author, permlink, weight)
    .then(res => {
      client.database.call('get_content', [author, permlink])
        .then(post => {
          dispatch(upvoteSuccess(author, permlink, post));
        })
    }).catch((err) => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
}

/**
 *  Uses SteemConnect to send a comment to the Steem blockchain.
 *
 *  @param {string} parentPost Parent being commented on
 *  @param {string} body Comment body
 *  @returns {function} Dispatches returned action object
 */
export const sendComment = (parentPost, body) => (dispatch, getState) => {
  dispatch(sendCommentStart(parentPost.id));
  const {
    auth: {
      user
    },
  } = getState();

  const { category, id, permlink: parentPermlink, author: parentAuthor } = parentPost;

  const author = user;
  const permlink = createCommentPermlink(parentAuthor, parentPermlink)

  const jsonMetadata = createPostMetadata(
    body,
    [category],
  );

  return SteemConnect
    .comment(parentAuthor, parentPermlink, author, permlink, '', body, jsonMetadata)
    .then(res => {
      if (res.result.block_num) {
        getComment(author, permlink)
          .then(comment => {
            dispatch(sendCommentSuccess(comment, id));
          })
      }
    });
}

export default getSummaryContent;
