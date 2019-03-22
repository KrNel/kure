import React, {Component} from 'react';
import marked from 'marked';
import { Form, TextArea, Button, Dimmer, Loader } from "semantic-ui-react";

/**
 *  Comment reply form for posts.
 */
class ReplyForm extends Component {
  state = {
    replyData: '',
  }

  /**
   *  If a comment has been posted, clear the form by clearing the replyData state.
   */
  static getDerivedStateFromProps(props, state) {
    if (props.parentPost.id === props.commentedId) {
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
   *  Show markdown preview as comment gets typed.
   */
  rawMarkup = () => {
    const { replyData } = this.state;
    return { __html: marked(replyData, {sanitize: true}) };
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
      }
    } = this;

    return (
      <div className='replyForm'>
        <Form>
          {
            isCommenting
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
              <div
                className='replyPreview'
                dangerouslySetInnerHTML={this.rawMarkup()}
              />
            </div>
          )
        }
      </div>
    )
  }
}

export default ReplyForm;
