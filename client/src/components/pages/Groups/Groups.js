import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {Grid, Segment, Label, Header} from "semantic-ui-react";
import { Helmet } from 'react-helmet-async';

import GroupsRecent from './GroupsRecent';
import GroupsCreatedGrid from './GroupsCreatedGrid';
import GroupsCreatedList from './GroupsCreatedList';
import ToggleView from '../../kure/ToggleView';
import Loading from '../../Loading/Loading';

import './Groups.css';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { getGroups } from '../../../actions/communitiesActions';
import defaultImage from '../../../images/steemkure-600.png';

/**
 *  Community page component that displays a variety of data tailored around
 *  the community activity. From recently active, to popular, to newly created.
 */
class Groups extends Component {

  static propTypes = {
    match: PropTypes.shape(PropTypes.object.isRequired),
    isFetching: PropTypes.bool,
    groupsCreated: PropTypes.arrayOf(PropTypes.object.isRequired),
    groupsActivity: PropTypes.arrayOf(PropTypes.object.isRequired),
    getContent: PropTypes.func,
    hasMore: PropTypes.bool,
  };

  static defaultProps = {
    match: {},
    isFetching: true,
    groupsCreated: [],
    groupsActivity: [],
    getContent: () => {},
    hasMore: true,
  };

  state = {
    showGrid: true,
    tabSelected: 'new',
  }

  limit = 20;

  /**
   *  When going to Communities page from other pages, load componentDidMount
   *  with props set and fetch data.
   */
  componentDidMount() {
    const { groupsCreated } = this.props;

    window.addEventListener("scroll", this.handleScroll);

    if (!groupsCreated.length)
      this.getGroupsData();
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
    } = this.props;
    if (!isFetching && hasMore) {
      let lastLi = document.querySelector("#newlyCreated div.four.wide.column:last-child");
      let lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
      let pageOffset = window.pageYOffset + window.innerHeight;
      if (pageOffset > lastLiOffset) {
        this.getGroupsData();
      }
    }
  }

  /**
   *  Get the various community data to display on the page.
   *
   *  @param {string} user User logged in
   */
  getGroupsData = () => {
    const {
      groupsCreated,
      getContent,
    } = this.props;

    let nextPageId = '';
    if (groupsCreated.length) {
      nextPageId = groupsCreated[groupsCreated.length - 1]._id;
    }

    getContent(this.limit, nextPageId);
  }

  /**
   *  Toggle state showGrid to show a grid or list view from being displayed.
   */
  toggleView = event => {
    event.preventDefault();
    this.setState(prevState => ({ showGrid: !prevState.showGrid }));
  }

  /**
   *  Update state with the selected page section to view.
   */
  tabView = (event, selected) => {
    event.preventDefault();
    this.setState({ tabSelected: selected });
  }

  render() {
    const {
      state: {
        showGrid,
        tabSelected,
      },
      props: {
        match,
        isFetching,
        groupsCreated,
        groupsActivity,
      }
    } = this;

    const newlyCreated =
      showGrid
      ? (
        <GroupsCreatedGrid
          groups={groupsCreated}
          match={match}
        />
      )
      : (
        <GroupsCreatedList
          groups={groupsCreated}
          match={match}
        />
      );

    let selectedTab = null;
    if (tabSelected === 'new') {
      selectedTab = newlyCreated;
    }else if (tabSelected === 'activity') {
      selectedTab = (
        <GroupsRecent
          groupsActivity={groupsActivity}
        />
      );
    }

    let tabs = [
      {name: 'Recently Created', view: 'new'},
      {name: 'Recently Active', view: 'activity'}
    ];

    //create the tab section
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
    })

    const metaUrl = `https://thekure.net/groups`;
    const pageTitle = `Communities`;
    const desc = 'View the communities users have created on KURE.';
    const metaTitle = `${pageTitle} - KURE`;
    const ampUrl = `groups/amp`;
    const image = `https://thekure.net${defaultImage}`;

    let pageData = null;

    //if there is data, display the data part of the page
    if (groupsCreated.length) {
      pageData = (
        <Grid columns={1} stackable>
          <Grid.Column>
            <div id='newlyCreated'>
              <Grid.Row>
                <Grid.Column>
                  {tabViews}
                  <ToggleView
                    toggleView={this.toggleView}
                    showGrid={showGrid}
                  />
                  <div className='clear' />
                </Grid.Column>
              </Grid.Row>
              <hr />
              {selectedTab}
              { isFetching && <Loading /> }
            </div>
          </Grid.Column>
        </Grid>
      )
    //if there is no data and fetching, show loader
    }else if (isFetching) {
      pageData = <Loading />;
    //if there is no data and no fetching, no groups exist
    }else {
      pageData = (
        <Segment>
          {'No communities.'}
        </Segment>
      )
    }
    
    return (
      <React.Fragment>
        <Helmet>
          <title>{pageTitle}</title>
          <link rel="canonical" href={metaUrl} />
          <link rel="amphtml" href={ampUrl} />
          <meta property="description" content={desc} />
          <meta property="og:title" content={metaTitle} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={metaUrl} />
          <meta property="og:image" content={image} />
          <meta property="og:description" content={desc} />
          <meta property="og:site_name" content="KURE" />
        </Helmet>
        <ErrorBoundary>
          {pageData}
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
    communities: {
      isFetching,
      groups: {
        groupsCreated,
        groupsActivity,
        hasMore,
      },
    }
  } = state;

  return {
    isFetching,
    groupsCreated,
    groupsActivity,
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
    getContent: (limit, nextPageId) => (
      dispatch(getGroups(limit, nextPageId))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
