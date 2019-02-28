import React, {Component} from 'react';
import {Grid, Label, Header, Loader, Segment} from "semantic-ui-react";
import PropTypes from 'prop-types';

import GroupPosts from '../../Common/GroupPosts'
import GroupUsers from '../../Common/GroupUsers'
import { getGroupDetails, requestToJoinGroup, logger } from '../../../utils/fetchFunctions';
import joinCommunities from '../../../utils/joinCommunities';

/**
 *
 *
 */
class GroupDetails extends Component {

  static propTypes = {
    user: PropTypes.string.isRequired,
    match: PropTypes.shape(PropTypes.object.isRequired),
  };

  constructor(props) {
    super(props)
    this.state = {
      group: {},
      isLoading: true,
      groupRequested: '',
      update: true,
    };

    this.update = true;
  }


  /**
   *  Fetch post detail from Steem blockchain on component mount.
   */
  componentDidMount() {
    const {
      params: {
        group
      },
      user,
      isAuth,
    } = this.props;
    if (isAuth)
      this.getGroupFetch(group, user);
  }

  /**
   *  Fetch post detail from Steem blockchain on component update.
   */
  componentDidUpdate() {
    const {
      props: {
        params: {
          group
        },
        user,
        isAuth,
      },
      state: {
        update
      }
    } = this;
    if (isAuth && this.update)
      this.getGroupFetch(group, user);
  }

  /**
   *  Get the various community data to display on the page.
   *
   *  @param {string} user User logged in
   */
  getGroupFetch = (group, user) => {
console.log('fetching')
    if (user === '') user = 'x';
console.log('user:',user)
    getGroupDetails(group, user)
    .then(result => {
      this.update = false;
console.log('data')
      if (result.data) {
        this.setState({
          group: result.data,
          isLoading: false,
          update: false,
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
      groupRequested: group,
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
        groups,
        groupRequested
      } = this.state;

      let gActivity = groups.groupsActivity;

      if (result.data) {
        const newGroup = gActivity.map(g => {
          if (g.name === groupRequested) {
            return {
              ...g,
              access: {
                access: 100
              }
            }
          }
          return g;
        });
        gActivity = newGroup;
      }
      this.setState({
        groups: {
          ...groups,
          groupsActivity: gActivity,
        },
        groupRequested: '',
      });

    }).catch(err => {
      logger('error', err);
    });
  }

  render() {
    const {
      state: {
        group,
        isLoading,
        groupRequested,
      },
      props: {
        isAuth,
        user,
      }
    } = this;
console.log(group)
    return (
      isLoading
      ? <Loader />
      : (
        <Grid columns={1} stackable>
          <Grid.Column>
            <Label size='large' color='blue'>
              <Header as='h2'>{group.group.display}</Header>
            </Label>
            <div className='right'>
              <Label size='large'>
                {'Membership: '}
                {
                  joinCommunities(isAuth, groupRequested, group.group.name, group.group.access, this.onJoinGroup)
                }
              </Label>
            </div>
            {
              group.posts.length
              ? (
                <GroupPosts
                  posts={group.posts}
                />
              ) : (
                <Segment>
                  {'No posts.'}
                </Segment>
              )
            }
            <GroupUsers
              users={group.users}
            />
          </Grid.Column>
        </Grid>
      )
    )
  }
}

export default GroupDetails;
