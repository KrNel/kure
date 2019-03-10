import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Form, Button } from "semantic-ui-react";

import PostsSummary from './PostsSummary';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import Picker from '../../Picker/Picker';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from '../../Loading/Loading';
import * as contentActions from '../../../actions/steemContentActions'

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
    isFetching: PropTypes.bool,
    noMore: PropTypes.bool,

  };

  static defaultProps = {
    user: '',
    csrf: '',
    isFetching: false,
    noMore: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      tag: '',
      selectedFilter: 'created',
    }
  }

  componentDidMount() {
    const {match: {path}} = this.props;
    if (path === '/kurate') {
      window.addEventListener("scroll", this.handleScroll);
    }
    this.getPosts();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   *  Infinite scroll. Checks to see if the last post in the list is reached,
   *  then calls fetch to get new posts.
   */
  handleScroll = (e) => {
    const {isFetching, noMore} = this.props;
    if (!isFetching && !noMore) {
      var lastLi = document.querySelector("#postList > div.post:last-child");
      var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      var pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
           this.getPosts('more');
      }
    }
  };

  /**
   *  When the page loads, this function will get the posts from Steem.
   *  THe list can be freshed with the Refresh button, or at the bottom
   *  more posts can be displayed by clicking 'Get More Posts'.
   *
   *  @param {string} action Get initial posts, or more after.
   */
  getPosts = (action = 'init') => {
    const {selectedFilter, tag} = this.state;
    const {getContent, posts} = this.props;

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

    getContent(selectedFilter, query, nextPost)
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
        nextPost,
        tag,
      },
      props: {
        user,
        csrf,
        posts,
        isFetching,
        match,
        groups,
        modalOpenAddPost,
        postExists,
        addPostLoading,
        showModal,
        handleModalClickAddPost,
        onModalCloseAddPost,
        handleGroupSelect,
        handleUpvote,
        isUpvoting,
        upvotePayload,
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
          onModalClose={onModalCloseAddPost}
          handleModalClick={handleModalClickAddPost}
          handleGroupSelect={handleGroupSelect}
          groups={groups}
          addErrorPost={addErrorPost}
          addPostLoading={addPostLoading}
        />
        <ErrorBoundary>
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
              <div id="postList">
                <PostsSummary
                  posts={posts}
                  nextPost={nextPost}
                  showModal={showModal}
                  user={user}
                  csrf={csrf}
                  handleUpvote={handleUpvote}
                  isUpvoting={isUpvoting}
                  upvotePayload={upvotePayload}
                />
              </div>
            </div>
            {
              isFetching && <Loading />
            }
          </React.Fragment>
        </ErrorBoundary>
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
  const {
    auth: {
      user, csrf
    },
    steemContent: {
      posts,
      isFetching,
      noMore,
      groups,
      postExists,
      addPostLoading,
      modalOpenAddPost,
      selectedGroup,
      addPostData,
      isUpvoting,
      upvotePayload,
    }
  } = state;

  return {
    user,
    csrf,
    posts,
    isFetching,
    noMore,
    groups,
    postExists,
    addPostLoading,
    modalOpenAddPost,
    selectedGroup,
    addPostData,
    isUpvoting,
    upvotePayload,
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    getContent: (selectedFilter, query, nextPost) => (
      dispatch(contentActions.getSummaryContent(selectedFilter, query, nextPost))
    ),
    showModal: (e, type, data) => (
      dispatch(contentActions.showModal(e, type, data))
    ),
    handleModalClickAddPost: (e) => (
      dispatch(contentActions.handleModalClickAddPost(e))
    ),
    onModalCloseAddPost: () => (
      dispatch(contentActions.onModalCloseAddPost())
    ),
    handleGroupSelect: (value) => (
      dispatch(contentActions.handleGroupSelect(value))
    ),
    handleUpvote: (voter, author, permlink, weight) => (
      dispatch(contentActions.upvotePost(voter, author, permlink, weight))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Kurate);
