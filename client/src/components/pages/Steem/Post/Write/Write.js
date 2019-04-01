import React, {Component} from 'react';
import { Form } from 'semantic-ui-react'
import marked from 'marked';

import './Write.css'

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
   *  Show markdown preview as comment gets typed.
   */
  rawMarkup = () => {
    const { body } = this.state;
    return { __html: marked(body, {sanitize: true}) };
  }

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
          <div
            className='postPreview'
            dangerouslySetInnerHTML={this.rawMarkup()}
          />
        </div>
      </div>
    )
  }
}

export default Write;
