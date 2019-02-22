import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Grid, Header, Segment, Label } from "semantic-ui-react";
import { connect } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

import { fetchPosts } from '../../../actions/recentPostsActions';
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
    user: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    myComms: PropTypes.arrayOf(PropTypes.object).isRequired,
    mySubs: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool.isRequired,
    isAuth: PropTypes.bool.isRequired,
  };

  //this fetches when page loaded after site loads from elsewhere (user defined)
  componentDidMount() {
    const {selected, dispatch, user} = this.props;
    if (user !== '') {
      dispatch(fetchPosts(selected, user));
    }
  }

  //need this for first page load, as user is empty and cant fetch on componentDidMount
  componentDidUpdate(prevProps) {
    const {selected, dispatch, user} = this.props;
    if (prevProps.user !== user) {
      dispatch(fetchPosts(selected, user));
    }
  }

  render() {
    //const { selected, posts, isFetching, lastUpdated, isAuth } = this.props;
    const { posts, groups, isFetching, isAuth, myComms, mySubs } = this.props;
    //const isEmpty = posts.length === 0;
    const recentPostsComp =
        (isFetching)
          ? <Loader active inline='centered' />
        : <RecentPosts posts={posts} isAuth={isAuth} />;

    moment.locale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s:  'secs',
        ss: '%ss',
        m:  'a min',
        mm: '%dm',
        h:  '1h',
        hh: '%dh',
        d:  'a day',
        dd: '%dd',
        M:  'month',
        MM: '%dM',
        y:  'year',
        yy: '%dY'
      }
    });

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
                groups.length
                ?
                  groups.map(g => (
                    <Grid.Column key={g.name} width={8}>
                      <Segment.Group className='box'>
                        <Segment>
                          <Label attached='top' className='head'>
                            <Header as='h3'>
                              {g.display}
                            </Header>
                          </Label>
                          <ul className='custom-list'>
                            {
                              g.posts.length
                              ? g.posts.map(p => (
                                <li key={p._id}>
                                  <Link
                                    to={p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
                                  >
                                    {`\u2022\u00A0`}
                                    {(p.st_title.length > 40)
                                      ? p.st_title.substr(0,40) + " ..."
                                      : p.st_title}
                                  </Link>
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

          {/*<Grid.Row><Header as="h1">Popular Groups:</Header></Grid.Row>*/}
          {/*<Grid.Row><Header as="h1">New Groups:</Header></Grid.Row>*/}

          <Grid.Column width={4} className="sidebar">
            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>My Communities</Header>
                </Label>
                <ul className='custom-list'>
                  {
                    !isAuth
                    ? <li>Must be logged in.</li>
                    : myComms.length
                      ?
                      myComms.map(c => (
                        <li key={c._id}>
                          <div className='left'>{c.display}</div>
                          <div className='right meta'>{moment.utc(c.updated).fromNow()}</div>
                          <div className='clear' />
                        </li>
                      ))
                      : <li>Create a community.</li>
                  }
                </ul>
              </Segment>
            </Segment.Group>

            <Segment.Group className='box'>
              <Segment>
                <Label attached='top' className='head'>
                  <Header as='h3'>My Submissions</Header>
                </Label>
                <ul className='custom-list'>
                  {
                    !isAuth
                    ? <li>Must be logged in.</li>
                    : mySubs.length
                      ?
                      mySubs.map(p => (
                        <li key={p._id}>
                          <div className='left'>
                            <Link
                              to={p.st_category+'/@'+p.st_author+'/'+p.st_permlink}
                            >
                              {
                                // eslint-disable-next-line
                                (p.st_title.length > 14) //longer than 14 chars?
                                  //eslint-disable-next-line
                                  ? (/[^\u0000-\u007f]/.test(p.st_title)) //non latin?
                                    ? p.st_title.substr(0,8) + " ..." //truncate non latin
                                    : p.st_title.substr(0,14) + " ..." //truncate latin
                                  : p.st_title //no truncate
                              }
                            </Link>
                          </div>
                          <div className='right meta'>{moment.utc(p.created).fromNow()}</div>
                          <div className='clear' />
                        </li>
                      ))
                      : <li>Curate some posts.</li>
                  }
                </ul>
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
    user: auth.userData.name,
  }
}

export default connect(mapStateToProps)(Home);
