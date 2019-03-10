/*
steemConnectAPI.vote(voter, post.author, post.permlink, weight).then(res => {

}
*/
//import axios from 'axios';
import scAPI from '../utils/auth/scAPI';

export const UPVOTE_START = 'UPVOTE_START';
export const UPVOTE_SUCCESS = 'UPVOTE_SUCCESS';

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @return {object} The action data
 */
export const upvoteStart = () => ({
  type: UPVOTE_START,
});

/**
 *  Action creator for requesting returning user athentication.
 *
 *  @param {object} res Results of the database fetch
 *  @return {object} The action data
 */
export const upvoteSuccess = (res, author, permlink) => ({
  type: UPVOTE_SUCCESS,
  author,
  permlink,
});

/**
 *  Function to fetch the returning user authentication from the database.
 *
 *  @param {function} dispatch Redux dispatch function
 *  @returns {function} Dispatches returned action object
 */
export const upvotePost = (voter, author, permlink, weight) => dispatch => {
  dispatch(upvoteStart());

  //return scAPI.vote(voter, author, permlink, weight)
  return scAPI.vote('krnel', 'krnel', 're-practicalthought-re-krnel-u-s-witch-hunt-against-wikileaks-and-assange-amplifies-with-grand-jury-subpoena-for-chelsea-manning-20190305t053142624z', 1)
    .then(res => {
console.log('res:',res)
      dispatch(upvoteSuccess(res, author, permlink));
    });
}
