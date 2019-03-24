import React from 'react';

import {hasLength} from '../../helpers/helpers';
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
 */
const Comments = ({
  comments,
  sendComment,
  isCommenting,
  commentedId,
  isAuth,
  commentPayload,
  pid,
}) => {

console.log('comments',comments)
console.log('commentPayload',commentPayload)
console.log('commentPayload[pid]',commentPayload[pid])

//console.log('Object.keys(commentPayload)',Object.keys(commentPayload))
//console.log('Object.getOwnPropertyNames(commentPayload)',Object.getOwnPropertyNames(commentPayload))
//console.log('commentPayload.hasOwnProperty(pid)',commentPayload.hasOwnProperty(pid))
//console.log('Object.keys(commentPayload).includes(pid)',Object.keys(commentPayload).includes(pid))
//Object.keys(commentPayload).map(c => c == pid)

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
              />
            </li>
          ))
        }
      </ul>
    </React.Fragment>
  )
}

export default Comments;
