import React from 'react';

import GroupsRecent from './GroupsRecent';

/**
 *  All community display components are located here.
 *
 *  GroupRecent shows communities with recent activity in them.
 *
 *  @param {boolean} isAuth Determines if user is authenticated
 *  @param {array} groupsActivity Data for active groups
 *  @param {string} groupRequested The name of the group being requested to join
 *  @param {function} onJoinGroup Handles a join request
 */
const GroupSummary = ({isAuth, groupsActivity, groupRequested, onJoinGroup}) => (
  <GroupsRecent
    isAuth={isAuth}
    groupsActivity={groupsActivity}
    groupRequested={groupRequested}
    onJoinGroup={onJoinGroup}
  />
)

export default GroupSummary;
