import React from 'react';

import Comment from './Comment';
import './Comments.css';

/**
 *  Sort the comments.
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
 *  Comments container.
 */
const Comments = ({
  comments,
  sendComment,
  isCommenting,
  commentedId,
  isAuth
}) => {

  let displayComments = '';

  if (comments) {
    const sorted = sortComments(comments, 'new');

    displayComments = sorted.map(comment => (
      <li key={comment.id}>
        <Comment
          comment={comment}
          sortComments={sortComments}
          sendComment={sendComment}
          isCommenting={isCommenting}
          commentedId={commentedId}
          isAuth={isAuth}
        />
      </li>
    ))
  }

  return (
    <React.Fragment>
      <ul>
        {
          displayComments
        }
      </ul>
    </React.Fragment>
  )
}

export default Comments;
