import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Form, TextArea, Button, Dimmer, Loader } from "semantic-ui-react";

import PostBody, { getHtml } from './PostBody';

/**
 *  Comment reply form for posts.
 */
class ReplyForm extends Component {

  static propTypes = {
    parentPost: PropTypes.shape(PropTypes.object.isRequired),
    sendComment: PropTypes.func.isRequired,
    isCommenting: PropTypes.bool.isRequired,
    commentedId: PropTypes.number,

  };

  static defaultProps = {
    parentPost: {},
    commentedId: 0,
  }

  state = {
    replyData: '',
  }

  /**
   *  If a comment has been posted, clear the form by clearing the replyData state.
   */
  static getDerivedStateFromProps(props, state) {
    if (props.parentPost.id === props.commentedId && !props.isCommenting) {
      props.toggleReplyForm();
      return {
        replyData: '',
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
    const {replyData} = this.state;
    const {sendComment} = this.props;

    if (replyData) {
      const {parentPost} = this.props;
      sendComment(parentPost, replyData);
    }
  }

  /**
   *  Clear the comment reply form.
   */
  handleClearReply = () => {
    this.setState({
      replyData: ''
    });
  }

  render() {
    const {
      state: {
        replyData,
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
                name='replyData'
                value={replyData}
                disabled={isCommenting}
              />
              <div>
                <Button
                  size="large"
                  color="blue"
                  content='Post'
                  disabled={replyData === '' || isCommenting}
                  onClick={this.handleSendComment}
                />
                <Button
                  size="large"
                  color="grey"
                  content='Clear'
                  disabled={replyData === '' || isCommenting}
                  onClick={this.handleClearReply}
                />
              </div>

            </Form>
            {
              replyData !== ''
              && (
                <div className='replyPreviewHeader'>
                  <span className='left'>Preview</span>
                  <span className='right'>
                    <a
                      href='https://guides.github.com/features/mastering-markdown/'
                    >
                      {'Markdown Help'}
                    </a>
                  </span>
                  <div className='clear' />
                  <div className='postPreview'>
                    <PostBody
                      full
                      rewriteLinks={false}
                      body={replyData}
                    />
                  </div>
                </div>
              )
            }
          </div>
        </li>
      </ul>
    )
  }
}

export default ReplyForm;
