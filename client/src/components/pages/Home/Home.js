import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Grid, Header, Segment, Label } from "semantic-ui-react";
import { connect } from 'react-redux';

import { fetchRecentIfNeeded } from '../../../actions/recentPostsActions';
import RecentPosts from './RecentPosts'
import './Home.css';
import {BASE_STEEM_URL} from '../../../settings';

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
    dispatch(fetchRecentIfNeeded(selected));
  }

  componentDidUpdate(prevProps) {
    /*if (prevProps.selectedSubreddit !== this.props.selectedSubreddit) {
      const { dispatch, selectedSubreddit } = this.props
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }*/
  }

  render() {

    //const { selected, posts, isFetching, lastUpdated, isAuth } = this.props;
    const { posts, groups, isFetching, isAuth } = this.props;
    const isEmpty = posts.length === 0;
    const recentPostsComp =
        (isFetching)
          ? <Loader active inline='centered' />
        : (isEmpty)
              ? 'No Posts'
              : <RecentPosts posts={posts} isAuth={isAuth} />;

    return (
      <div className="home">
        <Grid columns={1} stackable>
          <Grid.Column width={12} className="main">
            <Grid>
              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Label size='big' color='blue'><Header as="h3">Recently Added</Header></Label>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row columns={1}>
                <Grid.Column>
                  {recentPostsComp}
                </Grid.Column>
              </Grid.Row>

              <Grid.Row className="reducePad">
                <Grid.Column>
                  <Label size='big' color='blue'><Header as="h3">Community Activity</Header></Label>
                </Grid.Column>
              </Grid.Row>

              {
                groups.map((g, i) => {
                  return (
                    <Grid.Column key={g.name} width={8}>
                      <Segment.Group className='box'>
                        <Segment>
                          <Label attached='top' className='head'>
                            <Header as='h3'>
                              {g.display}
                            </Header>
                          </Label>
                          <ul className='group-posts'>
                            {
                              g.posts.map((p, i) => {
                                return (
                                  <li key={p._id}>
                                    <a
                                      href={BASE_STEEM_URL+'/'+p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
                                    >
                                      {`\u2022\u00A0`}
                                      {(p.st_title.length > 40)
                                        ? p.st_title.substr(0,40) + " ..."
                                        : p.st_title}
                                    </a>
                                  </li>
                                )
                              })
                            }
                          </ul>
                        </Segment>
                      </Segment.Group>
                    </Grid.Column>
                  )
                })
              }


            </Grid>
          </Grid.Column>

          {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
          {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

          <Grid.Column width={4} className="sidebar">
            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>
                    My Groups
                  </Header>
                </Label>
                <div>Post 1</div>
                <div>Post 2</div>
                <div>Post 3</div>
              </Segment>
            </Segment.Group>

            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>
                    My Submissions
                  </Header>
                </Label>
                <div>Post 1</div>
                <div>Post 2</div>
                <div>Post 3</div>
              </Segment>
            </Segment.Group>
          </Grid.Column>



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
    postItems: posts,
    groupItems: groups
  } = recentActivity[selected]
  || {
    isFetching: true,
    postItems: [],
    groupItems: []
  }

  return {
    selected,
    posts,
    groups,
    isFetching,
    lastUpdated,
    isAuth: auth.isAuth
  }
}

export default connect(mapStateToProps)(Home);
