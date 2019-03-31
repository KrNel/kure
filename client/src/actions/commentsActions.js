import { Client } from 'dsteem';

const client = new Client('https://hive.anyx.io/');

export const GET_COMMENTS_START = 'GET_COMMENTS_START';
export const GET_COMMENTS_SUCCESS = 'GET_COMMENTS_SUCCESS';

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

export default getPostComments;
