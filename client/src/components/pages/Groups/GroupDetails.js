import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Grid, Label, Header, Segment, Dimmer, Loader } from "semantic-ui-react";
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import Loading from '../../Loading/Loading';
import GroupPostsList from '../../kure/GroupPostsList';
import GroupPostsGrid from '../../kure/GroupPostsGrid';
import GroupUsers from '../../kure/GroupUsers';
import joinCommunities from '../../../utils/joinCommunities';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import { getGroupData, groupClear, joinGroup } from '../../../actions/communitiesActions';
import ToggleView from '../../kure/ToggleView';
import defaultImage from '../../../images/steemkure-600.png';

/**
 *  Shows the individual community page details.
 *
 *  Data is fetched from the DB then processed to be added to specific views.
 *  The Posts and Members are toggled for view selection, and the Posts can
 *  further be toggled to show as a grid or listab.
 */
class GroupDetails extends Component {

  static propTypes = {
    match: PropTypes.shape(PropTypes.object.isRequired),
    isAuth: PropTypes.bool,
    clearContent: PropTypes.func,
    isFetching: PropTypes.bool,
    groupData: PropTypes.shape(PropTypes.object.isRequired),
    getContent: PropTypes.func,
    joinGroupRequest: PropTypes.func,
    groupRequested: PropTypes.string,
    isJoining: PropTypes.bool,
  };

  static defaultProps = {
    isAuth: false,
    match: {},
    clearContent: () => {},
    isFetching: false,
    groupData: {},
    getContent: () => {},
    joinGroupRequest: () => {},
    groupRequested: '',
    isJoining: false,
  };

  constructor(props) {
    super(props)
    this.state = {
      showGrid: true,
      tabSelected: 'posts',
    };

    this.limit = 20;
  }

  /**
   *  Fetch post detail from Steem blockchain on component mountab.
   */
  componentDidMount() {

    window.addEventListener("scroll", this.handleScroll);

    this.getPosts();
  }

  /**
   *  Remove scoll window listener and clear the group redux contentab.
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);

    const { clearContent } = this.props;
    clearContent();
  }

  /**
   *  Infinite scroll. Checks to see if the last post in the list is reached,
   *  then calls fetch to get new posts.
   */
  handleScroll = () => {
    const {
      isFetching,
      groupData: {
        hasMore,
      }
    } = this.props;

    if (!isFetching && hasMore) {
      let lastLi = document.querySelector(".community div.infiniteEl:last-child");
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
    const {
      getContent,
      groupData: {
        kposts,
      },
      match: {
        params: {
          group
        },
      },
    } = this.props;

    let nextPageId = '';
    if (kposts.length) {
      nextPageId = kposts[kposts.length - 1]._id;
    }

    getContent(group, this.limit, nextPageId);
  }

  /**
   *  When user requests to join a community, send the request to DB
   *  for processing.
   *
   *  @param {element} event Element onClick comes from
   *  @param {string} group Group being requested to join
   */
  onJoinGroup = (event, group) => {
    event.preventDefault();

    const { joinGroupRequest } = this.props;
    joinGroupRequest(group);
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
        isAuth,
        groupData,
        isFetching,
        groupRequested,
        isJoining,
        match: {
          url,
        }
      }
    } = this;

    const posts =
      groupData.kposts.length
      ? showGrid
        ? <GroupPostsGrid posts={groupData.kposts} />
        : <GroupPostsList posts={groupData.kposts} />
      : (
        <Grid>
          <Grid.Column>
            <div>
              <Segment floated='left'>
                {'No posts.'}
              </Segment>
            </div>
          </Grid.Column>
        </Grid>
      );


    let selectedTab = null;
    if (tabSelected === 'posts') {
      selectedTab = posts;
    }else if (tabSelected === 'users') {
      selectedTab = (
        <GroupUsers
          users={groupData.kusers}
        />
      );
    }

    let tabs = [
      {name: 'Posts', view: 'posts'},
      {name: 'Members', view: 'users'}
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
    })

    const metaUrl = `https://thekure.net/${url}`;
    const pageTitle = `${groupData.display} Community`;
    const desc = 'View the communities users have created on KURE.';
    const metaTitle = `${pageTitle} - KURE`;
    const ampUrl = `${url}/amp`;
    const image = `https://thekure.net${defaultImage}`;

    return (
      !groupData.notExists
      ? groupData.display
        ? (
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
              <div className='community'>
                <Grid columns={1} stackable>
                  <Grid.Column width={16} className="main">
                    <Grid stackable>
                      <Grid.Row>
                        <Grid.Column>
                          <Label size='large' color='blue'>
                            <Header as='h2'>
                              {groupData.display}
                            </Header>
                          </Label>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <div className='left'>
                            {tabViews}
                            { isAuth && (
                              <Label size='large'>
                                { isJoining && <Dimmer inverted active={isJoining}><Loader size='tiny' inline /></Dimmer> }
                                {'Membership: '}
                                {
                                  joinCommunities(isAuth, groupRequested, groupData.name, groupData.kaccess[0], this.onJoinGroup)
                                }
                              </Label>
                            )}
                          </div>
                          <ToggleView
                            toggleView={this.toggleView}
                            showGrid={showGrid}
                          />
                          <div className='clear' />
                        </Grid.Column>
                      </Grid.Row>
                      {selectedTab}
                      { isFetching && <Loading /> }
                    </Grid>
                  </Grid.Column>
                </Grid>
              </div>
            </ErrorBoundary>
          </React.Fragment>
        )
        : <Loading />
      : (
        <Segment>
          {`That group doesn't exist.`}
        </Segment>
      )
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
      isAuth,
    },
    communities: {
      isFetching,
      groupData,
      isJoining,
    }
  } = state;

  return {
    isAuth,
    isFetching,
    groupData,
    isJoining,
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
    getContent: (group, limit, nextId) => (
      dispatch(getGroupData(group, limit, nextId))
    ),
    clearContent: () => (
      dispatch(groupClear())
    ),
    joinGroupRequest: (group) => (
      dispatch(joinGroup(group))
    ),
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetails);
