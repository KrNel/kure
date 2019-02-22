import React from 'react';
import {Grid, Segment} from "semantic-ui-react";

import GroupsRecent from './GroupsRecent';
import GroupsCreated from './GroupsCreated';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {boolean} isAuth Determines if user is authenticated
 *  @param {array} groups Data for groups
 *  @param {function} onJoinGroup Handles a join request
 */
const GroupSummary = ({isAuth, groupRequested, onJoinGroup, groups}) => {
  if (groups.groupsActivity.length) {
    return (
      <Grid columns={1} stackable>
        <Grid.Column>
          <GroupsCreated
            groupsCreated={groups.groupsCreated}
          />
          <GroupsRecent
            isAuth={isAuth}
            groupsActivity={groups.groupsActivity}
            groupRequested={groupRequested}
            onJoinGroup={onJoinGroup}
          />
        </Grid.Column>
      </Grid>
    )
  }else {
    return (
      <Segment>
        No communities.
      </Segment>
    )
  }
}

export default GroupSummary;
