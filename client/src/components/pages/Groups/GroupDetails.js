import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Grid, Label, Header, Segment} from "semantic-ui-react";
import PropTypes from 'prop-types';

import Loading from '../../Loading/Loading';
import GroupPostsList from '../../common/GroupPostsList'
import GroupPostsGrid from '../../common/GroupPostsGrid'
import GroupUsers from '../../common/GroupUsers'
import { getGroupDetails, requestToJoinGroup, logger } from '../../../utils/fetchFunctions';
import joinCommunities from '../../../utils/joinCommunities';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';
import {hasLength} from '../../../utils/helpers';

/**
 *
 *
 */
class GroupDetails extends Component {

  static propTypes = {
    user: PropTypes.string,
    csrf: PropTypes.string,
    match: PropTypes.shape(PropTypes.object.isRequired),
    isAuth: PropTypes.bool,
  };

  static defaultProps = {
    user: 'x',
    csrf: '',
    isAuth: false,
    match: {},
  };

  constructor(props) {
    super(props)
    this.state = {
      groupData: {},
      isLoading: true,
      groupRequested: '',
      notExists: false,
      showGrid: true,
    };
  }


  /**
   *  Fetch post detail from Steem blockchain on component mount.
   */
  componentDidMount() {
    let {
      match: {
        params: {
          group
        }
      },
      user,
      isAuth,
      csrf,
    } = this.props;

    if ((!isAuth && user === 'x') || isAuth)//fetch data when not logged in, or logged in, on first page view
      this.getGroupFetch(group, user);
    else if (csrf && !isAuth)//fetch data when logged out right after page refresh
      this.getGroupFetch(group, 'x');
  }

  /**
   *  Fetch post detail from Steem blockchain on component update.
   */
  componentDidUpdate(prevProps) {
    const {
      match: {
        params: {
          group
        }
      },
      user
    } = this.props;

    if (prevProps.user !== user) {
      this.getGroupFetch(group, user);
    }
  }

  /**
   *  Get the various community data to display on the page.
   *
   *  @param {string} user User logged in
   */
  getGroupFetch = (group, user) => {
    getGroupDetails(group, user)
    .then(result => {
      if (hasLength(result.data)) {
        this.setState({
          groupData: result.data.group,
          isLoading: false,
        });
      }else {
        this.setState({
          notExists: true,
          isLoading: false,
        });
      }
    }).catch(err => {
      logger('error', err);
    });
  }

  /**
   *  When user requests to join a community, send the request to DB
   *  for processing.
   *
   *  @param {element} e Element onClick comes from
   *  @param {string} group Group being requested to join
   */
  onJoinGroup = (e, group) => {
    e.preventDefault();
    this.setState({
      groupRequested: group
    });
    this.joinGroupRequest(group);
  }

  /**
   *  Send request to DB, return true to remove `Join` for group.
   *
   *  @param {string} group Group being requested to join
   */
  joinGroupRequest = (group) => {
    const {user, csrf} = this.props;
    requestToJoinGroup({group, user}, csrf)
    .then(result => {
      const {
        groupData,
      } = this.state;

      let kaccess = groupData.kaccess;

      if (result.data) {
        kaccess[0] = {access: 100};
      }
      this.setState({
        groupData: {
          ...groupData,
          kaccess: kaccess,
        },
        groupRequested: ''
      });
    }).catch(err => {
      logger('error', err);
    });
  }

  toggleVIew = () => {
    const { showGrid } = this.state;
    this.setState({ showGrid: !showGrid });
  }

  render() {
    const {
      state: {
        groupData,
        isLoading,
        groupRequested,
        notExists,
        showGrid,
      },
      props: {
        isAuth
      }
    } = this;

    return (
      isLoading ? <Loading /> : !notExists
      ? (
        <ErrorBoundary>
          <Grid columns={1} stackable>
            <Grid.Column>
              <Label size='large' color='blue'>
                <Header as='h2'>{groupData.display}</Header>
              </Label>

              <div className='right'>
                { isAuth && (
                  <Label size='large'>
                    {'Membership: '}
                    {
                      joinCommunities(isAuth, groupRequested, groupData.name, groupData.kaccess[0], this.onJoinGroup)
                    }
                  </Label>
                )}
              </div>
              {
                groupData.kposts.length
                ? (
                  showGrid
                  ? (
                    <GroupPostsGrid
                      posts={groupData.kposts}
                    />
                  )
                  : (
                    <GroupPostsList
                      posts={groupData.kposts}
                    />
                  )
                ) : (
                  <Segment>
                    {'No posts.'}
                  </Segment>
                )
              }
              <GroupUsers
                users={groupData.kusers}
              />
            </Grid.Column>
          </Grid>
        </ErrorBoundary>
      )
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
  const { user, csrf, isAuth } = state.auth;

  return {
    user,
    csrf,
    isAuth,
  }
}

export default connect(mapStateToProps)(GroupDetails);
