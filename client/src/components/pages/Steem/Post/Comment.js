import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Dimmer, Loader } from "semantic-ui-react";

import ReplyForm from './ReplyForm';
import Body from './PostBody';
import Avatar from '../Avatar';
import AuthorReputation from '../AuthorReputation';
import PostLink from '../PostLink';
import {long} from '../../../../utils/dateFormatting';
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
    sortBy: PropTypes.string,
    editingComment: PropTypes.number,
    isUpdating: PropTypes.bool,
    updatedComment: PropTypes.shape(PropTypes.object.isRequired),
    updatedId: PropTypes.number,
    sendDeleteComment: PropTypes.func.isRequired,
    commentDeleting: PropTypes.shape(PropTypes.object.isRequired),
  };

  static defaultProps = {
    upvotePayload: {},
    commentPayload: {},
    commentedId: 0,
    comment: {},
    sortBy: () => {},
    editingComment: 0,
    isUpdating: false,
    updatedComment: {},
    updatedId: 0,
    commentDeleting: {},
  }

  state = {
    showReplyForm: false,
    showEditForm: false,
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.isUpdating && props.updatedId === props.comment.id) {
      return {
        showEditForm: false,
      };
    }

    return null;
  }

  /**
   *  When the 'Reply' link is clicked for a comment, this runs to change the
   * state of the 'showReplyForm' var to toogle showing/hiding the reply form.
   */
  onShowReplyForm = (e) => {
    e.preventDefault();
    this.toggleReplyForm();
  }

  /**
   *  Toggle the display of the comment reply form.
   */
  toggleReplyForm = () => {
    const { showReplyForm } = this.state;
    this.setState({
      showReplyForm: !showReplyForm,
      showEditForm: false,
     });
  }

  /**
   *  When the 'Edit' link is clicked for a comment, this runs to change the
   * state of the 'showEditForm' var to toogle showing/hiding the edit form.
   */
  onShowEditForm = (e) => {
    e.preventDefault();
    this.toggleEditForm();
  }

  /**
   *  Toggle the display of the comment reply form.
   */
  toggleEditForm = () => {
    const { showEditForm } = this.state;
    this.setState({
      showEditForm: !showEditForm,
      showReplyForm: false,
     });
  }

  /**
   *  Cancel the comment edit form.
   */
  handleCancelEdit = () => {
    this.setState({
      showEditForm: false,
    });
  }

  render() {
    const {
      state: {
        showReplyForm,
        showEditForm,
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
        sortBy,
        editingComment,
        isUpdating,
        updatedComment,
        updatedId,
        sendDeleteComment,
        commentDeleting,
        isDeleting,
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

    if (updatedComment && updatedId === comment.id) {
      comment = {
        ...comment,
        active_votes: updatedComment.active_votes,
        body: updatedComment.body,
        json_metadata: updatedComment.json_metadata,
      }
    }

    const depth = comment.depth;

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

    const replyForm =
      isAuth && showReplyForm
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

    const editForm =
      isAuth && showEditForm
      ? (
        <ReplyForm
          commentBody={comment.body}
          comment={comment}
          handleCancelEdit={this.handleCancelEdit}
          editingComment={editingComment}
          isUpdating={isUpdating}
        />
      )
      : null;

    return (
      <React.Fragment>
        <div id={`comment-${id}`} className={`comment depth-${depth}`}>
          {
            isDeleting && hasLength(commentDeleting) && commentDeleting.author === author && commentDeleting.permlink === permlink && <Dimmer inverted active={isDeleting}><Loader /></Dimmer>
          }
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
              {
                showEditForm
                ? editForm
                : (
                  <React.Fragment>
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
                        {
                          isAuth && user === author && (
                            <React.Fragment>
                              <li className='item'>
                                <a href='/edit' onClick={this.onShowEditForm}>Edit</a>
                              </li>
                              {
                                comment.children < 1 && (
                                  <li className='item'>
                                    <a href='/delete' onClick={e => sendDeleteComment(e, author, permlink, commentPayload)}>Delete</a>
                                  </li>
                                )
                              }
                            </React.Fragment>
                          )
                        }
                      </ul>
                    </div>
                  </React.Fragment>
                )
              }
            </li>
            <div className='clear' />
          </ul>
          <div className='clear' />
          {showReplyForm && replyForm}
        </div>
        {
          comment.children > 0
          && (
          <ul className={replyClass}>
            {
              sortComments(comment.replies, sortBy).map(reply => (
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
                    sortBy={sortBy}
                    editingComment={editingComment}
                    isUpdating={isUpdating}
                    updatedComment={updatedComment}
                    updatedId={updatedId}
                    sendDeleteComment={sendDeleteComment}
                    commentDeleting={commentDeleting}
                    isDeleting={isDeleting}
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
                sortComments(commentPayload[id], sortBy).map(reply => (
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
                      sortBy={sortBy}
                      editingComment={editingComment}
                      isUpdating={isUpdating}
                      updatedComment={updatedComment}
                      updatedId={updatedId}
                      sendDeleteComment={sendDeleteComment}
                      commentDeleting={commentDeleting}
                      isDeleting={isDeleting}
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
