import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Label} from 'semantic-ui-react';

import PostsSummary from './PostsSummary';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';

import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from '../../Loading/Loading';
import FilterPosts from './FilterPosts';
import * as contentActions from '../../../actions/steemContentActions'

/**
 *  Kurate gets the Steem blockchain content and dusplays a list of post
 *  summaries for browsing. Content can be added to a community group
 *  to which the user belongs.
 */
class Posts extends Component {

  static propTypes = {
    user: PropTypes.string,
    csrf: PropTypes.string,
    match: PropTypes.shape(PropTypes.object.isRequired),
    isFetching: PropTypes.bool,
    noMore: PropTypes.bool,

  };

  static defaultProps = {
    user: '',
    csrf: '',
    isFetching: false,
    noMore: false,
    match: {}
  };

  constructor(props) {
    super(props);

    this.selectedFilter = 'created';
    this.tag = '';
  }

  componentDidMount() {
    const {match: {params: {tag}}} = this.props;
    if (tag) {
      this.tag = tag;
    }
    window.addEventListener("scroll", this.handleScroll);
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
    const {getContent, posts, match} = this.props;

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

    let tag = this.tag;
    let filter = this.selectedFilter;

    if (match.path === '/@:author/feed') {
      tag = match.params.author;
      filter = 'feed';
    }else if (match.path === '/@:author') {
      tag = match.params.author;
      filter = 'blog';
    }else {
      window.history.pushState({}, '', `/${filter}/${tag}`);
    }

    const query = {
      tag: tag,
      limit: 20,
      truncate_body: 0,
      start_author: startAuthor,
      start_permlink: startPermlink
    };

    getContent(filter, query, nextPost)
  }

  handleSubmitFilter = (selectedFilter, tag) => {
    this.selectedFilter = selectedFilter;
    this.tag = tag;
    this.getPosts('init');
  }

  render() {
    const {
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
        upvotePayload,
      }
    } = this;

    let addErrorPost = '';
    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

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
            {
              !match.path.includes('/@:author')
              && (
                <FilterPosts
                  handleSubmitFilter={this.handleSubmitFilter}
                />
              )
            }
            {
              match.path === '/@:author/feed'
              && (
                <Label size='big' color='blue'><Header as='h3'>{`${match.params.author}'s Feed`}</Header></Label>
              )
            }
            {
              match.path === '/@:author'
              && (
                <Label size='big' color='blue'><Header as='h3'>{`${match.params.author}'s Blog`}</Header></Label>
              )
            }
            <hr />
            <div>
              <div id="postList">
                {
                  !isFetching && (
                  <PostsSummary
                    posts={posts}
                    showModal={showModal}
                    user={user}
                    csrf={csrf}
                    handleUpvote={handleUpvote}
                    upvotePayload={upvotePayload}
                  />
                  )
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
