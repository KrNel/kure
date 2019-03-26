import React from 'react';
import PropTypes from 'prop-types';

import {hasLength} from '../../../../utils/helpers';
import Comment from './Comment';
import './Comments.css';

/**
 *  Sort the comments array by either date/new, payout amount, or upvotes, and
 *  in ascending or descending order.
 *
 *  @param {array} comments Comments to sort
 *  @param {string} sortBy Type of sorting to apply
 */
const sortComments = (comments, sortBy) => {
  let sorted = '';

  if (sortBy === 'new') {
    const order = 'created';
    sorted = comments.sort((a, b) => Date.parse(a[order]) - Date.parse(b[order]))
  }

  return sorted;
};

/**
 *  Comments container to process the first root level of comments of a post.
 *  Additionally, any new comments in `commentPayload` at the root level of
 *  the posts are also sent to render as a comment separately from the
 *  fetches comments.
 *
 *  @param {array} comments Comments to sort
 */
const Comments = (props) => {

  const {
    comments,
    sendComment,
    isCommenting,
    commentedId,
    isAuth,
    commentPayload,
    pid,
    user,
    handleUpvote,
    upvotePayload,
  } = props;

  return (
    <React.Fragment>
      <ul>
        {
          sortComments(comments, 'new').map(comment => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                sortComments={sortComments}
                sendComment={sendComment}
                isCommenting={isCommenting}
                commentedId={commentedId}
                isAuth={isAuth}
                commentPayload={commentPayload}
                handleUpvote={handleUpvote}
                upvotePayload={upvotePayload}
                user={user}
              />
            </li>
          ))
        }
        {
          hasLength(commentPayload) && commentPayload[pid] &&
          sortComments(commentPayload[pid], 'new').map(comment => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                sortComments={sortComments}
                sendComment={sendComment}
                isCommenting={isCommenting}
                commentedId={commentedId}
                isAuth={isAuth}
                commentPayload={commentPayload}
                handleUpvote={handleUpvote}
                upvotePayload={upvotePayload}
                user={user}
              />
            </li>
          ))
        }
      </ul>
    </React.Fragment>
  )
}

Comments.propTypes = {
  user: PropTypes.string.isRequired,
  isAuth: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(PropTypes.object.isRequired),
  handleUpvote: PropTypes.func.isRequired,
  upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
  sendComment: PropTypes.func.isRequired,
  isCommenting: PropTypes.bool.isRequired,
  commentedId: PropTypes.number,
  commentPayload: PropTypes.shape(PropTypes.object.isRequired),
  pid: PropTypes.number.isRequired,
};

Comments.defaultProps = {
  upvotePayload: {},
  commentPayload: {},
  commentedId: 0,
  comments: [],
}

export default Comments;
