import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Header, Label, Grid, Icon } from 'semantic-ui-react';
import { withRouter, Link } from 'react-router-dom';

import PostsSummaryGrid from './PostsSummaryGrid';
import PostsSummaryList from './PostsSummaryList';
import ModalGroup from '../../Modal/ModalGroup';
import ErrorLabel from '../../ErrorLabel/ErrorLabel';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import Loading from '../../Loading/Loading';
import FilterPosts from './FilterPosts';
import { getSummaryContent } from '../../../actions/summaryPostActions';
import * as addPostActions from '../../../actions/addPostActions';
import { upvotePost } from '../../../actions/upvoteActions';
import { resteem } from '../../../actions/resteemActions';
import { getFollowCount, getFollowers, getFollowing, clearFollow, searchFollowers } from '../../../actions/followActions';
import ToggleView from '../../kure/ToggleView';
import { changeViewSettings, initViewStorage } from '../../../actions/settingsActions';
import ModalVotesList from '../../Modal/ModalVotesList';
import FollowButton from './FollowButton';
import Follows from './Follows';

import './Posts.css';

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
    isFetching: PropTypes.bool,
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
    handleResteem: PropTypes.func,
    resteemedPayload: PropTypes.shape(PropTypes.object.isRequired),
    initViewSettings: PropTypes.func,
    toggleViewSettings: PropTypes.func,
    showGrid: PropTypes.bool,
    followCount: PropTypes.func,
    clearFollowData: PropTypes.func,
    followerCount: PropTypes.number,
    followingCount: PropTypes.number,
    followers: PropTypes.arrayOf(PropTypes.object),
    following: PropTypes.arrayOf(PropTypes.object),
    getFollowersList: PropTypes.func,
    getFollowingList: PropTypes.func,
    isFetchingFollows: PropTypes.bool,
    hasMoreFollows: PropTypes.bool,
    getSearchFollow: PropTypes.func,
    searchFollowLoading: PropTypes.bool,
  };

  static defaultProps = {
    user: '',
    csrf: '',
    isFetching: false,
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
    handleResteem: () => {},
    resteemedPayload: {},
    initViewSettings: () => {},
    toggleViewSettings: () => {},
    showGrid: true,
    followCount: () => {},
    clearFollowData: () => {},
    followerCount: 0,
    followingCount: 0,
    followers: [],
    following: [],
    getFollowersList: () => {},
    getFollowingList: () => {},
    isFetchingFollows: false,
    hasMoreFollows: true,
    getSearchFollow: () => {},
    searchFollowLoading: false,
  };

  constructor(props) {
    super(props);

    this.selectedFilter = 'created';
    this.tag = '';

    this.state = {
      showDesc: true,
      modalVotesOpen: false,
      voterData: {
        voters: [],
        ratio: 0,
      },
    };
  }

  /**
   *  Get the tags from the page URL if they are sent and add them to the
   *  object's variable `this.tag` for use.
   *  Set the infinite scroll on the window object.
   *  Get the posts for the page from redux.
   *  Get the inital view settings from Redux.
   */
  componentDidMount() {
    const {
      initViewSettings,
      followCount,
      getFollowersList,
      getFollowingList,
      clearFollowData,
      page,
      match: {
        params: {
          tag,
          author,
        },
        path,
      }
    } = this.props;

    if (tag) {
      this.tag = tag;
    }

    window.addEventListener("scroll", this.handleScroll);

    if (page !== 'follows')
      this.getPosts();

    initViewSettings();
    clearFollowData();
    followCount(author);

    if (path === '/@:author/followers') {
      getFollowersList(author);
    }else if (path === '/@:author/following') {
      getFollowingList(author);
    }
  }

  /**
   *  Need to check if different request for data being done through
   *  url route. If so, getPosts(), otherwise the page data stays the same.
   */
  componentDidUpdate(prevProps) {
    const {
      match: {
        path,
        url,
        params: {
          tag,
          author,
        },
      },
      page,
      followCount,
      clearFollowData,
      followers,
      following,
      getFollowersList,
      getFollowingList,
    } = this.props;

    if (url !== prevProps.match.url) {
      if (tag)
        this.tag = tag;
      else
        this.tag = '';

      if (page === 'blog') {
        clearFollowData();
        followCount(author);
      }

      if (page !== 'follows')
        this.getPosts();
      else if (!followers.length && path === '/@:author/followers')
        getFollowersList(author);
      else if (!following.length && path === '/@:author/following')
        getFollowingList(author);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   *  Infinite scroll. Checks to see if the last post in the list is reached,
   *  then calls fetch to get new posts.
   */
  handleScroll = () => {
    const {
      isFetching,
      hasMore,
      page,
      followers,
      following,
      getFollowersList,
      getFollowingList,
      isFetchingFollows,
      hasMoreFollows,
      match: {
        path,
        params: {
          author,
        },
      },
    } = this.props;

    if (!isFetching && hasMore && !isFetchingFollows && hasMoreFollows) {
      let lastLi = document.querySelector("#postList div.infSummary:nth-last-child(4)");
      let getter = () => this.getPosts('more');

      if (page === 'follows') {
        const more = true;
        let startFrom = '';
        lastLi = document.querySelector("#follows > div.follow:last-child");

        if (path === '/@:author/followers') {
          startFrom = followers[followers.length - 1].follower;
          getter = () => getFollowersList(author, startFrom, 100, more);
        }else {
          startFrom = following[following.length - 1].following;
          getter = () => getFollowingList(author, startFrom, 100, more);
        }
      }

      let lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      let pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
        getter();
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
    const { getContent, match, page } = this.props;

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

    getContent(filter, query, page, action);
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

  /**
   *  Toggle state showGrid to show a grid or list view from being displayed.
   */
  toggleView = event => {
    event.preventDefault();

    const { toggleViewSettings } = this.props;

    toggleViewSettings();
  }

  /**
   *  Toggle state showDesc to show the description on the page.
   */
  toggleDescriptions = event => {
    event.preventDefault();
    this.setState(prevState => ({ showDesc: !prevState.showDesc }));
  }

  /**
   *  Shows the popup modal for voter data.
   *
   *  @param {event} event Event triggered by element to handle
   *  @param {arary} voters Voters on a post or comment
   */
  showModalVotes = (event, voterData) => {
    event.preventDefault();
    this.setState({
      modalVotesOpen: true,
      voterData,
    });
  }

  /**
   *  Closes the popup modal for voter data.
   *
   *  @param {event} event Event triggered by element to handle
   */
  onModalVotesClose = event => {
    this.setState({
      modalVotesOpen: false,
    });
  }

  render() {
    const {
      props: {
        match: {
          path,
        },
        user,
        csrf,
        posts,
        isFetching,
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
        handleResteem,
        resteemedPayload,
        showGrid,
        followerCount,
        followingCount,
        followers,
        following,
        getSearchFollow,
        searchFollowLoading,
      },
      state: {
        showDesc,
        modalVotesOpen,
        voterData,
      },
    } = this;

    let addErrorPost = '';
    if (postExists) addErrorPost = <ErrorLabel position='left' text={this.existPost} />;

    const author = match.params.author;

    let pageheader = null;
    let followHeader = null;

    if (page === 'feed') {
      pageheader = (
        <Label size='big' color='blue'>
          <Header as='h3'>
            {`${author}'s Feed`}
          </Header>
        </Label>
      );
    }else if (page === 'blog' || page === 'follows') {
      pageheader = (
        <Label size='big' color='blue'>
          <Header as='h3' className='blog'>
            <Link
              to={`/@${author}`}
            >
              {`${author}'s Blog`}
            </Link>
          </Header>
        </Label>
      );

      followHeader = (
        <span>
          {'\u00A0\u00A0'}
          <Link
            to={`/@${author}/followers`}
          >
            <strong>{followerCount}</strong>
            {' followers'}
          </Link>

          <span>
            {'\u00A0\u00A0'}
            {'|'}
            {'\u00A0\u00A0'}
          </span>
          <Link
            to={`/@${author}/following`}
          >
            {'Following '}
            <strong>{followingCount}</strong>
          </Link>
          {
            user && user !== author && (
              <FollowButton
                user={author}
                pageOwner={author}
                compact
              />
            )
          }

        </span>
      );
    }else {
      pageheader = (
        <FilterPosts handleSubmitFilter={this.handleSubmitFilter} />
      );
    }

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
        <ModalVotesList
          modalOpen={modalVotesOpen}
          onModalClose={this.onModalVotesClose}
          voterData={voterData}
        />
        <ErrorBoundary>
          <React.Fragment>
            {
              page !== 'follows'
              ? (
                <div id="postList">
                  {
                    !showGrid
                    ? (
                      <div>
                        { pageheader }
                        { followHeader }
                        <ToggleView
                          toggleView={this.toggleView}
                          showGrid={showGrid}
                        />
                        <hr />
                        {
                          page === prevPage
                          ? (
                            <PostsSummaryList
                              posts={posts}
                              showModal={showModal}
                              user={user}
                              csrf={csrf}
                              handleUpvote={handleUpvote}
                              upvotePayload={upvotePayload}
                              isFetching={isFetching}
                              handleResteem={handleResteem}
                              page={page}
                              pageOwner={author}
                              resteemedPayload={resteemedPayload}
                              showModalVotes={this.showModalVotes}
                            />
                          ) : (
                            <Loading />
                          )
                        }
                      </div>
                    ) : (
                      <Grid columns={1} stackable>
                        <Grid.Column width={16} className="main">
                          <Grid stackable>
                            <Grid.Row>
                              <Grid.Column>
                                { pageheader }
                                { followHeader }
                                <ToggleView
                                  toggleView={this.toggleView}
                                  showGrid={showGrid}
                                />
                                <hr />
                                {'Hide Descriptions: '}
                                <a href='/description' onClick={this.toggleDescriptions}>
                                  {
                                    showDesc
                                    ? <Icon name='toggle off' size='large' />
                                    : <Icon name='toggle on' size='large' />
                                  }
                                </a>
                              </Grid.Column>
                            </Grid.Row>

                            {
                              page === prevPage
                              ? (
                                <PostsSummaryGrid
                                  posts={posts}
                                  showModal={showModal}
                                  user={user}
                                  csrf={csrf}
                                  handleUpvote={handleUpvote}
                                  upvotePayload={upvotePayload}
                                  isFetching={isFetching}
                                  handleResteem={handleResteem}
                                  page={page}
                                  pageOwner={author}
                                  resteemedPayload={resteemedPayload}
                                  showDesc={showDesc}
                                  showModalVotes={this.showModalVotes}
                                />
                              ) : (
                                <Loading />
                              )
                            }
                          </Grid>
                        </Grid.Column>
                      </Grid>
                    )
                  }
                  {
                    isFetching && page === prevPage && <Loading />
                  }
                </div>
              )
              : (
                <div>
                  { pageheader }
                  { followHeader }
                  <hr />
                  {
                    page === 'follows' && (
                      <Follows
                        path={path}
                        userLogged={user}
                        followers={followers}
                        following={following}
                        getSearchFollow={getSearchFollow}
                        author={author}
                        searchFollowLoading={searchFollowLoading}
                      />
                    )
                  }
                </div>
              )
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
      isFetching,
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
    resteem: {
      resteemedPayload,
    },
    settings: {
      showGrid,
    },
    follow: {
      followerCount,
      followingCount,
      followers,
      following,
      isFetching: isFetchingFollows,
      hasMore: hasMoreFollows,
      searchFollowLoading,
    }
  } = state;

  return {
    user,
    csrf,
    posts,
    isFetching,
    prevPage,
    hasMore,
    groups,
    postExists,
    addPostLoading,
    modalOpenAddPost,
    selectedGroup,
    upvotePayload,
    resteemedPayload,
    showGrid,
    followerCount,
    followingCount,
    followers,
    following,
    isFetchingFollows,
    hasMoreFollows,
    searchFollowLoading,
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
    showModal: (event, type, data) => (
      dispatch(addPostActions.showModal(event, type, data))
    ),
    handleModalClickAddPost: event => (
      dispatch(addPostActions.handleModalClickAddPost(event))
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
    handleResteem: (pid, author, permlink) => (
      dispatch(resteem(pid, author, permlink))
    ),
    toggleViewSettings: () => (
      dispatch(changeViewSettings())
    ),
    initViewSettings: () => (
      dispatch(initViewStorage())
    ),
    followCount: user => (
      dispatch(getFollowCount(user))
    ),
    getFollowersList: (user, startFrom, limit, more) => (
      dispatch(getFollowers(user, startFrom, limit, more))
    ),
    getFollowingList: (user, startFrom, limit, more) => (
      dispatch(getFollowing(user, startFrom, limit, more))
    ),
    clearFollowData: () => (
      dispatch(clearFollow())
    ),
    getSearchFollow: (user, userToFind, page) => (
      dispatch(searchFollowers(user, userToFind, page))
    ),
  }
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Posts));
