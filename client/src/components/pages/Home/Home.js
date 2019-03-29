import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Segment, Label } from "semantic-ui-react";
import { connect } from 'react-redux';

import Loading from '../../Loading/Loading';
import GroupLink from '../../common/GroupLink';
import MyCommunities from './MyCommunities';
import MySubmissions from './MySubmissions';
import { fetchPosts } from '../../../actions/recentPostsActions';
//import RecentPostsTable from './RecentPostsTable';
import RecentPostsGrid from './RecentPostsGrid';
import TitleLink from '../../common/TitleLink';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import './Home.css';

/**
 *  Home page component.
 *
 *  Shows the recent activity on the site.
 *  Recently added posts from all community groups are shown.
 *  Non-logged in users need to force a 'x' as a user in order for data to be
 *  retrieved from the database. Without that, the data comes back empty.
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
    user: PropTypes.string,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    myComms: PropTypes.arrayOf(PropTypes.object).isRequired,
    mySubs: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    user: 'x'
  };

  //this fetches when page loaded after site loads from elsewhere (user defined)
  componentDidMount() {
    let {
      selected,
      dispatch,
      user,
      csrf,
      isAuth
    } = this.props;

    if (user === '')
      user = 'x';
    if ((!isAuth && user === 'x') || isAuth) {//fetch data when not logged in, or logged in, on first page view
      dispatch(fetchPosts(selected, user));
    }else if (csrf && !isAuth) {
      dispatch(fetchPosts(selected, 'x'));//fetch data when logged out right after page refresh
    }
  }

  //need this for first page load, as user is empty and cant fetch on componentDidMount
  componentDidUpdate(prevProps) {
    const {selected, dispatch, user} = this.props;
    if (prevProps.user !== user)
      dispatch(fetchPosts(selected, user));
  }


  render() {
    //const { selected, posts, isFetching, lastUpdated, isAuth } = this.props;
    const { posts, groups, isFetching, isAuth, myComms, mySubs } = this.props;
    //const isEmpty = posts.length === 0;
    const recentPostsComp =
        (isFetching)
          ? <Loading />
          : <RecentPostsGrid posts={posts} isAuth={isAuth} />;

    return (
      <ErrorBoundary>
        <div className="home">
          <Grid columns={1} stackable>
            <Grid.Column width={12} className="main">
              <Grid>
                <Grid.Row className="reducePad">
                  <Grid.Column>
                    <Label size='big' color='blue'><Header as="h3">Recent Kurations</Header></Label>
                  </Grid.Column>
                </Grid.Row>

                {
                  posts.length && (
                    recentPostsComp
                  )
                }

                <Grid.Row className="reducePad">
                  <Grid.Column>
                    <Label size='big' color='blue'><Header as="h3">Community Activity</Header></Label>
                  </Grid.Column>
                </Grid.Row>

                {
                  groups.length
                  ?
                    groups.map(g => (
                      <Grid.Column key={g.name} width={8}>
                        <Segment.Group className='box'>
                          <Segment>
                            <Label attached='top' className='head'>
                              <Header as='h3'>
                                <GroupLink display={g.display} name={g.name} />
                              </Header>
                            </Label>
                            <ul className='custom-list'>
                              {
                                g.kposts.length
                                ? g.kposts.map(p => (
                                  <li key={p._id} className='ellipsis'>
                                    {`\u2022\u00A0`}
                                    <TitleLink
                                      title={p.st_title}
                                      category={p.st_category}
                                      author={p.st_author}
                                      permlink={p.st_permlink}
                                    />
                                  </li>
                                )) : 'No posts.'
                              }
                            </ul>
                          </Segment>
                        </Segment.Group>
                      </Grid.Column>
                    ))
                  : (
                    <Grid.Row columns={1}>
                      <Grid.Column>
                        <Segment>
                          {'No communities.'}
                        </Segment>
                      </Grid.Column>
                    </Grid.Row>
                  )
                }
              </Grid>
            </Grid.Column>

            <Grid.Column width={4} className="sidebar">
              <MyCommunities myComms={myComms} isAuth={isAuth} />
              <MySubmissions mySubs={mySubs} isAuth={isAuth} />
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
  const { selected, recentActivity, auth } = state;
  const {
    isFetching,
    lastUpdated,
    postItems: posts,
    groupItems: groups,
    myCommunities: myComms,
    mySubmissions: mySubs,
  } = recentActivity[selected]
  || {
    isFetching: true,
    postItems: [],
    groupItems: [],
    myCommunities: [],
    mySubmissions: [],
  }

  return {
    selected,
    posts,
    groups,
    myComms,
    mySubs,
    isFetching,
    lastUpdated,
    isAuth: auth.isAuth,
    user: auth.user,
    csrf: auth.csrf,
  }
}

export default connect(mapStateToProps)(Home);
