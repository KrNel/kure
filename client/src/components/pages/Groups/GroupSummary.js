import React from 'react';
import {Grid, Segment} from "semantic-ui-react";

import GroupsRecent from './GroupsRecent';
import GroupsCreatedGrid from './GroupsCreatedGrid';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {array} groups Data for groups
 */
const GroupSummary = ({groups, match}) => {
  if (groups.groupsActivity.length) {
    return (
      <Grid columns={1} stackable>
        <Grid.Column>
          <GroupsCreatedGrid
            groups={groups.groupsCreated}
            match={match}
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
