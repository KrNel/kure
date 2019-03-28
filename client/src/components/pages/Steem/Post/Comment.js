import React, {Component} from 'react';
import PropTypes from 'prop-types';

import ReplyForm from './ReplyForm';
import Body from './PostBody';
import Avatar from '../Avatar';
import AuthorReputation from '../AuthorReputation';
import PostLink from '../../../common/PostLink';
import {long} from '../../../../utils/timeFromNow';
import {hasLength} from '../../../../utils/helpers';
import Vote from '../Vote';
import './Comment.css';

/**
 *  Comment component to display the author, avatar, time and content.
 *  Will take each comment/reply and format that data, providing upvote
 *  and reply functionality for each. Child comments are recursively loaded
 *  back into the component until there are no more.
 */
class Comment extends Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    isAuth: PropTypes.bool.isRequired,
    comment: PropTypes.shape(PropTypes.object.isRequired),
    handleUpvote: PropTypes.func.isRequired,
    sortComments: PropTypes.func.isRequired,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    sendComment: PropTypes.func.isRequired,
    isCommenting: PropTypes.bool.isRequired,
    commentedId: PropTypes.number,
    commentPayload: PropTypes.shape(PropTypes.object.isRequired),
  };

  static defaultProps = {
    upvotePayload: {},
    commentPayload: {},
    commentedId: 0,
    comment: {},
  }

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

  /**
   *  Toggle the display of the comment reply form.
   */
  toggleReplyForm = () => {
    const { showReplyForm } = this.state;
    this.setState({ showReplyForm: !showReplyForm, showEdit: false });
  }

  render() {
    const {
      state: {
        showReplyForm,
      },
      props: {
        sortComments,
        sendComment,
        isCommenting,
        commentedId,
        isAuth,
        commentPayload,
        handleUpvote,
        user,
        upvotePayload,
      }
    } = this;

    let {
      props: {
        comment
      }
    } = this;

    const vp = upvotePayload.votedPosts.find(vp => vp.id === comment.id);
    if (vp)
      comment = vp;

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

    const id = comment.id;
    const author = comment.author;
    const permlink = comment.permlink;
    const created = comment.created;
    const anchorLink = `#@${author}/${permlink}`;
    const activeVotes = comment.active_votes;
    const totalPayout =
      parseFloat(comment.pending_payout_value) +
      parseFloat(comment.total_payout_value) +
      parseFloat(comment.curator_payout_value);
    const totalRShares = comment.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
    const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;

    return (
      <React.Fragment>
        <div id={`comment-${id}`} className={`comment depth-${depth}`}>
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
                <ul className="meta">
                  <Vote
                    activeVotes={activeVotes}
                    author={author}
                    payoutValue={totalPayout}
                    permlink={permlink}
                    user={user}
                    handleUpvote={handleUpvote}
                    upvotePayload={upvotePayload}
                    ratio={ratio}
                    pid={id}
                  />
                  {
                    isAuth && (
                      <li className='item'>
                        <a href='/reply' onClick={this.onShowReplyForm}>Reply</a>
                      </li>
                    )
                  }
                </ul>
              </div>
              {showReplyForm && replyForm}
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
                    user={user}
                    handleUpvote={handleUpvote}
                    upvotePayload={upvotePayload}
                  />
                </li>
              ))
            }
          </ul>
          )
        }
        {
          hasLength(commentPayload) && commentPayload[id]
          && (
            <ul className={replyClass}>
              {
                sortComments(commentPayload[id], 'new').map(reply => (
                  <li className='commentReply' key={reply.id}>
                    <Comment
                      comment={reply}
                      sortComments={sortComments}
                      sendComment={sendComment}
                      isCommenting={isCommenting}
                      commentedId={commentedId}
                      isAuth={isAuth}
                      commentPayload={commentPayload}
                      user={user}
                      handleUpvote={handleUpvote}
                      upvotePayload={upvotePayload}
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
