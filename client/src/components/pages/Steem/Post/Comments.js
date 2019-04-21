import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { hasLength, getUpvotes, sumPayout } from '../../../../utils/helpers';
import { deleteComment } from '../../../../actions/commentsActions';
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
  switch (sortBy) {
    case 'new': {
      const order = 'created';
      return comments.sort((a, b) => Date.parse(a[order]) - Date.parse(b[order])).reverse();
    }
    case 'old': {
      const order = 'created';
      return comments.sort((a, b) => Date.parse(a[order]) - Date.parse(b[order]));
    }
    case 'votes': {
      return comments.sort((a, b) => getUpvotes(a.active_votes).size - getUpvotes(b.active_votes).size);
    }
    case 'rep': {
      return comments.sort((a, b) => b.author_reputation - a.author_reputation);
    }
    case 'payout': {
      return comments.sort((a, b) => {
        if (a.net_rshares < 0) {
          return 1;
        } else if (b.net_rshares < 0) {
          return -1;
        }

        const aPayout = sumPayout(a);
        const bPayout = sumPayout(b);

        if (aPayout !== bPayout) {
          return bPayout - aPayout;
        }

        return b.net_rshares - a.net_rshares;
      });
    }
    default:
      return comments;
  }
}

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
    sortBy,
    editingComment,
    isUpdating,
    updatedComment,
    updatedId,
    commentDeleting,
    isDeleting,
  } = props;

  const handleDeleteComment = (e, author, permlink, commentPayload) => {
    e.preventDefault();
    const { sendDeleteComment } = props;
    sendDeleteComment(author, permlink, commentPayload);
  }

  return (
    <React.Fragment>
      <ul>
        {
          sortComments(comments, sortBy).map(comment => (
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
                sortBy={sortBy}
                editingComment={editingComment}
                isUpdating={isUpdating}
                updatedComment={updatedComment}
                updatedId={updatedId}
                sendDeleteComment={handleDeleteComment}
                commentDeleting={commentDeleting}
                isDeleting={isDeleting}
              />
            </li>
          ))
        }
        {
          hasLength(commentPayload) && commentPayload[pid] &&
          sortComments(commentPayload[pid], sortBy).map(comment => (
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
                sortBy={sortBy}
                editingComment={editingComment}
                isUpdating={isUpdating}
                updatedComment={updatedComment}
                updatedId={updatedId}
                sendDeleteComment={handleDeleteComment}
                commentDeleting={commentDeleting}
                isDeleting={isDeleting}
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
  sortBy: PropTypes.string.isRequired,
  editingComment: PropTypes.number,
  isUpdating: PropTypes.bool,
  updatedComment: PropTypes.shape(PropTypes.object.isRequired),
  updatedId: PropTypes.number,
  sendDeleteComment: PropTypes.func.isRequired,
};

Comments.defaultProps = {
  upvotePayload: {},
  commentPayload: {},
  commentedId: 0,
  comments: [],
  editingComment: 0,
  isUpdating: false,
  updatedComment: {},
  updatedId: 0,
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
 const mapStateToProps = state => {
   const {
     sendComment: {
       editingComment,
       isUpdating,
       updatedComment,
       updatedId,
       isDeleting,
       commentDeleting,
     },
   } = state;

   return {
     editingComment,
     isUpdating,
     updatedComment,
     updatedId,
     isDeleting,
     commentDeleting,
   }
 }

 /**
  *  Map redux dispatch functions to component props.
  *
  *  @param {object} dispatch - Redux dispatch
  *  @returns {object} - Object with recent activity data
  */
 const mapDispatchToProps = dispatch => (
  {
    sendDeleteComment: (author, permlink, commentPayload) => (
      dispatch(deleteComment(author, permlink, commentPayload))
    ),
  }
 );

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
