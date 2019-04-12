import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Header, Label } from "semantic-ui-react";

import { getPosts } from '../../../utils/fetchFunctions';
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
  };

  static defaultProps = {
    isAuth: false,
  };

  state = {
    isLoading: true,
    posts: [],
    showGrid: true,
  };

  /**
   *  On compounent mount, retrieve the the posts data for display.
   */
  componentDidMount() {
    this.getPostsFetch();
  }

  /**
   *  Fetch the posts data from the node server. On response, set
   *  loading state var to false and update state with posts.
   */
  getPostsFetch = () => {
    getPosts()
    .then(result => {
      this.setState({
        isLoading: false,
        posts: result.data.posts,
      });
    }).catch(err => {
      //logger('error', err);
    });
  }

  /**
   *  Toggle state showGrid to show a grid or list view from being displayed.
   */
  toggleView = (e) => {
    e.preventDefault();
    const { showGrid } = this.state;
    this.setState({ showGrid: !showGrid });
  }

  render() {
    const {
      state: {
        posts,
        isLoading,
        showGrid,
      },
      props: {
        isAuth
      }
    } = this;


  const recentPostsComp =
    isLoading
    ? <Loading />
    : showGrid
      ? <RecentPostsGrid posts={posts} isAuth={isAuth} />
      : <RecentPostsList posts={posts} isAuth={isAuth} />

    return (
      <ErrorBoundary>
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
            </Grid>
          </Grid.Column>
        </Grid>
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
  const { isAuth } = state.auth;

  return {
    isAuth,
  }
}

export default connect(mapStateToProps)(Posts);
