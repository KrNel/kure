import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Label, Select, Button } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import Preview from '../Post/Preview';
import { createPostMetadata } from '../helpers/postHelpers';
import { sendPost, clearSendPost } from '../../../../actions/sendPostActions';
import './Write.css'

/**
 *  A form is shown for making priomary content posts to the Steem blockchain.
 *  A title field, text area for the post, and tag field are used to generate
 *  the posts for the Steem blockchain.
 */
class Editor extends Component {
  static propTypes = {
    user: PropTypes.string,
    createPost: PropTypes.func.isRequired,
    newPostRedirect: PropTypes.string,
    clearPost: PropTypes.func.isRequired,
    isPosting: PropTypes.bool,
    error: PropTypes.string,
    isUpdating: PropTypes.bool,
    draft: PropTypes.shape(PropTypes.object.isRequired),
    isNewPost: PropTypes.bool,
  };

  static defaultProps = {
    user: '',
    newPostRedirect: '',
    isPosting: false,
    error: '',
    isUpdating: false,
    draft: {},
    isNewPost: false,
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

    this.permlink = '';
    this.rewardOptions = [
      {key: 0, value: '50', text: '50% SBD / 50% STEEM'},
      {key: 1, value: '100', text: '100% STEEM'},
      {key: 2, value: '0', text: 'Decline Payout'},
    ];
  }

  /**
   *  When a post is successfully added to Steem, clear the form and redirect
   *  to the post itself.
   *  If an edit is requested, then show the existing post data.
   */
  componentDidMount() {
    window.scrollTo(0, 0);

    const { clearPost, isUpdating, draft, isNewPost } = this.props;

    if (isUpdating && draft) {
      this.permlink = draft.permlink;
      this.setState({
        title: draft.title,
        body: draft.body,
        tags: draft.jsonMetadata.tags.join(' '),
      });
    }else if (isNewPost) {
      clearPost();
      this.setState({
        title: '',
        body: '',
        tags: '',
      });
    }
  }

  componentWillUnmount() {
    const { clearPost } = this.props;
    clearPost();
  }

  /**
   *  Set state for the reply form.
   */
  handleChange = (event, { name, value }) => {
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
   handleRewardChange = (event, {value}) => {
     this.setState({
       reward: value,
      });
   }

  /**
   *  Collect and process the form data for adding the post to the blockchain.
   */
  handleSubmit = event => {
    event.preventDefault();

    const { title, body, tags, reward } = this.state;
    const { createPost } = this.props;

    if (body === '' || title === '' || tags === '') return;

    const post = this.getNewPostData(title, body, tags, reward);

    if (post !== null)
      createPost(post);
  }

  /**
   *  Clear the post write form.
   */
  handleClear = () => {
    this.setState({
      body: '',
      title: '',
      tags: '',
    });

    this.permlink = '';

    const { isUpdating, clearPost } = this.props;
    if (isUpdating) clearPost();
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

    const validTags = this.validateTags(tags);

    if (validTags.errors !== '') {
      this.setState({tagErrors: validTags.errors});
      return null;
    }else {
      tags = validTags.tags;
    }

    const { user, draft } = this.props;

    const post = {
      body,
      title,
    };

    const oldMetadata = draft && draft.jsonMetadata;

    post.parentAuthor = '';
    post.author = user;
    post.parentPermlink = tags[0];
    post.jsonMetadata = createPostMetadata(post.body, tags, oldMetadata);
    post.reward = reward;
    post.permlink = this.permlink;

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
        title,
        tags,
      },
      props: {
        isPosting,
        isNewPost,
        error,
        isUpdating,
        newPostRedirect,
      }
    } = this;

    return (
      (newPostRedirect && isNewPost)
      ? <Redirect to={newPostRedirect} />
      : (
        <div id='write'>
          <Form onSubmit={this.handleSubmit} loading={isPosting}>
            <Form.Input
              placeholder='Title'
              name='title'
              value={title}
              onChange={this.handleChange}
            />

            <Form.TextArea
              id='body'
              placeholder='Write something...'
              onChange={this.handleChange}
              name='body'
              value={body}
            />

            <Form.Field>
              <Form.Input
                placeholder='Tags separated by spaces'
                name='tags'
                value={tags}
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

            {
              !isUpdating && (
              <Form.Group>
                <Form.Field
                  control={Select}
                  defaultValue={this.rewardOptions[0].value}
                  options={this.rewardOptions}
                  onChange={this.handleRewardChange}
                />
              </Form.Group>
              )
            }

            <Form.Group>
              <Form.Button
                color='blue'
                disabled={body === ''}
              >
                {
                  isUpdating
                  ? 'Update'
                  : 'Submit'
                }
              </Form.Button>
              <Button
                content='Cancel'
                disabled={body === ''}
                onClick={this.handleClear}
              />
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
       newPostRedirect,
       error,
       isUpdating,
       draft,
     },
   } = state;

   return {
     user,
     isPosting,
     newPostRedirect,
     error,
     isUpdating,
     draft,
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
      dispatch(clearSendPost())
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
