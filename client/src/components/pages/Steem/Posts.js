import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Header, Label} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
//

import PostsSummary from './PostsSummary';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from '../../Loading/Loading';
import FilterPosts from './FilterPosts';
import { getSummaryContent } from '../../../actions/summaryPostActions';
import * as addPostActions from '../../../actions/addPostActions';
import { upvotePost } from '../../../actions/upvoteActions';

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
    hasMore: PropTypes.bool,
    prevPage: PropTypes.string,
    groups: PropTypes.arrayOf(PropTypes.object),
    modalOpenAddPost: PropTypes.bool,
    postExists: PropTypes.bool,
    addPostLoading: PropTypes.bool,
    showModal: PropTypes.func,
    handleModalClickAddPost: PropTypes.func,
    onModalCloseAddPost: PropTypes.func,
    handleGroupSelect: PropTypes.func,
    handleUpvote: PropTypes.func,
    upvotePayload: PropTypes.shape(PropTypes.object.isRequired),
    page: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object),
    getContent: PropTypes.func,
  };

  static defaultProps = {
    user: '',
    csrf: '',
    isFetchingSummary: false,
    hasMore: true,
    match: {},
    prevPage: '',
    groups: [{}],
    modalOpenAddPost: false,
    postExists: false,
    addPostLoading: false,
    showModal: () => {},
    handleModalClickAddPost: () => {},
    onModalCloseAddPost: () => {},
    handleGroupSelect: () => {},
    handleUpvote: () => {},
    upvotePayload: {},
    page: '',
    posts: [{}],
    getContent: () => {},
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
    const {isFetchingSummary, hasMore} = this.props;
    if (!isFetchingSummary && hasMore) {
      var lastLi = document.querySelector("#postList > div.postSummary:last-child");
      var lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      var pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
        this.getPosts('more');
      }
    }
  }

  /**
   *  When the page loads, this function will get the posts from Steem.
   *  THe list can be freshed with the Refresh button, or at the bottom
   *  more posts can be displayed by clicking 'Get More Posts'.
   *
   *  @param {string} action Get initial posts, or more after.
   */
  getPosts = (action = 'init') => {
    const {getContent, match, page} = this.props;

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
    };

    getContent(filter, query, page, action)
  }

  /**
   *  Handle the filter and tag values pass up to parent, then
   *  getPosts with that new data.
   */
  handleSubmitFilter = (selectedFilter, tag) => {
    this.selectedFilter = selectedFilter;
    this.tag = tag;
    this.getPosts('');
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
      user,
      csrf,
    },
    summaryPost: {
      isFetchingSummary,
      prevPage,
      hasMore,
      posts,
    },
    userGroups: {
      groups,
    },
    addPost: {
      postExists,
      addPostLoading,
      modalOpenAddPost,
      selectedGroup,
    },
    upvote: {
      upvotePayload,
    },
  } = state;

  return {
    user,
    csrf,
    posts,
    isFetchingSummary,
    prevPage,
    hasMore,
    groups,
    postExists,
    addPostLoading,
    modalOpenAddPost,
    selectedGroup,
    upvotePayload,
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
    getContent: (selectedFilter, query, page, action) => (
      dispatch(getSummaryContent(selectedFilter, query, page, action))
    ),
    showModal: (e, type, data) => (
      dispatch(addPostActions.showModal(e, type, data))
    ),
    handleModalClickAddPost: (e) => (
      dispatch(addPostActions.handleModalClickAddPost(e))
    ),
    onModalCloseAddPost: () => (
      dispatch(addPostActions.onModalCloseAddPost())
    ),
    handleGroupSelect: (value) => (
      dispatch(addPostActions.handleGroupSelect(value))
    ),
    handleUpvote: (author, permlink, weight) => (
      dispatch(upvotePost(author, permlink, weight))
    ),
  }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts));
