import SteemConnect from '../utils/auth/scAPI';
import { createPermlink } from '../components/pages/Steem/helpers/postHelpers';
import { jsonParse } from '../components/pages/Steem/helpers/formatter';

export const SEND_POST_START = 'SEND_POST_START';
export const SEND_POST_SUCCESS = 'SEND_POST_SUCCESS';
export const SEND_POST_ERROR = 'SEND_POST_ERROR';
export const CLEAR_NEW_POST = 'CLEAR_NEW_POST';
export const SHOW_EDIT_POST = 'SHOW_EDIT_POST';

/**
 *  Action creator for starting to send a post.
 *
 *  @return {object} The action data
 */
const sendPostStart = () => ({
  type: SEND_POST_START,
});

/**
 *  Action creator for successfully sending a post.
 *
 *  @return {object} The action data
 */
const sendPostSuccess = redirect => ({
  type: SEND_POST_SUCCESS,
  redirect,
});

/**
 *  Action creator for errors on sending a post.
 *
 *  @param {string} newPost Path to new poth
 *  @return {object} The action data
 */
const sendPostError = error => ({
  type: SEND_POST_ERROR,
  error,
});

/**
 *  Action creator for clearing a new post after the page is loaded.
 *
 *  @return {object} The action data
 */
export const clearSendPost = () => ({
  type: CLEAR_NEW_POST,
});

/**
 *  Action creator for starting to edit a post.
 *
 *  @return {object} The action data
 */
const showEditPost = (draft) => ({
  type: SHOW_EDIT_POST,
  draft,
});



const rewardsValues = {
  all: '100',
  half: '50',
  none: '0',
};

/**
 *  Extract some data from the post, and send it back as a post draft for the
 *  edit form to display and allow the user to edit.
 *
 *  @param {string} post Post object to edited
 *  @returns {function} Dispatches returned action object
 */
export const editPost = post => dispatch => {
  const jsonMetadata = jsonParse(post.json_metadata);

  const draft = {
    ...post,
    originalBody: post.body,
    jsonMetadata,
    isUpdating: true,
  };

  return dispatch(showEditPost(draft));
}

/**
 *  Uses SteemConnect to send a post to the Steem blockchain. This is either a
 *  new post, or to edit a post.
 *
 *  @param {string} post Post object to be sent or updated
 *  @returns {function} Dispatches returned action object
 */
export const sendPost = post => (dispatch, getState) => {
  dispatch(sendPostStart());

  const {
    auth: {
      user
    },
    sendPost: {
      isUpdating
    }
  } = getState();

  const {
    parentAuthor,
    parentPermlink,
    author,
    title,
    body,
    jsonMetadata,
    reward,
  } = post;

  const permLink = isUpdating
    ? Promise.resolve(post.permlink)
    : createPermlink(title, author, parentAuthor, parentPermlink);

  return permLink.then(permlink => {
    const operations = [];
    const commentOp = [
      'comment',
      {
        parent_author: parentAuthor,
        parent_permlink: parentPermlink,
        author,
        permlink,
        title,
        body,
        json_metadata: JSON.stringify(jsonMetadata),
      },
    ];
    operations.push(commentOp);

    const redirect = `/${parentPermlink}/@${author}/${permlink}`;

    if (isUpdating) {
      return SteemConnect.broadcast(operations)
        .then(res => {
          dispatch(sendPostSuccess(`/${parentPermlink}/@${author}/${permlink}`));
      });
    }

    const commentOptions = {
      author,
      permlink,
      allow_votes: true,
      allow_curation_rewards: true,
      max_accepted_payout: '1000000.000 SBD',
      percent_steem_dollars: 10000,
      extensions: [],
    };

    if (reward === rewardsValues.none) {
      commentOptions.max_accepted_payout = '0.000 SBD';
    } else if (reward === rewardsValues.all) {
      commentOptions.percent_steem_dollars = 0;
    }

    operations.push(['comment_options', commentOptions]);

    const now = Date.now();
    const lastPosted = localStorage.getItem('lastPostedAt-' + user);

    //Check if last post was less than 5 minuts ago.
    //Send error message or send post to Steem if under or over 5 minutes.
    if (lastPosted && (now - lastPosted) < 300000)
      return dispatch(sendPostError('Must wait 5 minutes between posts.'));
    else
      return SteemConnect.broadcast(operations)
        .then(res => {
          localStorage.setItem('lastPostedAt-' + user, now);
          setTimeout(() => dispatch(sendPostSuccess(redirect)), 1500);
      });
  })
}

export default sendPost;
