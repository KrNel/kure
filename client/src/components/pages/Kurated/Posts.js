import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, Label } from "semantic-ui-react";

import { fetchPosts } from '../../../actions/kuratedActions';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import RecentPostsList from '../Home/RecentPostsList';
import RecentPostsGrid from '../Home/RecentPostsGrid';
import ToggleView from '../../kure/ToggleView';
import Loading from '../../Loading/Loading';

/**
 *  Display the kurated posts that have been submitted for all communities.
 *
 *  TODO: Implement a sort and infinite scroll.
 */
class Posts extends Component {
  static propTypes = {
    isAuth: PropTypes.bool,
    posts: PropTypes.arrayOf(PropTypes.object.isRequired),
    isFetching: PropTypes.bool,
    hasMore: PropTypes.bool,
    getContent: PropTypes.func,
  };

  static defaultProps = {
    isAuth: false,
    posts: [],
    isFetching: false,
    hasMore: true,
    getContent: () => {},
  };

  state = {
    showGrid: true,
  };

  // limit for infinite scroll results to grab each time
  limit = 20;

  /**
   *  On compounent mount, retrieve the the posts data for display.
   */
  componentDidMount() {
    const { posts } = this.props;

    window.addEventListener("scroll", this.handleScroll);

    if (!posts.length)
      this.getPosts();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /**
   *  Infinite scroll. Checks to see if the last post in the list is reached,
   *  then calls fetch to get new posts.
   */
  handleScroll = () => {
    const { isFetching, hasMore } = this.props;

    if (!isFetching && hasMore) {
      let lastLi = document.querySelector(".kurated div.infiniteEl:last-child");
      let lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      let pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
        this.getPosts();
      }
    }
  }

  /**
   *  Gets the redux props values required to keep track of the infinite scroll
   *  and updated the next page's ID to grab the next set of posts to display.
   */
  getPosts = () => {
    let {getContent, posts} = this.props;

    let nextPageId = '';
    if (posts.length) {
      nextPageId = posts[posts.length-1]._id;
    }

    getContent(this.limit, nextPageId);
  }


  /**
   *  Toggle state showGrid to show a grid or list view from being displayed.
   */
  toggleView = event => {
    event.preventDefault();
    const { showGrid } = this.state;
    this.setState({ showGrid: !showGrid });
  }

  render() {
    const {
      state: {
        showGrid,
      },
      props: {
        isAuth,
        posts,
        isFetching,
      }
    } = this;


  const recentPostsComp =
    showGrid
      ? <RecentPostsGrid posts={posts} isAuth={isAuth} />
      : <RecentPostsList posts={posts} isAuth={isAuth} />

    return (
      <ErrorBoundary>
        <div className='kurated'>
          <Grid columns={1} stackable>
            <Grid.Column width={16} className="main">
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Label size='big' color='blue'>
                      <Header as="h3">Kurated Posts</Header>
                    </Label>
                    <ToggleView
                      toggleView={this.toggleView}
                      showGrid={showGrid}
                    />
                  </Grid.Column>
                </Grid.Row>
                {recentPostsComp}
                { isFetching && <Loading /> }
              </Grid>
            </Grid.Column>
          </Grid>
        </div>
      </ErrorBoundary>
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
    kurated: {
      isFetching,
      hasMore,
      posts,
    },
    auth: {
      isAuth
    }
  } = state;

  return {
    isAuth,
    isFetching,
    hasMore,
    posts,
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
    getContent: (limit, nextPageId) => (
      dispatch(fetchPosts(limit, nextPageId))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
