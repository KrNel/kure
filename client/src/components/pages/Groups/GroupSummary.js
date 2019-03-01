import React from 'react';
import {Grid, Segment} from "semantic-ui-react";

import GroupsRecent from './GroupsRecent';
import GroupsCreated from './GroupsCreated';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {array} groups Data for groups
 */
const GroupSummary = ({groups}) => {
  if (groups.groupsActivity.length) {
    return (
      <Grid columns={1} stackable>
        <Grid.Column>
          <GroupsCreated
            groupsCreated={groups.groupsCreated}
          />
          <GroupsRecent
            groupsActivity={groups.groupsActivity}
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
