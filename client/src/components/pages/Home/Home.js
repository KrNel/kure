import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Label } from "semantic-ui-react";
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import CommunityActivity from './CommunityActivity';
import Loading from '../../Loading/Loading';
import ToggleView from '../../kure/ToggleView';
import MyCommunities from './MyCommunities';
import MySubmissions from './MySubmissions';
import { fetchPosts } from '../../../actions/recentPostsActions';
import RecentPostsList from './RecentPostsList';
import RecentPostsGrid from './RecentPostsGrid';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import './Home.css';
import defaultImage from '../../../images/steemkure-600.png';

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
    getContent: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.object).isRequired,
    groups: PropTypes.arrayOf(PropTypes.object).isRequired,
    myComms: PropTypes.arrayOf(PropTypes.object).isRequired,
    mySubs: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetching: PropTypes.bool,
    isAuth: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool,
  };

  static defaultProps = {
    hasMore: true,
    isFetching: true,
  };

  state = {
    showGrid: true,
    tabSelected: 'new',
  }

  // limit for infinite scroll results to grab each time
  limit = 20;

  //this fetches when page loaded after site loads from elsewhere (user defined)
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
    const { tabSelected } = this.state;

    if (!isFetching && hasMore && tabSelected === 'new') {
      let lastLi = document.querySelector(".home div.infiniteEl:last-child");
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
    let {selected, getContent, posts} = this.props;

    let nextPageId = '';
    if (posts.length) {
      nextPageId = posts[posts.length-1]._id;
    }

    getContent(selected, this.limit, nextPageId);
  }

  /**
   *  Toggle state showGrid to show a grid or list view from being displayed.
   */
  toggleView = event => {
    event.preventDefault();
    const { showGrid } = this.state;
    this.setState({ showGrid: !showGrid });
  }

  /**
   *  Update state with the selected page section to view.
   */
  tabView = (event, selected) => {
    event.preventDefault();
    this.setState({ tabSelected: selected });
  }

  render() {
    const { posts, groups, isFetching, isAuth, myComms, mySubs } = this.props;

    const { showGrid, tabSelected } = this.state;

    const recentPostsComp =
      showGrid
        ? <RecentPostsGrid posts={posts} isAuth={isAuth} />
        : <RecentPostsList posts={posts} isAuth={isAuth} />

    let selectedTab = null;
    if (tabSelected === 'new') {
      selectedTab = recentPostsComp;
    }else if (tabSelected === 'activity') {
      selectedTab = <CommunityActivity groups={groups} />;
    }

    let tabs = [
      {name: 'Recent Kurations', view: 'new'},
      {name: 'Community Activity', view: 'activity'}
    ];

    const tabViews = tabs.map(tab => {
      let classes = 'tabSelect';

      if (tabSelected === tab.view)
        classes += ' activeTab'

      return (
        <a key={tab.view} href={`/${tab.view}`} className={classes} onClick={event => this.tabView(event, tab.view)}>
          <Label size='big'>
            <Header as="h3">{tab.name}</Header>
          </Label>
        </a>
      )
    });

    const metaUrl = `https://thekure.net/`;
    const pageTitle = 'KURE Community Curation';
    const desc = 'KURE empowers the Steem community to coordinate their curation efforts through building community networks of their own.';
    const ampUrl = `home/amp`;
    const image = `https://thekure.net${defaultImage}`;

    return (
      <React.Fragment>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={metaUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={metaUrl} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="KURE" />
        </Helmet>
        <ErrorBoundary>
          <div className="home">
            <Grid columns={1} stackable>
              <Grid.Column width={12} className="main">
                <Grid stackable>
                  <Grid.Row>
                    <Grid.Column>
                      {tabViews}
                      <ToggleView
                        toggleView={this.toggleView}
                        showGrid={showGrid}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  {selectedTab}
                  { isFetching && <Loading /> }
                </Grid>
              </Grid.Column>

              <Grid.Column width={4} className="sidebar">
                <MyCommunities myComms={myComms} isAuth={isAuth} />
                <MySubmissions mySubs={mySubs} isAuth={isAuth} />
              </Grid.Column>
            </Grid>
          </div>
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
  const { selected, recentActivity, auth } = state;
  const {
    isFetching,
    lastUpdated,
    hasMore,
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
    hasMore: true,
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
    hasMore,
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
    getContent: (selected, limit, nextPageId) => (
      dispatch(fetchPosts(selected, limit, nextPageId))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
