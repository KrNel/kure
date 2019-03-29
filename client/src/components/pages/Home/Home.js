import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Label, Tab } from "semantic-ui-react";
import { connect } from 'react-redux';

import CommunityActivity from './CommunityActivity';
import Loading from '../../Loading/Loading';
import ToggleView from '../../common/ToggleView';
import MyCommunities from './MyCommunities';
import MySubmissions from './MySubmissions';
import { fetchPosts } from '../../../actions/recentPostsActions';
import RecentPostsList from './RecentPostsList';
import RecentPostsGrid from './RecentPostsGrid';
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

  state = {
    showGrid: true,
    tabSelected: 'recent',
  }

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

  toggleView = (e) => {
    e.preventDefault();
    const { showGrid } = this.state;
    this.setState({ showGrid: !showGrid });
  }

  tabView = (e, selected) => {
    e.preventDefault();
    this.setState({ tabSelected: selected });
  }

  render() {
    const { posts, groups, isFetching, isAuth, myComms, mySubs } = this.props;

    const { showGrid, tabSelected } = this.state;

    const recentPostsComp =
      isFetching
      ? <Loading />
      : showGrid
        ? <RecentPostsGrid posts={posts} isAuth={isAuth} />
        : <RecentPostsList posts={posts} isAuth={isAuth} />

      /*const panes = [
      { menuItem: <Label size='big' color='blue'><Header as="h3">Recent Kurations</Header></Label>, render: () => <Tab.Pane attached={false}><Grid></Grid></Tab.Pane> },
      { menuItem: <Label size='big' color='blue'><Header as="h3">Community Activity</Header></Label>, render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
      { menuItem: 'Tab 3', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
    ]*/
    let selectedTab = null;
    if (tabSelected === 'recent') {
      selectedTab = recentPostsComp;
    }else if (tabSelected === 'activity') {
      selectedTab = <CommunityActivity groups={groups} />;
    }

    let tabs = [
      {name: 'Recent Kurations', view: 'recent'},
      {name: 'Community Activity', view: 'activity'}
    ];


    return (
      <ErrorBoundary>
        <div className="home">
          <Grid columns={1} stackable>
            <Grid.Column width={12} className="main">
              <Grid>
                <Grid.Row className="reducePad">
                  <Grid.Column>
                    {
                      tabs.map((t,i) => {
                        let color = 'gray';

                        if (tabSelected === t.view)
                          color += ' blue';

                        return (
                          <a key={t.view} href={`/${t.view}`} className='tabSelect' onClick={(e) => this.tabView(e, t.view)}>
                            <Label size='big' color={color}>
                              <Header as="h3">{t.name}</Header>
                            </Label>
                          </a>
                        )
                      })
                    }
                    <ToggleView
                      toggleView={this.toggleView}
                      showGrid={showGrid}
                    />
                  </Grid.Column>
                </Grid.Row>

                {selectedTab}

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
