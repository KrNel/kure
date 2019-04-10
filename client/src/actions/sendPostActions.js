import SteemConnect from '../utils/auth/scAPI';
import { createPermlink } from '../components/pages/Steem/helpers/postHelpers';

export const SEND_POST_START = 'SEND_POST_START';
export const SEND_POST_SUCCESS = 'SEND_POST_SUCCESS';
export const SEND_POST_ERROR = 'SEND_POST_ERROR';
export const CLEAR_NEW_POST = 'CLEAR_NEW_POST';

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
const sendPostSuccess = newPost => ({
  type: SEND_POST_SUCCESS,
  newPost,
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

export const clearNewPost = () => ({
  type: CLEAR_NEW_POST,
});

const rewardsValues = {
  all: '100',
  half: '50',
  none: '0',
};

/**
 *  Uses SteemConnect to send a comment to the Steem blockchain.
 *
 *  @param {string} parentPost Parent being commented on
 *  @param {string} body Comment body
 *  @returns {function} Dispatches returned action object
 */
export const sendPost = post => (dispatch, getState) => {
  dispatch(sendPostStart());

  const {
    auth: {
      user
    },
  } = getState();

  const now = Date.now();
  const lastPosted = localStorage.getItem('lastPostedAt-' + user);
  //TODO: send message about 5minute posting limit
  if (lastPosted && (now - lastPosted) < 300000)
    dispatch(sendPostError('Must wait 5 minutes between posts.'));

  const {
    parentAuthor,
    parentPermlink,
    author,
    title,
    body,
    jsonMetadata,
    reward,
  } = post;

  const permLink = createPermlink(title, author, parentAuthor, parentPermlink);

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

    return SteemConnect.broadcast(operations)
      .then(res => {
        localStorage.setItem('lastPostedAt-' + user, now);
        dispatch(sendPostSuccess(`/${parentPermlink}/@${author}/${permlink}`));
    });
  })

}

export default sendPost;