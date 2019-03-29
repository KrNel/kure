import React from 'react';
import { Header, Label } from "semantic-ui-react";

import GroupsList from '../Manage/GroupsList';

/**
 *  Show the newly created groups as a table list.
 *
 *  @param {array} groups Data for newly created groups
 */
const GroupsCreatedGrid = ({ groups, match }) => {
  if (groups.length) {
    return (
      <div className='newlyCreated'>
        <Label size='large' color='blue'><Header>Newly Created</Header></Label>
        <GroupsList
          groups={groups}
          match={match}
        />
      </div>
    )
  }
}

export default GroupsCreatedGrid;
