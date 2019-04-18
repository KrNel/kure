import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form, TextArea, Button, Dimmer, Loader } from "semantic-ui-react";

import { editComment } from '../../../../actions/sendCommentActions';

import Preview from './Preview';

/**
 *  Comment reply form for posts.
 */
class ReplyForm extends Component {

  static propTypes = {
    parentPost: PropTypes.shape(PropTypes.object.isRequired),
    sendComment: PropTypes.func,
    isCommenting: PropTypes.bool,
    commentedId: PropTypes.number,
    toggleReplyForm: PropTypes.func,
  };

  static defaultProps = {
    parentPost: {},
    commentedId: 0,
    toggleReplyForm: () => {},
    sendComment: () => {},
    isCommenting: false,
  }

  state = {
    body: '',
  }

  /**
   *  If a comment has been posted, clear the form by clearing the body state.
   */
  static getDerivedStateFromProps(props, state) {
    if (props.parentPost.id === props.commentedId && !props.isCommenting) {
      props.toggleReplyForm();
      return {
        body: '',
      };
    }

    return null;
  }

  /**
   *  Set state for the reply form.
   */
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    });
  }

  /**
   *  Send the comment to redux for adding to Steem blockchain.
   */
  handleSendComment = () => {
    const { body } = this.state;
    const  { sendComment, parentPost } = this.props;

    if (body && parentPost) {
      sendComment(body, parentPost);
    }
  }

  /**
   *  Send the comment to redux for adding to Steem blockchain.
   */
  handleEditComment = () => {
    const { body } = this.state;
    const  { editCommentRedux, comment } = this.props;

    if (body && comment) {
      editCommentRedux(body, comment);
    }
  }

  /**
   *  Clear the comment reply form.
   */
  handleClearReply = () => {
    this.setState({
      body: ''
    });
  }

  /**
   *  Cancel the comment edit form.
   */
  onCancelEdit = () => {
    const { handleCancelEdit } = this.props;
    handleCancelEdit();
  }

  render() {
    const {
      state: {
        body,
      },
      props: {
        isCommenting,
        commentedId,
        parentPost,
        commentBody,
        comment,
        editingComment,
        isUpdating,
      }
    } = this;

    let cancelButtonClick = ['Clear', this.handleClearReply];
    let submitButtonClick = ['Post', this.handleSendComment];
    let disabled = body === '' || isCommenting;
    if (commentBody) {
      submitButtonClick = ['Update', this.handleEditComment];
      cancelButtonClick = ['Cancel', this.onCancelEdit];
      disabled = isUpdating;
    }

    return (
      <ul className='repliesNoIndent'>
        <li>
          <div className='replyForm'>
            <Form>
              {
                isCommenting && commentedId === parentPost.id
                && <Dimmer inverted active={isCommenting}><Loader /></Dimmer>
              }
              {
                isUpdating && editingComment === comment.id
                && <Dimmer inverted active={isUpdating}><Loader /></Dimmer>
              }
              <TextArea
                placeholder='Share your thoughts'
                onChange={this.handleChange}
                name='body'
                value={body || commentBody}
                disabled={disabled}
              />
              <div>
                <Button
                  size="large"
                  color="blue"
                  content={submitButtonClick[0]}
                  disabled={disabled}
                  onClick={submitButtonClick[1]}
                />
                <Button
                  size="large"
                  color="grey"
                  content={cancelButtonClick[0]}
                  disabled={disabled}
                  onClick={cancelButtonClick[1]}
                />
              </div>

            </Form>
            {
              body !== ''
              && (
                <Preview body={body} />
              )
            }
          </div>
        </li>
      </ul>
    )
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
   editCommentRedux: (body, comment) => (
     dispatch(editComment(body, comment))
   ),
 }
);

export default connect(null, mapDispatchToProps)(ReplyForm);
