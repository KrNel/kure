import React, {Component} from 'react';

import ReplyForm from './ReplyForm';
import Body from './PostBody';
import Avatar from '../Avatar';
import AuthorReputation from '../AuthorReputation';
import PostLink from '../../../common/PostLink';
import {long} from '../../../../utils/timeFromNow';
import {hasLength} from '../../helpers/helpers';
import './Comment.css';

/**
 *  Comment component to display the author, avatar, time and content.
 */
class Comment extends Component {
  state = {
    showReplyForm: false,
  }

  /**
   *  When the 'Reply' link is clicked for a comment, this runs to change the
   * state of the 'showReplyForm' var to toogle showing/hiding the reply form.
   */
  onShowReplyForm = (e) => {
    e.preventDefault();
    this.toggleReplyForm();
  };

  toggleReplyForm = () => {
    const { showReplyForm } = this.state;
    this.setState({ showReplyForm: !showReplyForm, showEdit: false });
  }

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
        isAuth,
        commentPayload,
      }
    } = this;

    const depth = comment.depth;

    const replyForm =
      showReplyForm && isAuth
      ? (
        <ReplyForm
          sendComment={sendComment}
          isCommenting={isCommenting}
          parentPost={comment}
          commentedId={commentedId}
          toggleReplyForm={this.toggleReplyForm}
        />
      )
      : null;

    let replyClass = depth + 1 > 5 ? 'repliesNoIndent' : 'replies';

    const author = comment.author;
    const permlink = comment.permlink;
    const created = comment.created;
    const anchorLink = `#@${author}/${permlink}`;

    return (
      <React.Fragment>
        <div id={`comment-${comment.id}`} className={`comment depth-${depth}`}>
          <ul className='commentList'>
            <li className='commentAvatar'>
              <Avatar author={author} height='40px' width='40px' />
            </li>
            <li className='commentContent'>
              <div className='commentHead'>
                <AuthorReputation author={author} reputation={comment.author_reputation} />
                {`\u00A0\u2022\u00A0`}
                <PostLink
                  link={anchorLink}
                  title={created}
                  text={long(created)}
                />
              </div>
              <div className='commentBody'>
                <Body
                  full
                  rewriteLinks={false}
                  body={comment.body}
                  json_metadata={comment.json_metadata}
                />
              </div>
              <div className='commentFooter'>
                {/*<div>Vote</div>*/}
                <a href='/reply' onClick={this.onShowReplyForm}>Reply</a>
                {showReplyForm && replyForm}
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
                    isAuth={isAuth}
                    commentPayload={commentPayload}
                  />
                </li>
              ))
            }
          </ul>
          )
        }
        {
          hasLength(commentPayload) && commentPayload[comment.id]
          && (
            <ul className={replyClass}>
              {
                sortComments(commentPayload[comment.id], 'new').map(reply => (
                  <li className='commentReply' key={reply.id}>
                    <Comment
                      comment={reply}
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
          )
        }
      </React.Fragment>
    )
  }
}

export default Comment;
