import React, {Component} from 'react';
import { Form } from 'semantic-ui-react'

import PostBody from '../Post/PostBody';
import './Write.css'

/**
 *  A form is shown for making priomary content posts to the Steem blockchain.
 *  A title field, text area for the post, and tag field are used to generate
 *  the posts for the Steem blockchain.
 */
class Write extends Component {
  state= {
    title: '',
    body: '',
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
   *  Collect and process the form data for adding the post to the blockchain.
   */
  handleSubmit = () => {
    const {title} = this.state;
  }

  render() {
    const {
      state: {
        title,
        body,
      }
    } = this;

    return (
      <div id='write'>
        <Form onSubmit={this.handleSubmit}>
          <Form.Input
            placeholder='Title'
            name='title'
          />

          <Form.TextArea
            id='body'
            placeholder='Write something...'
            onChange={this.handleChange}
            name='body'
            value={body}
          />

          <Form.Checkbox
            label='Payout at 50/50'
          />

          <Form.Button>Submit</Form.Button>
        </Form>

        <div className='postPreviewHeader'>
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
              body={body}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Write;
