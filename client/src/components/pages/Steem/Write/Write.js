import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Label } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom';

import Preview from '../Post/Preview';
import { createPostMetadata } from '../helpers/postHelpers';
import { sendPost, clearNewPost } from '../../../../actions/sendPostActions';
import './Write.css'

/**
 *  A form is shown for making priomary content posts to the Steem blockchain.
 *  A title field, text area for the post, and tag field are used to generate
 *  the posts for the Steem blockchain.
 */
class Write extends Component {
  static propTypes = {
    user: PropTypes.string,
    createPost: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: '',
  }

  constructor(props) {
    super(props)

    this.state = {
      title: '',
      body: '',
      tags: ''
    }

    this.redirect = '';
  }


  /*componentDidMount() {
    if (this.props.newPost) this.props.clearPost();
  }*/


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
  handleSubmit = (e) => {
    e.preventDefault();

    const { title, body, tags } = this.state;
    const { createPost } = this.props;

    if (body === '' || title === '' || tags === '') return;

    const post = this.getNewPostData(title, body, tags);

    createPost(post);
  }

  getNewPostData = (title, body, tags) => {
    tags = tags.split(' ');
    const { user } = this.props;
    const post = {
      body,
      title,
    };

    post.title = title;
    post.body = body;
    post.parentAuthor = '';
    post.author = user;
    post.parentPermlink = tags[0];
    post.jsonMetadata = createPostMetadata(post.body, tags);
    post.reward = 'half';

    return post;
  }

  render() {
    const {
      state: {
        body,
      },
      props: {
        isPosting,
        newPost,
        error,
        clearPost,
      }
    } = this;

    if (newPost) {
      this.redirect = newPost;
      clearPost();
    }

    return (
      (this.redirect)
      ? <Redirect to={this.redirect} />
      : (
        <div id='write'>
          <Form onSubmit={this.handleSubmit} loading={isPosting}>
            <Form.Input
              placeholder='Title'
              name='title'
              onChange={this.handleChange}
            />

            <Form.TextArea
              id='body'
              placeholder='Write something...'
              onChange={this.handleChange}
              name='body'
            />

            <Form.Input
              placeholder='Tags separated by spaces'
              name='tags'
              onChange={this.handleChange}
            />

            <Form.Checkbox
              label='Payout at 50/50'
            />

            <Form.Button>Submit</Form.Button>
            {
              error && (
                <Label basic color='red' pointing='left'>
                  {error}
                </Label>
              )
            }

          </Form>

          <Preview body={body} />
        </div>
      )
    )
  }
}

/**
 *  Map redux state to component props.
 *
 *  @param {object} state - Redux state
 *  @returns {object} - Object with recent activity data
 */
 const mapStateToProps = state => {
   const {
     auth: {
       user,
     },
     sendPost: {
       isPosting,
       newPost,
       error,
     }
   } = state;

   return {
     user,
     isPosting,
     newPost,
     error,
   }
 }

const mapDispatchToProps = (dispatch) => (
  {
    createPost: (post) => (
      dispatch(sendPost(post))
    ),
    clearPost: () => (
      dispatch(clearNewPost())
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Write);
