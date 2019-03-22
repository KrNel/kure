import React, {Component} from 'react';

import ReplyForm from './ReplyForm';
import Body from './PostBody';
import Avatar from '../Avatar';
import Author from '../Author';
import TimeAgo from '../TimeAgo';
import './Comment.css';

/**
 *  Comment component to display the autho, avatar, time and content.
 */
class Comment extends Component {
  state = {
    showReplyForm: false,
  }

  onShowReplyForm = (e) => {
    e.preventDefault();
    const { showReplyForm } = this.state;
    this.setState({ showReplyForm: !showReplyForm, showEdit: false });
  };

  render() {
    const {
      state: {
        showReplyForm,
        replyData,
      },
      props: {
        comment,
        sortComments,
        sendComment,
        isCommenting,
        commentedId,
      }
    } = this;

    const depth = comment.depth;

    const replyForm =
      showReplyForm
      ? (
        <ReplyForm
          sendComment={sendComment}
          isCommenting={isCommenting}
          parentPost={comment}
          commentedId={commentedId}
        />
      )
      : null;

    let replyClass = depth + 1 > 5 ? 'repliesNoIndent' : 'replies';

    return (
      <React.Fragment>
        <div id={`comment-${comment.id}`} className={`comment depth-${depth}`}>
          <ul className='commentList'>
            <li className='commentAvatar'>
              <Avatar author={comment.author} height='40px' width='40px' />
            </li>
            <li className='commentContent'>
              <div className='commentHead'>
                <Author author={comment.author} />
                {`\u00A0\u2022\u00A0`}
                <TimeAgo date={comment.created} />
              </div>
              <div className='commentBody'>
                <Body
                  full
                  rewriteLinks={false}
                  body={comment.body}
                  json_metadata={comment.json_metadata}
                />
              </div>
              
            </li>
            <div className='clear' />
          </ul>
          <div className='clear' />
        </div>
        {
          comment.children > 0
          && (
          <ul className={replyClass}>
            {
              sortComments(comment.replies, 'new').map(reply => (
                <li className='commentReply' key={reply.id}>
                  <Comment
                    comment={reply}
                    sortComments={sortComments}
                    sendComment={sendComment}
                    isCommenting={isCommenting}
                    commentedId={commentedId}
                  />
                </li>
              ))
            }
          </ul>
          )
        }
      </React.Fragment>
    )
  }
}

export default Comment;
