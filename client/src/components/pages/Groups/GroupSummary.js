import React from 'react';
import {Grid, Segment, Label, Header} from "semantic-ui-react";

import GroupsRecent from './GroupsRecent';
import GroupsCreatedGrid from './GroupsCreatedGrid';
import GroupsCreatedList from './GroupsCreatedList';
import ToggleView from '../../common/ToggleView';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {array} groups Data for groups
 */
const GroupSummary = ({groups, match, showGrid, toggleView}) => {
  if (groups.groupsActivity.length) {
    return (
      <Grid columns={1} stackable>
        <Grid.Column>
          <div className='newlyCreated'>
            <Label size='large' color='blue'><Header>Newly Created</Header></Label>
            <ToggleView
              toggleView={toggleView}
              showGrid={showGrid}
            />
            {
              showGrid
              ? (
                <GroupsCreatedGrid
                  groups={groups.groupsCreated}
                  match={match}
                />
              )
              : (
                <GroupsCreatedList
                  groups={groups.groupsCreated}
                  match={match}
                />
              )
            }
          </div>

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
