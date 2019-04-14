import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button, Dimmer, Loader } from "semantic-ui-react";

import Preview from './Preview';

/**
 *  Comment reply form for posts.
 */
class ReplyForm extends Component {

  static propTypes = {
    parentPost: PropTypes.shape(PropTypes.object.isRequired),
    sendComment: PropTypes.func.isRequired,
    isCommenting: PropTypes.bool.isRequired,
    commentedId: PropTypes.number,
    toggleReplyForm: PropTypes.func,
  };

  static defaultProps = {
    parentPost: {},
    commentedId: 0,
    toggleReplyForm: () => {},
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
    const {sendComment} = this.props;

    if (body) {
      const {parentPost} = this.props;
      sendComment(parentPost, body);
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

  render() {
    const {
      state: {
        body,
      },
      props: {
        isCommenting,
        commentedId,
        parentPost,
      }
    } = this;

    return (
      <ul className='repliesNoIndent'>
        <li>
          <div className='replyForm'>
            <Form>
              {
                isCommenting && commentedId === parentPost.id
                && <Dimmer inverted active={isCommenting}><Loader /></Dimmer>
              }
              <TextArea
                placeholder='Share your thoughts'
                onChange={this.handleChange}
                name='body'
                value={body}
                disabled={isCommenting}
              />
              <div>
                <Button
                  size="large"
                  color="blue"
                  content='Post'
                  disabled={body === '' || isCommenting}
                  onClick={this.handleSendComment}
                />
                <Button
                  size="large"
                  color="grey"
                  content='Clear'
                  disabled={body === '' || isCommenting}
                  onClick={this.handleClearReply}
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

export default ReplyForm;
