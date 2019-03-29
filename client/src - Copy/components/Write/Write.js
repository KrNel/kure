import React, {Component} from 'react';
import { Form } from 'semantic-ui-react'

import './Write.css'

class Write extends Component {
  state= {
    title: '',
    body: '',
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

          <Form.TextArea id='body' placeholder='Write something...' />

          <Form.Checkbox label='I agree to the Terms and Conditions' />

          <Form.Button>Submit</Form.Button>
        </Form>
      </div>
    )
  }
}

export default Write;
