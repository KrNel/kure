import React from 'react';

import Comment from './Comment';
import './Comments.css';

const iterateComments = comments => {
  const sorted = sortComments(comments, 'date');

  return sorted.map(comment => {
    if (comment.replies.length > 0) {
      return (
        <li key={comment.id}>
          <Comment comment={comment} />
          <ul>{iterateComments(comment.replies)}</ul>
        </li>
      )
    }else {
      return (
        <li key={comment.id}>
          <Comment comment={comment} />
        </li>
      )
    }
  });
}

const sortComments = (comments, sortBy) => {
  let sorted = '';

  if (sortBy === 'date') {
    const order = 'created';
    sorted = comments.sort((a, b) => Date.parse(a[order]) - Date.parse(b[order]))
  }

  return sorted;
};

//const commentsSorted = sortComments(comments, 'date').reverse();
//const commentsSorted = comments => sortComments(comments, 'date');

const Comments = ({comments}) => {

  let displayComments = '';
  if (comments)
    displayComments = iterateComments(comments);

  return (
    <React.Fragment>
      <div>Comments</div>
      <ul>
        {
          displayComments
        }
      </ul>
    </React.Fragment>
  )
}

export default Comments;
