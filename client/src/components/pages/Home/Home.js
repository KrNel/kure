import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Grid, Header, Segment } from "semantic-ui-react";
import { connect } from 'react-redux';

import { fetchPostsIfNeeded } from '../../../actions/recentPostsActions';
import RecentPosts from './RecentPosts'
import './Home.css';

/**
 *  Home page component.
 *
 *  Shows the recent activity on the site.
 *  Recently added posts from all community groups are shown.
 *
 *  @param {object} props Component props
 *  @param {string} props.selected Selected activity to display
 *  @param {function} props.dispatch Redux function to dispatch action
 *  @param {object} props.posts Contains data for recently added posts
 *  @param {bool} props.isFetching Determines if laoding spinner is to be shown
 *  @param {bool} props.isAuth Determines if user is authenticated
 *  @returns {Component} A component that displays the page data
 */
class Home extends Component {

  static propTypes = {
    selected: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const {selected, dispatch} = this.props;
    dispatch(fetchPostsIfNeeded(selected));
  }

  componentDidUpdate(prevProps) {
    /*if (prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }*/
  }

  render() {

    //const { selected, posts, isFetching, lastUpdated, isAuth } = this.props;
    const { posts, isFetching, isAuth } = this.props;
    const isEmpty = posts.length === 0;
    const recentPostsComp =
        (isFetching)
          ? <Loader active inline='centered' />
        : (isEmpty)
              ? 'No Posts'
              : (posts.map((post, i) => <RecentPosts key={post._id} post={post} isAuth={isAuth} />));

    return (
      <div className="home">
        <Grid columns={1} stackable>
          <Grid.Column width={16} className="main">
            <Grid>
              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Recently Added</Header>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1}>
                <Grid.Column>
                  <Segment className="nopad">
                    {recentPostsComp}
                  </Segment>
                </Grid.Column>
              </Grid.Row>

              {/*<Grid.Row className="reducePad">
                <Grid.Column>
                  <Header as="h3">Community Activity</Header>
                </Grid.Column>
              </Grid.Row>

                <Grid.Column width={8}>
                  <Segment>
                    <p>1</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>2</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>3</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Segment>
                    <p>3</p>
                    <p>Sample test to test the limits of the word wrap in a paragraph box.</p>
                  </Segment>
                </Grid.Column>*/}

            </Grid>
          </Grid.Column>

          {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
          {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

          {/*<Grid.Column width={4} className="sidebar">
            <Card>
              <Card.Content>
                <Card.Header as="h3">My Groups</Card.Header>
              </Card.Content>
              <Card.Content>
                <Feed>
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Date content='1 day ago' />
                      <Feed.Summary>
                        Thumb - Post Title - Likes?
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Card.Content>
            </Card>
          </Grid.Column>*/}

        </Grid>
      </div>
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
  const { selected, recentActivity, auth } = state
  const {
    isFetching,
    lastUpdated,
    items: posts
  } = recentActivity[selected] || {
    isFetching: true,
    items: []
  }

  return {
    selected,
    posts,
    isFetching,
    lastUpdated,
    isAuth: auth.isAuth
  }
}

export default connect(mapStateToProps)(Home);
