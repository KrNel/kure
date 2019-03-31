import React from 'react';

import GroupsGrid from '../Manage/GroupsGrid';

/**
 *  Show the newly created groups as a table list.
 *
 *  @param {array} groups Data for newly created groups
 */
const GroupsCreatedGrid = ({ groups, match }) => (
  <GroupsGrid
    groups={groups}
    match={match}
  />
)

export default GroupsCreatedGrid;
