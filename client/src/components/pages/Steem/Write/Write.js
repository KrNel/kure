import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Form, Label, Select } from 'semantic-ui-react'
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
    newPost: PropTypes.string,
    clearPost: PropTypes.func.isRequired,
    isPosting: PropTypes.bool,
    error: PropTypes.string,
  };

  static defaultProps = {
    user: '',
    newPost: '',
    isPosting: false,
    error: '',
  }

  constructor(props) {
    super(props)

    this.state = {
      title: '',
      body: '',
      tags: '',
      reward: '50',
      tagErrors: '',
    }

    this.redirect = '';
    this.rewardOptions = [
      {key: 0, value: '50', text: '50% SBD / 50% STEEM'},
      {key: 1, value: '100', text: '100% STEEM'},
      {key: 2, value: '0', text: 'Decline Payout'},
    ];
  }

  /**
   *
   */
  componentDidMount() {
    const { newPost, clearPost } = this.props;
    if (newPost) {
      this.redirect = '';
      clearPost();
    }
  }

  /**
   *  Set state for the reply form.
   */
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
      tagErrors: '',
    });
  }

  /**
   *  Set state values for when tag input text changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the element triggering the event
   */
   handleRewardChange = (e, {value}) => {
     this.setState({
       reward: value,
      });
   }

  /**
   *  Collect and process the form data for adding the post to the blockchain.
   */
  handleSubmit = (e) => {
    e.preventDefault();


    const { title, body, tags, reward } = this.state;
    const { createPost } = this.props;

    if (body === '' || title === '' || tags === '') return;

    const post = this.getNewPostData(title, body, tags, reward);

    if (post !== null)
      createPost(post);
  }

  /**
   *  Constructs the post object with the content required.
   *
   *  @param {string} title Title of post
   *  @param {string} body Body of post
   *  @param {string} tags Tags for post
   *  @param {string} reward Reward option for the post
   *  @return {object} Post object data
   */
  getNewPostData = (title, body, tags, reward) => {

    //tags = tags.trim().split(' ');

    const validTags = this.validateTags(tags);

    if (validTags.errors !== '') {
      this.setState({tagErrors: validTags.errors});
      return null;
    }else {
      tags = validTags.tags;
    }


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
    post.reward = reward;

    return post;
  }

  validateTags(tags) {

    if (!tags || tags.trim() === '')
      return { errors: 'Tags are required.' }

    tags = tags.trim().split(' ');

    if (tags.length > 5)
      return { errors: 'Maximum 5 tags.' }

    if (tags.find(t => t.length > 24))
      return { errors: 'Tags must be shorter than 24 chars.' }

    if (tags.find(t => t.split('-').length > 2))
      return { errors: 'Only one dash per tag.' }

    if (tags.find(t => t.indexOf(',') >= 0))
      return { errors: 'Separate tags with spaces.' }

    if (tags.find(t => /[A-Z]/.test(t)))
      return { errors: 'Must be lowercase.' }

    if (tags.find(t => !/^[a-z0-9-#]+$/.test(t)) > 5)
      return { errors: 'Invalid characters.' }

    if (tags.find(t => !/^[a-z-#]/.test(t)))
      return { errors: 'Must start with letter.' }

    if (tags.find(t => !/[a-z0-9]$/.test(t)))
      return { errors: 'Must end with letter or number.' }

    return { tags: tags, errors: '' };
  }

  render() {
    const {
      state: {
        body,
        tagErrors,
      },
      props: {
        isPosting,
        newPost,
        error,
      }
    } = this;

    if (newPost) {
      this.redirect = newPost;
    }

    return (
      (newPost)
      ? <Redirect to={newPost} />
      : (
        <Grid verticalAlign='middle' columns={1} centered>
          <Grid.Row>
            <Grid.Column width={13}>
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

                  <Form.Field>
                    <Form.Input
                      placeholder='Tags separated by spaces'
                      name='tags'
                      onChange={this.handleChange}
                    />
                    {
                      tagErrors && (
                        <Label basic color='red' pointing>
                          {tagErrors}
                        </Label>
                      )
                    }
                  </Form.Field>

                  <Form.Group>
                    <Form.Field
                      control={Select}
                      defaultValue={this.rewardOptions[0].value}
                      options={this.rewardOptions}
                      onChange={this.handleRewardChange}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Button>Submit</Form.Button>
                    {
                      error && (
                        <Label basic color='red' pointing='left'>
                          {error}
                        </Label>
                      )
                    }
                  </Form.Group>

                </Form>

                <Preview body={body} />
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
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

 /**
  *  Map redux dispatch functions to component props.
  *
  *  @param {object} dispatch - Redux dispatch
  *  @returns {object} - Object with recent activity data
  */
const mapDispatchToProps = dispatch => (
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
