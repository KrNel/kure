import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Label} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom'

import PostsSummary from './PostsSummary';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from '../../Loading/Loading';
import FilterPosts from './FilterPosts';
import * as contentActions from '../../../actions/steemContentActions';

/**
 *  Gets the Steem blockchain content and displays a list of post
 *  summaries for browsing. Content can be added to a community group
 *  to which the user belongs. The pages for Steem, Blog and Feed and go here
 *  to fetch and render the view.
 */
class Posts extends Component {

  static propTypes = {
    user: PropTypes.string,
    csrf: PropTypes.string,
    match: PropTypes.shape(PropTypes.object.isRequired),
    isFetchingSummary: PropTypes.bool,
    noMore: PropTypes.bool,
  };

  static defaultProps = {
    user: '',
    csrf: '',
    isFetchingSummary: false,
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

  /**
   *  Need to check if different request for data being done through
   *  url route. If so, getPosts(), otherwise the page data stays the same.
   */
  componentDidUpdate(prevProps) {
    const {match} = this.props;
    if (match.url !== prevProps.match.url) {
      //this.isPageLoading = true;
      if (match.params.tag)
        this.tag = match.params.tag;
      else
        this.tag = '';
      this.getPosts();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   *  Infinite scroll. Checks to see if the last post in the list is reached,
   *  then calls fetch to get new posts.
   */
  handleScroll = (e) => {
    const {isFetchingSummary, noMore} = this.props;
    if (!isFetchingSummary && !noMore) {
      var lastLi = document.querySelector("#postList > div.post:last-child");
      var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      var pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
        this.isInfScrollMore = true;
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
    const {getContent, posts, match, page} = this.props;

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
      window.history.replaceState({}, '', `/${filter}/${tag}`);
    }

    const query = {
      tag: tag,
      limit: 20,
      truncate_body: 0,
      start_author: startAuthor,
      start_permlink: startPermlink
    };

    getContent(filter, query, nextPost, page)
  }

  /**
   *  Handle the filter and tag values pass up to parent, then
   *  getPosts with that new data.
   */
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
        isFetchingSummary,
        prevPage,
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
        page,
      },
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
              page !== 'blog' && page !== 'feed'
              && (
                <FilterPosts
                  handleSubmitFilter={this.handleSubmitFilter}
                />
              )
            }
            {
              page === 'feed'
              && (
                <Label size='big' color='blue'><Header as='h3'>{`${match.params.author}'s Feed`}</Header></Label>
              )
            }
            {
              page === 'blog'
              && (
                <Label size='big' color='blue'><Header as='h3'>{`${match.params.author}'s Blog`}</Header></Label>
              )
            }
            <hr />
            <div>
              <div id="postList">
                {
                  page === prevPage
                  ? (
                    <PostsSummary
                      posts={posts}
                      showModal={showModal}
                      user={user}
                      csrf={csrf}
                      handleUpvote={handleUpvote}
                      upvotePayload={upvotePayload}
                      isFetchingSummary={isFetchingSummary}
                    />
                  )
                  : (
                    <Loading />
                  )
                }

              </div>
            </div>
            {
              isFetchingSummary && page === prevPage && <Loading />
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
      isFetchingSummary,
      prevPage,
      noMore,
      groups,
      postExists,
      addPostLoading,
      modalOpenAddPost,
      selectedGroup,
      upvotePayload,
    }
  } = state;

  return {
    user,
    csrf,
    posts,
    isFetchingSummary,
    prevPage,
    noMore,
    groups,
    postExists,
    addPostLoading,
    modalOpenAddPost,
    selectedGroup,
    upvotePayload,
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    getContent: (selectedFilter, query, nextPost, page) => (
      dispatch(contentActions.getSummaryContent(selectedFilter, query, nextPost, page))
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
    handleUpvote: (author, permlink, weight) => (
      dispatch(contentActions.upvotePost(author, permlink, weight))
    ),
  }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts));
