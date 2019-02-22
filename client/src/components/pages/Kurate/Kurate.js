import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Client } from 'dsteem';
import { Form, Button } from "semantic-ui-react";

import PostsSummary from './PostsSummary';
import PostDetails from './PostDetails';
import { getUserGroups, addPost, logger } from '../../../utils/fetchFunctions';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import Picker from '../../Picker/Picker';

const client = new Client('https://hive.anyx.io/');

/**
 *  Kurate gets the Steem blockchain content and dusplays a list of post
 *  summaries for browsing. Content can be added to a community group
 *  to which the user belongs.
 */
class Kurate extends Component {

  static propTypes = {
    user: PropTypes.string,
    csrf: PropTypes.string,
    match: PropTypes.shape(PropTypes.object.isRequired).isRequired,
  };

  static defaultProps = {
    user: '',
    csrf: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      postsListShow: 'none',
      selectedGroup: '',
      modalOpenAddPost: false,
      addPostData: {},
      groups: [{key: 0, text: 'No Groups', value: '0'}],
      newPost: '',
      postExists: false,
      addPostLoading: false,
      tag: '',
      selectedFilter: 'created',
    }
    this.existPost = "Post already in group.";
    this.steemPostData = '';
  }

  componentDidMount() {
    this.getPosts();
  }

  /**
   *  When the page loads, this function will get the posts from Steem.
   *  THe list can be freshed with the Refresh button, or at the bottom
   *  more posts can be displayed by clicking 'Get More Posts'.
   *
   *  @param {string} action Get initial posts, or more after.
   */
  getPosts = (action = 'init') => {
    const {posts, selectedFilter, tag} = this.state;

    let startAuthor = undefined;
    let startPermlink = undefined;

    if (posts.length && action === 'more') {
      startAuthor = document.querySelector('.post:last-child li.author').dataset.author;
      startPermlink = document.querySelector('.post:last-child div.summary-content').dataset.permlink;
    }

    let nextPost = false;
    if (startAuthor !== undefined && startPermlink !== undefined) {
      nextPost = true;
    }

    const query = {
      tag: tag,
      limit: 20,
      truncate_body: 0,
      start_author: startAuthor,
      start_permlink: startPermlink
    };

    client.database.getDiscussions(selectedFilter, query)
      .then(result => {
        if (result) {
          let newPosts;
          if (nextPost) {
            newPosts = [...posts, ...result.slice(1)];
          }else {
            newPosts = result;
          }
          this.setState({
            posts: newPosts,
            nextPost,
          });
          this.onPostsGet();

          const {user} = this.props;
          if (user) this.getGroupsFetch(user);
        } else {
          //document.getElementById('postList').innerHTML = 'No result.';
        }
      }).catch(err => {
        logger('error', err);
      });
  }

  /**
   *  Shows the popup modal for user confirmation.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {object} modalData Post and user data for the modal
   */
  showModal = async (e, type, data) => {
    e.preventDefault();
    const {user, csrf} = this.props;
    if (type === 'addPost') {
      this.setState({
        modalOpenAddPost: true,
        addPostData: {...data, user, csrf},
      });
    }
  }

  /**
   *  Hides the popup modal.
   */
  onModalCloseAddPost = () => this.setState({
    modalOpenAddPost: false,
    addPostLoading: false,
    postExists: false,
  });

  /**
   *  Handle the Yes or No confirmation from the modal.
   *  If Yes, proceed with deletion of post or user.
   *
   *  @param {event} e Event triggered by element to handle
   */
  handleModalClickAddPost = (e) => {
    const confirm = e.target.dataset.confirm;
    if (confirm === 'true') {
      this.setState({addPostLoading: true});
      this.addPostFetch();
    }else this.onModalCloseAddPost();
  }

  /**
   *  Send new post to be added to the database.
   *  Reset the flags depending on errors or not, add new post to posts state.
   */
  addPostFetch = () => {
    const {
      addPostData: {
        csrf,
         ...rest
      },
      selectedGroup,
    } = this.state;
    addPost({group: selectedGroup, ...rest}, csrf)
    .then(res => {
      if (!res.data.invalidCSRF) {
        if (res.data.exists) {
          this.setState({
            postExists: true,
            addPostLoading: false,
          });
        }else if (res.data.post) {
          this.setState({
            postExists: false,
            addPostLoading: false,
          });
          this.onModalCloseAddPost();
        }
      }
    }).catch((err) => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
  }

  /**
   *  Set state values for when group select changes.
   *  Reset post exists error flag.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the element triggering the event
   */
  handleGroupSelect = (e, {value}) => {
    this.setState({
      selectedGroup: value,
      postExists: false,
     });
  }

  /**
   *  Fetch the groups for groups selection when adding a post.
   *
   *  @param {string} user User to get groups for
   */
  getGroupsFetch = (user) => {
    getUserGroups(user, 'all')
    .then(res => {
      const groups = res.data.groups.map((g, i) => {
        return {key: i, value: g.name, text: g.display, ...g}
      })
      this.setState({
        groups
      });
    }).catch(err => {
      logger({level: 'error', message: {name: err.name, message: err.message, stack: err.stack}});
    });
  }

  /**
   *  Change the style to show posts when data is returned.
   */
  onPostsGet = () => {
    this.setState({postsListShow: 'block'})
  }

  /**
   *  Set state values for when tag input text changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} name Name of the element triggering the event
   *  @param {string} value Value of the element triggering the event
   */
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value,
     });
  }

  /**
   *  Set state values for when filter option changes.
   *
   *  @param {event} e Event triggered by element to handle
   *  @param {string} value Value of the role selected
   */
  handleFilterSelect = (e, {value}) => {
    this.setState({
      selectedFilter: value
     });
  }

  render() {
    const {
      state: {
        posts,
        postsListShow,
        nextPost,
        modalOpenAddPost,
        groups,
        postExists,
        addPostLoading,
        tag,
      },
      props: {
        user,
        csrf,
        match: {
          path,
        }
      },
    } = this;

    let addErrorPost = '';
    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

    const filters = [
      {key: 0, value: 'created', text: 'New'},
      {key: 1, value: 'hot', text: 'Hot'},
      {key: 2, value: 'promoted', text: 'Promoted'},
      {key: 3, value: 'trending', text: 'Trending'}
    ];

    return (
      <React.Fragment>
        <ModalGroup
          modalOpen={modalOpenAddPost}
          onModalClose={this.onModalCloseAddPost}
          handleModalClick={this.handleModalClickAddPost}
          getGroupsFetch={this.getGroupsFetch}
          handleGroupSelect={this.handleGroupSelect}
          groups={groups}
          addErrorPost={addErrorPost}
          addPostLoading={addPostLoading}
        />
        {
          (path === '/kurate')
          ?
          (
            <React.Fragment>
              <div className='controlContent'>
                <Form>
                  <Form.Group>
                    <Button id='init' color='blue' onClick={() => this.getPosts('init')}>Refresh Posts</Button>
                    <Picker
                      onChange={this.handleFilterSelect}
                      options={filters}
                      label=''
                    />
                    <Form.Input
                      placeholder='Search a tag'
                      name='tag'
                      value={tag}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Form>
              </div>
              <hr />
              <div>
                <div id="postList" style={{display: postsListShow}}>
                  <PostsSummary
                    posts={posts}
                    nextPost={nextPost}
                    showModal={this.showModal}
                    user={user}
                    csrf={csrf}
                    onClickTitle={this.onClickTitle}
                  />
                </div>
              </div>
              <Button id='more' color='blue' style={{display: postsListShow}} type="button" onClick={() => this.getPosts('more')}>Get More Posts</Button>
            </React.Fragment>
          )
          :
          (
            <PostDetails
              match={this.props.match}
              showModal={this.showModal}
              user={user}
              csrf={csrf}
            />
          )
        }
      </React.Fragment>
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
  const { userData, csrf } = state.auth;

  return {
    user: userData.name,
    csrf
  }
}

export default connect(mapStateToProps)(Kurate);
